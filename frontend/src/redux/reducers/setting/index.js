import { combineReducers } from "redux"
import {pro_credential} from "./pro_credential"
import {configuration} from "./configuration"
import {global} from "./global"
import {notification} from "./notification"
import {typemanager} from "./typemanager"
import {language} from "./language"
const setting = combineReducers({
  pro_credential,
  configuration,
  global,
  notification,
  typemanager,
  language,
})

export default setting