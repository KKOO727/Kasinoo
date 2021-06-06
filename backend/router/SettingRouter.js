const express = require('express');
const router = express.Router();
const SettingControl = require("../controller/SettingController");
const multer = require('multer');
const config = require('../db');
const BaseControll = require("../controller/basecontroller")
const authMiddleware = require("../middleware/middleware/authMiddleware");

router.post("/setting_procredential_load",authMiddleware.isLoggedIn,SettingControl.get_provider_credential);
// router.post("/setting_procredential_save",SettingControl.save_provider_credential);
router.post("/setting_procredential_update",authMiddleware.isLoggedIn,SettingControl.update_provider_credential);
// router.post("/setting_procredential_delete",SettingControl.delete_provider_credential);
router.post("/getConfig",authMiddleware.isLoggedIn,SettingControl.get_config);
router.post("/saveConfig",authMiddleware.isLoggedIn,SettingControl.saveConfig);

router.post("/updateConfig",authMiddleware.isLoggedIn,SettingControl.updateConfig);
router.post("/deleteCOnfig",authMiddleware.isLoggedIn,SettingControl.deleteCOnfig);

router.post("/getAppConfig",SettingControl.getAppConfig);
router.post("/setAppConfig",authMiddleware.isLoggedIn,SettingControl.appConfigSetting);

router.post("/getGlobalSetting", authMiddleware.isLoggedIn,SettingControl.getGlobalSetting)
router.post("/setGlobalConfig", authMiddleware.isLoggedIn,SettingControl.setGlobalConfig)
router.post("/appConfigSave", authMiddleware.isLoggedIn,multer({dest:config.APPURL}).any(),BaseControll.appupload,SettingControl.appConfigSave)

router.post("/getNotificationtotal",authMiddleware.isLoggedIn,SettingControl.getNotificationtotal);
router.post("/getNotificationdetail",authMiddleware.isLoggedIn,SettingControl.getNotificationdetail);
router.post("/savegetNotification",authMiddleware.isLoggedIn,SettingControl.savegetNotification);
router.post("/updategetNotification",authMiddleware.isLoggedIn,SettingControl.updategetNotification);
router.post("/deletegetNotification",authMiddleware.isLoggedIn,SettingControl.deletegetNotification);
router.post("/resendNotificationdetail",authMiddleware.isLoggedIn,SettingControl.resendNotificationdetail);

router.post("/getTypemanager",authMiddleware.isLoggedIn,SettingControl.getTypemanager);
router.post("/updateTypemanager",authMiddleware.isLoggedIn,SettingControl.updateTypemanager);
router.post("/saveTypemanager",authMiddleware.isLoggedIn,SettingControl.saveTypemanager);
router.post("/deleteTypemanager",authMiddleware.isLoggedIn,SettingControl.deleteTypemanager);


router.post("/getLanguage",authMiddleware.isLoggedIn,SettingControl.getLanguage);
router.post("/updateLanguage",authMiddleware.isLoggedIn,SettingControl.updateLanguage);
router.post("/saveLanguage",authMiddleware.isLoggedIn,SettingControl.saveLanguage);
router.post("/deleteLanguage",authMiddleware.isLoggedIn,SettingControl.deleteLanguage);
router.post("/telegramGetLanuageMenu",SettingControl.telegramGetLanuageMenu);

module.exports = router;
