import {AXIOS_REQUEST,Set_reducer} from "../../auth/index"
import {toast} from "react-toastify"
import {history} from "../../../../history"


export const getInactivePlayers = (params,date) =>{
  return async dispatch =>{
    var rdata = await AXIOS_REQUEST('players/get_inactivePlayers',{start :  date.start,end : date.end},dispatch,true);
    if(rdata){
      Set_reducer(dispatch,params,rdata,"PLAYERS_GET_DATA");

    }else{
      toast.error("fail")
    }
  }
}

export const getData = (params,filterData) => {
  return  async(dispatch) => {
    var rdata = await AXIOS_REQUEST("players/playerlist",{},dispatch,true)
      if(rdata.status){      
        Set_reducer(dispatch,params,rdata,"PLAYERS_GET_DATA");
      }else{
        toast.error("fail");
      }
  }
}

export const signup = (users,params) => {
  return async(dispatch) =>{
    var rdata =  await AXIOS_REQUEST("users/adminplayerregister",{user : users},dispatch,true)
      if(rdata.status){
        toast.success("success")
        Set_reducer(dispatch,params,rdata,"PLAYERS_GET_DATA");
      }else{
        toast.error(rdata.data);
      }
  }
}

export const multiBlockAction = (params,rows) =>{
  return async dispatch =>{
    if (rows.length > 0){
      var rdata = await AXIOS_REQUEST("players/multiblock",{users : rows},dispatch,true)
      if(rdata.status){
        Set_reducer(dispatch,params,rdata,"PLAYERS_GET_DATA");
      }else{
        
      }
    }else{
      toast.warn("Please select items");

    }
  }
}

export const userDetailShow = (row) =>{
  return  dispatch =>{
    history.push('/Players/infor',row);
  }
}

export const getTotal = () =>{
  return async dispatch =>{
    var rdata = await AXIOS_REQUEST("promotions/getBonusitems",{},dispatch,true)
    if(rdata.status){
      let options = [{label : "None" , value : ""}];
      options = [...options, ...rdata.data]
      dispatch({ type : "PLAYERSGETBONUSOPTIONS" , data : options});
      // setReducer(dispatch,rdata,params,filterData);
    }else{
      
    }
  }
}

export const resetpass = (params,row) =>{
  return async dispatch =>{
    var rdata = await AXIOS_REQUEST("players/playerresetpass",{user : row},dispatch,true)
    if(rdata.status){
      toast.success("successfully")
      
      // setReducer(dispatch,rdata,params,filterData);
    }else{
      
    }
  }    
}

export const filterData = (value,bool,params) => {
  return dispatch => dispatch({ type: "PLAYERS_FILTER_DATA", value : value,bool : bool ,params  :params})
}

export const depositAction = (data,params,filterData) =>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("players/deposittion",{data : data},dispatch,true)
    if(rdata.status){
      toast.success("successfully")
      Set_reducer(dispatch,params,rdata,"PLAYERS_GET_DATA");
    }else{
      toast.warn(rdata.data)

    }

  }
}

export const withdrawalAction = (data,params,filterData) =>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("players/withdrawaction",{data : data},dispatch,true)
      if(rdata.status){
      toast.success("successfully")
      Set_reducer(dispatch,params,rdata,"PLAYERS_GET_DATA");
      }else{
      toast.warn(rdata.data)
        
      }
  }
}

export const pagenationChange = (params,data)=>{
  return (dispatch,getState)=>{
    var row = {
      data : getState().Players.playerslist.allData
    }
    Set_reducer(dispatch,params,row,"PLAYERS_GET_DATA");

  }
}