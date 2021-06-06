import * as loginAction from "./loginActions"
import { Root} from "../../../authServices/rootconfig"
import { history } from "../../../history"
import axios from "axios"
import {key_providers} from "../../../configs/providerconfig"
import { toast } from "react-toastify";
import {LoginUrl} from "../../../urls"
import addNotification from 'react-push-notification';

export default loginAction


export const dateConvert = (date) => {
	// 2021-03-28T00:29:02.157Z
	if (date && date.length) {
		let dd = date.slice(5,7) + "/" + date.slice(8 ,10) + "/" + date.slice(0,4) + " " + date.slice(11,19)
		return dd
	} else {
		return new Date().toString()
	}
}


export const Onlydate = (date) => {
	// 2021-03-28T00:29:02.157Z
	if (date && date.length) {
		let dd = date.slice(5,7) + "/" + date.slice(8 ,10) + "/" + date.slice(0,4)
		return dd
	} else {
		return new Date().toString()
	}
}

export const notification = (allnoti) => {
	addNotification({
		title: allnoti.title,
		subtitle: "",
		message: allnoti.body,
		theme: 'darkblue',
		native: true // when using native, your OS will handle theming.
	  });
}

// export const getIndex = (arr, arr2, arr3, params = {}) =>{
// 	if (arr2.length > 0) {
// 		let startIndex = arr.findIndex(i => i._id === arr2[0]._id) + 1
// 		let endIndex = arr.findIndex(i => i._id === arr2[arr2.length - 1]._id) + 1
// 		let finalArr = [startIndex, endIndex]
// 		return (arr3 = finalArr)
// 	} else {
// 		let finalArr = [arr.length - parseInt(params.perPage), arr.length]
// 		return (arr3 = finalArr)
// 	}
// }

export const get_date  =(time) =>{
	var times = time.split(":");
	if (times.length >= 1){
		
		if (parseInt(times[0]) > 12) {
			let time =convert ((parseInt(times[0]) - 12 )) + ":" +  convert(times[1]) + " PM";
			return time;
		} else if ( parseInt(times[0]) === 12 ){
			let time = "12:00 PM";
			return time
		} else {
			let time = convert(parseInt(times[0]))+":" + convert(times[1])  + "  AM";
			return time
		}
	}
	function convert(number){
        if (parseInt(number) > 9) {
            return number
        } else {
            return "0" + parseInt(number)
        }
    }
}

export const get_options = (timers) => {
	var closetime = parseInt((timers.closetime).split(":")[0]);
	var opentime = parseInt(timers.opentime.split(":")[0]);
	var lasttime = timers.opentime.split(":")[1];
	var options = [];
	for (var i = opentime ; i <= closetime ; i++) {
		let item = get_date(i + ":" + lasttime);
		options.push(item);
	} 
	return options;
}


export const  get_timestring =(time) =>{
	var hours = time.getHours();
	var minute = time.getMinutes();
	return hours + ":" + minute;
}

export const  get_GGR_value =  (item) =>{
	var totalbet =  item.BET ? item.BET : 0;
	var totalwin =  item.WIN ? item.WIN : 0;
	var totalcancel_bet =  item.CANCEL_BET ? item.CANCEL_BET : 0;
	var totalGGr = (totalbet - totalwin - totalcancel_bet).toFixed(0);
	return totalGGr;
}

export const get_total_ggr_value = (data) =>{
	var totalNum = 0;
	for(var i = 0 ; i < data.length ; i++){
		totalNum += parseFloat(get_GGR_value(data[i]));
	}
	return totalNum.toFixed(0);
}

export const get_total_value = (bool,data) =>{
	var totalNum = 0;
	for(var i = 0 ; i < data.length; i ++){
		totalNum += data[i][bool] ? data[i][bool] : 0;
	}
	return totalNum.toFixed(0);
}

export const Set_reducer = (dispatch,params,rdata,type) =>{
	// var rows = set_page(params,rdata);
	// var fdata =rows['fdata'];
	// var totalPages = rows['totalPages'];
	// dispatch({
	//   type: type,
	//   data: fdata,
	//   totalPages:totalPages,
	//   params : rows['params'],
	//   allData : rdata.data
	// })

	var rows =  set_page(params,rdata);
	var fdata = rows['fdata'];
	var totalPages = rows['totalPages'];
	dispatch({ type: type,data: fdata,totalPages:totalPages,params : rows['params'],alldata : rdata.data});
}  

export const select_string = (bool)=>{
	var  booloptions = key_providers
	var string =  booloptions.find(obj => obj.value === bool);
	return string.label;
}
export const select_color = (bool)=>{
	switch(bool){
        case "1" :{
          return "light-success"
        }
        case "2" :{
          return "light-danger"
        }
        case "3" :{
          return "light-warning"
        }
        case "4" :{
          return "light-primary"
        }
        case "5" :{
          return ""
		}
		default :{
			return;
		}
      }
}

