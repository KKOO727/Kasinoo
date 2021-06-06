import {AXIOS_REQUEST} from "../../auth/index"
import { toast } from "react-toastify";
import {MatkaBettingPlayers_GETDATA} from "../../../types"

function reduxload (rdata, dispatch) {
  var data = rdata.data;
  var totalPages = rdata.pageset["totalPages"];
  var pages = rdata.pageset;
  var totalRecords = rdata.pageset["totalRecords"]
  dispatch({
      type: MatkaBettingPlayers_GETDATA,
      data: data,
      totalPages:totalPages,
      params : pages,
      totalRecords : totalRecords,
  });
}

export const getData = (params,data) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("satta/getBettingPlayers",{params,data},dispatch,true)
    if(rdata.status){
      reduxload(rdata,dispatch)
    }else{
      toast.error("fail")
    }
  }
}
