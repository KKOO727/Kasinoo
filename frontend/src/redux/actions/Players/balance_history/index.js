import {AXIOS_REQUEST} from "../../auth/index"
import { toast } from "react-toastify";

export const getData = (params,filters) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("players/balance_history",{params,filters},dispatch,true);
    if (rdata.status) {            
      var data = rdata.data;
      var totalPages = rdata.pageset["totalPages"];
      var pages = rdata.pageset;
      var totalRecords = rdata.pageset["totalRecords"]
        dispatch({
          type: "PLAYERBALANCE_GET_DATA",
          data: data,
          totalPages:totalPages,
          params : pages,
          totalRecords : totalRecords
        });
    } else {
      toast.error("fail")
    }
  }
}

export const getTotal = filters => {
  return async dispatch => {
    var rdata = await AXIOS_REQUEST("players/balance_history_total",{filters},dispatch,true);
    if (rdata.status) {
      dispatch({
        type: "PLAYERBALANCE_GET_ALL_DATA",
        data: rdata.data
      });
    } else {
      toast.error("fail")
    }
  }
}
