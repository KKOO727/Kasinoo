import {AXIOS_REQUEST,Set_reducer} from "../../auth/index"
import { toast } from "react-toastify";
import confirm from "reactstrap-confirm"


export const getData = (params,bool) => {
  return  async (dispatch) => {
    console.log(bool)
    var rdata = await AXIOS_REQUEST("cms/menuload",{bool : bool},dispatch,true)
    if(rdata.status){
      Set_reducer(dispatch,params,rdata,"FIRSTMENU_GET_DATA")
    }else{
      toast.error("fail")
    }
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: "FIRSTMENU_FILTER_DATA", value })
}


export const menudelete = (value,params,bool)=>{
  return async(dispatch)=>{
    var result = await confirm();
    if(result){
      var rdata = await AXIOS_REQUEST("cms/menudelete",{data : value,bool : bool},dispatch,true)
        if(rdata.status){
          Set_reducer(dispatch,params,rdata,"FIRSTMENU_GET_DATA")
        }else{
            toast.error("fail")
        }
    }
  }
}

export const menusave =(data,params,bool)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("cms/menusave",{data : data,bool : bool},dispatch,true)
        if(rdata.status){
          Set_reducer(dispatch,params,rdata,"FIRSTMENU_GET_DATA")

        }else{
          toast.error("fail")
        }
    }
}

export const menuupdate = (datas,params,bool)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("cms/menuupdate",{data : datas,bool : bool},dispatch,true)
        if(rdata.status){
            Set_reducer(dispatch,params,rdata,"FIRSTMENU_GET_DATA")
        }else{
          toast.error("fail")
        }
    }
}

export const menuimageupload = (formdata,params,bool)=>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("cms/menuimageupload",formdata,dispatch,true)
      if(rdata.status){
        Set_reducer(dispatch,params,rdata,"FIRSTMENU_GET_DATA")
      }else{
        toast.error("fail")
      }
  }
}

