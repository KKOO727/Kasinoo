import {AXIOS_REQUEST} from "../../auth/index"
import { toast } from "react-toastify";
import {PROMOTIONS_BONUS_GET_DATA,PROMOTIONS_BONUS_GETCONFIG,PROMOTIONS_BONUS_SETCONFIG} from "../../../types"
import confirm from "reactstrap-confirm"

function reduxload(rdata,dispatch){
  var data = rdata.data;
  var totalPages = rdata.pageset["totalPages"];
  var pages = rdata.pageset;
  var totalRecords = rdata.pageset["totalRecords"]
  dispatch({
    type: PROMOTIONS_BONUS_GET_DATA,
    data: data,
    totalPages:totalPages,
    params : pages,
    totalRecords : totalRecords,
    options : rdata.options
  });
}

export const BonusConfig = (method) => {
  return async dispatch => {
    var rdata = await AXIOS_REQUEST("promotions/GetBonusConfig",{method})
    if (rdata.status) {
      dispatch({
        type : PROMOTIONS_BONUS_GETCONFIG,
        data : rdata.data.data,
        options : rdata.data.options
      })
    } else {
      toast.error("fail")
    }
  }
}

export const SetBonusConfig = (method,data) => {
  return async dispatch => {
    var rdata = await AXIOS_REQUEST("promotions/GetBonusConfig",{method,data})
    if (rdata.status) {
      dispatch({
        type : PROMOTIONS_BONUS_SETCONFIG,
        data : data,
      })
      toast.success("success")
    } else {
      toast.error("fail")
    }
  }
}

export const getData = (params) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("promotions/bonusMenuload",{params})
    if (rdata.status) {
      reduxload(rdata,dispatch)
    } else {
      toast.error("fail")
    }
  }
}


export const menudelete = (data,params)=> {
  return async(dispatch)=>{
    let result = await confirm();
    if (result) {
      var rdata = await AXIOS_REQUEST("promotions/bonusmenu_delete",{data ,params})
        if (rdata.status) {
          toast.success("success")
          reduxload(rdata,dispatch)
        } else {
          toast.error("fail")
        }
    } else {

    }
  }
}

export const menusave =(data,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("promotions/bonusmenu_save",{data,params})
        if (rdata.status) {
          toast.success("success")
          reduxload(rdata,dispatch)
        } else {
          toast.error("fail")
        }
    }
}

export const menuupdate = (data,params)=>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("promotions/bonus_menuupdate",{data ,params})
      if (rdata.status) {
        toast.success("success")
        reduxload(rdata,dispatch)
      } else {
        toast.error("fail")
      }
  }
}