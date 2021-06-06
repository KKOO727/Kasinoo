import {REPORTSCASINO_PLAYERID_LOAD,REPORTSCASINO_PLAYERID_GETDATA} from "../../../types"


const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
  }
  
  
export  const reportscasinoplayerid = (state = initialState, action) => {
    switch (action.type) {
      case REPORTSCASINO_PLAYERID_GETDATA:
        return {
          ...state,
          toptbl: action.data,
        }

      case REPORTSCASINO_PLAYERID_LOAD:

        return {
          ...state,
          data: action.data,
          totalPages: action.totalPages,
          params: action.params,
          totalRecords: action.totalRecords,
          sortIndex : [action.params["skip"] + 1,action.params["skip2"]],
        }
   
      default:
        return state
    }
  }
  
  