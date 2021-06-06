import {AXIOS_REQUEST} from "../auth/index"
import { toast } from "react-toastify";
import {Set_reducer} from "../auth/index"
import {ToolGeoIpBlock_filter,ToolGeoIpBlock_load} from "../../types"
import confirm from "reactstrap-confirm";

export const getData = (params) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("Tools/geoipblock_load")
    if (rdata.status) {
      Set_reducer(dispatch,params,rdata,ToolGeoIpBlock_load);
    } else {
      toast.error("fail")
    }
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: ToolGeoIpBlock_filter, value })
}

export const menusave =(data,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("Tools/geoipblock_save",{data : data})
      if (rdata.status) {
        Set_reducer(dispatch,params,rdata,ToolGeoIpBlock_load);
      } else {
        toast.error("fail")
      }
  }
}

export const menudelete = (value,params)=>{
  return async(dispatch)=>{
    var result =  await confirm();
    if (result) {
      var rdata = await AXIOS_REQUEST("Tools/geoipblock_delete",{data : value})
      if (rdata.status) {
        Set_reducer(dispatch,params,rdata,ToolGeoIpBlock_load);

      } else {
        toast.error("fail")
      }
    } else {
    }
  }
}

export const pagenationchange = (params,data)=>{
  return (dispatch,getState)=>{
    var row = {
      data : getState().tools.toolsgeoipblock.allData
    }
    Set_reducer(dispatch,params,row,ToolGeoIpBlock_load);

  }
}
