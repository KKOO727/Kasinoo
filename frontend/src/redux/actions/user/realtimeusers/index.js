import {AXIOS_REQUEST,Set_reducer} from "../../auth/index"
import { toast } from "react-toastify";

export const getData = (params,date) => {
  return  async(dispatch) => {
    if(date.length === 2){
      var rdata = await AXIOS_REQUEST("players/realtimeusers",{start : date[0],end : date[1]})
          if(rdata.status){
            Set_reducer(dispatch,params,rdata,"REALTIME_GET_DATA")

        }else{
          toast.error("fail")
        }
    }
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: "REALTIME_FILTER_DATA", value })
}

export const deleteRow = (value,params)=>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("players/realtimeusersdelete",{email : value.email})
      if(rdata.status){
        Set_reducer(dispatch,params,rdata,"REALTIME_GET_DATA")

      }else{
        toast.error("fail")
      }
  }
}

export const pagenationchange = (params,data)=>{
  return (dispatch,getState)=>{
    var row = {
      data : getState().userslist.realtimeusers.allData
    }
    Set_reducer(dispatch,params,row,"REALTIME_GET_DATA")

  }
}