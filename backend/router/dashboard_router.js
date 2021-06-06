const express = require('express');
const router = express.Router();
const DashboardControl = require("../controller/dashboardController")
const authMiddleware = require("../middleware/middleware/authMiddleware");
const configMiddleware = require("../middleware/middleware/configMiddleware");

router.post("/getUserLoad",authMiddleware.isLoggedIn,configMiddleware.homeconfig,DashboardControl.getUserLoad);

module.exports = router;