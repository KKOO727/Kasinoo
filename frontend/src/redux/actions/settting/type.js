import {AXIOS_REQUEST,Set_reducer} from "../auth/index"
import { toast } from "react-toastify";
import confirm from "reactstrap-confirm"
import * as ActionTypes from "../../types"

export const getData = (params) => {
    return  async (dispatch) => {
        var rdata = await AXIOS_REQUEST("settings/getTypemanager",{},dispatch,true)
        if (rdata.status) {
            Set_reducer(dispatch,params,rdata,ActionTypes.GETTypeManager)
        } else {
            toast.error("fail")
        }
    }
}

export const menudelete = (value,params)=>{
    return async(dispatch)=>{
        var result = await confirm();
        if (result){
            var rdata = await AXIOS_REQUEST("settings/deleteTypemanager",{data : value},dispatch,true)
            if(rdata.status){
                toast.success("success")
                Set_reducer(dispatch,params,rdata,ActionTypes.GETTypeManager)
            }else{
                toast.error("fail")
            }
        }
    }
}

export const menusave =(data,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("settings/saveTypemanager",{data : data},dispatch,true)
        if(rdata.status){
            toast.success("success")
            Set_reducer(dispatch,params,rdata,ActionTypes.GETTypeManager)
        }else{
          toast.error("fail")
        }
    }
}

export const menuupdate = (datas,params)=>{
    return async(dispatch)=>{
        var rdata = await AXIOS_REQUEST("settings/updateTypemanager",{data : datas},dispatch,true)
        if(rdata.status){
            toast.success("success")
            Set_reducer(dispatch,params,rdata,ActionTypes.GETTypeManager)
        }else{
            toast.error("fail")
        }
    }
}