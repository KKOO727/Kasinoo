import {AXIOS_REQUEST,Set_reducer} from "../../auth/index"
import { toast } from "react-toastify";

export const getData = (params,bool) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("providermanager/get_firstpage_gamelist",{type : bool},dispatch,true)
    if(rdata.status){
      Set_reducer(dispatch,params,rdata,"FIRSTPAGE_GAME_SETTING_GET_DATA")
    }else{
      toast.error("fail")
    }
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: "FIRSTMENU_FILTER_DATA", value })
}

export const menuupdate = (datas,params,bool)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("providermanager/update_firstpage_gamelist",{data : datas,type : bool},dispatch,true)
        if(rdata.status){
          toast.success("success")
          Set_reducer(dispatch,params,rdata,"FIRSTPAGE_GAME_SETTING_GET_DATA")
        }else{
          toast.error("fail")
        }
    }
}

export const menudelete = (data,params,bool) =>{
    return async dispatch =>{
      var rdata = await AXIOS_REQUEST("providermanager/delete_firstpage_gamelist",{data : data,type : bool},dispatch,true)
      if(rdata.status){
        toast.success("success")
        Set_reducer(dispatch,params,rdata,"FIRSTPAGE_GAME_SETTING_GET_DATA")
      }else{
        toast.error("fail")
      }
    }
}