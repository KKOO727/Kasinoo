import { combineReducers } from "redux"
import { users } from "./users"
import { realtimeusers } from "./realtimeusers"
import { sessionusers } from "./sessionusers"
import {permission} from "./permission"
const userslist = combineReducers({
  users,
  sessionusers,
  realtimeusers,
  permission
})

export default userslist