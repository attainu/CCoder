const { Router } = require("express");
const router = Router()
const {testCase,submission,challengeDiscussion, challenge,contest,signup } = require("../controllers/apiController");
const authenticate = require('../middlewares/authenticate');


//challenge creation by admin
router.post("/admin/challenge", challenge);
router.post("/testcase/:challenge", testCase);
router.post("/submit/:challenge/:token",authenticate, submission);
router.post('/:challenge/discussion/:token', authenticate, challengeDiscussion);
router.post("/user/challenge/:token", authenticate , challenge);
router.post("/contest/new/:token",authenticate, contest);
router.post("/:contest/signup/:token",authenticate, signup);


module.exports = router;
