import {REPORTSCASINO_GAMEID_LOAD,REPORTSCASINO_GAMEID_GETDATA} from "../../../types"

const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
  }
  
export  const reportscasinogameid = (state = initialState, action) => {
    switch (action.type) {
      case REPORTSCASINO_GAMEID_GETDATA:
        return {
          ...state,
          toptbl: action.data,
        }

      case REPORTSCASINO_GAMEID_LOAD:

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
  
  