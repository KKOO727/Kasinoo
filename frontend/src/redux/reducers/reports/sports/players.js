import {ReposrtSportsPlayersLoad,ReposrtSportsPlayersGetData} from "../../../types"

const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
  }
  
export  const sportsplayers = (state = initialState, action) => {
    switch (action.type) {
      case ReposrtSportsPlayersGetData:
        return {
          ...state,
          toptbl: action.data,
        }

      case ReposrtSportsPlayersLoad:

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
  
  