import {AXIOS_REQUEST} from "../../auth/index"
import { toast } from "react-toastify";
import confirm from "reactstrap-confirm"
import {MATKA_BAZAARS_GET_DATA,MATKA_GAMES_GMAELIST_DATA} from "../../../types"

function reduxload (rdata, dispatch) {
  var data = rdata.data;
  var totalPages = rdata.pageset["totalPages"];
  var pages = rdata.pageset;
  var totalRecords = rdata.pageset["totalRecords"]
  dispatch({
    type: MATKA_BAZAARS_GET_DATA,
    data: data,
    totalPages:totalPages,
    params : pages,
    totalRecords : totalRecords,
  });
}


export const getData = (params,filters,first) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("satta/get_bazaars",{params,filters,first},dispatch,true)
    if (rdata.status) {
      dispatch({type : MATKA_GAMES_GMAELIST_DATA,data:rdata.gamelist})
      reduxload(rdata,dispatch)
    } else {
      toast.error("fail")
    }
  }
}

export const gamelink_save = (item,params,filters) =>{
  return async (dispatch) =>{
    var rdata = await AXIOS_REQUEST("satta/gamelink",{data : item,params,filters,first : true},dispatch,true)
    if (rdata.status) {
      toast.success("success")
      reduxload(rdata,dispatch)
    } else {
      toast.error("fail")
    }
  }
}

export const menudelete = (value,params,filters)=>{
  return async(dispatch)=>{
    var result = await confirm();
    if (result) {
      var rdata = await AXIOS_REQUEST("satta/delete_bazaars",{data : value,params,filters,first : true},dispatch,true)
        if (rdata.status) {
        toast.success("success")
          reduxload(rdata,dispatch)
        } else {
          toast.error("fail")
        }
    }
  }
}

export const menusave =(data,params,filters)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("satta/create_bazaars",{data : data,params,filters,first : true},dispatch,true)
      if (rdata.status) {
        toast.success("success")
        reduxload(rdata,dispatch)
      } else {
        toast.error("fail")
      }
    }
}

export const menuupdate = (datas,params,filters)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("satta/update_bazaars",{data : datas,params,filters,first : true},dispatch,true)
        if (rdata.status) {
          toast.success("success")
          reduxload(rdata,dispatch)
        } else {
          toast.error("fail")
        }
    }
}
