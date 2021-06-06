import {AXIOS_REQUEST,Set_reducer} from "../../auth/index"
import { toast } from "react-toastify";
import confirm from "reactstrap-confirm"
import {MATKA_BAZARTYPES_GET_DATA,MATKA_GAMES_FILTER_DATA} from "../../../types"

export const getData = (params,bool) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("satta/get_bazartypes",{},dispatch,true)
    if(rdata.status){
      Set_reducer(dispatch,params,rdata,MATKA_BAZARTYPES_GET_DATA)
    }else{
      toast.error("fail")
    }
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: MATKA_GAMES_FILTER_DATA, value })
}

export const pagenationchange = (params,data)=>{
    return (dispatch,getState)=>{
      var row = {
        data : getState().matka.gameslist.allData
      }
      Set_reducer(dispatch,params,row,MATKA_BAZARTYPES_GET_DATA)

    }
  }

export const menudelete = (value,params,bool)=>{
  return async(dispatch)=>{
    var result = await confirm();
    if(result){
      var rdata = await AXIOS_REQUEST("satta/delete_bazartypes",{data : value,bool : bool},dispatch,true)
        if(rdata.status){
          toast.success("success")
          Set_reducer(dispatch,params,rdata,MATKA_BAZARTYPES_GET_DATA)
        }else{
            toast.error("fail")
        }
    }
  }
}

export const menusave =(data,params,bool)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("satta/create_bazartypes",{data : data},dispatch,true)
        if(rdata.status){
          toast.success("success")
          Set_reducer(dispatch,params,rdata,MATKA_BAZARTYPES_GET_DATA)
        }else{
          toast.error("fail")
        }
    }
}

export const menuupdate = (datas,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("satta/update_bazartypes",{data : datas},dispatch,true)
        if(rdata.status){
          toast.success("success")
          Set_reducer(dispatch,params,rdata,MATKA_BAZARTYPES_GET_DATA)
        }else{
          toast.error("fail")
        }
    }
}


export const iconupload = (datas,params)=>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("satta/iconupload_bazartypes",datas,dispatch,true)
      if(rdata.status){
          Set_reducer(dispatch,params,rdata,MATKA_BAZARTYPES_GET_DATA)
      }else{
        toast.error("fail")
      }
  }
}

export const filesupload = (datas,params)=>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("satta/imgupload_bazartypes",datas,dispatch,true)
      if(rdata.status){
          Set_reducer(dispatch,params,rdata,MATKA_BAZARTYPES_GET_DATA)
      }else{
        toast.error("fail")
      }
  }
}