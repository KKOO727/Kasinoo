import { combineReducers } from "redux"
import {reportscasinogameid } from "./casino/gameid"
import {reportscasinoplayerid } from "./casino/playerid"
import {reportscasinoproviders } from "./casino/byproviders"
import {reportscasinoplaygameid } from "./casino/bybet"
import {sportsbets } from "./sports/bybets"
import {sprotsgames } from "./sports/games"
import {sportsplayers } from "./sports/players"

import {SattaBazars } from "./satta/bybazar"
import {SattaPlayers } from "./satta/byplayer"
import {SattaMarkets } from "./satta/bymarket"

const Reports = combineReducers({
    reportscasinogameid,
    reportscasinoplayerid,
    reportscasinoproviders,
    reportscasinoplaygameid,
    sportsbets,
    sprotsgames,
    sportsplayers,
    SattaBazars,
    SattaPlayers,
    SattaMarkets,

})

export default Reports