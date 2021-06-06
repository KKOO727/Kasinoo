const express = require('express');
const router = express.Router();
const SportControll = require("../controller/sportController.js");
const authMiddleware = require("../middleware/middleware/authMiddleware");
const multer = require('multer');
const config = require('../db');
const BaseControll = require("../controller/basecontroller")


router.post("/getSportsType", SportControll.getSportsType);
router.post("/getSportsMatchs", SportControll.getSportsMatchs);
router.post("/changeMatchPermission", SportControll.changeMatchPermission);

router.post("/getAllSportsType",SportControll.getAllSportsType);
router.post("/sportsTypeUpdate",authMiddleware.isLoggedIn,SportControll.sportsTypeUpdate);
router.post("/uploadsportsImage",authMiddleware.isLoggedIn,multer({dest:config.BASEURL}).any(),BaseControll.imageupload,SportControll.uploadsportsImage);

router.post("/addfeatureSportsType", SportControll.sportsfeatureAdd);
router.post("/deletefeatureSportsType", SportControll.sportsfeatureDelete);
router.post("/loadfeatureSportsType", SportControll.sportsfeatureLoad);

router.post("/getSportsListPlayer", SportControll.getSportsListPlayer);
router.post("/getSportsMatchPlayer", SportControll.getSportsMatchPlayer)

router.post("/getOneMatchPlayer", SportControll.getOneMatchPlayer);
router.post("/getRecoveryEvent", SportControll.getRecoveryEvent);
router.post("/getFeaturedEvent", SportControll.getFeaturedEvent);

router.post("/placeBetPlayer", authMiddleware.isLoggedIn , SportControll.placeBetPlayer);
router.post("/getSportsBetHistory", authMiddleware.isLoggedIn, SportControll.getSportsBetHistory);
router.post("/getActiveBetCount", authMiddleware.isLoggedIn, SportControll.getActiveBetCount);

router.post("/getCsvData", SportControll.getCsvData)
router.post("/deleteAllMatchs", SportControll.deleteAllMatchs)

// for SDK
router.post("/getLatestTimeStamp", SportControll.getLatestTimeStamp);

router.post("/OddsChange", SportControll.OddsChange);
router.post("/BetStop", SportControll.BetStop);

router.post("/RecoveryEvent", SportControll.RecoveryEvent);
router.post("/BetSettlement", SportControll.BetSettlement);
router.post("/RollbackBetSettlement", SportControll.RollbackBetSettlement);
router.post("/BetCancel", SportControll.BetCancel);
router.post("/RollbackBetCancel", SportControll.RollbackBetCancel);

module.exports = router;