const mongoose = require("mongoose");
const baseController = require("./basecontroller");
const { sportsTypeList, sportsBet, sportsTemp } = require("../models/sports_model");
const { GamePlay } = require("../models/users_model");
const redis = require('redis');
const rdsconfig = require("../servers/db.json")
const fs = require("fs");
const config = require('../db');

exports.deleteAllMatchs = (req, res) => {
    redisClient.flushdb((err, result) => {
        sportsTemp.deleteMany({}).then(() => {
            return res.send(true)
        })
    })
}

const sportsConfig = {
    SPORTID: "sportid",
    FINISHED: "Finished",
    SUSPENDED: "Suspended",
    LIVE: "Live",
    NOTSTARTED: "NotStarted",
    ALL: "All",
    SPORTS: "sports",
    TIMESTAMP: "timestamp",
    SOCKETIO: "socketio",
    MULTI: "MULTI",
    ODDSCHANGE: "OddsChange",
    BETSTOP: "BetStop",
    FIXTURECHANGE: "FixtureChange",
    BETSETTLEMENT: "BetSettlement",
    RecoveryEvent: "RecoveryEvent",
}

async function player_balanceupdatein(amount, uid, wallets) {
    let outdata = await baseController.player_balanceupdatein_Id(amount, uid, wallets);
    return outdata;
}

exports.getSportsType = async(req, res) => {
    let query = [];
    redisClient.keys('*', async(err, keys) => {
        redisClient.mget(keys, async function (err, values) {
            if (values) {
                for (let i = 0; i < values.length; i++) {
                    oneMatch = JSON.parse(values[i]);
                    let index = query.findIndex(item => item.sport_id == oneMatch.sportid);
                    if (index < 0) {
                        query.push({
                            sport_id: oneMatch.sportid
                        });
                    }
                }
                let list_data = [];
                if (query.length) {
                    list_data = await baseController.BSortfind(sportsTypeList, {
                        status: true,
                        $or: query
                    }, {
                        order: 1
                    });
                }
                if (!list_data) {
                    return res.json({
                        status: true,
                        data: []
                    });
                } else {
                    return res.json({
                        status: true,
                        data: list_data
                    });
                }
            } else {
                return res.json({
                    status: true,
                    data: []
                });
            }
        });
    });
}

exports.getSportsMatchs = async(req, res) => {
    let data = req.body;
    redisClient.keys(`*_${data.sport_id}`, async(err, keys) => {
        redisClient.mget(keys, async function (err, eventData) {
            if (eventData) {
                let returnData = [];
                for (var i = 0; i < eventData.length; i++) {
                    let oneData = JSON.parse(eventData[i]);
                    oneData.market_len = oneData.market.length;
                    if (data.EventStatus == sportsConfig.LIVE) {
                        if (oneData.EventStatus == sportsConfig.LIVE || oneData.EventStatus == sportsConfig.SUSPENDED) {
                            if (data.status == "All") {
                                returnData.push(oneData);
                            } else if (oneData.permission === data.status) {
                                returnData.push(oneData);
                            }
                        }
                    } else if (data.EventStatus == sportsConfig.NOTSTARTED) {
                        if (neData.EventStatus == sportsConfig.NOTSTARTED) {
                            if (data.status == "All") {
                                returnData.push(oneData);
                            } else if (oneData.permission === data.status) {
                                returnData.push(oneData);
                            }
                        }
                    } else {
                        if (oneData.EventStatus == sportsConfig.LIVE || oneData.EventStatus == sportsConfig.SUSPENDED || oneData.EventStatus == sportsConfig.NOTSTARTED) {
                            if (data.status == "All") {
                                returnData.push(oneData);
                            } else if (oneData.permission === data.status) {
                                returnData.push(oneData);
                            }
                        }
                    }
                }
                return res.json({
                    status: true,
                    data: returnData
                });
            } else {
                return res.json({
                    status: false,
                    data: []
                });
            }
        });
    });
}

exports.changeMatchPermission = async(req, res) => {
    let data = req.body;
    redisClient.keys(`${data.row.event_id}_*`, (err, keys) => {
        redisClient.get(keys[0], (err, fetchData) => {
            if (fetchData) {
                fetchData = JSON.parse(fetchData);
                fetchData.permission = data.key;
                redisClient.set(keys[0], JSON.stringify(fetchData), (err) => {})
                return res.json({
                    status: true
                });
            } else {
                return res.json({
                    status: false
                });
            }
        })
    })
}

exports.getAllSportsType = async(req, res) => {

    let rdata = await baseController.BSortfind(sportsTypeList, {}, {order: 1})
    if (rdata) {
        return res.json({ 
            status: true,
            data: rdata
        });
    } else {
        return res.json({
            status: false
        });
    }
}

exports.sportsfeatureAdd = async(req, res, next) => {
    var row = req.body.row;
    if (row) {
        redisClient.keys(`${row.event_id}_*`, async(err, keys) => {
            redisClient.get(keys[0], async function (err, values) {
                if (values) {
                    let event = JSON.parse(values);
                    event.isfeatured = true;
                    redisClient.set(keys[0], JSON.stringify(event))
                    return res.json({
                        status: true
                    });
                } else {
                    return res.json({
                        status: false
                    });
                }
            });
        });
    } else {
        res.json({
            status: false,
            data: "server error"
        });
        return next();
    }
}

exports.sportsfeatureDelete = async(req, res, next) => {
    var row = req.body.row;
    if (row) {
        redisClient.keys(`${row.event_id}_*`, async(err, keys) => {
            redisClient.get(keys[0], async function (err, values) {
                if (values) {
                    let event = JSON.parse(values);
                    event.isfeatured = false;
                    redisClient.set(keys[0], JSON.stringify(event))
                    featureLoad(req, res, next)
                } else {
                    return res.json({
                        status: false
                    });
                }
            });
        });
    } else {
        res.json({
            status: false,
            data: "server error"
        });
        return next();
    }
}

