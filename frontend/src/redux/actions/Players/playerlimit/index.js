import {AXIOS_REQUEST,Set_reducer} from "../../auth/index"
import { toast } from "react-toastify";

export const getData = (params) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("players/playerlimit_load",{},dispatch,true)
    if(rdata.status){
      Set_reducer(dispatch,params,rdata,"PLAYERLIMITS_DATA");

    }else{
      toast.error("fail")
    }
  }
}

export const filterData = (value,bool,params) => {
  return dispatch => dispatch({ type: "PLAYERLIMITS_FILTER_DATA", value,bool,params })
}

export const menuupdate = (datas,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("players/playerlimit_update",{data : datas},dispatch,true)
        if(rdata.status){
          Set_reducer(dispatch,params,rdata,"PLAYERLIMITS_DATA");
        }else{
          toast.error("fail")
        }
    }
}

export const pagenationchange = (params,data)=>{
  return (dispatch,getState)=>{
    var row = {
      data : getState().Players.playerlimit.allData
    }
    Set_reducer(dispatch,params,row,"PLAYERLIMITS_DATA");

  }
}