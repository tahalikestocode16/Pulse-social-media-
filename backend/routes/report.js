const express = require("express");
const router = express.Router();
const Report = require("../models/reportschema");
const isAdmin = require("../middleware/admin.js");

const isLogged  = require("../middleware/authenticate.js");

router.post("/", isLogged, async (req, res, next) => {
    try {

        const { targetType, targetId, reason, description } = req.body;

        await Report.create({
            reporter: req.user._id,
            targetType,
            targetId,
            reason,
            description
        });

        return res.status(201).json({
            message: "Report submitted"
        });

    }
    catch(err){
        next(err);
    }
});

router.get("/", isLogged, isAdmin, async (req,res,next)=>{
    try{

        const reports = await Report.find()
        .populate("reporter")
        .sort({createdAt:-1});

        res.json(reports);

    }catch(err){
        next(err);
    }
});

router.patch("/:id", isLogged, isAdmin, async(req,res,next)=>{
    try{

        const report = await Report.findByIdAndUpdate(
            req.params.id,
            {
                status:req.body.status
            },
            {
                new:true,
                runValidators:true
            }
        );

        if(!report){
            return res.status(404).json({
                message:"Report not found"
            });
        }

        res.json(report);

    }catch(err){
        next(err);
    }
});

module.exports = router;