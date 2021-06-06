const express = require('express');
const router = express.Router();
const UserCon = require("../controller/userscontroller")
const authMiddleware = require("../middleware/middleware/authMiddleware");
const configMiddleware = require("../middleware/middleware/configMiddleware")


// player login
router.post("/login",configMiddleware.homeconfig,UserCon.player_login);
router.post("/LoginbyId",configMiddleware.homeconfig,UserCon.LoginbyId);

// player register
router.post("/register",configMiddleware.homeconfig,UserCon.playerRegister);
// telegram register
router.post("/telegramregister",configMiddleware.homeconfig,UserCon.telegramregister);

// admin login
router.post("/adminlogin",configMiddleware.homeconfig,UserCon.admin_login)
// logout
router.post("/logout", authMiddleware.logoutUser,(req, res, next)=>{ res.json({status : true}); });
// player changedpasswrod 
router.post("/adminchangepassword",authMiddleware.isLoggedIn,UserCon.admin_changepassword)
// cms player user creating action
router.post("/adminplayerregister",authMiddleware.isLoggedIn,configMiddleware.homeconfig,UserCon.PlayerRegisterByadmin)

// cms sidebar load
router.post("/adminsidebar_load",authMiddleware.isLoggedIn,UserCon.adminsidebar_load)
//cms user getting items list
router.post("/getlist",authMiddleware.isLoggedIn,UserCon.get_users_load)
// cms users actions start
router.post("/users_depositaction",authMiddleware.isLoggedIn,configMiddleware.paymentconfig,UserCon.users_depositaction)
router.post("/users_withdrawlaction",authMiddleware.isLoggedIn,configMiddleware.paymentconfig,UserCon.users_withdrawlaction)
router.post("/adminresetpassword",authMiddleware.isLoggedIn,UserCon.adminresetpassword)
router.post("/adminmultiusersblock",authMiddleware.isLoggedIn,UserCon.adminmultiusersblock)
router.post("/adminmultiusersdelete",authMiddleware.isLoggedIn,UserCon.adminmultiusersdelete)
router.post("/adminusers_again",authMiddleware.isLoggedIn,UserCon.adminuserupdateByuser)
router.post("/adminregister",authMiddleware.isLoggedIn,configMiddleware.homeconfig,UserCon.adminRegisterByuser)
// cms user actions end

// cms users rolemanager action start
router.post("/role_menuload",authMiddleware.isLoggedIn,UserCon.roles_load)
router.post("/role_menusave",authMiddleware.isLoggedIn,UserCon.roles_menusave)
router.post("/role_menuupdate",authMiddleware.isLoggedIn,UserCon.roles_menuupdate)
router.post("/role_menudelete",authMiddleware.isLoggedIn,UserCon.roles_menudelete)
// cms users rolemanager action send

router.post("/blockgetlist",authMiddleware.isLoggedIn,UserCon.get_users_load_block)
router.post("/save_themeinfor",authMiddleware.isLoggedIn,UserCon.save_adminthmestyle)




router.post("/emailverify_receive",UserCon.emailverify_receive_action)

router.post("/resend_email",UserCon.resend_email_action)

router.post("/forgotpassword_send",UserCon.forgotpassword_send_action)

router.post("/forgotpassword_receive",UserCon.forgotpassword_receive_action)
router.post("/forgotpassword_set",UserCon.forgotpassword_set_action)

// router.post("/changepassword",UserCon.user_changepassword)

router.post("/againusersave",UserCon.userdetail_save)
router.post("/role_menuload_permission",UserCon.get_rolesfrom_per)
router.put("/authdecrypt",UserCon.decrypt_auth);

router.post("/get_themeinfor",authMiddleware.isLoggedIn,UserCon.get_adminthemestyle)
router.post("/get_userinfor",authMiddleware.isLoggedIn,UserCon.get_user_detail);
router.post("/playerThemeGet",UserCon.playerThemeGet);
router.post("/playerThemeSave",UserCon.playerThemeSave);


router.post("/telegramGetUserinfor",UserCon.telegramGetUserinfor);
router.post("/telegramUpdateAdress",UserCon.telegramUpdateAdress);
router.post("/telegramUpdateLanguage",authMiddleware.isLoggedIn,UserCon.telegramUpdateLanguage);
router.post("/telegramCreatePassword",authMiddleware.isLoggedIn,UserCon.telegramCreatePassword);
router.post("/telegramGetSupportChat",authMiddleware.isLoggedIn,UserCon.telegramGetSupportChat);

router.post("/get_user_auth",authMiddleware.isLoggedInMobile);

router.get("/getip",authMiddleware.isLoggedIn,UserCon.getip);

router.post("/getSessionsatta",UserCon.getSessionSatta);
router.post("/getSessionsports",UserCon.getSessionsports);

module.exports = router;