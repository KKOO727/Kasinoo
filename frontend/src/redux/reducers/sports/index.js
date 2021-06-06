
const initialState = {
    sports_list : {data : []},
    sports_data : {data : [] , allData : [] , totalPages : 1},
}

  

  const player = (state = initialState, action) => {
    switch (action.type) {
        case "SPORTS_LIST" :
            return { ...state,sports_list : action.data }        
        case "SPORTS_MATCHS" :
            return { ...state,sports_data : {data : action.data , allData : action.allData , totalPages : action.totalPages}}
        default:
            return state
    }
  }
  
export default player
  
