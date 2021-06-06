import {AXIOS_REQUEST, Set_reducer} from "../../auth/index"
import { toast } from "react-toastify";
import {SPORTS_MENULIST_GETDATA,SPORTS_MENULIST_FILTERDATA} from "../../../types"

export const getData = (params) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("sport/getAllSportsType",{},dispatch,true)
    if(rdata.status){
      Set_reducer(dispatch, params,rdata,SPORTS_MENULIST_GETDATA )
    }else{
      toast.error("fail")
    }
  }
}

export const sportsImageUpload = (params,formdata) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("sport/uploadsportsImage",formdata,dispatch,true)
    if(rdata.status){
      toast.success("success")
      Set_reducer(dispatch, params,rdata,SPORTS_MENULIST_GETDATA )
    }else{
      toast.error("fail")
    }
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: SPORTS_MENULIST_FILTERDATA, value })
}

export const menuupdate = (datas,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("sport/sportsTypeUpdate",{data : datas},dispatch,true)
      if(rdata.status){
        toast.success("success")
        Set_reducer(dispatch, params,rdata,SPORTS_MENULIST_GETDATA )
      }else{
        toast.error("fail")
      }
    }
}

export const pagenationchange = (params,data)=>{
    return (dispatch,getState)=>{
      var row = {
        data : getState().cms.sports.allData
      }
      Set_reducer(dispatch, params,row,SPORTS_MENULIST_GETDATA )
    }
}