const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const isLogged = require("../middleware/authenticate.js");


// view profile route
router.get("/profile/:id", isLogged, async (req, res)=> {
    let { id } = req.params;
    let profile = await User.findById(id);
    res.status(200).json(profile);
});


// =============================== Future Routes ========================================

router.post("/update", async (req, res)=> {
    let { bio, pfp, username } = req.body;
    res.json({message: "under development"});
});


