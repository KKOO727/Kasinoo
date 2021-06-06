import {AXIOS_REQUEST,alert, Set_reducer} from "../auth/index"
import { toast } from "react-toastify"

export const PaymentconfigLoad = type => {
  return  async(dispatch) => {
    var rdata = await AXIOS_REQUEST("paymentGateWay/paymentConfigLoad",{type})
    if(rdata.status){
        dispatch({ type: "PAYMENTMENU_CONFIG_DATA", data: rdata.data })
    }else{
        toast.error(rdata.data);
    }
  }
}
  
export const PaymentconfigSave = params => {
  return  async(dispatch) => {
    var rdata = await AXIOS_REQUEST("paymentGateWay/paymentConfigSave",{params})
    if(rdata.status){
      toast.success(rdata.data);   
    }else{
      toast.error(rdata.data);   
    }
  }
}


function reduxload(rdata,dispatch) {
  dispatch({
    type: "PAYMENTMENU_GET_OPTIONS",
    typeoptions : rdata.typeoptions
  });
}

export const getData = (params) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("paymentGateWay/adminmenuload",{params})
    if(rdata.status){
      reduxload(rdata,dispatch)
      Set_reducer(dispatch,params,rdata,"PAYMENTMENU_GET_DATA")
    }else{
      toast.error("fail")
    }
  }
}



export const menudelete = (data,params)=>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("paymentGateWay/menudelete",{data,params},dispatch,true)
      if(rdata.status){
        alert("success","success")
        reduxload(rdata,dispatch)
        Set_reducer(dispatch,params,rdata,"PAYMENTMENU_GET_DATA")
      }else{
        toast.error("fail")
      }
  }
}

export const menusave =(data,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("paymentGateWay/menusave",data,dispatch,true)
        if(rdata.status){
          alert("success","success")
          reduxload(rdata,dispatch)
          Set_reducer(dispatch,params,rdata,"PAYMENTMENU_GET_DATA")
        }else{
          toast.error("fail")
        }
    }
}


export const menuupdate = (data,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("paymentGateWay/menuupdate",{data,params},dispatch,true)
        if(rdata.status){
          alert("success","success")
          reduxload(rdata,dispatch)
          Set_reducer(dispatch,params,rdata,"PAYMENTMENU_GET_DATA")
        }else{
          toast.error("fail")
        }
    }
}