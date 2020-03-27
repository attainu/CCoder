const { Router } = require("express");

const router = Router();

const authenticate = require('../middlewares/authenticate');

const { userRegister, userLogin, singleUser, userLogout, userProfileUpdate, userChangePassword } = require('../controllers/userController')

router.post('/user/register', userRegister);

router.post('/user/login', userLogin);

router.get('/user/me/:token', authenticate, singleUser);

router.delete('/user/logout/:token', authenticate, userLogout);

router.patch('/user/userprofile/:token', authenticate, userProfileUpdate);

router.patch('/user/changepassword/:token', authenticate, userChangePassword);

module.exports = router;