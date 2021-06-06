const express = require('express');
const router = express.Router();
const MatkaControll = require("../controller/matkaController")
const multer = require('multer');
const config = require('../db');
const authMiddleware = require("../middleware/middleware/authMiddleware");
const configMiddleware = require("../middleware/middleware/configMiddleware")
const BaseControll = require("../controller/basecontroller")

// players detail matkahistory
router.post("/bethistory_email_load",authMiddleware.isLoggedIn,MatkaControll.bethistory_email_load);
router.post("/sattabettingCancel",authMiddleware.isLoggedIn,MatkaControll.sattabettingCancel);

router.post("/adminbethistory_email_load",authMiddleware.isLoggedIn,MatkaControll.adminbethistory_email_load);

router.post("/getBettingPlayers",authMiddleware.isLoggedIn,MatkaControll.getBettingPlayers);


router.post("/get_bazaars",MatkaControll.get_bazaars);
router.post("/create_bazaars",MatkaControll.create_bazaars);
router.post("/update_bazaars",MatkaControll.update_bazaars);
router.post("/delete_bazaars",MatkaControll.delete_bazaars);


router.post("/gamelink",MatkaControll.gamelink);
router.post("/get_games",MatkaControll.getgames);
router.post("/create_games",MatkaControll.create_games);
router.post("/update_games",MatkaControll.update_games);
router.post("/imgupload_games",multer({dest:config.BASEURL}).any(),BaseControll.imageupload,MatkaControll.upload_imgs)
router.post("/delete_games",MatkaControll.delete_games);


router.post("/get_bazartypes",MatkaControll.get_bazartypes);
router.post("/Telegrambazartypes",MatkaControll.Telegrambazartypes);
router.post("/create_bazartypes",MatkaControll.create_bazartypes);
router.post("/update_bazartypes",MatkaControll.update_bazartypes);
router.post("/imgupload_bazartypes",multer({dest:config.BASEURL}).any(),BaseControll.imageupload,MatkaControll.imgupload_bazartypes)
router.post("/iconupload_bazartypes",multer({dest:config.BASEURL}).any(),BaseControll.imageupload,MatkaControll.iconupload_bazartypes)
router.post("/delete_bazartypes",MatkaControll.delete_bazartypes);

router.post("/load_bazaars",MatkaControll.load_bazaars);
router.post("/save_bet_bazaars",authMiddleware.isLoggedIn,MatkaControll.save_bet_bazaars);

router.post("/adminGetLoadBazaars",MatkaControll.adminGetLoadBazaars);
router.post("/get_bets_from_bazarr",MatkaControll.get_bets_from_bazarr);
router.post("/get_bets_from_resultannouncer",MatkaControll.get_bets_from_resultannouncer);



// router.post("/get_games_from_bazarr",MatkaControll.get_games_from_bazarr);
// router.post("/get_numbers_from_games",MatkaControll.get_numbers_from_games);

router.post("/get_result",authMiddleware.isLoggedIn,MatkaControll.get_result);
router.post("/create_result",authMiddleware.isLoggedIn,MatkaControll.create_result);
router.post("/update_result",authMiddleware.isLoggedIn,MatkaControll.update_result);
router.post("/delete_result",MatkaControll.delete_result);
router.post("/get_renuve_frombazzar",MatkaControll.get_renuve_frombazzar);
router.post("/revenCalc",MatkaControll.revenCalc);


router.post("/today_result",authMiddleware.isLoggedIn,MatkaControll.today_result);
router.post("/all_result",authMiddleware.isLoggedIn,MatkaControll.allresult);


router.post("/Loadresstrictiondays",authMiddleware.isLoggedIn,MatkaControll.Loadresstrictiondays)
router.post("/Saveresstrictiondays",authMiddleware.isLoggedIn,MatkaControll.Saveresstrictiondays)
router.post("/Updateresstrictiondays",authMiddleware.isLoggedIn,MatkaControll.Updateresstrictiondays)
router.post("/deleteresstrictiondays",authMiddleware.isLoggedIn,MatkaControll.deleteresstrictiondays)

module.exports = router;