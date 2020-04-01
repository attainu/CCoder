const { Router } = require("express");
const router = Router()
const {testCase,submission,challengeDiscussion, challenge,contest,signup,addBookmark, getChallenge, contestChallenge,contestModerator,updateChallenge,deleteBookmark,challengeLeaderboard, testCaseUpdate, testCaseDelete, contestUpdate, deleteChallenge, deleteContestModerator, deleteContest} = require("../controllers/apiController");
const authenticate = require('../middlewares/authenticate');
const { check} = require("express-validator")


//challenge creation by admin
router.post("/admin/challenge",[
    check('func_name')
        .isLength({ min: 1}).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores')
], challenge);

router.post("/testcase/:challenge/:token",authenticate,testCase);

router.post("/admin/testcase/:challenge", testCase);

router.patch("/testcase/update/:challenge/:testCaseId/:token", authenticate, testCaseUpdate);

router.patch("/admin/testcase/update/:challenge/:testCaseId", testCaseUpdate);

router.delete("/testcase/delete/:challenge/:testCaseId/:token", authenticate, testCaseDelete);

router.delete("/admin/testcase/delete/:challenge/:testCaseId", testCaseDelete);

router.post("/submit/:challenge/:token",authenticate, submission);

router.post('/:challenge/discussion/:token', authenticate, challengeDiscussion);

router.post("/user/challenge/:token",[
    check('func_name')
        .isLength({ min: 1}).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores'), authenticate] , challenge);

router.post("/contest/new/:token",authenticate, contest);

router.post("/contest/:contest/signup/:token",authenticate, signup);

router.post("/contest/:contest/:challenge/:token", authenticate, contestChallenge);

router.post("/contest/:contest/addmoderator/:username/:token",authenticate, contestModerator);

router.get("/:challenge/leaderboard/:token", authenticate, challengeLeaderboard);

router.post("/:challenge/bookmark/add/:token",authenticate, addBookmark);

router.patch("/:challenge/update/:token",[
    check('func_name')
        .isLength({ min: 1}).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores'), authenticate] , updateChallenge);

router.get("/contest/:token", authenticate, getChallenge);

router.delete("/:challenge/bookmark/delete/:token",authenticate,deleteBookmark)

router.patch("/:challenge/adminupdate", updateChallenge)

router.patch("/contest/:contest/update/:token", authenticate, contestUpdate);

router.delete("/contest/delete/:contest/:token", authenticate, deleteContest);

router.delete("/user/delete/:challenge/:token", authenticate, deleteChallenge);

router.delete("/admin/delete/:challenge", deleteChallenge);

router.delete("/contest/:contest/deletemoderator/:username/:token",authenticate,deleteContestModerator);

module.exports = router;
