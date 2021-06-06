import {AXIOS_REQUEST,Set_reducer,} from "../auth/index"
import { toast } from "react-toastify";
import {permissionload,permissionget,permissionfilter} from "../../types"
import confirm from "reactstrap-confirm"
 
export const getData = (params) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("users/role_menuload",{})
    if(rdata.status){
      dispatch({ type: permissionload, data: rdata.data })
      Set_reducer(dispatch,params,rdata,permissionget)

    }else{
      toast.error("fail")
    }
  }
}

export const getDataAgain = (params) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("users/role_menuload_permission",{})
    if(rdata.status){
      var permission = rdata.data;
      let temp_permission = [];
      for(var i = 0 ; i < permission.length ; i ++)
      {
        let temp = {};
        temp.value = permission[i].id;
        temp.label = permission[i].title;
        temp_permission.push(temp);
      }
      dispatch({ type: "PERMISSION_LOAD", data: temp_permission })
    }else{
      toast.error("fail")
    }
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: permissionfilter, value })
}


export const menudelete = (value,params)=>{
  return async(dispatch)=>{
    var result =  await confirm();
    if(result){
      var rdata = await AXIOS_REQUEST("users/role_menudelete",{data : value})
      if(rdata.status){
        dispatch({ type: permissionload, data: rdata.data })
        Set_reducer(dispatch,params,rdata,permissionget)
      }else{
        toast.error("fail")
      }
    }else{

    }
  }
}

export const menusave =(data,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("users/role_menusave",{data : data})
        if(rdata.status){
          dispatch({ type: permissionload, data: rdata.data })
          Set_reducer(dispatch,params,rdata,permissionget)
        }else{
          toast.error("fail")
        }
    }
}

export const menuupdate = (datas,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("users/role_menuupdate",{data : datas})
        if(rdata.status){
          dispatch({ type: permissionload, data: rdata.data })
          Set_reducer(dispatch,params,rdata,permissionget)

        }else{
          toast.error("fail")
        }
    }
}

export const pagenationchange = (params,data)=>{
  return (dispatch,getState)=>{
    var row = {
      data : getState().userslist.permission.allData
    }
    Set_reducer(dispatch,params,row,permissionget)

  }
}


export const sidebarSave = (params)=>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("users/sidebarSave",params)
      if(rdata.status){
        toast.success("success")
      }else{
      }
  }
}

export const sidebarLoad = (params) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("users/sidebarLoad",params)
    if(rdata.status){
      dispatch({ type: "SIDBAR_LOAD_DATA", data: rdata.data.sidebar })
    }else{
      toast.error("fail")
    }
  }
}