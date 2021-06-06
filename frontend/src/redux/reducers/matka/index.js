import { combineReducers } from "redux"
import {bazaars} from "./bazaars"
import {gameslist} from "./games"
import {bazartypes} from "./bazartype"
import {regular} from "./regular"
import Result from "./result"
import {announcer} from "./anouncer"
import {dashboard} from "./dashboard"
import {betplayers} from "./betplayers"
import {restrictiondays} from "./restrictiondays"

const Players = combineReducers({
    gameslist,
    bazaars,
    regular,
    Result,
    announcer,
    dashboard,
    betplayers,
    restrictiondays,
    bazartypes,
});

export default Players