const { Router } = require("express");
const router = Router()
const {testCase,submission,challengeDiscussion, challenge,contest,signup,addBookmark, getChallenge, contestChallenge,contestModerator,updateUserChallenge,deleteBookmark,challengeLeaderboard} = require("../controllers/apiController");
const authenticate = require('../middlewares/authenticate');


//challenge creation by admin
router.post("/admin/challenge", challenge);
router.post("/testcase/:challenge", testCase);
router.post("/submit/:challenge/:token",authenticate, submission);
router.post('/:challenge/discussion/:token', authenticate, challengeDiscussion);
router.post("/user/challenge/:token", authenticate , challenge);
router.post("/contest/new/:token",authenticate, contest);
router.post("/contest/:contest/signup/:token",authenticate, signup);
router.post("/contest/:contest/:challenge/:token", authenticate, contestChallenge);
router.post("/contest/:contest/addmoderator/:username/:token",authenticate, contestModerator);
router.post("/:challenge/leaderboard/:token", authenticate, challengeLeaderboard);

router.post("/:challenge/bookmark/add/:token",authenticate, addBookmark);

router.patch("/:challenge/update/:token", authenticate , updateUserChallenge);

router.get("/contest/:token", authenticate, getChallenge);

router.delete("/:challenge/bookmark/delete/:token",authenticate,deleteBookmark)

module.exports = router;
