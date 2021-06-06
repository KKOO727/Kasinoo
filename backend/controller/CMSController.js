
const config = require('../db');
const fs = require("fs");
const BASECON = require("./basecontroller");
const FIRSTPAGECON = require("../models/firstpage_model");
const SliderIMgModel = FIRSTPAGECON.SliderIMGModel;
const GAMELISTMODEL = require("../models/games_model").GAMELISTMODEL;
const firstpagesetting = FIRSTPAGECON.firstpagesetting;
const FirstpagePaymentMethodImg =FIRSTPAGECON.FirstpagePaymentMethodImg;
const FirstpageProviderImg = FIRSTPAGECON.FirstpageProviderImg;
const firstMenuModel =FIRSTPAGECON.firstMenuModel;
var mongoose = require('mongoose');

const BASECONTROL = require("./basecontroller");
const USERS = require("../models/users_model");
const sidebarmodel = USERS.profilemenu;
const configkeys = require("../config/configkeys")

exports.configload = async (req,res,next) => {
    let type = req.body.type;
    let d1 = await firstpagesetting.findOne({type : type});
    if (d1) {
        res.send({status : true , data : d1});
        return next();
    } else {
        res.send({status : false , data : d1});
        return next();
    }
}

exports.cmsload = async (req,res,next) => {
    let d1 = await firstpagesetting.findOne({type : configkeys.Referrallink});
    let d2 = await firstpagesetting.findOne({type : configkeys.logoimg});
    let d3 = await firstpagesetting.findOne({type : configkeys.cmsfootertext});
    let row = {
        Referrallink : d1.content ?  d1.content : "",
        logoimg : d2.content ? d2.content : "",
        cmsfootertext : d3.content ? d3.content : ""
    }

    res.send({status : true , data : row});
    return next();
}

exports.get_sliderimgs = async (req,res,next) =>{
    var top =  await BASECON.BSortfind(SliderIMgModel,{},{bool : -1});
    if(top.length > 0){
        var bool =parseInt(top[0]["bool"]);
        var row = {}
        for(var i = 1 ; i <= bool ; i++){
            var data = await BASECON.BSortfindPopulate(SliderIMgModel,{ bool: i},{order : 1},"gameid");
            row[i] = data;
        }
        res.json({status : true,data : row});
        return next();
    }else{
        res.json({ status:false,error :"error" });
        return next();
    }
}

exports.save_sldierimgs =  async (req,res,next) =>{
    
    var editdata = req.body;
    var bool  =req.body.bool;
    if (  editdata && bool ) {
        var img = req.body.imagesrc;
        if (editdata.addnew == "true") {
            var result = await BASECON.BSortfind(SliderIMgModel,{bool : bool},{order : -1});
            var order  = 1;
            if (result.length > 0) {
                order = parseInt(result[0]["order"]) + 1;
            }
            let newslider = {
                order:order ,
                data : {},
                bool : bool,
            };

            if (img) {
                newslider["image"] = img;
            }

            var rdata = await BASECON.data_save(newslider,SliderIMgModel)
            if (!rdata) {
                res.json({ status:false,error : "error" });
                return next();
            } else {
                get_sliderimgs(req,res,next,bool);
            }
        } else {
            var _id = editdata._id;
            var lastitem = await BASECON.BfindOne(SliderIMgModel,{_id :_id });
            
            if(img){
                row["image"] = img;
            }else{
                var del_path = config.BASEURL + lastitem.image;
                fs.unlink(del_path, async (err)=>{    
                });
            }
            var uhandle = await BASECON.BfindOneAndUpdate(SliderIMgModel,{_id : _id},row);
            if (uhandle) {
                get_sliderimgs(req,res,next,bool)
            } else {
                res.json({ status:false ,error : "error" });
                return next();
            }
        }
    }else{
        res.json({ status:false,error :"error" });
        return next();
    }
}

async function get_sliderimgs(req,res,next,bool){
    if (bool){
        var data = await BASECON.BSortfindPopulate(SliderIMgModel,{ bool: bool},{order : 1},"gameid");
        if (data) {
            res.json({status : true,data : data});
            return next();
        } else {
            res.json({status : false,error :"error"});
            return next();
        }
    } else {
        res.json({status : false,error :"error"});
        return next();
    }
}

exports.Slider_textsave = async (req,res,next) => {
    console.log(req.body)
    let data = req.body.data;
    if (data) {
        var bool  =req.body.data.bool;

        let row = {
            data : data.data,
        }

        if (data.gameid && data.gameid.length) {
            let gitem = await GAMELISTMODEL.findOne({_id : data.gameid});
            if (gitem) {
                row['gameid'] = mongoose.Types.ObjectId(data.gameid)
            }
        }

        var up = await BASECON.BfindOneAndUpdate(SliderIMgModel,{_id : data.selectrow._id },row);
        if (up) {
            get_sliderimgs(req,res,next,bool)
        } else {
            res.json({status : false,error :"error"});
            return next();            
        }     
    } else {
        res.json({status : false,error :"error"});
        return next();
    }
}

