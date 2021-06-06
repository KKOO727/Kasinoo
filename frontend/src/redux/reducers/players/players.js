import {set_page} from "../../actions/auth/index"

const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
    bonusoptions : []
  }
  
  export const playerslist = (state = initialState, action) => {
    switch (action.type) {
      case "PLAYERSGETBONUSOPTIONS" :
        return {
          ...state ,
          bonusoptions : action.data
        }
      case "PLAYERS_GET_DATA":
        return {
          ...state,
          data: action.data,
          allData : action.alldata,
          totalPages: action.totalPages,
          totalRecords: action.alldata.length,
          params: action.params,
          sortIndex:  [action.params["skip"] + 1,action.params["skip2"]]
        }
      case "PLAYERS_SET_PAGENATION":
        return {
          ...state,
          data: action.data,
          totalPages: action.totalPages,
          totalRecords: state.allData.length,
          params: action.params,
          sortIndex:  [action.params["skip"] + 1,action.params["skip2"]]
        }
      case "PLAYERS_FILTER_DATA":
        let value = (action.value);
        let bool = (action.bool).toString();
        let data = [];
        if (value.length || Object.keys(value).length > 0) {
          data = state.allData.filter(item => {
            let startsWithCondition = false;
            let includesCondition = false;
            if(bool === "date"){
              var date = new Date(item.date);
              var date1 = new Date(value.start);
              var date2 = new Date(value.end);
              if(date >= date1 && date <= date2){
                startsWithCondition = true;
                includesCondition = true;
              }else{
                startsWithCondition = false;
                includesCondition = false;
              }
            }else{
              value = value.toString();
              var uitem = (item[bool]).toString();
              startsWithCondition = uitem.toLowerCase().startsWith(value.toLowerCase());
              includesCondition = uitem.toLowerCase().includes(value.toLowerCase());
            }
            if (startsWithCondition) {
              return startsWithCondition
            } else if (!startsWithCondition && includesCondition) {
              return includesCondition
            } else return null
          }).slice(state.params.page - 1, state.params.perPage)
          let row = Object.assign({},{status : true , data : data});
          let rows = set_page(action.params, row)
          return {...state, data: rows["fdata"], totalPages:rows["totalPages"], params : rows["params"], totalRecords: data.length, sortIndex: [rows["params"]["skip"] + 1,rows["params"]["skip2"]] }
        } else {
          data = state.allData
          let row = Object.assign({},{status : true , data : data});
          let rows = set_page(action.params, row)
          return {...state, data: rows["fdata"], totalPages:rows["totalPages"], params : rows["params"], totalRecords: data.length, sortIndex: [rows["params"]["skip"] + 1,rows["params"]["skip2"]] }
        }   
      default:
        return state
    }
  }
  
  