function featureLoad(req, res, next) {
    redisClient.keys("*", async(err, keys) => {
        redisClient.mget(keys, async function (err, values) {
            if (values) {
                let items = [];
                for (let i in values) {
                    let item = JSON.parse(values[i]);
                    if (item.isfeatured) {
                        items.push(item);
                    }
                }
                return res.json({
                    status: true,
                    data: items
                });
            } else {
                return res.json({
                    status: false
                });
            }
        });
    });
}

exports.sportsfeatureLoad = async(req, res, next) => {
    featureLoad(req, res, next)
}

exports.uploadsportsImage = async (req,res ,next) => {
    let {imagesrc,_id} = req.body;

    if (imagesrc) {
        let item = await sportsTypeList.findOne({_id : _id});
        if (item) {
            if (item.image && item.image.length) {
                var del_path = config.BASEURL + item.image;
                fs.unlink(del_path, async (err)=>{    
                });
            } 
            let up = await sportsTypeList.findOneAndUpdate({_id : _id},{image : imagesrc});
            if (up) {
                this.getAllSportsType(req,res,next)
            } else {
                return res.json({
                    status: false,
                    data: "fail"
                });
            }                
        } else {
            return res.json({
                status: false,
                data: "fail"
            });
        }
    } else {
        return res.json({
            status: false,
            data: "fail"
        });
    }
}

exports.sportsTypeUpdate = async(req, res) => {
    let indata = req.body.data;
    for (let i = 0; i < indata.length; i++) {
        delete indata[i]._id
        let updatehandle = await baseController.BfindOneAndUpdate(sportsTypeList, {
            sport_id: indata[i].sport_id
        }, indata[i]);
        if (!updatehandle) {
            return res.json({
                status: false,
                data: "fail"
            });
        }
    }
    let findhandle = await baseController.BSortfind(sportsTypeList, {}, {
        order: 1
    });
    if (!findhandle) {
        return res.json({
            status: false,
            data: "fail"
        })
    } else {
        return res.json({
            status: true,
            data: findhandle
        })
    }
}

exports.getSportsListPlayer = async(req, res) => {
    let query = [];
    let EventStatus = req.body.data;
    redisClient.keys('*', async(err, keys) => {
        redisClient.mget(keys, async function (err, values) {
            if (values) {
                for (let i = 0; i < values.length; i++) {
                    oneMatch = JSON.parse(values[i]);
                    if ((EventStatus == sportsConfig.SPORTS || oneMatch.EventStatus == EventStatus) && oneMatch.permission) {
                        let index = query.findIndex(item => item.sport_id == oneMatch.sportid);
                        if (index < 0) {
                            query.push({
                                sport_id: oneMatch.sportid
                            });
                        }
                    }
                }
                let list_data = [];
                if (query.length) {
                    list_data = await baseController.BSortfind(sportsTypeList, {
                        status: true,
                        $or: query
                    }, {
                        order: 1
                    });
                }
                if (!list_data) {
                    return res.json({
                        status: true,
                        data: []
                    });
                } else {
                    return res.json({
                        status: true,
                        data: list_data
                    });
                }
            } else {
                return res.json({
                    status: true,
                    data: []
                });
            }
        });
    });
}

exports.getSportsMatchPlayer = async(req, res) => {
    let data = req.body;
    redisClient.keys(`*_${data.sportid}`, async(err, keys) => {
        redisClient.mget(keys, async function (err, oddsData) {
            let returnData = [];
            for (let i = 0; i < oddsData.length; i++) {
                let oneMatch = JSON.parse(oddsData[i]);
                if (oneMatch.EventStatus == data.EventStatus && oneMatch.market.length && oneMatch.permission) {
                    let market = [];
                    let T1X2 = oneMatch.market.findIndex(item => item.MarketName.toLowerCase() == "1x2");
                    let THANDICAP = oneMatch.market.findIndex(item => item.MarketName.toLowerCase() == "handicap");
                    let TTOTAL = oneMatch.market.findIndex(item => item.MarketName.toLowerCase() == "total");
                    if (T1X2 > -1) {
                        market.push(oneMatch.market[T1X2]);
                    }
                    if (THANDICAP > -1) {
                        market.push(oneMatch.market[THANDICAP]);
                    }
                    if (TTOTAL > -1) {
                        market.push(oneMatch.market[TTOTAL]);
                    }
                    oneMatch.marketLen = oneMatch.market.length;
                    oneMatch.market = market;
                    let index = returnData.findIndex(item => item.event_id === oneMatch.event_id);
                    if (index > -1) {
                        redisClient.keys(`${returnData[index].event_id}_*`, async(err, keys) => {
                            redisClient.hdel(keys[0], async function (err, values) {})
                        })
                        returnData[index] = oneMatch;
                    } else {
                        returnData.push(oneMatch);
                    }
                }
            }
            return res.json({
                status: true,
                data: returnData
            });
        })
    })
}

exports.getOneMatchPlayer = async(req, res, next) => {
    redisClient.keys(`${req.body.event_id}_*`, (err, keys) => {
        redisClient.get(keys[0], (err, fetchData) => {
            return res.json({
                status: true,
                data: JSON.parse(fetchData)
            });
        })
    })
}

