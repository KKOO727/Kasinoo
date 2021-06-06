const express = require('express');
const router = express.Router();
const promotionsControl = require('../controller/promotionsController');
const authMiddleware = require("../middleware/middleware/authMiddleware");

//players
router.post("/bonusMenuloadFromMail",authMiddleware.isLoggedIn,promotionsControl.bonus_menuloads);
router.post('/ClaimRequest',authMiddleware.isLoggedIn,promotionsControl.Claim_request);

router.post('/getBonusTotal',authMiddleware.isLoggedIn,promotionsControl.getBonusTotal);
router.post('/CreditBonus',authMiddleware.isLoggedIn,promotionsControl.CreditBonus);

router.post("/GetBonusConfig",authMiddleware.isLoggedIn,promotionsControl.BonusConfig)

//cms
router.post('/bonusMenuload',authMiddleware.isLoggedIn,promotionsControl.bonus_menuload);
router.post('/bonus_menuupdate',authMiddleware.isLoggedIn,promotionsControl.bonus_menuupdate);
router.post("/bonusmenu_delete",authMiddleware.isLoggedIn,promotionsControl.bonusmenu_delete);
router.post('/bonusmenu_save',authMiddleware.isLoggedIn,promotionsControl.bonusmenu_save);
router.post('/getBonusitems',authMiddleware.isLoggedIn,promotionsControl.getBonusitems);
router.post('/getBonusHistory',authMiddleware.isLoggedIn,promotionsControl.getBonusHistory);



module.exports = router;