const BASECONTROL = require("./basecontroller");
const { exchgHeaderModel, exchgBetModel ,exchg_opentingmarket} = require("../models/exchg_model");
const { sessionmodel } = require("../models/users_model")
const exchgXmlConfig = require("../config/exchgXmlConfig");
const redis = require('redis');
const rdsconfig = require("../servers/db.json")


async function player_balanceupdatein(amount, uid, wallets) {
    let outdata = await BASECONTROL.player_balanceupdatein_Id(amount, uid, wallets);
    return outdata;
}

exports.load_exchgdata = async(req, res, next) => {
    exchgHeaderModel.find({}, "_id Id Name DisplayOrder IsEnabledForMultiples icon viewBox color status").sort({
        DisplayOrder: 1
    }).then(data => {
        res.json({
            status: true,
            data: data
        });
        return next();
    }).catch(err => {
        res.json({
            status: false
        });
        return next();
    })
}

exports.exchg_update = async(req, res, next) => {
    let indata = req.body.data;
    for (let i = 0; i < indata.length; i++) {
        delete indata[i]._id
        let updatehandle = await BASECONTROL.BfindOneAndUpdate(exchgHeaderModel, {
            Id: indata[i].Id
        }, indata[i]);
        if (!updatehandle) {
            res.json({
                status: false,
                data: "fail1"
            });
            return next();
        }
    }
    let findhandle = await BASECONTROL.BSortfind(exchgHeaderModel, {}, {
        DisplayOrder: 1
    });
    if (!findhandle) {
        res.json({
            status: false,
            data: "fail2"
        })
        return next();
    } else {
        res.json({
            status: true,
            data: findhandle
        })
        return next();
    }
}

