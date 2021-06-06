const express = require('express');
const router = express.Router();
const toolgetoipblock_model = require("../models/tools_model").toolgetoipblock_model
const BASECONTROL = require("./basecontroller");

// let dd= new toolgetoipblock_model({ipaddress : "dddd"});
// dd.save().then(rdata=>{
//     console.log(rdata)
// })

router.post("/geoipblock_load",async(req,res,next)=>{
    var finddata = await BASECONTROL.Bfind(toolgetoipblock_model);
    if(!finddata){
        res.json({status : false,})
        return next();
    }else{
        res.json({status : true,data : finddata})
    }
});

router.post("/geoipblock_save",async(req,res,next)=>{
    var indata = req.body.data;
    var findhandle = await BASECONTROL.BfindOne(toolgetoipblock_model,indata);
    if(!findhandle){
        var save_handle = await  BASECONTROL.data_save(indata,toolgetoipblock_model);
        if(!save_handle){
            res.json({status : false,})
            return next();
        }else{
            var finddata = await BASECONTROL.Bfind(toolgetoipblock_model);
            if(!finddata){
                res.json({status : false,data : "server error"})
                return next();
            }else{
                res.json({status : true,data : finddata})
                return next();
            }
        }
    }else{
        res.json({status : false,data : "server error"})
        return next();
    }
});

router.post("/geoipblock_delete",async(req,res,next)=>{
    var data =req.body.data;
    var delete_handle = await BASECONTROL.BfindOneAndDelete(toolgetoipblock_model,{_id : data._id});
    if(!delete_handle){
        res.json({status : false,data : "server error"})
        return next();
    }else{
        var finddata = await BASECONTROL.Bfind(toolgetoipblock_model);
        if(!finddata){
            res.json({status : false,data : "server error"})
            return next();
        }else{
            res.json({status : true,data : finddata})
        }
    }
});

module.exports = router;