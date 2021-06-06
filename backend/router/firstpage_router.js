const express = require('express');
const router = express.Router();
const FirstPageCon = require("../controller/firstpageController")
const authMiddleware = require("../middleware/middleware/authMiddleware");
const configMiddleware = require("../middleware/middleware/configMiddleware")
const multer = require('multer');
const config = require('../db');
const BaseControll = require("../controller/basecontroller")

// player action  start
router.post('/load_data',FirstPageCon.firstpage_load);
router.post('/firstpage_slider',FirstPageCon.firstpage_slider);
router.post('/firstpage_gamelist',FirstPageCon.firstpage_gamelist);

router.post('/topgamesList',authMiddleware.isLoggedIn,FirstPageCon.topgamesList);

router.post('/toptypelist',configMiddleware.typeconfig,FirstPageCon.typelist);

router.post('/getsidebar',authMiddleware.isLoggedIn,FirstPageCon.getsidebar);
router.post("/gamesSearch",FirstPageCon.gamesSearch)

router.post('/LivecasinoproviderLoad',configMiddleware.typeconfig,FirstPageCon.LivecasinoproviderLoad);
router.post('/LivecasinoproviderChange',FirstPageCon.LivecasinoproviderChange);
router.post('/scroll_load',FirstPageCon.scroll_load)

router.post("getAppVersion",FirstPageCon.getAppVersion)
router.post("setAppVersion",multer({dest:config.APPURL}).any(),BaseControll.appupload,FirstPageCon.setAppVersion)


router.post("/telegramMenuload",FirstPageCon.telegramMenuload);
router.post("/telegramproviderload",FirstPageCon.telegramMenuproviderload);
router.post("/telegramgamelistload",FirstPageCon.telegramMenugamelistload);
// player action end
module.exports = router;