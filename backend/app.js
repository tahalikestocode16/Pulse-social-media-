try { require("dotenv").config(); } catch (e) { }
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/pulse";
const PORT = process.env.PORT || 8080;
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require('passport-local-mongoose');
const session = require("express-session");
const User = require("./models/user");
const upload = require("./models/middleware/profileupload.js");


// ── Middleware (MUST come before routes) ─────────────────────
// cors must run first so the browser's preflight OPTIONS request is handled
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

// body parsers let us read req.body — routes below need this
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(express.json({ limit: "25mb" }));

// session must be before passport — passport reads the session cookie
const isProduction = process.env.NODE_ENV === "production";
app.use(session({
    secret: process.env.SESSION_SECRET || 'pulse secretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
}));

// passport must be after session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ── Routes (AFTER middleware) ─────────────────────────────────
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const profileRoutes = require("./routes/profile");
const reportRoutes = require("./routes/report");
const notificationRoutes = require("./routes/notificaton.js");
const conversationRoutes = require("./routes/conversation.js");
const messageRoutes = require("./routes/message.js");
const userRoutes = require("./routes/users.js");

app.use("/notifications", notificationRoutes);
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/profile", profileRoutes);
app.use("/reports", reportRoutes);
app.use("/conversation", conversationRoutes);
app.use("/messages", messageRoutes);
app.use("/users", userRoutes);

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connection successful");
    })
    .catch((err) => {
        console.log(err);
    });


const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});


// socket.io setup 


// temporary memory
const userSocketMap = new Map();


app.set("io", io);


io.on("connection", (socket) => {

    console.log("user connected:", socket.id);


    // get user id from frontend socket connection
    const userId = socket.handshake.auth.userId;


    if (userId) {
        userSocketMap.set(userId, socket.id);
    }


    console.log(userSocketMap);



    // join conversation room
    socket.on("joinConversation", (conversationId) => {

        socket.join(conversationId);

        console.log(
            "joined conversation:",
            conversationId
        );

    });
    //    to means to everyone else in the room except yourself
    socket.on("typing", ({ conversationId, userId }) => {

        socket.to(conversationId).emit("userTyping", {
            userId
        });

    });


    // disconnect cleanup
    socket.on("disconnect", () => {

        for (let [userId, socketId] of userSocketMap) {

            if (socketId === socket.id) {

                userSocketMap.delete(userId);
                break;

            }

        }


        console.log(
            "user disconnected:",
            socket.id
        );

    });

});


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});


// http normal express runs on response request layout now we have a server thats always active 




// ============================== CODE STARTS HERE +====================================

// Main page
app.get("/", (req, res) => {
    res.json({ message: "this will be our main page" });
});



// Error handling middleware 
app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    res.status(status).json({ message: message });
});

