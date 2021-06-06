import {AXIOS_REQUEST, alert} from "../../auth/index"
import {REQUESTPAYOUT_GET,REQUESTPAYOUT_FILTER,REQUESTPAYOUTTOTAL_GET} from "../../../types"
import { toast } from "react-toastify";
import {history} from "../../../../history"

function reduxload(rdata,dispatch){
  var array = rdata.data;
  var totalPages = rdata.pageset["totalPages"];
  var pages = rdata.pageset;
  var totalRecords = rdata.pageset["totalRecords"];
  console.log(rdata)
    dispatch({
      type: REQUESTPAYOUT_GET,
      data: array,
      totalPages:totalPages,
      params : pages,
      totalRecords : totalRecords
    });
}

export const Payout = (data,filters,params) => {
  return  async(dispatch) => {
    var rdata = await AXIOS_REQUEST("paymentGateWay/Payout",{ data,params,filters},dispatch,true)
      if(rdata.status){
        if (rdata.error) {
          alert(rdata.error, "error")
        }
        reduxload(rdata,dispatch)        
      }else{
        toast.error(rdata.data); 
      }
  }
}

export const getData = (params,filters) => {
  return  async(dispatch) => {
    let rdata = await AXIOS_REQUEST("paymentGateWay/adminWithdrawHistoryLoad",{filters,params},dispatch,true);
    if(rdata.status){
      reduxload(rdata,dispatch)        

    }else{
      toast.error("fail")
    }  
  }
}

export const getTotal = (filters) =>{
  return async (dispatch) =>{
    let rdata2 = await AXIOS_REQUEST("paymentGateWay/adminwithdrawal_total",{filters},dispatch,true);
    if(rdata2.status){
      dispatch({
        type: REQUESTPAYOUTTOTAL_GET,
        total: rdata2.data,
      });
    }else{
      toast.error("fail")
    }  
  }
}

export const filterData = (value,bool) => {
  return dispatch => dispatch({ type: REQUESTPAYOUT_FILTER, value : value,bool : bool })
}


export const pagenationchange = (params,data)=>{
  return (dispatch,getState)=>{
    
  }
}


export const request_payout_show = (row) =>{
  return dispatch =>{
    history.push('/finace/playershow',row.userid);
  }
}