var initdata = { userRole: "admin",
  loading : false ,
  values : null,
  userdetail : {},
}

export const login = (state =initdata, action) => {
  switch (action.type) {
 
    case "LOGIN_WITH_JWT": {
      return { ...state, values: action.data }
    }
    case "SIDEVAR_DATA": {
      return { ...state, sidebar: action.data,sidebararray : action.array }
    }
    case "LOGOUT_WITH_JWT": {
      return { ...state, values: action.payload }
    }
  
    case "CHANGE_ROLE": {
      return { ...state, userRole: action.userRole }
    }
    case "USERSLIST" : {
      return { ...state, userslist : action.payload }
    }
    case "DELETEDUSERSLIST" : {
      return { ...state, userslist_deleted : action.payload}
    } 
    case "KYCDOCLIST" :{
      return { ...state, kycdoclist : action.payload}
    }

    case "USERSROLE" :{
      return { ...state, userRoles : action.data}
    }
    
    case "HOMEPAGELOADIN":{
      return {...state, loading : action.data}
    }

    case "PROFILE_USER" : {
      return {...state,userdetail : action.data,values : action.data}
    }

    default: {
      return state
    }
  }
}
