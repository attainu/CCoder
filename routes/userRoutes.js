const { Router } = require("express");

const router = Router();

const authenticate = require('../middlewares/authenticate');

<<<<<<< HEAD
const { userRegister, userLogin, singleUser, userLogout } = require('../controllers/userController')
=======
const { userRegister, userLogin, singleUser, userLogout, challengeDiscussion } = require('../controllers/userController')
>>>>>>> 0f552d170dd8e1ab10f1fe86f451ec1978ee6fee

router.post('/user/register', userRegister);

router.post('/user/login', userLogin);

router.get('/user/me/:token', authenticate, singleUser);

router.delete('/user/logout/:token', authenticate, userLogout);

<<<<<<< HEAD
=======
router.post('/problem/discussion/:token', authenticate, challengeDiscussion);

>>>>>>> 0f552d170dd8e1ab10f1fe86f451ec1978ee6fee
module.exports = router;