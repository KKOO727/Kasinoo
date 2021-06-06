const BASECONTROL = require("./basecontroller");
const USERS = require("../models/users_model");
const sidebarmodel = USERS.sidebarmodel;
const permission_model = USERS.permission_model;

exports.roles_load = async (req,res,next)=>{
    var findhandle = "";
    findhandle = await BASECONTROL.BSortfind(permission_model,{},{order : 1});
    var  roles = await BASECONTROL.Bfind(sidebarmodel);
    if(!findhandle){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        var data = BASECONTROL.array_sort(findhandle,"order")
        res.json({status : true,data : data,list :roles})
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
    row['roles'] = data.roles;
    row['type'] = data.type;
    var uhandle = await BASECONTROL.BfindOneAndUpdate(sidebarmodel,{id : data.id},row);
    if(uhandle){
        this.roles_load(req,res,next);
    }else{ 
        res.json({status : false});
        return next()
    }
}