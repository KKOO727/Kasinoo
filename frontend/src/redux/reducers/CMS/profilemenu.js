const initialState = {
    data : [],
    list : []
}

export const profilemenu = (state = initialState, action) => {
    switch (action.type) {
      case "CMS_PROFILE_MENU" :
        return { ...state,data : action.data,list : action.list }
      default:
        return state
    }
  }