exports.delete_sldierimgs =  async (req,res,next) =>{

    if(req.body.data && req.body.data.data){
        var data = req.body.data.data;
        var del_path = config.BASEURL + data.image;
        var udelete = await BASECON.BfindOneAndDelete(SliderIMgModel,{_id : data._id });
        if(udelete){
            fs.unlink(del_path, (err)=>{    
                get_sliderimgs(req,res,next,data.bool);
            });
        }else{
            res.json({status : false,error : "error"});
            return next();
        }
    }else{
        res.json({status : false,error : "Please provide valid data."});
        return next();
    }
}

exports.update_sldierimgs =  async (req,res,next) =>{
    var data = req.body.data.data;
    for(var i = 0 ; i < data.length ; i++){
        var upHandle = await BASECON.BfindOneAndUpdate(SliderIMgModel,{_id :  data[i]._id},data[i]);
        if(!upHandle){
            res.json({status : false,data : "fail"});
            return next();
        }
    }
    get_sliderimgs(req,res,next,req.body.data.bool);
}

exports.save_logos = async(req,res,next) =>{
    let type = req.body.type;

    if (req.body.imagesrc) {
        var result = await BASECON.BfindOne(firstpagesetting,{type : type});
        if (result) {
            var del_path = config.BASEURL  + result.content;    
            fs.unlink(del_path, async(err)=>{
            });
        }
        let row = {
            content : req.body.imagesrc,
            type : type
        }
        let update = await BASECON.BfindOneAndUpdate(firstpagesetting,{type : type},row);
        if (update) {
            res.json({ status: true,data : update });
            return next();
        } else {
            res.json({ status: false });
            return next();
        }
    } else {
        res.json({ status: false });
        return next();
    }
}


exports.firstpage_load = async (req,res,next) =>{
    var data = await BASECON.Bfind(firstpagesetting);
    var row = {};
    for(var i = 0 ; i < data.length ; i++){
        row[data[i].type] = data[i].content;
    }
    var data1 = await BASECON.Bfind(FirstpagePaymentMethodImg);
    var data2 = await BASECON.Bfind(FirstpageProviderImg);
    row['payment'] = data1;
    row['provider'] = data2;
    res.json({status : true,data : row});
    return next();
}

exports.logoimg_load = async(req,res,next)=>{
    var rdata = await BASECON.BfindOne(firstpagesetting,{type : "logoimg"});
    if(!rdata){
        res.json({status : false})
        return next();
    }else{
        res.json({status : true,data : rdata})
        return next();
    }
}

exports.setting_etc = async (req,res,next) =>{
    var code = req.body.data;
    var Model = firstpagesetting;
    var type = code.type;
    var data = code.data;
    var fhandle = await BASECON.BfindOne(Model,{type : type});
    if(fhandle){
        var uphandle = await BASECON.BfindOneAndUpdate(Model,{type : type},{content : data});
        if(!uphandle){
            res.json({status : false})
            return next();
        }else{
            res.json({status : true,data : uphandle})
            return next();            
        }
    }else{
        var shandle = await BASECON.data_save({type : type,content : data},Model);
        if(!shandle){
            res.json({status : false})
            return next();
        }else{
            res.json({status : true,data : shandle})
            return next();            
        }
    }
}

exports.paymentimg_delete =async(req,res,next)=>{
    var indata = req.body.data;   
    var outdata = null;
    await FirstpagePaymentMethodImg.findOneAndDelete({_id : indata._id}).then(rdata=>{
        if(!rdata){
            outdata =false;
        }else{
            outdata = true;
        }
    });
    if(!outdata){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        var del_path = config.BASEURL + indata.image;
        fs.unlink(del_path, async rdata=>{
            get_provider_paymentimgs(req,res,next,FirstpagePaymentMethodImg)
        });
    }
}

async function get_provider_paymentimgs(req,res,next,Model){
    await Model.find().then(rdata=>{
        if(!rdata){
            outdata = false;
        }else{
            outdata = rdata;
        }
    });
    if(!outdata){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        res.json({status : true,data : outdata})
        return next();
    }
}

exports.providerimg_delete = async(req,res,next)=>{
    var indata = req.body.data;   
    var outdata = null;
    await FirstpageProviderImg.findOneAndDelete({_id : indata._id}).then(rdata=>{
        if(!rdata){
            outdata =false;
        }else{
            outdata = true;
        }
    });
    if(!outdata){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        var del_path = config.BASEURL + indata.image;
        fs.unlink(del_path, async rdata=>{
            get_provider_paymentimgs(req,res,next,FirstpageProviderImg)
        })
    }
}

