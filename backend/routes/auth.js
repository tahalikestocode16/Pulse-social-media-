const express = require("express");
const passport = require("passport");
const User = require("../models/user.js");
const router = express.Router();

const Conversation = require("../models/conversation.js");
const Message = require("../models/message.js");

// Helper to ensure Pulse Team account exists and welcome message is sent to every user
const ensureWelcomeMessage = async (user) => {
    try {
        let pulseTeam = await User.findOne({ username: "pulse_official" });
        if (!pulseTeam) {
            pulseTeam = new User({
                username: "pulse_official",
                email: "team@pulse.social",
                bio: "Official Pulse Team 👋",
                profilePic: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
                role: "admin"
            });
            await User.register(pulseTeam, "PulseTeamOfficialPass2026!");
        }

        if (user._id.toString() === pulseTeam._id.toString()) return;

        let convo = await Conversation.findOne({
            participants: { $all: [pulseTeam._id, user._id] }
        });

        if (!convo) {
            convo = await Conversation.create({
                participants: [pulseTeam._id, user._id]
            });

            const welcomeText = `Welcome to Pulse! 👋 We're so glad you're here.

Pulse is your space to share photos, videos, and real moments with your friends.

Here is a quick overview of what you can do on Pulse:
• Share Updates: Post photos or videos with captions directly to your feed.
• Explore & Discover: Discover fresh photos and trending visual content on the Explore tab.
• Direct Messages: Chat with friends in real time.
• Stories: Share quick daily moments (users with an active story will show a blue ring around their avatar!).

Feel free to look around and start sharing! If you ever need anything, we're here to help. Happy posting! ✨`;

            const message = await Message.create({
                sender: pulseTeam._id,
                text: welcomeText,
                isRead: false,
                conversation: convo._id
            });

            convo.lastMessage = message._id;
            await convo.save();
        }
    } catch (err) {
        console.error("Welcome message error:", err);
    }
};

// Register route
router.post("/register", async (req, res, next)=> {
   try {
     let { username, email, password } = req.body;
    const signedUser = new User({
    username,
    email: email ? email.toLowerCase() : undefined,
    role: "user"
});
    console.log("Before register");
    await User.register(signedUser, password);
    req.login(signedUser, async (err)=> {
        if(err) {
            return next(err)
        }
        await ensureWelcomeMessage(signedUser);
        console.log("After register");
        res.status(201).json({message: `${signedUser.username} registered`, user: signedUser})
    });
   }
    catch(err) {
      // only call next(err) — the error handler in app.js will send the response.
      // calling res.json() here too causes a "headers already sent" crash.
      return next(err);
    }
});

// Login route 
router.post("/login", async (req, res, next) => {
    let { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username/email and password are required" });
    }

    try {
        let inputIdentifier = username.trim();
        let targetUsername = inputIdentifier;

        // If user logged in using email address, lookup their username
        if (inputIdentifier.includes("@")) {
            const foundUser = await User.findOne({ email: inputIdentifier.toLowerCase() });
            if (foundUser) {
                targetUsername = foundUser.username;
            }
        }

        req.body.username = targetUsername;

        passport.authenticate("local", (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({ message: info?.message || "Invalid username/email or password" });
            }
            req.login(user, async (err) => {
                if (err) return next(err);
                await ensureWelcomeMessage(user);
                return res.status(200).json({ message: `${user.username} logged in`, user });
            });
        })(req, res, next);
    } catch (err) {
        return next(err);
    }
});

 // Logout route
router.post("/logout", (req, res, next)=> {
    req.logout(function (err) {
        if(err) return next(err);
        res.status(200).json({ message: `succesfully logged out accountname: ${req.body.username}`});
     
    })
});

// Delete route
router.delete("/delete", async (req, res, err)=> {
         let { id } = req.body;
         await User.findByIdAndDelete(id);
         res.status(200).json({message: "account succesfully deleted"});
       if(err) return next(err);
});


module.exports = router;