import {AXIOS_REQUEST} from "../../auth/index"
import { toast } from "react-toastify";
import {Set_reducer} from "../../auth/index"

export const getData = (params,date) => {
  return  async(dispatch) => {
    if(date && date.length === 2){
      var rdata = await AXIOS_REQUEST("players/gamesrealtimeusers",{start : date[0],end : date[1]})
        if(rdata.status){
          Set_reducer(dispatch,params,rdata,"GAMESESSIonREALTIME_GET_DATA")

        }else{
          toast.error("fail")
        }
    }
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: "GAMESESSIonREALTIME_FILTER_DATA", value })
}

export const deleteRow = (value,params)=>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("players/gamesrealtimeusersdelete",{email : value.email})
      if(rdata.status){
        Set_reducer(dispatch,params,rdata,"GAMESESSIonREALTIME_GET_DATA")

      }else{

      }
  }
}

export const pagenationchange = (params,data)=>{
  return (dispatch,getState)=>{
    var row = { 
      data : getState().userslist.sessionusers.allData
    }
    Set_reducer(dispatch,params,row,"GAMESESSIonREALTIME_GET_DATA")

  }
}