exports.placeBetPlayer = async(req, res) => {
    let data = req.body;
    let userData = await baseController.BfindOne(GamePlay, {
        id: req.user._id
    });
    if (userData) {
        let transactionId = await baseController.get_timestamp();
        for (let i = 0; i < data.bet.length; i++) {
            let tempTransactionId = await baseController.get_timestamp();
            let saveData = data.bet[i];
            saveData.USERID = mongoose.Types.ObjectId(req.user._id)
            saveData.gameid = mongoose.Types.ObjectId(saveData.gameid)
            saveData.TYPE = "BET";
            saveData.betting.betType = data.betType;
            saveData.betting.betId = data.betId;
            saveData.betting.prevbalance = userData.balance;
            saveData.betting.transactionId = data.betType == sportsConfig.MULTI ? transactionId : tempTransactionId;
            saveData.betting.handleState = false;
            saveData.betting.isVFHALFWIN = false;
            saveData.betting.isDHFTHIRDWIN = false;
            saveData.betting.isDHFHALFWIN = false;
            saveData.betting.isVFHALFLOST = false;
            saveData.betting.isVFALLLOST = false;

            let sportsWallet = {
                commission: 0,
                sportid: mongoose.Types.ObjectId(saveData.gameid),
                sportsData: {
                    MatchName: saveData.betting.MatchName,
                    MarketName: saveData.betting.MarketName,
                    OutcomeName: saveData.betting.OutcomeName,
                },
                status: "BET",
                userid: mongoose.Types.ObjectId(req.user._id),
                roundid: saveData.betting.transactionId,
                transactionid: saveData.betting.transactionId,
                lastbalance: userData.balance,
                credited: 0,
                debited: saveData.AMOUNT
            }
            await player_balanceupdatein(parseFloat(saveData.AMOUNT) * -1, req.user._id, sportsWallet);
            await baseController.data_save(saveData, sportsBet);
        }
        return res.json({
            status: true
        });
    } else {
        return res.json({
            status: false
        });
    }
}

exports.getSportsBetHistory = async(req, res) => {
    let data = req.body;
    let searchData = {
        USERID: mongoose.Types.ObjectId(req.user._id)
    }
    if (data.selectId == 1) {
        searchData["betting.handleState"] = false;
    } else if (data.selectId == 2) {
        searchData["betting.handleState"] = true;
    } else if (data.betId) {
        searchData["betting.betId"] = data.betId;
    }
    let result = await baseController.Bfind(sportsBet, searchData);
    if (result) {
        return res.json({
            status: true,
            data: result
        });
    } else {
        return res.json({
            status: false
        });
    }
}

exports.getActiveBetCount = async (req, res) => {
    sportsBet.countDocuments({
        USERID: mongoose.Types.ObjectId(req.user._id),
        "betting.handleState": false
    }).then(count => {
        return res.json({ status: true, count })
    }).catch(err => {
        return res.json({ status: false })
    })
}

exports.getLatestTimeStamp = async(req, res) => {
    let result = await baseController.BfindOne(sportsTemp, {
        key: sportsConfig.TIMESTAMP
    });
    if (result) {
        return res.send(result.timestamp);
    } else {
        return res.send("false");
    }
}

exports.OddsChange = async(req, res) => {
    const io = req.app.get(sportsConfig.SOCKETIO);
    let sendData = req.body;
    let eventid = sendData.event_id;
    sportsTemp.findOneAndUpdate({
        key: sportsConfig.TIMESTAMP
    }, {
        timestamp: sendData.timestamp,
        key: sportsConfig.TIMESTAMP
    }, {
        upsert: true
    });

    redisClient.keys(`${eventid}_*`, function (e, keys) {
        redisClient.get(`${keys[0]}`, (err, row) => {
            if (row) {
                row = JSON.parse(row);
                let market = row.market;
                for (let i in market) {
                    let index = sendData.market.findIndex(item => item.MarketName === market[i].MarketName && item.MarketId === market[i].MarketId && item.MarketSpecifiers === market[i].MarketSpecifiers);
                    if (index < 0) {
                        sendData.market.push(market[i]);
                    }
                }
                if (row.permission) {
                    if (sendData.EventStatus == sportsConfig.LIVE || sendData.EventStatus == sportsConfig.NOTSTARTED || sendData.EventStatus == sportsConfig.SUSPENDED) {
                        sendData.permission = row.permission;
                        sendData.isfeatured = row.isfeatured;
                        redisClient.set(`${eventid}_${sendData.sportid}`, JSON.stringify(sendData), (err) => {})
                    } else {
                        redisClient.hdel(`${eventid}_${sendData.sportid}`, async function (err, values) {})
                    }
                    io.sockets.emit(sportsConfig.ODDSCHANGE, {
                        data: sendData,
                        key: sportsConfig.ODDSCHANGE
                    });
                }
            } else {
                sendData.permission = true;
                redisClient.set(`${eventid}_${sendData.sportid}`, JSON.stringify(sendData), (err) => {
                })
                io.sockets.emit(sportsConfig.ODDSCHANGE, {
                    data: sendData,
                    key: sportsConfig.ODDSCHANGE
                });
            }
        });
    });
    return res.send(true);
}

exports.BetStop = async(req, res) => {
    sportsTemp.findOneAndUpdate({
        key: sportsConfig.TIMESTAMP
    }, {
        timestamp: req.body.timestamp,
        key: sportsConfig.TIMESTAMP
    }, {
        upsert: true
    });
    const io = req.app.get(sportsConfig.SOCKETIO);
    redisClient.keys(`${req.body.event_id}_*`, function (e, keys) {
        redisClient.get(`${keys[0]}`, (err, row) => {
            if (row) {
                let data = JSON.parse(row);
                data.EventStatus = sportsConfig.SUSPENDED;
                io.sockets.emit(sportsConfig.BETSTOP, {
                    data: Object.assign({}, data, req.body),
                    key: sportsConfig.BETSTOP
                });
                redisClient.set(`${req.body.event_id}_${data.sportid}`, JSON.stringify(data));
            }
        });
    })
    return res.send(true);
}

