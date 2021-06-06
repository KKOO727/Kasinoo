
const init = {
    activeNavbar: "warning",
    navbarType: "sticky",
    footerType: "static",
    menuTheme: "warning",
    theme : "real-dark",
}

const playercustomizer = (state = init, action) => {
  switch (action.type) {
   
    case "PLAYERTHEMSET" :
      return { ...state,
            theme: action.theme.theme,
            footerType : action.theme.footerType,
            menuTheme : action.theme.menuTheme,
            navbarColor : action.theme.navbarColor,
            navbarType : action.theme.navbarType,
          }
    default:
      return state
  }
}

export default playercustomizer
