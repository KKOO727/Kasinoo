
const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
    useroptions : []
  }
  
  export const bankdetail = (state = initialState, action) => {
    switch (action.type) {
        case "GETDATABANKDETAIl" :
            return {
                ...state,
                data: action.data,
                totalPages: action.totalPages,
                params: action.params["params"],
                sortIndex : [action.params["skip"] + 1,action.params["skip2"]],
                totalRecords: action.totalRecords,
            }
        case "LOADBANKDETAIL" :
            return {
                ...state,
                useroptions : action.data
            }
        default:
        return state
    }
  }
  
  