exports.BetSettlement = async(req, res) => {
    let data = req.body;
    await sportsTemp.findOneAndUpdate({
        key: sportsConfig.TIMESTAMP
    }, {
        timestamp: data.timestamp,
        key: sportsConfig.TIMESTAMP
    }, {
        upsert: true
    });
    for (let i = 0; i < data.market.length; i++) {
        let market = data.market[i];
        for (let j = 0; j < market.Outcomes.length; j++) {
            let outcome = market.Outcomes[j];
            let searchData = {
                "GAMEID": data.event_id,
                "betting.MarketId": market.MarketId,
                "betting.MarketName": market.MarketName,
                "betting.MarketSpecifiers": market.MarketSpecifiers ? market.MarketSpecifiers : "",
                "betting.OutcomeId": outcome.OutcomeId,
                "betting.OutcomeName": outcome.OutcomeName,
                "TYPE": "BET",
                "betting.handleState": false
            }
            let allBet = await baseController.Bfind(sportsBet, searchData);
            for (let k = 0; k < allBet.length; k++) {
                let bet_one_item = allBet[k];
                let userData = await baseController.BfindOne(GamePlay, {
                    id: bet_one_item.USERID
                });
                if (outcome.OutcomeResult.toLowerCase() == "won") {
                    if (bet_one_item.betting.betType.toLowerCase() === "single") {
                        let updateMoney = parseFloat(bet_one_item.betting.OutcomeOdds) * parseFloat(bet_one_item.AMOUNT);
                        if (outcome.OutcomeVoidFactor == 0.5) {
                            updateMoney = (parseFloat(updateMoney) * 0.5) + (parseFloat(bet_one_item.AMOUNT) * 0.5)
                            await sportsBet.updateOne(bet_one_item, {
                                "betting.handleState": true,
                                TYPE: "WIN",
                                "betting.isVFHALFWIN": true,
                                "betting.resultMoney": updateMoney
                            }).then(async(err) => {})
                        } else if (outcome.OutcomeDeadHeatFactor == 0.33) {
                            updateMoney = parseFloat(updateMoney) * 0.33;
                            await sportsBet.updateOne(bet_one_item, {
                                "betting.handleState": true,
                                TYPE: "WIN",
                                "betting.isDHFTHIRDWIN": true,
                                "betting.resultMoney": updateMoney
                            }).then(async(err) => {})
                        } else if (outcome.OutcomeDeadHeatFactor == 0.5) {
                            updateMoney = parseFloat(updateMoney) * 0.5;
                            await sportsBet.updateOne(bet_one_item, {
                                "betting.handleState": true,
                                TYPE: "WIN",
                                "betting.isDHFHALFWIN": true,
                                "betting.resultMoney": updateMoney
                            }).then(async(err) => {})
                        } else {
                            await sportsBet.updateOne(bet_one_item, {
                                "betting.handleState": true,
                                TYPE: "WIN",
                                "betting.resultMoney": updateMoney
                            }).then(async(err) => {})
                        }
                        let sportsWallet = {
                            commission: 0,
                            sportid: mongoose.Types.ObjectId(bet_one_item.gameid),
                            sportsData: {
                                MatchName: bet_one_item.betting.MatchName,
                                MarketName: bet_one_item.betting.MarketName,
                                OutcomeName: bet_one_item.betting.OutcomeName,
                            },
                            status: "WIN",
                            userid: mongoose.Types.ObjectId(bet_one_item.USERID),
                            roundid: bet_one_item.betting.transactionId,
                            transactionid: bet_one_item.betting.transactionId,
                            lastbalance: userData.balance,
                            credited: updateMoney,
                            debited: 0
                        }
                        player_balanceupdatein(parseFloat(updateMoney), bet_one_item.USERID, sportsWallet);
                    } else {
                        if (outcome.OutcomeVoidFactor == 0.5) {
                            await sportsBet.updateOne(bet_one_item, {
                                "betting.handleState": true,
                                TYPE: "WIN",
                                "betting.isVFHALFWIN": true,
                                "betting.resultMoney": 0
                            }).then(async(err) => {})
                        } else if (outcome.OutcomeDeadHeatFactor == 0.33) {
                            await sportsBet.updateOne(bet_one_item, {
                                "betting.handleState": true,
                                TYPE: "WIN",
                                "betting.isDHFTHIRDWIN": true,
                                "betting.resultMoney": 0
                            }).then(async(err) => {})
                        } else if (outcome.OutcomeDeadHeatFactor == 0.5) {
                            await sportsBet.updateOne(bet_one_item, {
                                "betting.handleState": true,
                                TYPE: "WIN",
                                "betting.isDHFHALFWIN": true,
                                "betting.resultMoney": 0
                            }).then(async(err) => {})
                        } else {
                            await sportsBet.updateOne(bet_one_item, {
                                "betting.handleState": true,
                                TYPE: "WIN",
                                "betting.resultMoney": 0
                            }).then(async(err) => {})
                        }
                        let multiData = await baseController.Bfind(sportsBet, {
                            "betting.transactionId": bet_one_item.betting.transactionId,
                            TYPE: "BET"
                        });
                        if (!multiData || !multiData.length) {
                            let multiLostData = await baseController.Bfind(sportsBet, {
                                "betting.transactionId": bet_one_item.betting.transactionId,
                                TYPE: "LOST"
                            });
                            if (!multiLostData || !multiLostData.length) {
                                let multiWinData = await baseController.Bfind(sportsBet, {
                                    "betting.transactionId": bet_one_item.betting.transactionId,
                                    TYPE: "WIN"
                                });
                                let updateMoney = parseFloat(multiWinData[0].AMOUNT);
                                for (let p = 0; p < multiWinData.length; p++) {
                                    updateMoney = parseFloat(multiWinData[p].betting.OutcomeOdds) * parseFloat(updateMoney);
                                    if (multiWinData[p].betting.isVFHALFWIN) {
                                        updateMoney = (parseFloat(updateMoney) * 0.5) + (parseFloat(multiWinData[p].AMOUNT) * 0.5);
                                    } else if (multiWinData[p].betting.isDHFTHIRDWIN) {
                                        updateMoney = parseFloat(updateMoney) * 0.33;
                                    } else if (multiWinData[p].betting.isDHFHALFWIN) {
                                        updateMoney = parseFloat(updateMoney) * 0.5;
                                    }
                                }
                                let sportsWallet = {
                                    commission: 0,
                                    gameid: data.event_id,
                                    status: "WIN",
                                    userid: mongoose.Types.ObjectId(bet_one_item.USERID),
                                    roundid: bet_one_item.betting.transactionId,
                                    transactionid: bet_one_item.betting.transactionId,
                                    lastbalance: userData.balance,
                                    credited: updateMoney,
                                    debited: 0
                                }
                                player_balanceupdatein(parseFloat(updateMoney), bet_one_item.USERID, sportsWallet);
                                await sportsBet.updateMany({
                                    "betting.transactionId": bet_one_item.betting.transactionId
                                }, {
                                    "betting.resultMoney": updateMoney
                                })
                            }
                        }
                    }
                } else {
                    let sportsWallet = {
                        commission: 0,
                        sportid: mongoose.Types.ObjectId(bet_one_item.gameid),
                        sportsData: {
                            MatchName: bet_one_item.betting.MatchName,
                            MarketName: bet_one_item.betting.MarketName,
                            OutcomeName: bet_one_item.betting.OutcomeName,
                        },
                        status: "WIN",
                        userid: mongoose.Types.ObjectId(bet_one_item.USERID),
                        roundid: bet_one_item.betting.transactionId,
                        transactionid: bet_one_item.betting.transactionId,
                        lastbalance: userData.balance,
                        debited: 0
                    }
                    if (bet_one_item.betting.betType.toLowerCase() === "single") {
                        if (outcome.OutcomeVoidFactor == 1) {
                            await sportsBet.updateOne(bet_one_item, {
                                "betting.handleState": true,
                                TYPE: "LOST",
                                "betting.isVFHALFLOST": true,
                                "betting.resultMoney": bet_one_item.AMOUNT
                            }).then(async(err) => {
                                sportsWallet.credited = bet_one_item.AMOUNT;
                                player_balanceupdatein(parseFloat(bet_one_item.AMOUNT), bet_one_item.USERID, sportsWallet);
                            });
                        } else if (outcome.OutcomeVoidFactor == 0.5) {
                            await sportsBet.updateOne(bet_one_item, {
                                "betting.handleState": true,
                                TYPE: "LOST",
                                "betting.isVFALLLOST": true,
                                "betting.resultMoney": bet_one_item.AMOUNT * 0.5
                            }).then(async(err) => {
                                sportsWallet.credited = parseFloat(bet_one_item.AMOUNT) * 0.5;
                                player_balanceupdatein(parseFloat(bet_one_item.AMOUNT) * 0.5, bet_one_item.USERID, sportsWallet);
                            });
                        } else {
                            await sportsBet.updateOne(bet_one_item, {
                                "betting.handleState": true,
                                TYPE: "LOST",
                                "betting.resultMoney": bet_one_item.AMOUNT
                            }).then(err => {});
                        }
                    } else {
                        await sportsBet.updateOne(bet_one_item, {
                            "betting.handleState": true,
                            TYPE: "LOST",
                            "betting.resultMoney": bet_one_item.AMOUNT
                        }).then(err => {});
                    }
                }
            }
        }
    }
    return res.send(true);
}