// Frontend
exports.getExchgHeaderData = async(req, res) => {

    redisClient.keys("*", async(err, keys) => {
        redisClient.mget(keys, async function (err, values) {
            if (values) {
                let Category = [];
                for (let i in values) {
                    let item = JSON.parse(values[i]);
                    Category.push({
                        Id: item.Id,
                        Name: item.Name,
                        children: [],
                        type: "collapse",
                        ParentId: "0",
                    });
                }

                Category.sort((a, b) => {
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
                return res.json({
                    status: true,
                    data: Category
                });
            } else {
                return res.json({
                    status: false
                });
            }
        });
    });
}

exports.getExchgData = async(req, res) => {
    var data = req.body.data;
    if (data) {
        await redisClient.get(data.Id, (error, TypeDataString) => {
            let TypeDataJSON = JSON.parse(TypeDataString);
            return res.json({
                status: true,
                data: TypeDataJSON.children
            });
        });
    } else {
        return res.json({
            status: false
        });
    }
}


exports.RealtimeMarket = async(io) => {
    let array = await exchg_opentingmarket.aggregate([{
            "$lookup": {
                "from": "user_sockets",
                "localField": "socketuser",
                "foreignField": "_id",
                "as": "socketuser"
            }
        },
        {
            "$unwind": "$socketuser"
        },
        {
            "$group": {
                "_id": "$marketid",
                "data": {
                    "$push": {
                        "marketdata": "$marketdata",
                        "socketid": "$socketuser.socketid"
                    },
                },
            }
        },
        {
            "$unwind": "$data"
        },
    ]);

    for (let i in array) {
        let marketData = array[i].data.marketdata;
        let returnData = await this.navMarketData(marketData);
        io.to(array[i].data.socketid).emit('GETOddsData', {
            data: returnData
        });
    }

}

exports.getExchgMarketData = async(req, res) => {
    let marketData = req.body.data.marketData;
    if (marketData && marketData.length) {

        let userid = req.user._id;
        let socket = await sessionmodel.findOne({
            id: userid
        });
        if (socket) {
            let row = {
                marketdata: marketData,
                marketid: req.body.data.Id,
                socketuser: socket._id
            }

            let sh = await BASECONTROL.BfindOneAndUpdate(exchg_opentingmarket, {
                userid: userid
            }, row);
            if (sh) {
                let returnData = await this.navMarketData(marketData);
                return res.json({
                    status: true,
                    data: returnData
                });
            } else {
                return res.json({
                    status: false
                })
            }
        } else {
            return res.json({
                status: false
            })
        }
    } else {
        return res.json({
            status: false
        })
    }
}

exports.navMarketData = async(data) => {
    let MarketsData = [],
        tempMarketsData = [],
        returnData = [];
    if (!data || !data.length) {
        return returnData;
    }
    for (let i = 0; i < data.length; i++) {
        tempMarketsData.push(data[i].Id);
        if (tempMarketsData.length == 50) {
            MarketsData.push(tempMarketsData);
            tempMarketsData = [];
        }
    }
    MarketsData.push(tempMarketsData);
    for (let i = 0; i < MarketsData.length; i++) {
        await BASECONTROL.sendRequest(exchgXmlConfig.GetPrices(MarketsData[i]), 0, async(GetPrices) => {
            if (GetPrices && GetPrices['GetPricesResponse']) {
                let GetPricesResponse = GetPrices['GetPricesResponse'][0]['GetPricesResult'][0]['MarketPrices'];
                if (GetPricesResponse) {
                    for (let p = 0; p < GetPricesResponse.length; p++) {
                        let GetPricesMarket = GetPricesResponse[p]['$'];
                        let GetPricesResult = GetPricesResponse[p]['Selections'] ? GetPricesResponse[p]['Selections'] : [];
                        let oddsData = await this.getSelectionData(GetPricesResult);
                        if (oddsData.length) {
                            GetPricesMarket.oddsData = oddsData;
                            returnData.push(GetPricesMarket);
                        }
                    }
                }
            }
        })
    }
    return returnData;
}

exports.getSelectionData = async(markets) => {
    let oddsData = [];
    for (let odd_i = 0; odd_i < markets.length; odd_i++) {
        let odds = markets[odd_i]['$'];
        let ForSidePricesData = markets[odd_i]['ForSidePrices'] ? markets[odd_i]['ForSidePrices'] : [];
        let AgainstSidePricesData = markets[odd_i]['AgainstSidePrices'] ? markets[odd_i]['AgainstSidePrices'] : [];
        let flag = false;
        let ForSidePrices = [];
        for (let j = 0; j < 3; j++) {
            if (ForSidePricesData[j]) {
                flag = true;
                ForSidePrices.push(ForSidePricesData[j]['$'])
            } else {
                ForSidePrices.push({
                    nofield: true
                })
            }
        }
        let AgainstSidePrices = [];
        for (let k = 0; k < 3; k++) {
            if (AgainstSidePricesData[k]) {
                falg = true;
                AgainstSidePrices.push(AgainstSidePricesData[k]['$'])
            } else {
                AgainstSidePrices.push({
                    nofield: true
                })
            }
        }
        if (flag) {
            odds.ForSidePrices = ForSidePrices;
            odds.AgainstSidePrices = AgainstSidePrices;
            oddsData.push(odds);
        }
    }
    return oddsData;
}

exports.placeBet = async(req, res) => {
    let betData = req.body.data;
    let returnData = [];
    for (let i in betData) {
        let transactionId = new Date().valueOf() + i;
        betData[i].PunterReferenceNumber = transactionId;
        await BASECONTROL.sendRequest(exchgXmlConfig.PlaceOrdersNoReceipt(betData[i]), 1, async(placeBet) => {
            let returnCode = placeBet.PlaceOrdersNoReceiptResponse[0].PlaceOrdersNoReceiptResult[0].ReturnStatus[0]['$'].Code;
            let description = placeBet.PlaceOrdersNoReceiptResponse[0].PlaceOrdersNoReceiptResult[0].ReturnStatus[0]['$'].Description;
            if (returnCode == 0) {
                let currentPlayerBalance = await BASECONTROL.getSportsBalance(req.user._id);
                let exchgWallet = {
                    commission: 0,
                    sportsData: {
                        Price: betData[i].Price,
                        Name: betData[i].Name,
                        matchName: betData[i].matchName,
                        marketName: betData[i].marketName,
                        SelectionId: betData[i].SelectionId,
                        Polarity: betData[i].Polarity
                    },
                    status: "BET",
                    userid: mongoose.Types.ObjectId(req.user._id),
                    roundid: transactionId,
                    transactionid: transactionId,
                    lastbalance: currentPlayerBalance,
                    credited: 0,
                    debited: betData[i].Stack
                }
                returnData.push({
                    status: true,
                    data: betData[i]
                });
                await player_balanceupdatein(parseFloat(betData[i].Stack) * -1, req.user._id, exchgWallet);
                await BASECONTROL.data_save(exchgBetModel, betData[i]);
            } else {
                returnData.push({
                    status: false,
                    data: betData[i],
                    message: description
                });
            }
        })
    }
    return res.json({
        status: true,
        data: returnData
    })
}

exports.GetAccountBalances = async(req, res) => {
    BASECONTROL.sendRequest(exchgXmlConfig.GetAccountBalances(), 1, async(data) => {
        return res.json({
            status: true,
            data: data['GetAccountBalancesResponse'][0]['GetAccountBalancesResult'][0]
        });
    })
}