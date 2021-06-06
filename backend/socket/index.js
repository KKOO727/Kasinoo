const gamesessionmodel = require("../models/users_model").gamesessionmodel;
const usersession = require("../models/users_model").sessionmodel;
const usersessionmodel = require("../models/users_model").usersessionmodel
const adminUser = require("../models/users_model").adminUser
const BASECONTROL = require("../controller/basecontroller");
const {PaymoroSubmitData} = require("../models/paymentGateWayModel")
const exchgController = require("../controller/ExchgController");
const redis = require('redis');
const exchgXmlConfig = require("../config/exchgXmlConfig");
const rdsconfig = require("../servers/db.json")




module.exports = async (io) => {
    io.on("connection", async (socket) => {

        console.log("----------socket id --------", socket.id);
        let query = socket.handshake.query;

        if (query.auth) {
            let socketid = socket.id;
            var user = BASECONTROL.decrypt(query.auth);
            if (user) {
                user = JSON.parse(user);
                let row = {
                    id: user._id,
                    socketid: socketid,
                    chatid: "web"
                }
                let dd = await BASECONTROL.BfindOneAndUpdate(usersession, {
                    id: user._id
                }, row);
            }
        }

        socket.on("setTelegram", async rdata => {
            console.log(rdata)
            let user = await adminUser.findOne({ email: rdata.telegram_id });
            if (user) {
                let row = {
                    chatid: rdata.chat_id,
                    id: user._id,
                    socketid: socket.id
                }
                let dd = await BASECONTROL.BfindOneAndUpdate(usersession, {
                    id: user._id
                }, row);
            }
        })

        socket.on("setsession", async (rdata) => {});

        socket.on("sessiondestroy", async (rdata) => {
            var user = BASECONTROL.decrypt(rdata.token);
            if (rdata.token && user) {
                user = JSON.parse(user);
                await BASECONTROL.BfindOneAndDelete(usersession, { id: user._id });
                await BASECONTROL.BfindOneAndDelete(usersessionmodel, { id: user._id });
            }
        })

        socket.on("gamesavetoken", async (rdata) => {
            var find = await BASECONTROL.BfindOneAndUpdate(gamesessionmodel, { email: rdata.email }, rdata);
            if (!find) {
                socket.emit("gamedestory", { data: false })
            }
        });

        socket.on("gamedelete", async (rdata) => {
            await gamesessionmodel.findOneAndDelete({ toke: rdata.data })
            // await gamesessionremove(rdata.data);
        });

        socket.on("disconnect", async () => {
            let socketid = socket.id;
            let dd = await BASECONTROL.BfindOneAndDelete(usersession, { socketid: socketid });
        })
    });

    setInterval(() => {
        io.sockets.emit('datetime', {
            offset: new Date().getTimezoneOffset(),
            toDateString: new Date().toDateString(),
            toLocaleTimeString: new Date().toLocaleTimeString(),
            toTimeString: new Date().toTimeString()
        });
    }, 1000);

    setInterval(async () => {
        var gameSession = await gamesessionmodel.find({ intimestamp: { $lte: new Date() }});
        if (gameSession.length) {
            await gamesessionmodel.deleteMany({ intimestamp: { $lte: new Date() } });

            var Gexpires = {};
            for (var i in gameSession) {
                Gexpires[gameSession[i]['email']] = true;
            }
            io.sockets.emit('expiredestory', { data: Gexpires });
        }


        let siPlayers = await usersession.find().populate("id");
        if (siPlayers.length) {
            let balances = {};
            for (var i in siPlayers) {
                balances[siPlayers[i]['id']['email']] = BASECONTROL.getPlayerBalanceCal_(siPlayers[i]['id']['playerid']);
            }
            io.sockets.emit('balance', { data: balances });
        }

        await PaymoroSubmitData.find({ date: { $lte: new Date() } });

        var userSession = await usersessionmodel.find({ inittime: { $lte: new Date() } }).populate("id");
        if (userSession.length) {
            await usersessionmodel.deleteMany({ inittime: { $lte: new Date() } });

            var expires = {}
            for (var i in userSession) {
                expires[userSession[i]['id']['email']] = true;
                await usersession.findOneAndDelete({ id: userSession[i]['id']['_id'] });
            }
            io.sockets.emit('destory', { data: expires });
        }
    
    }, 5000);
	
	setInterval(() => {
        // fimRealTimeFetch(io);
        // exchgController.RealtimeMarket(io);
    }, 5 * 1000);

    // fimListBootstrapOrders();
};

async function fimRealTimeFetch(io) {
    await BASECONTROL.sendRequest(exchgXmlConfig.ListTopLevelEvents(), 0, async xmlTopData => {
        if (xmlTopData && xmlTopData['ListTopLevelEventsResponse']) {
            var xmlNavData = xmlTopData['ListTopLevelEventsResponse'][0]['ListTopLevelEventsResult'][0]['EventClassifiers'];
            if (xmlNavData && xmlNavData.length) {
                await exchangeRedis.keys("*", async (err, keys) => {
                    for(let i in keys) {
                        let flag = xmlNavData.findIndex(item => item['$'].Id == keys[i]);
                        if(flag < 0) {
							await exchangeRedis.del(keys[i], async function(err, values){})
                        }
                    }
                });

                let rows = [];
                for (var i = 0; i < xmlNavData.length; i++) {
                    var navData = xmlNavData[i]['$'];
                    var temp = {
                        Id: navData.Id,
                        Name: navData.Name,
                        type: "collapse",
                        ParentId: "0",
                        children: [],
                    }

                    rows.push(temp);
                    fimReamTimeEventFetch([temp], io)
                }

                rows.sort((a, b) => {
                    let fa = a.Name.toLowerCase(),
                        fb = b.Name.toLowerCase();
                
                    if (fa < fb) {
                        return -1;
                    }
                    if (fa > fb) {
                        return 1;
                    }
                    return 0;
                });

                io.sockets.emit("GetDataFimMenu",{data : rows.slice(3,10)});

            }
        }
    });
}

