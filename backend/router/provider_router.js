const express = require('express');
const router = express.Router();
const ProviderCon =require("../controller/providerscontroller")
const multer = require('multer');
const config = require('../db');
const authMiddleware = require("../middleware/middleware/authMiddleware");
const configMiddleware = require("../middleware/middleware/configMiddleware")
const BaseControl =require("../controller/basecontroller")

router.post("/LivecasinoproviderLoad",authMiddleware.isLoggedIn,configMiddleware.typeconfig,ProviderCon.LivecasinoproviderLoad);
router.post("/Livecasinoprovidertotal",authMiddleware.isLoggedIn,configMiddleware.typeconfig,ProviderCon.Livecasinoprovidertotal);
router.post("/Livecasinoitemsimg_upload",authMiddleware.isLoggedIn,multer({dest:config.BASEURL}).any(),BaseControl.imageupload,ProviderCon.Livecasinoitemsimg_upload);

router.post("/LivecasinoFirstPageCheck",authMiddleware.isLoggedIn,ProviderCon.LivecasinoFirstPageCheck);
router.post("/Livecasinostatuspagecheck",authMiddleware.isLoggedIn,ProviderCon.Livecasinostatuspagecheck);

router.post("/topgamescheck",authMiddleware.isLoggedIn,ProviderCon.topgamescheck);
router.post("/topgamesload",authMiddleware.isLoggedIn,configMiddleware.typeconfig,ProviderCon.topgamesload);
router.post("/topgamesupdate",authMiddleware.isLoggedIn,configMiddleware.typeconfig,ProviderCon.topgamesupdate);
router.post("/topgamesdelete",authMiddleware.isLoggedIn,configMiddleware.typeconfig,ProviderCon.topgamesdelete);

router.post("/LivecasinoproviderChange",authMiddleware.isLoggedIn,ProviderCon.LivecasinoproviderChange);
router.post("/LivecasinoProviderCheck",authMiddleware.isLoggedIn,ProviderCon.LivecasinoProviderCheck);
router.post("/Livecasinoitemsadd",authMiddleware.isLoggedIn,ProviderCon.Livecasinoitemsadd);
router.post("/Livecasinoitemsupdate",authMiddleware.isLoggedIn,ProviderCon.Livecasinoitemsupdate);
router.post("/Livecasinoitemsdelete",authMiddleware.isLoggedIn,ProviderCon.Livecasinoitemsdelete);

router.post("/get_firstpage_gamelist",authMiddleware.isLoggedIn,ProviderCon.get_firstpage_gamelist);
router.post("/update_firstpage_gamelist",authMiddleware.isLoggedIn,ProviderCon.update_firstpage_gamelist);
router.post("/delete_firstpage_gamelist",authMiddleware.isLoggedIn,ProviderCon.delete_firstpage_gamelist);

router.post("/gameinforchange",authMiddleware.isLoggedIn,ProviderCon.gameinforchange);

router.post("/allrefreshGames",ProviderCon.allrefreshGames);
router.post("/newtokeninit",ProviderCon.newtokeninit);
router.post("/createnewtoken",ProviderCon.createnewtoken);
router.post("/vivoupdate",ProviderCon.vivoupdate);



module.exports = router;   