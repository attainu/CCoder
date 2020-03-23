const { Router } = require("express");

const router = Router();

const authenticate = require('../middlewares/authenticate');

const { userRegister, userLogin, singleUser, userLogout } = require('../controllers/userController')

router.post('/user/register', userRegister);

router.post('/user/login', userLogin);

router.get('/user/me/:token', authenticate, singleUser);

router.delete('/user/logout/:token', authenticate, userLogout);

module.exports = router;