async function fimReamTimeEventFetch(headerData, io) {
    // BASECONTROL.sendRequest(exchgXmlConfig.GetEventSubTreeWithSelections(headerData), 0, async (xmlTopData) => {
    await BASECONTROL.sendRequest(exchgXmlConfig.GetEventSubTreeNoSelections(headerData), 0, async (xmlTopData) => {
        if (xmlTopData && xmlTopData['GetEventSubTreeNoSelectionsResponse']) {
            var xmlFetchData = xmlTopData['GetEventSubTreeNoSelectionsResponse'][0]['GetEventSubTreeNoSelectionsResult'][0]['EventClassifiers'] ? xmlTopData['GetEventSubTreeNoSelectionsResponse'][0]['GetEventSubTreeNoSelectionsResult'][0]['EventClassifiers'] : [];
            for (var i = 0; i < xmlFetchData.length; i++) {
                var xmlGetData = xmlFetchData[i];
                var topData = xmlGetData['$'];
                var xmlNavData = xmlGetData['EventClassifiers'];
                var Category = [];
                for (let j = 0; j < xmlNavData.length; j++) {
                    let subData = xmlNavData[j]['$'];
                    let subNavData = xmlNavData[j]['EventClassifiers'] ? xmlNavData[j]['EventClassifiers'] : [];
                    let Matchs = [];
                    if (subNavData.length) {
                        for (let k = 0; k < subNavData.length; k++) {
                            let subMatchData = subNavData[k]['$'];
                            if (subNavData[k]['EventClassifiers']) {
                                let subNavMatchData = subNavData[k]['EventClassifiers'] ? subNavData[k]['EventClassifiers'] : [];
                                let tempMatch = [];
                                for (let l = 0; l < subNavMatchData.length; l++) {
                                    let subMarketData = subNavMatchData[l]['$'];
                                    let Market = [];
                                    let subNavMarketData = subNavMatchData[l]['Markets'] ? subNavMatchData[l]['Markets'] : [];
                                    for (let m = 0; m < subNavMarketData.length; m ++) {
                                        let subOddsData = subNavMarketData[m]['$'];
                                        // let subOddsSelection = subNavMarketData[m]['Selections'] ? subNavMarketData[m]['Selections'] : [];
                                        // let oddsData = await exchgController.getSelectionData(subOddsSelection);

                                        // if(navMarketData.length) {
                                            // subOddsData.oddsData = oddsData;
                                            Market.push(subOddsData);
                                        // }
                                    }
                                    if(Market.length) {
                                        // subMarketData.marketData = await exchgController.navMarketData(Market);
                                        subMarketData.marketData = Market;
                                        subMarketData.type = "item"
                                        tempMatch.push(subMarketData);
                                    }
                                }
                                if(tempMatch.length) {
                                    subMatchData.children = tempMatch;
                                    subMatchData.type = tempMatch.length ? "collapse": "item";
                                    Matchs.push(subMatchData);
                                }
                            } else {
                                let Market = [];
                                let subNavMarketData = subNavData[k]['Markets'] ? subNavData[k]['Markets'] : [];
                                for (let l = 0; l < subNavMarketData.length; l++) {
                                    let subOddsData = subNavMarketData[l]['$'];

                                    // let subOddsSelection = subNavMarketData[l]['Selections'] ? subNavMarketData[l]['Selections'] : [];
                                    // let oddsData = await exchgController.getSelectionData(subOddsSelection);

                                    // if(navMarketData.length) {
                                        // subOddsData.oddsData = oddsData;
                                        Market.push(subOddsData);
                                    // }
                                }
                                if(Market.length) {
                                    subMatchData.marketData = Market
                                    // subMatchData.marketData = await exchgController.navMarketData(Market);
                                    subMatchData.type = "item"
                                    Matchs.push(subMatchData);
                                }
                            }
                        }
                    }
                    if(Matchs.length) {
                        subData.children = Matchs;
                        subData.type = "collapse";
                        Category.push(subData);
                    }
                }
                topData.children = Category;
                topData.type = "collapse";
                topData.ParentId = "0";
                exchangeRedis.set(topData.Id, JSON.stringify(topData));
                io.sockets.emit("GetFimMatch",{data : topData});
            }
        }
    });
}

async function fimListBootstrapOrders() {
    await BASECONTROL.sendRequest(exchgXmlConfig.ListBootstrapOrders(-1), 1, async xmlOrderData => {
        let xmlOrders = xmlOrderData.ListBootstrapOrdersResponse[0].ListBootstrapOrdersResult[0].Orders;
        if(xmlOrders && xmlOrders[0] && xmlOrders[0].Order) {
            let Orders = xmlOrders[0].Order;
            for (let key in Orders) {
                // console.log(Orders[key]['$'])
                // console.log(Orders[key].OrderCommissionInformation[0]['$'].OrderCommission)
            }
        }
    })
}

function run() {
    exchangeRedis.flushdb((err, result) => {
	})
}
// run();