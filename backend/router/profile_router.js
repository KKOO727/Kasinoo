const express = require('express');
const router = express.Router();
const ProfileControl = require('../controller/profilecontroller');
const multer = require('multer');
const config = require('../db');
const authMiddleware = require("../middleware/middleware/authMiddleware");
const BaseControll = require("../controller/basecontroller")



router.post('/set_document',authMiddleware.isLoggedIn,multer({dest:config.BASEURL}).any(),ProfileControl.set_document);
router.post("/get_document",authMiddleware.isLoggedIn,ProfileControl.get_document);
router.post("/get_notification",authMiddleware.isLoggedIn,ProfileControl.get_notification);
router.post("/set_notification",authMiddleware.isLoggedIn,ProfileControl.set_notification);

router.post('/profilesave',authMiddleware.isLoggedIn,multer({dest:config.BASEURL}).any(),BaseControll.imageupload,ProfileControl.profilesave);
router.post('/avatarUpload',authMiddleware.isLoggedIn,multer({dest:config.BASEURL}).any(),BaseControll.imageupload,ProfileControl.avatarUpload);

module.exports = router;