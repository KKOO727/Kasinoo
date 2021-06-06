const express = require('express');
const router = express.Router();
const Report_control =require("../controller/reportcontroller")
const authMiddleware = require("../middleware/middleware/authMiddleware");
const configMiddleware = require("../middleware/middleware/configMiddleware")

// player side player
// cms side admin
router.post("/adminreports_email_load",authMiddleware.isLoggedIn,configMiddleware.paymentconfig,Report_control.adminreports_email_load);
router.post("/adminBetsHitoryTotalFromEmail",authMiddleware.isLoggedIn,configMiddleware.paymentconfig,Report_control.adminBetsHitoryTotalFromEmail);


router.post("/report_byplayer_history",authMiddleware.isLoggedIn,Report_control.report_byplayer_history)
router.post("/report_byplayer_total",authMiddleware.isLoggedIn,Report_control.report_byplayer_total)

router.post("/report_bygameid_history",authMiddleware.isLoggedIn,Report_control.report_bygameid_history)
router.post("/report_bygameid_total",authMiddleware.isLoggedIn,Report_control.report_bygameid_total)

router.post("/report_bybet_history",authMiddleware.isLoggedIn,Report_control.report_bybet_history)
router.post("/report_bybet_total",authMiddleware.isLoggedIn,Report_control.report_bybet_total)

router.post("/report_byprovider_total",authMiddleware.isLoggedIn,Report_control.report_byprovider_total)
router.post("/report_byprovider_history",authMiddleware.isLoggedIn,Report_control.report_byprovider_history)

router.post("/sportsBybetTotal",authMiddleware.isLoggedIn,Report_control.sportsBybetTotal)
router.post("/sportsBybethistory",authMiddleware.isLoggedIn,Report_control.sportsBybethistory)

router.post("/sportsBygamesTotal",authMiddleware.isLoggedIn,Report_control.sportsBygamesTotal)
router.post("/sportsBygameshistory",authMiddleware.isLoggedIn,Report_control.sportsBygameshistory)

router.post("/sportsByplayerTotal",authMiddleware.isLoggedIn,Report_control.sportsByplayerTotal)
router.post("/sportsByplayerhistory",authMiddleware.isLoggedIn,Report_control.sportsByplayerhistory)



router.post("/sattaByplayersTotal",authMiddleware.isLoggedIn,Report_control.sattaByplayersTotal)
router.post("/sattaByplayershistory",authMiddleware.isLoggedIn,Report_control.sattaByplayershistory)

router.post("/sattaBymartketTotal",authMiddleware.isLoggedIn,Report_control.sattaBymartketTotal)
router.post("/sattaBymartkethistory",authMiddleware.isLoggedIn,Report_control.sattaBymartkethistory)


router.post("/sattaByBazarTotal",authMiddleware.isLoggedIn,Report_control.sattaByBazarTotal)
router.post("/sattaByBazarhistory",authMiddleware.isLoggedIn,Report_control.sattaByBazarhistory)


module.exports = router;