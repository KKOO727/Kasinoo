import {REPORTSCASINO_GAMEPLAYER_LOAD,REPORTSCASINO_GAMEPLAYER_GETDATA} from "../../../types"

const initialState = {
  data: [],
  params: null,
  allData: [],
  totalPages: 0,
  filteredData: [],
  totalRecords: 0,
  sortIndex: [0,0]
}
  
export  const reportscasinoplaygameid = (state = initialState, action) => {
    switch (action.type) {
      case REPORTSCASINO_GAMEPLAYER_GETDATA:
        return {
          ...state,
          toptbl: action.data,
        }

      case REPORTSCASINO_GAMEPLAYER_LOAD:

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
  
  