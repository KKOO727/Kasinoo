import {AXIOS_REQUEST,Set_reducer} from "../auth/index"
import { toast } from "react-toastify";
import confirm from "reactstrap-confirm"
import * as ActionTypes from "../../types"

export const getData = (params) => {
    return  async (dispatch) => {
        var rdata = await AXIOS_REQUEST("settings/getLanguage",{},dispatch,true)
        if (rdata.status) {
            dispatch({type : "GETLANGUAGEOPTIONS", data : rdata.options})
            Set_reducer(dispatch,params,rdata,ActionTypes.GETLANGUAGE)
        } else {
            toast.error("fail")
        }
    }
}

export const menudelete = (value,params)=>{
    return async(dispatch)=>{
        var result = await confirm();
        if (result){
            var rdata = await AXIOS_REQUEST("settings/deleteLanguage",{data : value},dispatch,true)
            if(rdata.status){
                toast.success("success")
                Set_reducer(dispatch,params,rdata,ActionTypes.GETLANGUAGE)
            }else{
                toast.error("fail")
            }
        }
    }
}

export const menusave =(data,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("settings/saveLanguage",{data : data},dispatch,true)
        if(rdata.status){
            toast.success("success")
            Set_reducer(dispatch,params,rdata,ActionTypes.GETLANGUAGE)
        }else{
          toast.error("fail")
        }
    }
}

export const menuupdate = (datas,params)=>{
    return async(dispatch)=>{
        var rdata = await AXIOS_REQUEST("settings/updateLanguage",{data : datas},dispatch,true)
        if(rdata.status){
            toast.success("success")
            Set_reducer(dispatch,params,rdata,ActionTypes.GETLANGUAGE)
        }else{
            toast.error("fail")
        }
    }
}