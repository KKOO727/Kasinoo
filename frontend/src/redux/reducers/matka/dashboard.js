const initialState = {

}
  
  export const dashboard = (state = initialState, action) => {
      switch (action.type) {
        case "SATTA_DAHSBOARD_RESULT":
          return { ...state,  ...action.data}
          default:
          return state
      }
    }
  
  