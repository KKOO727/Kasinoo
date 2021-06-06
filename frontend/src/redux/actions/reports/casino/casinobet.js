import {AXIOS_REQUEST,alert} from "../../auth/index"
import {REPORTSCASINO_GAMEPLAYER_LOAD,REPORTSCASINO_GAMEPLAYER_GETDATA} from "../../../types"

export const getTotal = (filters) => {
  return async dispatch =>{
    filters['dates']["start"] = new Date(filters['dates']["start"]).toDateString();
    filters['dates']["end"] = new Date(filters['dates']["end"]).toDateString();
    let rdata = await AXIOS_REQUEST("reports/report_bybet_total",{ filters},dispatch,true);
    if(rdata.status){
      dispatch({
        type: REPORTSCASINO_GAMEPLAYER_GETDATA,
        data: rdata.data
      });
    }else{
      alert("error","error")
    }
  }
}

export const getData = (params,filters) => {
  return  async(dispatch) => {
    console.log(params)
    filters['dates']["start"] = new Date(filters['dates']["start"]).toDateString();
    filters['dates']["end"] = new Date(filters['dates']["end"]).toDateString();
    let rdata = await AXIOS_REQUEST("reports/report_bybet_history",{filters,params},dispatch,true);
      if(rdata.status){
        var data = rdata.data;
        var totalPages = rdata.pageset["totalPages"];
        var pages = rdata.pageset;
        var totalRecords = rdata.pageset["totalRecords"]
          dispatch({
            type: REPORTSCASINO_GAMEPLAYER_LOAD,
            data: data,
            totalPages:totalPages,
            params : pages,
            totalRecords : totalRecords
          });
      }else{
        alert("error","error")
      }
  }
}