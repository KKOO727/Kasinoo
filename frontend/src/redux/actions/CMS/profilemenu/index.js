import {AXIOS_REQUEST} from "../../auth/index"


function data_load_to_tbl (rdata,dispatch){
    
    dispatch({
        type : "CMS_PROFILE_MENU",
        list : rdata.list
    })
}

export const roleList = () =>{
    return async (dispatch) =>{
        var rdata = await AXIOS_REQUEST("cms/promenu_menuload",{});
        if(rdata.status){
            console.log(rdata)
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
        var rdata = await AXIOS_REQUEST("cms/promenu_menuadd",{data : data});
        if(rdata.status){
            data_load_to_tbl(rdata,dispatch)  
        }else{
            return false
        }
    }
}

export const rowinadd_action = (data) =>{
    return async (dispatch) =>{
        var rdata = await AXIOS_REQUEST("cms/promenu_menuadd",{data : data});
        if(rdata.status){
            data_load_to_tbl(rdata,dispatch)  
        }else{
            return false
        }
    }
}

export const rowupdate_action = (data) =>{
    return async (dispatch) =>{
        var rdata = await AXIOS_REQUEST("cms/promenu_menuupdate",{data : data});
        if(rdata.status){
            data_load_to_tbl(rdata,dispatch)  
        }else{
            return false
        }
    }
}

export const row_delete_action = (data) =>{
    return async (dispatch) =>{
        var rdata = await AXIOS_REQUEST("cms/promenu_menudelete",{data : data});
        if(rdata.status){
            data_load_to_tbl(rdata,dispatch)  
        }else{
            return false
        }       
    }
}