const express = require('express');
const router = express.Router();

const DashboardRouter = require("./dashboard_router");
const PlayerRouter = require("./player_router");
const UsersRouter = require("./users_router");
const PermissionRouter = require("./permission_router");
const FirstpageRouter = require("./firstpage_router");
const SettingRouter = require("./SettingRouter");
const CmsRouter = require("./cms_router");
const provider_Router = require("./provider_router")
const Reports_Router = require("./report_router");
const gameProvider_Router = require("./gameprovider_router");
const exchg_Router = require("./exchg_Router")
const satta_Router = require("./matka_Router")
const sport_Router = require("./sport_Router");
const paymentGateWay = require("./paymentGateWay");
const profile_Router = require("./profile_router");

const Tools = require("../controller/ToolsController");
// const promotionsControl  = require("../controller/promotionsController");
const promotionsRouter = require("./promotionRouter")

router.use("/dashboard",DashboardRouter);
router.use("/players",PlayerRouter);
router.use("/users",UsersRouter);
router.use("/permission",PermissionRouter);
router.use("/firstpage", FirstpageRouter);
router.use("/settings", SettingRouter)
router.use("/cms",CmsRouter);
router.use("/reports",Reports_Router);
router.use("/providermanager",provider_Router);
router.use("/gameprovider",gameProvider_Router);
router.use("/exchg",exchg_Router);
router.use("/satta",satta_Router);
router.use("/sport",sport_Router);

router.use("/promotions",promotionsRouter);
router.use("/profile",profile_Router);

router.use("/Tools",Tools);
router.use("/paymentGateWay",paymentGateWay);

module.exports = router;