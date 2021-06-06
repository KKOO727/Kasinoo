import {gameproviderget,gameproviderbool} from "../../types"
const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
    allgamedata : []
  }
  
export  const providers = (state = initialState, action) => {
    switch (action.type) {
      case gameproviderget:
        return {
          ...state,
          data: action.data,
          totalPages: action.totalPages,
          params: action.params["params"],
          sortIndex : [action.params["skip"] + 1,action.params["skip2"]],
          totalRecords: action.totalRecords,
      }
      
      case gameproviderbool :
        return {
          ...state,bool : action.data
        }

      
        case "GET_ALLGMAESLISTDATA" : 
        return {...state,allgamedata : action.data}
      default:
        return state
    }
  }