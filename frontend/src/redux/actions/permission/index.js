import {AXIOS_REQUEST} from "../auth/index"


function data_load_to_tbl (rdata,dispatch){
    let news = [];
    for(var i = 0 ; i < rdata.data.length ; i++){
        news.push({value : rdata.data[i].id,label  : rdata.data[i].title});
    }
    dispatch({
        type : "PERMISSION_LOAD_LIST",
        data : news,list : rdata.list
    })
}

export const roleList = () =>{
    return async (dispatch) =>{
        var rdata = await AXIOS_REQUEST("permission/role_menuload",{});
        if(rdata.status){
            data_load_to_tbl(rdata,dispatch)  
        }else{

        }
    }
}

export const rowadd_action = (data) =>{
    return async (dispatch) =>{
        if(!data.pid){
            data.pid = "0";
        }
        var rdata = await AXIOS_REQUEST("permission/role_menuadd",{data : data});
        if(rdata.status){
            data_load_to_tbl(rdata,dispatch)  
        }else{
            return false
        }
    }
}

export const rowinadd_action = (data) =>{
    return async (dispatch) =>{
        var rdata = await AXIOS_REQUEST("permission/role_menuadd",{data : data});
        if(rdata.status){
            data_load_to_tbl(rdata,dispatch)  
        }else{
            return false
        }
    }
}

export const rowupdate_action = (data) =>{
    return async (dispatch) =>{
        var rdata = await AXIOS_REQUEST("permission/role_menuupdate",{data : data});
        if(rdata.status){
            data_load_to_tbl(rdata,dispatch)  
        }else{
            return false
        }
    }
}

export const row_delete_action = (data) =>{
    return async (dispatch) =>{
        var rdata = await AXIOS_REQUEST("permission/role_menudelete",{data : data});
        if(rdata.status){
            data_load_to_tbl(rdata,dispatch)  
        }else{
            return false
        }       
    }
}