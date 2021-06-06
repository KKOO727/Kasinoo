import { toast } from "react-toastify"
import {AXIOS_REQUEST} from "../auth"

export const changeMode = mode => {
  return dispatch => dispatch({ type: "CHANGE_MODE", mode })
}

export const collapseSidebar = value => {
  return dispatch => dispatch({ type: "COLLAPSE_SIDEBAR", value })
}

export const changeNavbarColor = color => {
  return dispatch => dispatch({ type: "CHANGE_NAVBAR_COLOR", color })
}

export const changeNavbarType = style => {
  return dispatch => dispatch({ type: "CHANGE_NAVBAR_TYPE", style })
}

export const changeFooterType = style => {
  return dispatch => dispatch({ type: "CHANGE_FOOTER_TYPE", style })
}

export const changeMenuColor = style => {
  return dispatch => dispatch({ type: "CHANGE_MENU_COLOR", style })
}

export const hideScrollToTop = value => {
  return dispatch => dispatch({ type: "HIDE_SCROLL_TO_TOP", value })
}

export const playerSave = (data) => {
  return async dispatch => {
    var rdata =  await AXIOS_REQUEST("users/playerThemeSave",{data},dispatch, true)
    if (rdata.status) {
      toast.success("success") 
      dispatch({ type: "PLAYERTHEMSET", theme : rdata.data })
    }
  }
}


export const playerGet = () => {
  return async dispatch => {
    var rdata =  await AXIOS_REQUEST("users/playerThemeGet")
    if (rdata.status) { 
      dispatch({ type: "PLAYERTHEMSET", theme : rdata.data })
    }
  }
}