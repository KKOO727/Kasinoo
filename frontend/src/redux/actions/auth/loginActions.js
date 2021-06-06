import { history } from "../../../history"
import { Root} from "../../../authServices/rootconfig"
import {AXIOS_REQUEST} from "./index"
import {LoginUrl} from "../../../urls"
import{setSession,url_path,fake_session ,notification} from "./index"
import { toast } from "react-toastify"
import io from 'socket.io-client'
import * as AcionTypes from "../../types"

export const get_userinfor =() =>{
  return async(dispatch) =>{
    var response = await AXIOS_REQUEST("users/get_userinfor",);
    if(response.status){
      return dispatch({
        type : "PROFILE_USER",
        data : response.data
      })
    }else{
    }
  }
}

export const loginWithJWT = user => {
  return async(dispatch) => {
    var rdata = await AXIOS_REQUEST("users/adminlogin",{username: user.email,password: user.password},dispatch,true);
    if(rdata.status){
      toast.success("Successfully logged In");
       setSession(rdata.data);
      window.location.assign("/");
    }else{
      toast.error(rdata.data)
    }
      
  }
}

export const setSidebar = () => {
  return async dispatch => {
  
  }
}

export const logoutWithJWT = () => {
  return async dispatch => {
    // await AXIOS_REQUEST("users/logout",);
    fake_session();
    dispatch({ type : "LOGIN_WITH_JWT", payload :false});
    history.push(LoginUrl);
  }
}

export const session_checked = (decoded)=>{
  return async(dispatch) =>{
    Root.socket = io(Root.admindomain,{query : {auth : decoded}});
    // Root.socket = io("51.79.157.0:1998");
    
    var user = await AXIOS_REQUEST("users/get_user_auth",{token : decoded});
    var userdata = user.data;
    dispatch({ type : "PROFILE_USER",data : userdata});


    Root.socket.on("destory",(dd)=>{ 
      if(dd.data[userdata.email] ){
        fake_session();
        window.location.assign(LoginUrl);
      }
    });
    
    Root.socket.emit("setsession", {token :  decoded});
    
    Root.socket.on("datetime",(date)=>{ 
      dispatch({ type : "SET_DATE" ,data : date });      
    });
  
    Root.socket.on("balance",(barray)=>{
      if(barray.data){
        if(barray.data[userdata.email]){
          dispatch({  type : "GETBALANCE",  data : barray.data[userdata.email] });
        }
      }
    });

    

    // Root.socket.on("AllNotification",data=> {
    //     let allnoti = data.data;  
    //     notification(allnoti)
    // })

    Root.socket.on("webNotification",data=> {
      let allnoti = data.data;  
      notification(allnoti)

    })

    Root.socket.on("UserNotification",data=> {
      let allnoti = data.data;  
      if (allnoti.userid === userdata.email) {
        notification(allnoti)
      }
    })

    var rdata =  await AXIOS_REQUEST("users/get_themeinfor")
    if(rdata.status){
      dispatch({ type : "THEMSET", theme : rdata.data })
    }
    if(url_path() === LoginUrl ){
      history.push("/");
    }


    rdata = await AXIOS_REQUEST("users/adminsidebar_load");
    if(rdata.status){
      dispatch({ 
        type : "SIDEVAR_DATA",
        data : rdata.data,
        array : rdata.array
      })
    }else{

    }


    rdata = await AXIOS_REQUEST("cms/cmsload",{},dispatch,true);
    if(rdata.status){
      let row = rdata.data;
      dispatch({type : AcionTypes.GETREFERALINK,data :  row.Referrallink});
      dispatch({type : AcionTypes.FirstPageSettingLogo,data : row.logoimg});
      dispatch({type : AcionTypes.FirstpageSetting_cmsfootertext,data : row.cmsfootertext});

    }else{
    }
    return true;
  }
}


export const cmsload = () =>{
  return async (dispatch) =>{
   
  }
}


export const changeRole = role => {
  return dispatch => dispatch({ type: "CHANGE_ROLE", userRole: role })
}

export const getuserslist = () =>{
  return async(dispatch) => {
    var rdata = await AXIOS_REQUEST("users/getlist",{})
      if(rdata.status){
        dispatch({ type: "USERSLIST", payload: rdata.data })
      }else{
        toast.error("fail")
      }
  }
}

export const getuserslist_delete = () =>{
  return async(dispatch) =>{
    var rdata = await AXIOS_REQUEST("users/getlist",{});
      if(rdata.status){
        dispatch({type : "DELETEDUSERSLIST",payload : rdata.data})
      }else{
        toast.error("Fail")
      }
  }
}

export const deleteuser = (user) =>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("users/delete",{user : user})
      if(!rdata.status){
        return dispatch({ type: "USERSLIST", payload: rdata.data })
      }else{
      }
  }
}

export const kycdoclist = () =>{
  return async(dispatch) =>{
    var rdata = await AXIOS_REQUEST("files/getkycdoclist",{})
      if(rdata.status){
        return dispatch({
          type : "KYCDOCLIST",
          payload : rdata.data
        })
      }else{
      }
  }
}

export const kycdoccheck =(data)=>{
  return async(dispatch) =>{
    var rdata = await AXIOS_REQUEST("files/checkkycdoc",{data : data})
      if(rdata.status){
        return dispatch({
          type : "KYCDOCLIST",
          payload : rdata.data
        })
      }else{
      }
  }
}

export const kycdocreject =(data)=>{
  return async(dispatch) =>{
    var rdata = await AXIOS_REQUEST("files/rejectkycdoc",{data : data})
      if(rdata.status){
        return dispatch({
          type : "KYCDOCLIST",
          payload : rdata.data
        })
      }else{
      }
  }
}

export const kycdownload = (data) => {
  return dispatch => {
    // axios.get(BASEURL + "file/download/"+ data.filename+"/"+data.originalname,).then( response =>{
    // })
  }
}

export const changepassword =(user) =>{
  return async(dispatch) =>{
    var rdata = await AXIOS_REQUEST("users/adminchangepassword",{user},dispatch,true);
    if(rdata.status){
      toast.success("successfully changed");
    }else{
      toast.error(rdata.error)

    }
  }
}

export const themeinforsave = (data)=>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("users/save_themeinfor",{data : data})
    if(rdata.status){
      dispatch({
        type : "THEMSET",
        theme : rdata.data
      })
    }else{
      toast.error("Fail")
    }
  }
}

export const role_update = () =>{
  return async dispatch =>{
    var rdata = await AXIOS_REQUEST("users/role_load",{});
    if(rdata.status){
      dispatch({
        type : "USERSROLE",
        data : rdata.data
      })
    }else{

    }
  }
}