exports.RollbackBetSettlement = async(req, res) => {
    let data = req.body;
    await sportsTemp.findOneAndUpdate({
        key: sportsConfig.TIMESTAMP
    }, {
        timestamp: data.timestamp,
        key: sportsConfig.TIMESTAMP
    }, {
        upsert: true
    });
    for (let i = 0; i < data.market.length; i++) {
        let market = data.market[i];
        let searchData = {
            GAMEID: data.event_id,
            "betting.MarketId": market.MarketId,
            "betting.MarketName": market.MarketName,
            "betting.MarketSpecifiers": market.MarketSpecifiers ? market.MarketSpecifiers : "",
            "betting.handleState": true
        }
        let bet_won = await baseController.Bfind(sportsBet, searchData);
        for (let k = 0; k < bet_won.length; k++) {
            let bet_won_item = bet_won[k];
            let userData = await baseController.BfindOne(GamePlay, {
                id: bet_won_item.USERID
            });
            if (bet_won_item.TYPE.toLowerCase() == "win") {
                if (bet_won_item.betting.betType.toLowerCase() === "single") {
                    let updateMoney = parseFloat(bet_won_item.betting.OutcomeOdds) * parseFloat(bet_won_item.AMOUNT);
                    if (bet_won_item.betting.isVFHALFWIN) {
                        updateMoney = (parseFloat(updateMoney) * 0.5) + (parseFloat(bet_won_item.AMOUNT) * 0.5);
                        await sportsBet.updateOne(bet_won_item, {
                            "betting.handleState": false,
                            TYPE: "BET",
                            "betting.isVFHALFWIN": false,
                            "betting.resultMoney": 0
                        }).then(async(err) => {})
                    } else if (bet_won_item.betting.isDHFTHIRDWIN) {
                        updateMoney = parseFloat(updateMoney) * 0.33;
                        await sportsBet.updateOne(bet_won_item, {
                            "betting.handleState": false,
                            TYPE: "BET",
                            "betting.isDHFTHIRDWIN": false,
                            "betting.resultMoney": 0
                        }).then(async(err) => {})
                    } else if (bet_won_item.betting.isDHFHALFWIN) {
                        updateMoney = parseFloat(updateMoney) * 0.5;
                        await sportsBet.updateOne(bet_won_item, {
                            "betting.handleState": false,
                            TYPE: "BET",
                            "betting.isDHFHALFWIN": false,
                            "betting.resultMoney": 0
                        }).then(async(err) => {})
                    } else {
                        await sportsBet.updateOne(bet_won_item, {
                            "betting.handleState": false,
                            TYPE: "BET",
                            "betting.resultMoney": 0
                        }).then(async(err) => {})
                    }
                    if (bonus) {
                        updateMoney = parseFloat(updateMoney) + parseFloat(bonus);
                    }
                    let sportsWallet = {
                        commission: 0,
                        sportid: mongoose.Types.ObjectId(bet_won_item.gameid),
                        sportsData: {
                            MatchName: bet_won_item.betting.MatchName,
                            MarketName: bet_won_item.betting.MarketName,
                            OutcomeName: bet_won_item.betting.OutcomeName,
                        },
                        status: "CANCELED_WIN",
                        userid: mongoose.Types.ObjectId(bet_won_item.USERID),
                        roundid: bet_won_item.betting.transactionId,
                        transactionid: bet_won_item.betting.transactionId,
                        lastbalance: userData.balance,
                        credited: 0
                    }
                    sportsWallet.debited = parseFloat(updateMoney);
                    player_balanceupdatein(parseFloat(updateMoney) * -1, bet_won_item.USERID, sportsWallet);
                } else {
                    if (bet_won_item.betting.isVFHALFWIN) {
                        await sportsBet.updateOne(bet_won_item, {
                            "betting.handleState": false,
                            TYPE: "BET",
                            "betting.isVFHALFWIN": false,
                            "betting.resultMoney": 0
                        }).then(async(err) => {})
                    } else if (bet_won_item.betting.isDHFTHIRDWIN) {
                        await sportsBet.updateOne(bet_won_item, {
                            "betting.handleState": false,
                            TYPE: "BET",
                            "betting.isDHFTHIRDWIN": false,
                            "betting.resultMoney": 0
                        }).then(async(err) => {})
                    } else if (bet_won_item.betting.isDHFHALFWIN) {
                        await sportsBet.updateOne(bet_won_item, {
                            "betting.handleState": false,
                            TYPE: "BET",
                            "betting.isDHFHALFWIN": false,
                            "betting.resultMoney": 0
                        }).then(async(err) => {})
                    } else {
                        await sportsBet.updateOne(bet_won_item, {
                            "betting.handleState": false,
                            TYPE: "BET",
                            "betting.resultMoney": 0
                        }).then(async(err) => {})
                    }
                    let multiData = await baseController.Bfind(sportsBet, {
                        "betting.transactionId": bet_won_item.betting.transactionId,
                        TYPE: "WIN"
                    });
                    if (!multiData || !multiData.length) {
                        let multiLostData = await baseController.Bfind(sportsBet, {
                            "betting.transactionId": bet_won_item.betting.transactionId,
                            TYPE: "LOST"
                        });
                        if (!multiLostData || !multiLostData.length) {
                            let multiBetData = await baseController.Bfind(sportsBet, {
                                "betting.transactionId": bet_won_item.betting.transactionId,
                                TYPE: "BET"
                            });
                            let updateMoney = parseFloat(multiBetData[0].AMOUNT);
                            for (let p = 0; p < multiBetData.length; p++) {
                                updateMoney = parseFloat(multiBetData[p].betting.OutcomeOdds) * parseFloat(updateMoney);
                                if (multiBetData[p].betting.isVFHALFWIN) {
                                    updateMoney = (parseFloat(updateMoney) / 2 + parseFloat(multiBetData[p].AMOUNT) / 2);
                                } else if (multiBetData[p].betting.isDHFTHIRDWIN) {
                                    updateMoney = parseFloat(updateMoney) * 0.33;
                                } else if (multiBetData[p].betting.isDHFHALFWIN) {
                                    updateMoney = parseFloat(updateMoney) * 0.5;
                                }
                            }
                            let sportsWallet = {
                                commission: 0,
                                sportid: mongoose.Types.ObjectId(bet_won_item.gameid),
                                sportsData: {
                                    MatchName: bet_won_item.betting.MatchName,
                                    MarketName: bet_won_item.betting.MarketName,
                                    OutcomeName: bet_won_item.betting.OutcomeName,
                                },
                                status: "CANCELED_WIN",
                                userid: mongoose.Types.ObjectId(bet_won_item.USERID),
                                roundid: bet_won_item.betting.transactionId,
                                transactionid: bet_won_item.betting.transactionId,
                                lastbalance: userData.balance,
                                credited: 0
                            }
                            sportsWallet.debited = parseFloat(updateMoney);
                            player_balanceupdatein(parseFloat(updateMoney) * -1, bet_won_item.USERID, sportsWallet);
                        }
                    }
                }
            } else {
                if (bet_won_item.betting.betType.toLowerCase() === "single") {
                    if (bet_won_item.betting.isVFHALFLOST) {
                        await sportsBet.updateOne(bet_won_item, {
                            "betting.handleState": false,
                            TYPE: "BET",
                            "betting.isVFHALFLOST": false,
                            "betting.resultMoney": 0
                        }).then(async(err) => {
                            let sportsWallet = {
                                commission: 0,
                                gameid: data.event_id,
                                status: "CANCELED_BET",
                                userid: mongoose.Types.ObjectId(bet_won_item.USERID),
                                roundid: bet_won_item.betting.transactionId,
                                transactionid: bet_won_item.betting.transactionId,
                                lastbalance: userData.balance,
                                credited: 0
                            }
                            sportsWallet.debited = parseFloat(bet_won_item.AMOUNT);
                            player_balanceupdatein(parseFloat(bet_won_item.AMOUNT) * -1, bet_won_item.USERID, sportsWallet);
                        });
                    } else if (bet_won_item.betting.isVFALLLOST) {
                        await sportsBet.updateOne(bet_won_item, {
                            "betting.handleState": false,
                            TYPE: "BET",
                            "betting.isVFALLLOST": false,
                            "betting.resultMoney": 0
                        }).then(async(err) => {
                            let sportsWallet = {
                                commission: 0,
                                gameid: data.event_id,
                                status: "CANCELED_BET",
                                userid: mongoose.Types.ObjectId(bet_won_item.USERID),
                                roundid: bet_won_item.betting.transactionId,
                                transactionid: bet_won_item.betting.transactionId,
                                lastbalance: userData.balance,
                                credited: 0
                            }
                            sportsWallet.debited = parseFloat(bet_won_item.AMOUNT) / 2;
                            player_balanceupdatein((parseFloat(bet_won_item.AMOUNT) / 2) * -1, bet_won_item.USERID, sportsWallet);
                        });
                    } else {
                        await sportsBet.updateOne(bet_won_item, {
                            "betting.handleState": false,
                            TYPE: "BET",
                            "betting.resultMoney": 0
                        }).then(err => {});
                    }
                } else {
                    await sportsBet.updateOne(bet_won_item, {
                        "betting.handleState": false,
                        TYPE: "BET",
                        "betting.resultMoney": 0
                    }).then(err => {});
                }
            }
        }
    }
    return res.send(true);
}

