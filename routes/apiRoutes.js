const { Router } = require("express");
const router = Router()
const { testCase, submission, challengeDiscussion, challenge, contest, signup, addBookmark, getChallenge, contestChallenge, contestModerator, updateChallenge, deleteBookmark, challengeLeaderboard, testCaseUpdate, testCaseDelete, contestUpdate, deleteChallenge, deleteContestModerator, deleteContest,allChallenge,specChallenge,specContest,allContest,getAllBookmarks,getAllSubmissons,getChallengeSubmission} = require("../controllers/apiController");
const authenticate = require('../middlewares/authenticate');
const { check } = require("express-validator")
const path = require('path');


//----------------------------------@ADMIN ROUTES-----------------------------------
// -------------------------------------------------------------------------------------------------------



//challenge creation by admin
router.post("/admin/challenge", 
[
    check('func_name')
        .isLength({ min: 1 }).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores'),
    check('name')
        .isLength({min:1}).trim()
], 
challenge);

//adding testcase for admin challnge
router.post("/admin/testcase/:challenge",
    check('result')
        .isLength({ min: 1 }).trim()
        .withMessage('Result cannot be empty.'),
    check('input')
        .isLength({ min: 1 }).trim()
        .withMessage('Input cannot be empty'), testCase);

//updating challnge
router.patch("/:challenge/adminupdate", updateChallenge)

//updating test case
router.patch("/admin/testcase/update/:challenge/:testCaseId", testCaseUpdate);

//deleting test case
router.delete("/admin/testcase/delete/:challenge/:testCaseId", testCaseDelete);

//deleting challenge
router.delete("/admin/delete/:challenge", deleteChallenge);

//*---------------------------------------------------------------------------------------*


//-------------------------------------@USER ROUTES-----------------------------------------

//@CHALLENGE creation updation and deletion
//creatiom
router.post("/user/challenge/:token", [
    check('func_name')
        .isLength({ min: 1 }).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores'),
        check('name')
        .isLength({min:1}).trim()
    , authenticate], challenge);
//updation
router.patch("/:challenge/update/:token", [
    check('func_name')
        .isLength({ min: 1 }).trim()
        .withMessage('function name cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i')
        .withMessage('Function name must be Alphabetical, and can contain underscores'), authenticate], updateChallenge);
//deletion
router.delete("/user/delete/:challenge/:token", authenticate, deleteChallenge);

//@TESTCASE
//creation
router.post("/testcase/:challenge/:token", [
    check('result')
        .isLength({ min: 1 }).trim()
        .withMessage('Result cannot be empty.'),
    check('input')
        .isLength({ min: 1 }).trim()
        .withMessage('Input cannot be empty'),
    authenticate], testCase);
//updation
router.patch("/testcase/update/:challenge/:testCaseId/:token", authenticate, testCaseUpdate);
//deletion
router.delete("/testcase/delete/:challenge/:testCaseId/:token", authenticate, testCaseDelete);

//@DISCUSSION
router.post('/:challenge/discussion/:token', authenticate, challengeDiscussion);

//@submitting code
router.post("/submit/:challenge/:token", [
    check('language')
        .isLength({ min: 1 }).trim()
        .withMessage('Language name cannot be empty.'),
    check('code')
        .isLength({ min: 1 }).trim()
        .withMessage('Code cannot be empty'), authenticate], submission);

//@leaderboard
router.get("/leaderboard/:challenge/:token",authenticate,challengeLeaderboard);

//@bookmark add delete
router.post("/:challenge/bookmark/add/:token", authenticate, addBookmark);
router.delete("/:challenge/bookmark/delete/:token", authenticate, deleteBookmark)
//--------------------------------------------------------------------------

//@CONTEST ROUTE

//Creating
router.post("/contest/new/:token", [
    check('name')
        .isLength({ min: 1 }).trim()
        .withMessage('name cannot be empty.'),
    check('startTime')
        .isLength({ min: 1 }).trim()
        .withMessage('Starttime cannot be empty'),
    check('endTime')
        .isLength({ min: 1 }).trim()
        .withMessage('EndTime cannot be empty'),
    check('scoring')
        .isLength({ min: 1 }).trim()
        .withMessage('scoring cannot be empty'),
    check('description')
        .isLength({ min: 1 }).trim()
        .withMessage('Description cannot be empty'),
    check('rules')
        .isLength({ min: 1 }).trim()
        .withMessage('Rules cannot be empty'),
    authenticate], contest);

//Adding challenge
router.get("/contest/available/challenge/:token", authenticate, getChallenge);
router.post("/contest/:contest/addchallenge/:challenge/:token", authenticate, contestChallenge);

//Adding deleting moderator
router.post("/contest/:contest/addmoderator/:username/:token", authenticate, contestModerator);
router.delete("/contest/:contest/deletemoderator/:username/:token", authenticate, deleteContestModerator);

//Participant signup
router.post("/contest/:contest/signup/:token", authenticate, signup);

//Updating Contest
router.patch("/contest/:contest/update/:token", authenticate, contestUpdate);

//deleting contest
router.delete("/contest/delete/:contest/:token", authenticate, deleteContest);


//GET
router.get("/dashboard/challenges/:token", authenticate,allChallenge);
router.get("/dashboard/contests/:token",  authenticate,allContest);
router.get("/dashboard/challenges/:challengename/:token", authenticate ,specChallenge);
router.get("/dashboard/contests/:contestname/:token", authenticate ,specContest);
router.get("/user/bookmarks/:token", authenticate, getAllBookmarks);

//@ get submissions 
router.get("/user/submission/:token", authenticate, getAllSubmissons);

//@ get Specific challenge submission
router.get("/:challenge/submission/:token", authenticate, getChallengeSubmission);


router.get("/",function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
})

module.exports = router;
