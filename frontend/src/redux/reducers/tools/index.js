import { combineReducers } from "redux"
import { toolsgeoipblock} from "./geoipblock"

const Tools = combineReducers({
    toolsgeoipblock : toolsgeoipblock
})

export default Tools