exports.BetCancel = async(req, res) => {
    let data = req.body;
    await sportsTemp.findOneAndUpdate({
        key: sportsConfig.TIMESTAMP
    }, {
        timestamp: data.timestamp,
        key: sportsConfig.TIMESTAMP
    }, {
        upsert: true
    });
    for (let i = 0; i < data.market.length; i++) {
        let market = data.market[i];
        let searchData = {
            GAMEID: data.event_id,
            "betting.MarketId": market.MarketId,
            "betting.MarketName": market.MarketName,
            "betting.MarketSpecifiers": market.MarketSpecifiers ? market.MarketSpecifiers : "",
            "TYPE": "BET",
            "betting.handleState": false
        }
        let result = await baseController.Bfind(sportsBet, searchData);
        if (result) {
            for (let i = 0; i < result.length; i++) {
                let result_item = result[i];
                let flag = false;
                let StartTime = data.StartTime ? data.StartTime.split("IST").join("GMT +05:30") : "";
                let EndTime = data.EndTime ? data.EndTime.split("IST").join("GMT +05:30") : "";
                let userData = await baseController.BfindOne(GamePlay, {
                    id: result_item.USERID
                });
                if (StartTime && EndTime) {
                    if (new Date(StartTime) <= new Date(result_item.DATE) && new Date(result_item.DATE) <= new Date(EndTime)) {
                        flag = true;
                    }
                } else if (StartTime && !EndTime) {
                    if (new Date(StartTime) <= new Date(result_item.DATE)) {
                        flag = true;
                    }
                } else if (!StartTime && EndTime) {
                    if (new Date(result_item.DATE) <= new Date(EndTime)) {
                        flag = true;
                    }
                } else if (!StartTime && !EndTime) {
                    flag = true;
                }
                if (flag) {
                    if (result_item.betting.betType.toLowerCase() == "single") {
                        await sportsBet.updateOne(result_item, {
                            TYPE: "CANCEL",
                            "betting.handleState": true,
                            "betting.resultMoney": result_item.AMOUNT
                        });
                        let sportsWallet = {
                            commission: 0,
                            sportid: mongoose.Types.ObjectId(result_item.gameid),
                            sportsData: {
                                MatchName: result_item.betting.MatchName,
                                MarketName: result_item.betting.MarketName,
                                OutcomeName: result_item.betting.OutcomeName,
                            },
                            status: "CANCELED_BET",
                            userid: mongoose.Types.ObjectId(result_item.USERID),
                            roundid: result_item.betting.transactionId,
                            transactionid: result_item.betting.transactionId,
                            lastbalance: userData.balance,
                            debited: 0
                        }
                        sportsWallet.credited = parseFloat(result_item.AMOUNT);
                        player_balanceupdatein(parseFloat(result_item.AMOUNT), result_item.USERID, sportsWallet);
                    } else {
                        let multiData = await baseController.Bfind(sportsBet, {
                            "betting.transactionId": result_item.betting.transactionId,
                            TYPE: "BET"
                        });
                        if (multiData.length) {
                            let sportsWallet = {
                                commission: 0,
                                sportid: mongoose.Types.ObjectId(result_item.gameid),
                                sportsData: {
                                    MatchName: result_item.betting.MatchName,
                                    MarketName: result_item.betting.MarketName,
                                    OutcomeName: result_item.betting.OutcomeName,
                                },
                                status: "CANCELED_BET",
                                userid: mongoose.Types.ObjectId(result_item.USERID),
                                roundid: result_item.betting.transactionId,
                                transactionid: result_item.betting.transactionId,
                                lastbalance: userData.balance,
                                debited: 0
                            }
                            sportsWallet.credited = parseFloat(result_item.AMOUNT);
                            player_balanceupdatein(parseFloat(result_item.AMOUNT), result_item.USERID, sportsWallet);
                            sportsBet.updateMany({
                                "betting.transactionId": result_item.betting.transactionId
                            }, {
                                TYPE: "CANCEL",
                                "betting.handleState": true
                            })
                        }
                    }
                }
            }
        }
    }
    return res.send(true);
}

