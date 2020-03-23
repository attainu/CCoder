const { Router } = require("express");
const router = Router()
const {adminChallenge,testCase,submission,challengeDiscussion } = require("../controllers/apiController");
const authenticate = require('../middlewares/authenticate');


//challenge creation by admin
router.post("/admin/challenge", adminChallenge)
router.post("/testcase/:challenge", testCase)
router.post("/submit/:challenge", submission)
router.post('/problem/discussion/:token', authenticate, challengeDiscussion);





module.exports = router;
