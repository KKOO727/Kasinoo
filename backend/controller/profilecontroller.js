const BASECONTROLL = require("./basecontroller");
const config = require('../db');
const documentModel = require('../models/profile_model').documentModel;
const pro_notification = require('../models/profile_model').pro_notification;
const usersmodel = require("../models/users_model").adminUser;
var fs = require('fs');

exports.set_document = async ( req, res, next ) => 
{
    var uploadData = req.body;
    var filenames = "";
    var originalnames = "";
    var flag = 0;
    for(var i = 0 ; i < req.files.length ; i ++)
    {
        var filename = req.files[i].filename;
        var originalname = req.files[i].originalname;
        var filetype = req.files[i].mimetype.split("/")[1];
        // var filetype = req.files[i].originalname.split(".")[req.files[i].originalname.split(".").length-1];
        var current_path = config.BASEURL + req.files[i].filename;
        filename += "." + filetype;
        var new_path = config.BASEURL + filename;
        filenames += filename + "#|@|#";
        originalnames += originalname + "#|@|#";
        fs.rename( current_path, new_path, function(err){
            if(err) throw err;
            if(flag == req.files.length-1)
            {
                var datas = {
                    email : uploadData.email,
                    verifyId : uploadData.verifyId,
                    filename : filenames, 
                    name : originalnames, 
                };
                const newupload = new documentModel(datas);
                newupload.save().then( rdatas =>{
                    if(!rdatas){
                        res.json({ status : false, msg : 'Failure' })
                    }else{
                        documentModel.find({email:uploadData.email}).then( rdata =>{
                            if(!rdata){
                                res.json({status : false,data : "fail"});
                                return next();
                            }else{  
                                res.json({ status : true, data: rdata });
                                return next();
                            }
                        })
                    }
                })
            }
            flag++;
        })
    }
}

exports.get_document = async (req,res,next) =>{
    var email = req.user.email;
    var rdata = await BASECONTROLL.Bfind(documentModel,{email : email});
    if(!rdata){
        res.json({status : false,data : "fail"});
        return next();
    }else{  
        res.json({ status : true, data: rdata });
        return next();
    }
}

exports.profilesave = async (req,res,next)=>{

    var users = req.body;

    if(req.body.imagesrc){
        users["avatar"] = req.body.imagesrc;
    }

    var data = await BASECONTROLL.BfindOneAndUpdate(usersmodel,{email : req.user.email},users);
    if(data){
        if(req.user.avatar && req.user.avatar != ""){
            var del_path = config.BASEURL  + req.user.avatar;
            fs.unlink(del_path, async(err)=>{
                res.json({
                    status: true,data : data
                });
                return next();
            });
        }else{
            res.json({
                status: true,data : data
            });
            return next();
        }
    }else{
        res.json({
            status: false
        });
        return next();
    }
}


exports.avatarUpload = async (req,res,next)=>{

    var users = req.body;

    if(req.body.imagesrc){
        users["avatar"] = req.body.imagesrc;
    }

    if (req.body.imagesrc && req.body.imagesrc.length) {
        var data = await BASECONTROLL.BfindOne(usersmodel,{_id : req.body._id});
        if(data){
            let updata = await usersmodel.findOneAndUpdate({_id : req.body._id}, {avatar : req.body.imagesrc},{upsert : true})
            if(data.avatar && data.avatar != ""){
                var del_path = config.BASEURL  + data.avatar;
                fs.unlink(del_path, async(err)=>{
                    res.json({
                        status: true,data : updata
                    });
                    return next();
                });
            }else{
                res.json({
                    status: true,data : data
                });
                return next();
            }
        }else{
            res.json({
                status: false
            });
            return next();
        }
    } else {
        res.json({
            status: false
        });
        return next();
    }
}

exports.set_notification = async(req,res,next)=>{
    var data = req.body.data;
    var rdata = await BASECONTROLL.BfindOneAndUpdate(pro_notification,{email : data.email},data);
    if(!rdata){
        var newdata = await BASECONTROLL.data_save(data,pro_notification);
        if(!newdata){
            res.json({
                status : false,
                data : "fail"
            })
            return next();
        }else{
            res.json({
                status : true,
                data : newdata
            })
            return  next();
        }
    }else{
        res.json({
            status : true,
            data : rdata
        })
        return next();
    }
}

exports.get_notification = async(req,res,next)=>{

    var rdata = await BASECONTROLL.BfindOne(pro_notification,{email : req.user.email});
    if(!rdata){
        res.json({status : false,data : "no database"})
        return next();
    }else{  
        res.json({status : true,data : rdata})
        return next();
    }
}