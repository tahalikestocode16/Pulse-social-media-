const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/pulse";
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require('passport-local-mongoose');
const session = require("express-session");
const User = require("./models/user");
const upload = require("./middleware/profileupload");
// socket.io setup 

const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = new Server(server);



// Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const profileRoutes = require("./routes/profile");
const reportRoutes = require("./routes/report");
const notificationRoutes = require("./routes/notificaton.js");
const conversationRoutes = require("./routes/conversation.js");
const messageRoutes = require("./routes/message.js");

// setup routes
app.use("/notification", notificationRoutes);
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/profile", profileRoutes);
app.use("/reports", reportRoutes);
app.use("/conversation", conversationRoutes);
app.use("/messages", messageRoutes);




app.use(cors({
    origin: ["http://localhost:5174"],
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
// to read data sent from react
app.use(session({
    secret: 'pulse secretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax"
    }
}));
// Session

passport 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

io.on("connection", (socket) => {
    console.log("user connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("user disconnected:", socket.id);
    });
});    

server.listen(8080, () => {
    console.log("Listening on port 8080");
});


// http normal express runs on response request layout now we have a server thats always active 




// ============================== CODE STARTS HERE +====================================

// Main page
app.get("/", (req, res)=> {
    res.json({message: "this will be our main page"});
});



// Error handling middleware 
app.use((err, req, res, next)=> {
    let { status = 500, message = "something went wrong"} = err;
    res.status(status).json({message: message});
});

