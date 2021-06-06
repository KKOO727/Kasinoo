const express = require('express');
const router = express.Router();
const GameProviderCon = require("../controller/gameproviders")
const authMiddleware = require("../middleware/middleware/authMiddleware");


router.post("/providerload",authMiddleware.isLoggedIn,GameProviderCon.providerload)
router.post("/providersave",authMiddleware.isLoggedIn,GameProviderCon.providersave)
router.post("/providerupdate",authMiddleware.isLoggedIn,GameProviderCon.providerupdate)
router.post("/providerdelete",authMiddleware.isLoggedIn,GameProviderCon.providerdelete)



module.exports = router;