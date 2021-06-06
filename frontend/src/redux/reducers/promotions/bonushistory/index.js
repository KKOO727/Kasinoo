
const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
    useroptions : [],
    bonusoptions : []
  }
  
  export const Bonushistory = (state = initialState, action) => {
    switch (action.type) {
        case "GETDATABONUSHISTORY" :
            return {
                ...state,
                data: action.data,
                totalPages: action.totalPages,
                params: action.params["params"],
                sortIndex : [action.params["skip"] + 1,action.params["skip2"]],
                totalRecords: action.totalRecords,
            }
        case "TOTLABONUSHISTORY" :
            return {
                ...state,
                useroptions : action.useroptions,
                bonusoptions : action.bonusoptions,
            }
        default:
        return state
    }
  }
  
  