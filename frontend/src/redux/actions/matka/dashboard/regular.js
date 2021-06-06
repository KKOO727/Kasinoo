import {AXIOS_REQUEST,Set_reducer} from "../../auth/index"
import { toast } from "react-toastify";
import {history} from "../../../../history"
import {MATKA_ANOUNCER_GET_DATA} from "../../../types"


export const getData = (date) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("satta/adminGetLoadBazaars",{date : date},dispatch,true)
    if(rdata.status){
      let row = rdata.data;
      row['date'] = date;
      dispatch({type : "SATTA_DAHSBOARD_REGULAR",data : row});
    }else{
      toast.error("fail")
    }
  }
}

export const get_bets_from_bazarr = (bazaritem ,date) => {
  return async dispatch =>{
    console.log(date)
    date = new Date(date).toDateString()
    var rdata = await AXIOS_REQUEST("satta/get_bets_from_bazarr",{bazaritem ,date},dispatch,true);
    if(rdata.status){   

      dispatch({type : "SATTA_DAHSBOARD_RESULT" , data: { bettingObject : rdata.data , numbersData : rdata.numbersData}});

    } else {

    }    
  }
}

export const goTopageResult = (bazaritem,gamelist,date, totalresult) => {
  return async dispatch =>{
    history.push("/matka/dashboard/numbers",{gamelist,bazaritem, date, totalresult});
  }
}


export const goTopagebetplayers = (bazaritem,gameitem,date,bazarListObject, bazaars, gameList) => {
  return async dispatch =>{
    console.log("---")
    history.push("/matka/dashboard/players",{bazaritem,gameitem,date,bazarListObject, bazaars, gameList});
  }
}


export const create_result = (row) =>{
  return async dispatch =>{
  }
}


export const get_bets_fromresultannouncer = (params,bazzarItem,date, gamesdata) =>{
  return async (dispatch) =>{
    var rdata = await AXIOS_REQUEST("satta/get_bets_from_resultannouncer",{bazzarItem,date, gamesdata},dispatch,true);
    if(rdata.status){   
      console.log(rdata)
      Set_reducer(dispatch,params,rdata,MATKA_ANOUNCER_GET_DATA);
    }else{
    }    
  }
}

export const goToPageResultannounce = (bazaritem,gamesdata, date) =>{
  return (dispatch) =>{
    // let gamesdata = getState().matka.regular.gamesdata;
    console.log(bazaritem,gamesdata, date)
    history.push("/matka/dashboard/resultannouncer",{gamesdata, bazaritem, date});
  }
}
  

export const pagenations = (params) =>{
    return (dispatch,getState)=>{
      var row = {
        data : getState().matka.announcer.allData
      }
      Set_reducer(dispatch,params,row,MATKA_ANOUNCER_GET_DATA);

    }
}