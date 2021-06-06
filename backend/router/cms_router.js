const express = require('express');
const router = express.Router();
const CmsControll = require("../controller/CMSController")
const multer = require('multer');
const config = require('../db');
const authMiddleware = require("../middleware/middleware/authMiddleware");
const BaseControll = require("../controller/basecontroller")

router.post("/Slider_load",authMiddleware.isLoggedIn,CmsControll.get_sliderimgs);
router.post("/configload",CmsControll.configload);

router.post("/Slider_save",authMiddleware.isLoggedIn,multer({dest:config.BASEURL}).any(),BaseControll.imageupload,CmsControll.save_sldierimgs);

router.post("/Slider_textsave",authMiddleware.isLoggedIn,CmsControll.Slider_textsave);
router.post("/Slider_delete",authMiddleware.isLoggedIn,CmsControll.delete_sldierimgs);
router.post("/Slider_update",authMiddleware.isLoggedIn,CmsControll.update_sldierimgs);

router.post("/logoimg_save",authMiddleware.isLoggedIn,multer({dest:config.BASEURL}).any(),BaseControll.imageupload,CmsControll.save_logos);
router.post("/firstpage_load",authMiddleware.isLoggedIn,CmsControll.firstpage_load);
router.post("/logoimg_load",authMiddleware.isLoggedIn,CmsControll.logoimg_load);
router.post("/trackcode_save",authMiddleware.isLoggedIn,CmsControll.setting_etc);
router.post("/providerImg",authMiddleware.isLoggedIn,CmsControll.setting_etc);

router.post("/menusave",authMiddleware.isLoggedIn,CmsControll.save_menu);
router.post("/menuupdate",authMiddleware.isLoggedIn,CmsControll.update_menu);
router.post("/menudelete",authMiddleware.isLoggedIn,CmsControll.delete_menu);
router.post("/menuload",authMiddleware.isLoggedIn,CmsControll.load_menu); 
router.post("/menuimageupload",authMiddleware.isLoggedIn,multer({dest:config.BASEURL}).any(),BaseControll.imageupload,CmsControll.menuimageupload); 


router.post("/promenu_menuload",authMiddleware.isLoggedIn,CmsControll.roles_load)
router.post("/promenu_menuadd",authMiddleware.isLoggedIn,CmsControll.roles_add)
router.post("/promenu_menudelete",authMiddleware.isLoggedIn,CmsControll.roles_delete)
router.post("/promenu_menuupdate",authMiddleware.isLoggedIn,CmsControll.roles_update)

router.post("/paymentimg_delete",authMiddleware.isLoggedIn,CmsControll.paymentimg_delete);
router.post("/providerimg_delete",authMiddleware.isLoggedIn,CmsControll.providerimg_delete);
router.post("/upload_provider_paymentimg",authMiddleware.isLoggedIn,multer({dest:config.BASEURL}).any(),BaseControll.imageupload,CmsControll.upload_provider_paymentimg);

// router.post("/faviconimg_save",multer({dest:config.BASEURL}).any(),CmsControll.save_faviconimg);

router.post("/cmsload",authMiddleware.isLoggedIn,CmsControll.cmsload);

module.exports = router;