const { Router } = require("express");
const router = Router()
const {testCase,submission,challengeDiscussion, challenge,contest } = require("../controllers/apiController");
const authenticate = require('../middlewares/authenticate');


//challenge creation by admin
router.post("/admin/challenge", challenge);
router.post("/testcase/:challenge", testCase);
router.post("/submit/:challenge/:token",authenticate, submission);
router.post('/problem/discussion/:token', authenticate, challengeDiscussion);
router.post("/user/challenge/:token", authenticate , challenge);




module.exports = router;
