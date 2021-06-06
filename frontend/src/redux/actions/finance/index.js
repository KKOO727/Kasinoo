import {AXIOS_REQUEST} from "../auth/index"
import {FINANCE_TRANSACTIONS_GET, FINANCE_TRANSACTIONS_LOAD} from "../../types"

export const getData = (params,filters) => {
  return  async(dispatch) => {
    let rdata = await AXIOS_REQUEST("paymentGateWay/admindeposittransactionHistoryLoad",{params,filters},dispatch,true);
      if(rdata.status){
        var data = rdata.data;
        var totalPages = rdata.pageset["totalPages"];
        var pages = rdata.pageset;
        var totalRecords = rdata.pageset["totalRecords"]
        dispatch({
            type: FINANCE_TRANSACTIONS_GET,
            data: data,
            totalPages:totalPages,
            params : pages,
            totalRecords : totalRecords,
        });
     }
  }
}

export const getTotal = ( filters) => {
  return  async(dispatch) => {
    let rdata = await AXIOS_REQUEST("paymentGateWay/admindeposittransactionHistoryLoadTotal",{filters},dispatch,true);
      if(rdata.status){
        
        dispatch({
            type: FINANCE_TRANSACTIONS_LOAD,
            data: rdata.data,
        });
     }
  }
}