export const Filter = (value,data) =>{
	var filteredData = []
	if(value === "All"){
		filteredData = data;
			return filteredData
	}else{
		filteredData = data
			.filter(item => {
			  let startsWithCondition =!item.TYPE ? null : item.TYPE.toLowerCase().startsWith(value.toLowerCase())
			  let includesCondition =!item.TYPE ? null :item.TYPE.toLowerCase().startsWith(value.toLowerCase())
			if (startsWithCondition) {
				return startsWithCondition
			  } else if (!startsWithCondition && includesCondition) {
				return includesCondition
			  } else return null
			});
			return filteredData
	}
}

export const order_change =(items)=>{
    var newdata = [];
    for(var i = 0 ; i < items.length ; i++){
		var row = items[i];
		row.order = i;
		newdata.push(row);
	}
	return newdata;
}

export const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result
}

export const setSession =async (string)=>{
	await localStorage.setItem(Root.token,string);
	return true;
}

export const deleteSession = ()=>{
	localStorage.removeItem(Root.token);
	return true;
}

export const validateUsername = (fld) =>{
        
	var error = "";

	if (fld === "") {
		error = "You didn't enter a username.\n";
		toast.error(error);
		return false;

	}else {

	}
	return true;
}



export const getSession =()=>{
	var session =  sessioninfor();
	if(session){
		return session;
	}else{
		return false;
	}
}

export const url_path = ()=>{
	return history.location.pathname;
}

export const sessioninfor = ()=>{
	let auth = localStorage.getItem(Root.token);
	return auth
}


export const fake_session = () =>{
	localStorage.removeItem(Root.token);
}
export const alert = (string,type) =>{
	if(string && string.length > 0){

		switch(type){
			case "success" :
				toast.success(string);
			break;
			case "warn" :
				toast.warn(string);
			break;
			case "error" :
				toast.error(string);
			break;
			default : 
				toast.error(string);
			break;
		}
		return;
	}
}

export const set_page = (params,rdata)=>{
	let { page, perPage } = params;
	let fdata = [];
	let newparams = {};
	if (page !== undefined && perPage !== undefined) {
		var totalPages = Math.ceil(rdata.data.length / perPage);
		let calculatedPage = (page - 1) * perPage;
	  	if(calculatedPage > rdata.data.length){
			newparams['page'] = 1;
			newparams['perPage'] = parseInt(perPage);
		}else{
			newparams['perPage'] = parseInt(perPage);
            newparams['page'] = parseInt(page);
		}
	}else {
		totalPages = Math.ceil(rdata.data.length / 10);
        newparams['page'] = 1;
        newparams['perPage'] = 10;
	}
    let index1 = newparams.page === 0 ? 0 : newparams.page - 1; 
    let index2 = newparams.page === 0 ? 1 : newparams.page;
    let skip = index1 * (newparams.perPage);
    let limit = index2 * (newparams.perPage);
	fdata = rdata.data.slice(skip, limit);
	let skip2 = (skip) + fdata.length;
	newparams['skip'] = skip;
	newparams['skip2'] = skip2;
	return {fdata : fdata,totalPages : totalPages,params : newparams,skip  : skip ,limit : limit,skip2 : skip2}
}

export const instance = axios.create({
    baseURL: Root.adminurl,
    timeout: 50000,
    headers: {
		authorization: `${encodeURIComponent(sessioninfor())}`,
		"Content-Type": "application/json",
		"device": window.innerWidth,
		"user-device" : "web",
    },
});

export const AXIOS_REQUEST =async (url,inputdata,dispatch,loading) =>{
	try{
		if(loading){
			dispatch({type : "HOMEPAGELOADIN",data : true})
		}

		var	Response =  await instance.post( url , inputdata );
		if(loading){
			setTimeout(()=>{
				dispatch({type : "HOMEPAGELOADIN",data : false})

			},100)
		}
		if(Response.data){
			if(Response.data.session){
				fake_session();
				window.location.assign(LoginUrl);
			}else{
				return Response.data
			}
		}else{
			return {status : false,data : "error"}
		}
	}catch(e){
		if(loading){
			dispatch({type : "HOMEPAGELOADIN",data : false})
		}
		return {status : false,data : "error"}
	}
}

export const authinstance = axios.create({
    baseURL: Root.adminurl,
    timeout: 50000,
    headers: {
		authorization: `${sessioninfor()}`,
		"Content-Type": "application/json",
		"device": window.innerWidth,
		"user-device" : "web",
    },
});

export const instance_file = axios.create({
    baseURL: Root.adminurl,
    timeout: 150000000,
    headers: {
		authorization: `${sessioninfor()}`,
		"Content-Type": "application/json",
		"device": window.innerWidth,
		"user-device" : "web",
    },
});

export const AXIOS_REQUEST_FILE =async (url,inputdata,dispatch,loading) =>{
	try{
		if(loading){
			dispatch({type : "HOMEPAGELOADIN",data : true})
		}
		var Response =  await instance_file.post(url,inputdata);
		if(loading){
			dispatch({type : "HOMEPAGELOADIN",data : false})
		}
		if(Response.data){
			return Response.data;
		}else{
			return {status : false,data : "error"}
		}
	}catch(e){
		if(loading){
			dispatch({type : "HOMEPAGELOADIN",data : false})
		}
		return {status : false,data : "server error"}
	}
}

