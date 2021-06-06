
const initialState = {
  }
  
 export const configuration = (state = initialState, action) => {
    switch (action.type) {
      case  "SETTING_CONFIGURATION" :
        return{
          ...state,data : action.data
        }
      default:
        return state
    }
  }  
  
