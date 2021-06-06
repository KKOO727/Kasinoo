import {AXIOS_REQUEST,alert} from "../auth/index"
import reactconfirm from "reactstrap-confirm"

export const getData = () =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("settings/getConfig",{});
        if (rdata.status) {
            dispatch({type:"SETTING_CONFIGURATION",data : rdata.data})
        } else {

        }
    }
}


export const configSave = (data) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("settings/saveConfig",{data});
        if (rdata.status) {
            alert("success","success")
            dispatch({type:"SETTING_CONFIGURATION",data : rdata.data})
        } else {

        }
    }
}

export const configUpdate = (data) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("settings/updateConfig",{data});
        if (rdata.status) {
            alert("success","success")
            
            dispatch({type:"SETTING_CONFIGURATION",data : rdata.data})
        } else {

        }
    }
}

export const configDelete = (data) =>{
    return async dispatch =>{
        let result = await reactconfirm();
        if (result) {
            var rdata = await AXIOS_REQUEST("settings/deleteCOnfig",{data});
            if (rdata.status) {
            alert("success","success")

                dispatch({type:"SETTING_CONFIGURATION",data : rdata.data})
            } else {
    
            }
        } else {

        }
    
    }
}