exports.RollbackBetCancel = async(req, res) => {
    let data = req.body;
    await sportsTemp.findOneAndUpdate({
        key: sportsConfig.TIMESTAMP
    }, {
        timestamp: data.timestamp,
        key: sportsConfig.TIMESTAMP
    }, {
        upsert: true
    });
    for (let i = 0; i < data.market.length; i++) {
        let market = data.market[i];
        let searchData = {
            GAMEID: data.event_id,
            "betting.MarketId": market.MarketId,
            "betting.MarketName": market.MarketName,
            "betting.MarketSpecifiers": market.MarketSpecifiers ? market.MarketSpecifiers : "",
            "TYPE": "CANCEL",
            "betting.handleState": true
        }
        let result = await baseController.Bfind(sportsBet, searchData);
        if (result) {
            for (let i = 0; i < result.length; i++) {
                let result_item = result[i];
                let flag = false;
                let StartTime = data.StartTime ? data.StartTime.split("IST").join("GMT +05:30") : "";
                let EndTime = data.EndTime ? data.EndTime.split("IST").join("GMT +05:30") : "";
                let userData = await baseController.BfindOne(GamePlay, {
                    id: result_item.USERID
                });

                if (StartTime && EndTime) {
                    if (new Date(StartTime) <= new Date(result_item.DATE) && new Date(result_item.DATE) <= new Date(EndTime)) {
                        flag = true;
                    }
                } else if (StartTime && !EndTime) {
                    if (new Date(StartTime) <= new Date(result_item.DATE)) {
                        flag = true;
                    }
                } else if (!StartTime && EndTime) {
                    if (new Date(result_item.DATE) <= new Date(EndTime)) {
                        flag = true;
                    }
                } else if (!StartTime && !EndTime) {
                    flag = true;
                }
                if (flag) {
                    if (result_item.betting.betType.toLowerCase() == "single") {
                        await sportsBet.updateOne(result_item, {
                            TYPE: "BET",
                            "betting.handleState": false,
                            "betting.resultMoney": 0
                        });
                        let sportsWallet = {
                            commission: 0,
                            sportid: mongoose.Types.ObjectId(result_item.gameid),
                            sportsData: {
                                MatchName: result_item.betting.MatchName,
                                MarketName: result_item.betting.MarketName,
                                OutcomeName: result_item.betting.OutcomeName,
                            },
                            status: "Rollback bet cancel",
                            userid: mongoose.Types.ObjectId(result_item.USERID),
                            roundid: result_item.betting.transactionId,
                            transactionid: result_item.betting.transactionId,
                            lastbalance: userData.balance,
                            credited: 0
                        }
                        sportsWallet.debited = parseFloat(result_item.AMOUNT);
                        player_balanceupdatein(parseFloat(result_item.AMOUNT) * -1, result_item.USERID, sportsWallet);
                    } else {
                        let multiData = await baseController.Bfind(sportsBet, {
                            "betting.transactionId": result_item.betting.transactionId,
                            TYPE: "CANCEL"
                        });
                        if (multiData.length) {
                            let sportsWallet = {
                                commission: 0,
                                sportid: mongoose.Types.ObjectId(result_item.gameid),
                                sportsData: {
                                    MatchName: result_item.betting.MatchName,
                                    MarketName: result_item.betting.MarketName,
                                    OutcomeName: result_item.betting.OutcomeName,
                                },
                                status: "Rollback bet cancel",
                                userid: mongoose.Types.ObjectId(result_item.USERID),
                                roundid: result_item.betting.transactionId,
                                transactionid: result_item.betting.transactionId,
                                lastbalance: userData.balance,
                                credited: 0
                            }
                            sportsWallet.debited = parseFloat(result_item.AMOUNT);
                            player_balanceupdatein(parseFloat(result_item.AMOUNT) * -1, result_item.USERID, sportsWallet);
                            sportsBet.updateMany({
                                "betting.transactionId": result_item.betting.transactionId
                            }, {
                                TYPE: "BET",
                                "betting.handleState": false
                            })
                        }
                    }
                }
            }
        }
    }
    return res.send(true);
}

