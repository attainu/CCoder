const { Router } = require("express");
const passport = require("passport");
const router = Router();

const authenticate = require('../middlewares/authenticate');

const { userRegister, userLogin, singleUser, userLogout, userProfileUpdate, userChangePassword, fetchUserFromGoogle, fetchUserFromGithub } = require('../controllers/userController')

router.post('/user/register', userRegister);

router.post('/user/login', userLogin);

router.get('/user/me/:token', authenticate, singleUser);

router.delete('/user/logout/:token', authenticate, userLogout);

router.patch('/user/userprofile/:token', authenticate, userProfileUpdate);

router.patch('/user/changepassword/:token', authenticate, userChangePassword);

router.get("/google", passport.authenticate("google", { session: false,scope: ["profile", "email"]}));
  
router.get("/google/redirect", passport.authenticate("google", {session: false, failureRedirect: "http://localhost:1234/#login"}),fetchUserFromGoogle);

router.get("/github", passport.authenticate("github", { session: false,scope: [ 'user:email' ]}));
  
router.get("/github/callback", passport.authenticate("github", {session: false, failureRedirect: "http://localhost:1234/github"}),fetchUserFromGithub);

module.exports = router;