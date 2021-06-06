import {AXIOS_REQUEST,Set_reducer} from "../../auth/index"
import { toast } from "react-toastify";

export const getData = (params) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("sport/loadfeatureSportsType",{},dispatch,true)
    if(rdata.status){
      Set_reducer(dispatch,params,rdata,"FIRSTPAGE_FEATURESEVENTS_GET_DATA")
    }else{
      toast.error("fail")
    }
  }
}



export const menudelete = (row,params) =>{
    return async dispatch =>{
      var rdata = await AXIOS_REQUEST("sport/deletefeatureSportsType",{row},dispatch,true)
      if(rdata.status){
        toast.success("success")
        Set_reducer(dispatch,params,rdata,"FIRSTPAGE_FEATURESEVENTS_GET_DATA")
      }else{
        toast.error("fail")
      }
    }
}