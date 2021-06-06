import {AXIOS_REQUEST,AXIOS_REQUEST_FILE} from "../auth/index"
import * as GlobalTypes from "../../types"
import { toast } from "react-toastify";

export const getGlobalSetting = () => {
    return async dispatch => {
        var rdata = await AXIOS_REQUEST("settings/getGlobalSetting",{});
        if (rdata.status) {
            console.log(rdata.data)
            dispatch({type:GlobalTypes.GETALLGLOBALSETTING,data : rdata.data})
        } else {
        }
    }
}

export const appconfigSave = (data, type) => {
    return async dispatch => {
        var rdata = await AXIOS_REQUEST_FILE("settings/appConfigSave",data);
        if (rdata.status) {
            toast.success("success")
            dispatch({type:type, data : rdata.data.content})
        } else {
        }
    }
}


export const setGlobalConfig = (row, type) => {
    return async dispatch => {
        var rdata = await AXIOS_REQUEST("settings/setGlobalConfig",{row});
        if (rdata.status) {
            toast.success("success")
            dispatch({type:type, data : rdata.data.content})
        } else {
        }
    }
}

