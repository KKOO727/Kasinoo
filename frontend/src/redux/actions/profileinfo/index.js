import {AXIOS_REQUEST} from "../auth/index"
import {toast} from "react-toastify"

function reduxload(rdata,dispatch,type) {
    var data = rdata.data;
    var totalPages = rdata.pageset["totalPages"];
    var pages = rdata.pageset;
    var totalRecords = rdata.pageset["totalRecords"]
    dispatch({
        type: type,
        data: data,
        totalPages:totalPages,
        params : pages,
        totalRecords : totalRecords,
    });
}

export const get_accountStatement =(date,user,params) =>{
    return async dispatch =>{
        
        var row = Object.assign({},date,{id : user._id});
        console.log(row)
        row.start = new Date(row.start).toDateString()
        row.end = new Date(row.end).toDateString()
        var rdata = await AXIOS_REQUEST("players/get_accountstatement",{row,params},dispatch,true)
        if(rdata.status){
            reduxload(rdata,dispatch,"PROFILEINFOR_ACCOUNTSTATEMENT_LOAD");
        }else{

        }        
    }
}

export const transactionHistoryLoad = (date,user,params) => {
    return  async(dispatch) => {

        var row = Object.assign({},date,{id : user._id})
        row.start = new Date(row.start).toDateString()
        row.end = new Date(row.end).toDateString()
        var rdata = await AXIOS_REQUEST("paymentGateWay/deposit_withdrawlhistoryload",{row,params},dispatch,true)
        if(rdata.status){
            reduxload(rdata,dispatch,"PROFILEINFOR_DEPOSIT_LOAD");
        }else{  
            
        }
    }
}


export const reports_email_load = (date,user,params) => {
    return  async(dispatch) => {
        var row = Object.assign({},date,{id : user._id})
        row.start = new Date(row.start).toDateString()
        row.end = new Date(row.end).toDateString()
        var rdata = await AXIOS_REQUEST("reports/adminreports_email_load",{row,params})
        if(rdata.status){
            reduxload(rdata,dispatch,"PROFILEINFOR_MYBETS_LOAD");
        }else{
        }
    }
}


export const bethistoryFromEmailTotal = (date,user,params) => {
    return  async(dispatch) => {
        var row = Object.assign({},date,{id : user._id})
        row.start = new Date(row.start).toDateString()
        row.end = new Date(row.end).toDateString()
        var rdata = await AXIOS_REQUEST("reports/adminBetsHitoryTotalFromEmail",{row,params})
        if(rdata.status){
            dispatch({type : "PROFILEINFOR_MYBETS_TOTAl",data : rdata.data})
        }else{
        }
    }
}

export const satta_history_load = (date,user,type,params) => {
    return  async(dispatch) => {
        var row = Object.assign({},date,{id : user._id});
        console.log(row)
        row.start = new Date(row.start).toDateString()
        row.end = new Date(row.end).toDateString()
        var rdata = await AXIOS_REQUEST("satta/adminbethistory_email_load",{row,params , type})
        if(rdata.status){
            reduxload(rdata,dispatch,"PROFILEINFOR_SATTA_LOAD");
        }else{
            // toast.error('No Record');   
        }
    }
}


export const profile_update = (users) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("players/profile_userupdate",{users : users},dispatch,true)
        if(rdata.status){
            toast.success("successfully updated");
            dispatch({
                type : "PROFILEINFOR_PROFILE_LOAD",
                data : rdata.data
            })
        }else{

        }
    }
}

export const avatarUpload = (file) => {
    return async dispatch => {
        var response = await AXIOS_REQUEST("profile/avatarUpload",file);
        if(response.status){
            var row = Object.assign({},response.data);
            dispatch({
                type : "PROFILEINFOR_PROFILE_LOAD",
                data : row
            })
        }else{
          // alert(response.data.data)
        }  
    }
}

export const profile_load = (user) =>{
    return async(dispatch) =>{
        var response = await AXIOS_REQUEST("players/profile_userload",{user});
        if(response.status){
            var row = Object.assign({},response.data);
            dispatch({
                type : "PROFILEINFOR_PROFILE_LOAD",
                data : row
            })
        }else{
          // alert(response.data.data)
        }
      }
}



export const WithdrawHistoryLoad = (email) => {
    return  async(dispatch) => {
        var res = await AXIOS_REQUEST("paymentGateWay/WithdrawHistoryLoad",email)
        if(res.status){
            dispatch({ type : "PROFILEINFOR_WITHDRAWL_LOAD", data : res.data })
        }else{
            // toast.error(res.data);   
        }
        
    }
}

export const mywallet_infor = (row,date) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("players/get_wallet_mainuser",{user: row,startDate : new Date(date[0]).toDateString(),endDate :new Date(date[1]).toDateString()});
        if(rdata.status){
            dispatch({
                type: "PROFILEINFOR_MYWALLET_LOAD",
                result : rdata.result,
                data : rdata.data
            });
        }else{
            // toast.error('No Record');   
        }
    }
}

export const get_bets_profit = (row,user) =>{
    return async dispatch =>{
        row.start = new Date(row.start).toDateString()
        row.end = new Date(row.end).toDateString()        
        row.user = user;
        var rdata = await AXIOS_REQUEST("players/get_bets_profit",row);
        if(rdata.status){
            dispatch({
                type: "PROFILEINFOR_MYBETS_TOTAl",
                data : rdata.data
            });
        }else{
            
        }
    }
}