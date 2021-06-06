import {PROMOTIONS_BONUS_GET_DATA, PROMOTIONS_BONUS_GETCONFIG,PROMOTIONS_BONUS_SETCONFIG} from "../../../types"
const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
    options : [],
    setconfig : null
  }
  

 export const BonusMenu = (state = initialState, action) => {
    switch (action.type) {

        case PROMOTIONS_BONUS_GET_DATA :
          return {
              ...state,
              data: action.data,
              totalPages: action.totalPages,
              params: action.params["params"],
              sortIndex : [action.params["skip"] + 1,action.params["skip2"]],
              totalRecords: action.totalRecords,
              options : action.options
          }

        case PROMOTIONS_BONUS_GETCONFIG :
          return {
            ...state,
            setconfig : action.data,
            options : action.options
          }
        case PROMOTIONS_BONUS_SETCONFIG :
          return {
            ...state,
            setconfig : action.data,
          }
          
      default:
        return state
    }
  }