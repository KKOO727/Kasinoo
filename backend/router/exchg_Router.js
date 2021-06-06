const express = require('express');
const router = express.Router();
const ExchgControll = require("../controller/ExchgController")
const authMiddleware = require("../middleware/middleware/authMiddleware");

router.post("/getExchgHeaderData", ExchgControll.getExchgHeaderData);
router.post("/getExchgData", ExchgControll.getExchgData);
router.post("/getExchgMarketData",authMiddleware.isLoggedIn, ExchgControll.getExchgMarketData);

router.post("/load_exchgdata",ExchgControll.load_exchgdata);
router.post("/exchg_update",ExchgControll.exchg_update);

router.post("/sendPlaceBet" , ExchgControll.placeBet);
router.post("/GetAccountBalances" , ExchgControll.GetAccountBalances);

module.exports = router;