import {AXIOS_REQUEST,Set_reducer} from "../auth/index"
import {toast} from "react-toastify";

export const getSportsList = () => {
  return async(dispatch) => {
    var rdata = await AXIOS_REQUEST("sport/getSportsType");
    if(rdata.status) {
        dispatch({ type : "SPORTS_LIST", data : Object.assign({} , {data : rdata.data})});
    }else{
        toast.error("error");   
    }
  }
}

export const featureadd = (row) => {
  return async dispatch => {
    console.log(row)
    var rdata = await AXIOS_REQUEST("sport/addfeatureSportsType",{row});
    if(rdata.status) {
      toast.success("success");   
    }else{
      toast.error("error");   
    }

  }
}

export const getSportData = (params , sendData) => {
  return async(dispatch) => {
    var rdata = await AXIOS_REQUEST("sport/getSportsMatchs" , sendData , dispatch , true)
    if(rdata.status){
      Set_reducer(dispatch,params,rdata,"SPORTS_MATCHS");
    }else{
        toast.error("error");   
    }
  }
}

export const changeStatus = (row , params , key) => {
  return async(dispatch , getState) => {
    var sendData = {row , key};
    var rdata = await AXIOS_REQUEST("sport/changeMatchPermission" , sendData , dispatch , false)
    if(rdata.status){
      var data = getState().sports.sports_data.allData;
      var newData = [];
      for(var i = 0 ; i < data.length ; i ++){
        if(data[i].event_id === row.event_id){
          var temp = data[i];
          temp.permission = key;
          newData.push(temp);
        }else{
          newData.push(data[i])
        }
      }

      Set_reducer(dispatch,params,Object.assign({} , {data : []}),"SPORTS_MATCHS");
      Set_reducer(dispatch,params,Object.assign({} , {data : newData}),"SPORTS_MATCHS");
    }else{
      toast.error("error");
    }
  }
}

export const pagenationchange = (params)=>{
  return (dispatch,getState)=>{
    Set_reducer(dispatch,params,{data : getState().sports.sports_data.allData},"SPORTS_MATCHS");
  }
}