import {MATKA_BAZAARS_GET_DATA,MATKA_GAMES_GMAELIST_DATA} from "../../types"

const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
    gamelist : []
  }
  
  export const bazaars = (state = initialState, action) => {
    switch (action.type) {
      case MATKA_GAMES_GMAELIST_DATA :
        return {
          ...state,gamelist : action.data
        }
      case MATKA_BAZAARS_GET_DATA:
        return {
          ...state,
          data: action.data,
          totalPages: action.totalPages,
          params: action.params["params"],
          sortIndex : [action.params["skip"] + 1,action.params["skip2"]],
          totalRecords: action.totalRecords,
      }
      
        
   
      default:
        return state
    }
  }
  
  