exports.upload_provider_paymentimg = async (req,res,next) =>{
    var bool = req.body.bool;
    let image = req.body.imagesrc;
    if (image) {
        if (bool == "1") {
            var shandle = await BASECON.data_save({image: image},FirstpagePaymentMethodImg)
            if (!shandle) {
                res.json({
                    status:false
                })
                return next();
            }else {
                get_provider_paymentimgs(req,res,next,FirstpagePaymentMethodImg)
            }
        } else {
            var shandle = await BASECON.data_save({image: image},FirstpageProviderImg)
            if (!shandle) {
                res.json({
                    status:false
                })
                return next();
            } else {
                get_provider_paymentimgs(req,res,next,FirstpageProviderImg)
            }
        }
    } else {
        res.json({
            status:false
        })
        return next();
    }
}

exports.save_menu = async (req,res,next)=>{
    var indata = req.body.data;
    var savehandle = await BASECON.data_save(indata,firstMenuModel);
    if(!savehandle){
        res.json({status : false,data : "fail"});
        return next();
    }else{
        this.load_menu(req,res,next)
    }
}

exports.update_menu = async (req,res,next)=>{
    var indata = req.body.data;
    for(var i = 0 ; i < indata.length ; i++)
    {
        var updatehandle =  await data_update(indata[i],firstMenuModel);
        if(!updatehandle){
            res.json({status : false,data : "fail"});
            return next();
        }
    }
    this.load_menu(req,res,next)
}

exports.delete_menu = async(req,res,next)=>{
    var indata = req.body.data;
    var outdata = null;
    await firstMenuModel.findOneAndDelete({_id : indata._id}).then(rdata=>{
        if(!rdata){
            outdata =false;
        }else{
            outdata = true;
        }
    });
    if(!outdata){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        this.load_menu(req,res,next)
    }
}

exports.load_menu = async (req,res,next)=>{
    var findhandle = "";
    findhandle = await BASECON.BSortfind(firstMenuModel,{bool : req.body.bool},{order : 1});
    if(!findhandle){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        res.json({status : true,data : findhandle})
        return next();
    }
}

exports.menuimageupload = async (req,res,next) => {
    let {imagesrc,_id} = req.body;

    if (imagesrc) {
        let item = await firstMenuModel.findOne({_id : _id});
        if (item) {
            if (item.image && item.image.length) {
                var del_path = config.BASEURL + item.image;
                fs.unlink(del_path, async (err)=>{    
                });
            } 
            let up = await firstMenuModel.findOneAndUpdate({_id : _id},{image : imagesrc});
            if (up) {
                this.load_menu(req,res,next)
            } else {
                return res.json({
                    status: false,
                    data: "fail"
                });
            }                
        } else {
            return res.json({
                status: false,
                data: "fail"
            });
        }
    } else {
        return res.json({
            status: false,
            data: "fail"
        });
    }
}

async function data_update(data,model)
{
    var outdata = null;
    await model.findOneAndUpdate({_id : data._id},data).then(rdata=>{
        if(!rdata){
            outdata =false;
        }else{
            outdata = true;
        }
    });
    return outdata;
}





exports.roles_load = async (req,res,next)=>{
    var  roles = await BASECONTROL.Bfind(sidebarmodel);
    if(!roles){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        res.json({status : true,list :roles})
        return next();
    }
}

exports.roles_add = async(req,res,next) =>{ 
    var data = req.body.data;
    var roles = await BASECONTROL.Bfind(sidebarmodel,{pid : data.pid});
    var order = 1;
    if(roles.length > 0){
        order = roles[roles.length-1].order + 1;
    }
    data['order'] = order;    
    var shandle = await BASECONTROL.data_save(data,sidebarmodel);
    if(shandle){
        this.roles_load(req,res,next);

    }else{
        res.json({status : false});
        return next();
    }
}

exports.roles_delete = async(req,res,next) =>{
    var data = req.body.data;
    var ids = await get_deleteids(data.id);
    for(var i = 0 ; i < ids.length ; i++){
        var handel = await BASECONTROL.BfindOneAndDelete(sidebarmodel,{id : ids[i]})
    }
    this.roles_load(req,res,next);
}

async function get_deleteids(id) {
    var data = [];
    async function  fact(pid){
        var child = await BASECONTROL.Bfind(sidebarmodel,{pid : pid});
        if(child.length > 0){
            for(var i = 0 ; i < child.length ; i++){
                data.push(child[i].id);
                await fact(child[i].id);
            }
        }else{
            return;
        }
    }
    await fact(id);
    data.push(id);
    return data;
}



exports.roles_update = async(req,res,next) =>{
    var data = req.body.data;
    var row = {};
    row['title'] = data.title;
    row['navLink'] = data.navLink;
    row['icon'] = data.icon;
    row['status'] = data.status;
    row['mobilestatus'] = data.mobilestatus;
    row['roles'] = data.roles;
    row['type'] = data.type;
    row['mobileicon'] = data.mobileicon;
    
    var uhandle = await BASECONTROL.BfindOneAndUpdate(sidebarmodel,{id : data.id},row);
    
    if(uhandle){
        this.roles_load(req,res,next);
    }else{ 
        res.json({status : false});
        return next()
    }
}
