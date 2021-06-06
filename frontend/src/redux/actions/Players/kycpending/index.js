import {AXIOS_REQUEST,Set_reducer} from "../../auth/index"
import { toast } from "react-toastify";

export const getData = (params,status) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("players/KYCmenuload",{status : status})
    if(rdata.status){
      Set_reducer(dispatch,params,rdata,"KYC_GET_DATA");

    }else{
      toast.error("fail")
    }
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: "KYC_FILTER_DATA", value })
}

export const menuupdate = (datas,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("players/KYCupdate",{data : datas})
    
        if(rdata.status){
          toast.success("Successfully")
          Set_reducer(dispatch,params,rdata,"KYC_GET_DATA");

        }else{
          toast.error("fail")
        }
    }
}