exports.RecoveryEvent = async(req, res) => {
    let data = req.body;
    let produceStatus = data.isDown == true ? false : true;

    const io = req.app.get(sportsConfig.SOCKETIO);
    if (produceStatus) {
        setTimeout(async() => {
            await sportsTemp.findOneAndUpdate({
                key: sportsConfig.RecoveryEvent
            }, {
                produceStatus,
                key: sportsConfig.RecoveryEvent
            }, {
                upsert: true
            });
            io.sockets.emit(sportsConfig.RecoveryEvent, {
                data: {
                    produceStatus: produceStatus
                },
                key: sportsConfig.RecoveryEvent
            });
            res.send(true);
        }, 1000 * 60);
    } else {
        await sportsTemp.findOneAndUpdate({
            key: sportsConfig.RecoveryEvent
        }, {
            produceStatus,
            key: sportsConfig.RecoveryEvent
        }, {
            upsert: true
        });
        io.sockets.emit(sportsConfig.RecoveryEvent, {
            data: {
                produceStatus: produceStatus
            },
            key: sportsConfig.RecoveryEvent
        });
        res.send(true);
    }
}

exports.getRecoveryEvent = async(req, res) => {
    let data = await baseController.BfindOne(sportsTemp, {
        key: sportsConfig.RecoveryEvent
    });
    if (data) {
        return res.json({
            status: true,
            data
        })
    } else {
        return res.json({
            status: false
        })
    }
}

exports.getFeaturedEvent = async(req, res) => {
    let returnData = [];
    redisClient.keys('*', async(err, keys) => {
        redisClient.mget(keys, async function (err, values) {
            if (values) {
                for (let i = 0; i < values.length; i++) {
                    oneMatch = JSON.parse(values[i]);
                    if (oneMatch.permission && oneMatch.isfeatured) {
                        let market = [];
                        let T1X2 = oneMatch.market.findIndex(item => item.MarketName.toLowerCase() == "1x2");
                        let THANDICAP = oneMatch.market.findIndex(item => item.MarketName.toLowerCase() == "handicap");
                        let TTOTAL = oneMatch.market.findIndex(item => item.MarketName.toLowerCase() == "total");
                        if (T1X2 > -1) {
                            market.push(oneMatch.market[T1X2]);
                        }
                        if (THANDICAP > -1) {
                            market.push(oneMatch.market[THANDICAP]);
                        }
                        if (TTOTAL > -1) {
                            market.push(oneMatch.market[TTOTAL]);
                        }
                        oneMatch.marketLen = oneMatch.market.length;
                        oneMatch.market = market;
                        returnData.push(oneMatch);
                    }
                }
                return res.json({
                    status: true,
                    data: returnData
                })
            } else {
                return res.json({
                    status: true,
                    data: []
                });
            }
        });
    });
}

exports.getCsvData = async(req, res) => {
    let query = [];
    redisClient.keys('*_21', async(err, keys) => {
        redisClient.mget(keys, async function (err, values) {
            if (values) {
                for (let i = 0; i < values.length; i++) {
                    var oneMatch = JSON.parse(values[i]);
                    var oneMarket = oneMatch.market;
                    for (var j = 0; j < oneMarket.length; j++) {
                        var temp = {
                            id: oneMarket[j].MarketId,
                            name: oneMarket[j].MarketName,
                        }
                        var index = query.findIndex(item => item.id == temp.id);
                        if (index < 0) {
                            query.push(temp);
                        }
                    }
                }
                return res.json({
                    data: query
                });
            } else {
                return res.json({
                    status: true,
                    data: []
                });
            }
        });
    });
}