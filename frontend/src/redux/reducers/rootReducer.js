import { combineReducers } from "redux"
import chatReducer from "./chat/"
import customizer from "./customizer/"
import auth from "./auth/"
import userslist from "./user/"
import cms from "./CMS/"
import paymentGateWay from "./paymentGateWay"
import gameproviders from "./gameprovider"
import Players from "./players"
import Reports from "./reports"
import dashboard from "./dashboard"
import finance from "./finance"
import profileinfo from "./profileinfo"
import promotions from "./promotions"
import sports from "./sports"
import roles from "./roles"
import permission from "./permission"
import setting from "./setting"
import tools from "./tools"
import balance from "./balance"
import matka from "./matka"
import time from "./time"

const rootReducer = combineReducers({
  chatApp: chatReducer,
  profileinfo: profileinfo,
  customizer: customizer,
  auth: auth,
  cms : cms,
  userslist : userslist,
  paymentGateWay : paymentGateWay,
  gameproviders : gameproviders,
  Players : Players,
  Reports : Reports,
  dashboard : dashboard,
  finance :finance ,
  promotions : promotions,
  sports : sports,
  roles : roles,
  permission : permission,
  setting : setting,
  balance : balance,
  tools : tools,
  matka : matka,
  time : time

})

export default rootReducer