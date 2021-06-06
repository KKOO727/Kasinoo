import {AXIOS_REQUEST,Set_reducer} from "../../auth/index"
import { toast } from "react-toastify";
import {EXCHG_MENULIST_GETDATA,EXCHG_MENULIST_FILTERDATA} from "../../../types"

export const getExchgData = (params) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("exchg/load_exchgdata" , {} );
    if(rdata.status){
      Set_reducer(dispatch,params,rdata,EXCHG_MENULIST_GETDATA);

    }else{
      toast.error("fail")
    }
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: EXCHG_MENULIST_FILTERDATA, value })
}

export const menuupdate = (datas,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("exchg/exchg_update",{data : datas})
        if(rdata.status){
          Set_reducer(dispatch,params,rdata,EXCHG_MENULIST_GETDATA);

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
      Set_reducer(dispatch,params,row,EXCHG_MENULIST_GETDATA);

    }
  }