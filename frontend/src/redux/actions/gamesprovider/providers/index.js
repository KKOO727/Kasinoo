import {AXIOS_REQUEST} from "../../auth/index"
import { toast } from "react-toastify";
import {gameproviderget} from "../../../types";
import confirm from "reactstrap-confirm";


function reduxload(rdata,dispatch){
  var data = rdata.data;
  var totalPages = rdata.pageset["totalPages"];
  var pages = rdata.pageset;
  var totalRecords = rdata.pageset["totalRecords"]
  dispatch({
    type: gameproviderget,
    data: data,
    totalPages:totalPages,
    params : pages,
    totalRecords : totalRecords
  });
}


export const getData = (params, filters) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("gameprovider/providerload",{filters, params})
    if (rdata.status) {
      reduxload(rdata,dispatch);
    } else {
      toast.error("fail")
    }
  }
}


export const menudelete = (row, filters, params)=>{
  return async(dispatch)=>{
    var result =  await confirm();
    if (result) {
      var rdata = await AXIOS_REQUEST("gameprovider/providerdelete",{row,filters,params})
      if (rdata.status) {
        reduxload(rdata,dispatch);
      } else {
        toast.error("fail")
      }
    }
  }
}

export const menusave =(row, filters, params)=>{
    return async(dispatch,getState)=>{
      var rdata = await AXIOS_REQUEST("gameprovider/providersave",{row, filters, params})
      if (rdata.status) {
        reduxload(rdata,dispatch);
      } else {
        toast.error("fail")
      }
  }
}


export const menuupdate = (row, filters, params)=>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("gameprovider/providerupdate",{row, filters, params})
    if (rdata.status) {
      reduxload(rdata,dispatch);
    } else {
      toast.error("fail")
    }
  }
}
