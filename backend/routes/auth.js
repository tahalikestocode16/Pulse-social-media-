const express = require("express");
const User = require("../models/user");
const router = express.Router();

// Register route
router.post("/register", async (req, res, next)=> {
   try {
     let { username, email, password } = req.body;
    const signedUser = new User({
        username, 
        email
    });
    await User.register(signedUser, password);
    req.login(signedUser, (err)=> {
        if(err) {
            return next(err)
        }
        res.status(201).json({message: `${signedUser.username} registered`})
    });
   }
    catch(err) {
      return next(err);
    }
});

// Login route 
router.post("/login", (req, res, next)=> {
    let { username} = req.body;
    passport.authenticate("local", (err, user)=> {
        if(err) {
            return next(err);
        }
        if(!user) {
           return res.status(401).json({ message: "No user defined"});
        }
         req.login(user, (err)=> {
            if(err) return next(err);
            else {
             return res.status(200).json({message: `${user.username} logged in`});

            }      
        })    
    })(req, res, next);
    // req res are also parameters in authenticate due to passports 
    // rules we couldnt put them in directly
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