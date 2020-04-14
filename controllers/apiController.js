const Testcase = require("../models/Testcase");
const Discussion = require('../models/Discussion');
const Challenge = require("../models/Challenge");
const Submission = require('../models/Submission');
const User = require('../models/User');
const Contest = require('../models/Contest');
const { validationResult } = require("express-validator")



const { c, cpp, node, python, java } = require('compile-run');


module.exports = {

        //@access: private;
    //@desc: Creating user defined challenge
    async challenge(req, res) {
        
        try {
             const errors = validationResult(req)
         if (!errors.isEmpty()) {
             throw new Error('Validation error')
         }
            const funct_node = (name, no_of_args) => {
                const func = `
        # Complete the ${name} function below.
        #You dont need to provide value in arguement it will be given by compiler
        function ${name}('use ${no_of_args} args here'){
            return
        }`
                return func
            }
            const funct_py = (name, no_of_args) => {
                const func =
`#!/bin/python3
import math
import os
import random
import re
import sys
# Complete the ${name} function below.
#You dont need to provide value in arguement it will be given by compiler
def ${name}('use ${no_of_args} args here'):
    return
`
    return func
            }
            const funct_c = (no_of_args, input, output) => {
                const func = `#include<stdio.h>
/**
* Complete this method
* I will be sending ${no_of_args} input
* sample ${input} so use symbol in scanf according to the sample.
* Sample output should be like this ${output} 
*/
void main()
{    
  
    scanf("");
    printf("",result);
    return 0;
}`
                return func
            }
            const funct_cpp = (no_of_args, input, output) => {
                const func = `#include <iostream>
using namespace std;
// Complete this method
// I will be sending ${no_of_args} arguements as input
// sample input :${input}
// Sample output: ${output} 
int main()
{
    int a, b;
    // All the required Input Should be taken in single Statement
    cin >> b >> a;
    sumOfTwoNumbers = firstNumber + secondNumber;
    // Only One Print Statement Should be used
    cout << ;     
    return 0;
}`
                return func
            }
            const funct_java = (no_of_args, input, output) => {
                const func = `import java.util.*;
public class Solution {
    // Complete this method
    // I will be sending ${no_of_args} input so use ${no_of_args} inputs
    // sample input: ${input} .
    // Sample output : ${output} 
    public static void main(String[] args) {
      Scanner sc=new Scanner(System.in);
      
      System.out.println();
    }
}`
                return func
            }
            const user = req.user
            const { name, description, question, input, output, editorial, maxScore, func_name, no_of_args,constraints } = req.body;
            const func_py = funct_py(func_name, no_of_args)
            const func_node = funct_node(func_name, no_of_args)
            const func_java = funct_java(no_of_args, input, output)
            const func_c = funct_c(no_of_args, input, output)
            const func_cpp = funct_cpp(no_of_args, input, output)
            if (user === undefined) {
                const challenge = await Challenge.create({ name, description, question, input, output, editorial,constraints, maxScore, func_name, no_of_args, func_py, func_node, func_java, func_c, func_cpp });

                res.status(201).json({ status: 201, challenge: challenge });
            }
            else {
                const challenge = await Challenge.create({ name, description, question, input, output, editorial,constraints, maxScore, createdBy: user._id, func_name, no_of_args, func_py, func_node, func_java, func_c, func_cpp });
                user.challenge.push(challenge._id)
                await user.save()
                res.status(201).json({ status: 201, challenge: challenge, createdBy: user._id });
            }


        } catch (err) {
            //console.log(err)
            if (err.message === 'MongoError') {
                res.status(409).send("Problem Name Should be Different");
            }
            else if (err.code == 11000) {
                res.status(422).send("Problem Name Should be Different")
            }
            else if (err.message=='Validation error') {
                res.status(422).send(err.message)
            }
            else {
                console.log(err)
                res.status(500).send('Server Error')
            }
        }
    },


    //@access:private
    //@desc : For Adding Test case for challenge
    async testCase(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }
        try {
            const user = req.user
            let { result, input } = req.body
            const challengename = req.params.challenge
            if (user === undefined) {

                let challenge = await Challenge.find({ name: challengename, createdBy: null })
                if (challenge.length == 0) {
                    throw new Error('Invalid Challenge')
                }
                let func = challenge[0].func_name
                input = input.split(";")
                let newinput = [];
                for (i = 0; i < input.length; i++) {
                    if (isNaN(input[i]) == false) {
                        newinput.push(parseInt(input[i]))
                    }
                    else if(input[i].includes('[')||input[i].includes('{')){
                        newinput.push(input[i])
                    }
                    else if (typeof (input[i]) == 'string') {
                        newinput.push(`"${input[i]}"`)
                    }
                    else {
                        newinput.push(input[i])
                    }
                }
                let testCase = 0
                console.log(newinput)
                if (typeof (input) == 'string') {
                    testCase = await Testcase.create({ rawinput: `${newinput}`, result, input: `${func}(${newinput})`, challenge: challenge[0]._id });
                }
                else {
                    testCase = await Testcase.create({ rawinput: `${newinput}`, result, input: `${func}(${newinput})`, challenge: challenge[0]._id });

                }

                challenge[0].testCases.push(testCase)
                await challenge[0].save()
                res.status(201).json({ statuscode: 201, testCase: testCase })

            } else {
                let challenge = await Challenge.find({ name: challengename, createdBy: user._id })
                if (challenge.length == 0) {
                    throw new Error('Invalid Challenge')
                }
                let func = challenge[0].func_name
                input = input.split(";")
                let newinput = [];
                console.log(input.length)
                for (i = 0; i < input.length; i++) {
                    if (isNaN(input[i]) == false) {
                        newinput.push(parseInt(input[i]))
                    }
                    else if(input[i].includes('[')||input[i].includes('{')){
                        newinput.push(input[i])
                    }
                    else if (typeof (input[i]) == 'string') {
                        newinput.push(`"${input[i]}"`)
                    }
                    else {
                        newinput.push(input[i])
                    }
                }
                let testCase = 0
                if (typeof (input) == 'string') {
                    testCase = await Testcase.create({ rawinput: `${newinput}`, result, input: `${func}(${newinput})`, challenge: challenge[0]._id, user: user._id });
                }
                else {
                    testCase = await Testcase.create({ rawinput: `${newinput}`, result, input: `${func}(${newinput})`, challenge: challenge[0]._id, user: user._id });
                }

                challenge[0].testCases.push(testCase)
                await challenge[0].save()
                res.status(201).json({ statuscode: 201, testCase: testCase })
            }

        }
        catch (err) {
            console.log(err)
            if (err.message == 'Invalid Challenge') {
                res.status(404).send(err.message)
            }
            else if (err.message=='Validation error') {
                res.status(422).send(err.message)
            }
            else {
                res.status(500).send('Server Error');
            }
        }
    },


    //@desc:For Compiling and submitting code for a challenge
    //@access:PRIVATE
    async submission(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }
        try {
            const user = req.user;
            const { language, code } = req.body
            console.log(language)
            const challengename = req.params.challenge
            let challenge = await Challenge.find({ name: challengename }).populate('testCases').populate('contest')
            if (challenge.length == 0) {
                throw new Error('Invalid Challenge')
            }

            if(challenge[0].contest){
                if(!challenge[0].contest.signups.includes(user._id)){
                    throw new Error('You are not signed Up')
                }
                console.log(new Date(String(challenge[0].contest.startTime)))
                console.log(Date())
                if(new Date(String(challenge[0].contest.startTime))>new Date()){
                    throw new Error('Contest Not started')
                }
                if(new Date(String(challenge[0].contest.endTime))<new Date()){
                    throw new Error('Contest Has been ended')
                }
            }
            const maxScore = challenge[0].maxScore
            let score = 0;
            let scorepertc = maxScore / challenge[0].testCases.length


            if (language == 'python') {
                for (i = 0; i < challenge[0].testCases.length; i++) {
                    const input = '\n' + challenge[0].testCases[i].input
                    const newcode = code + input
                    const result = await python.runSource(newcode);
                    result.stdout = result.stdout.slice(0, -1)
                    if (result.stderr.length != 0) console.log(result.stderr)
                    else if (result.stdout == challenge[0].testCases[i].result) {
                        score = score + scorepertc
                    }
                    else {
                        score = score
                    }
                }
                const submission = await Submission.create({ code: code, score: score, challenge: challenge[0]._id, user: user._id, language: language });
                challenge[0].submissions.push(submission)
                await challenge[0].save()
                user.submissions.push(submission);
                await user.save()
                res.json({ score: score })
            }
            else if (language == 'node') {
                for (i = 0; i < challenge[0].testCases.length; i++) {
                    const input = '\n' + challenge[0].testCases[i].input
                    const newcode = code + input
                    const result = await node.runSource(newcode);
                    result.stdout = result.stdout.slice(0, -1)
                    if (result.stderr.length != 0) console.log(result.stderr)
                    else if (result.stdout == challenge[0].testCases[i].result) {
                        score = score + scorepertc
                    }
                    else {
                        score = score
                    }
                }

                const submission = await Submission.create({ code: code, score: score, challenge: challenge[0]._id, user: user._id, language: language });
                challenge[0].submissions.push(submission)
                await challenge[0].save()
                user.submissions.push(submission);
                await user.save()
                res.json({ score: score })
            }
            else if (language == 'c') {
                for (i = 0; i < challenge[0].testCases.length; i++) {
                    let input = challenge[0].testCases[i].rawinput
                    input = input.replace(',', '\n')
                    const result = await c.runSource(code, { stdin: input });
                    if (result.stderr.length != 0) console.log('yes' + result.stderr)
                    else if (result.stdout == challenge[0].testCases[i].result) {
                        score = score + scorepertc
                    }
                    else {
                        score = score
                    }
                }
                const submission = await Submission.create({ code: code, score: score, challenge: challenge[0]._id, user: user._id, language: language });
                challenge[0].submissions.push(submission)
                await challenge[0].save()
                user.submissions.push(submission);
                await user.save()
                res.json({ score: score })
            }
            else if (language == 'c++') {
                for (i = 0; i < challenge[0].testCases.length; i++) {
                    let input = challenge[0].testCases[i].rawinput
                    input = input.replace(',', '\n')
                    const result = await cpp.runSource(code, { stdin: input ,timeout:13000,compileTimeout:13000});
                    console.log(result)
                    if (result.stderr.length != 0) console.log(result.stderr)
                    else if (result.stdout == challenge[0].testCases[i].result) {
                        score = score + scorepertc
                    }
                    else {
                        score = score
                    }
                }
                const submission = await Submission.create({ code: code, score: score, challenge: challenge[0]._id, user: user._id, language: language });
                challenge[0].submissions.push(submission)
                await challenge[0].save()
                user.submissions.push(submission);
                await user.save()
                res.json({ score: score })
            }
            else if (language == 'java') {
                for (i = 0; i < challenge[0].testCases.length; i++) {
                    let input = challenge[0].testCases[i].rawinput
                    input = input.replace(',', '\n')
                    const result = await java.runSource(code, { stdin: input ,timeout:13000,compileTimeout:13000});
                    console.log(result)
                    result.stdout = result.stdout.slice(0, -1)
                    if (result.stdout == challenge[0].testCases[i].result) {
                        score = score + scorepertc
                    }
                    else {
                        score = score
                    }
                }
                const submission = await Submission.create({ code: code, score: score, challenge: challenge[0]._id, user: user._id, language: language });
                challenge[0].submissions.push(submission)
                await challenge[0].save()
                user.submissions.push(submission);
                await user.save()
                res.json({ score: score })
            }

        }
        catch (err) {
            console.log(err)
            if (err.message == 'Invalid Challenge') {
                res.status(404).send(err.message)
            }
            else if (err.message=='Validation error') {
                res.status(422).send(err.message)
            }
            else if(err.message=='You are not signed Up'){
                res.status(403).send(err.message)
            }
            else if(err.message=='Contest Not started'){
                res.status(403).send(err.message)
            }
            else if(err.message=='Contest Has been ended'){
                res.status(403).send(err.message)
            }
            
            else{
            res.status(500).send(err)
            }
        }
    },

    //@desc:For Replying on the discussion Section of a challenge
    //@access:PRIVATE    
    async challengeDiscussion(req, res) {
        try {
            const challengename = req.params.challenge
            let challenge = await Challenge.find({ name: challengename });
            if (challenge.length == 0) {
                throw new Error('Invalid Challenge')
            }
            const user = req.user;
            const { text } = req.body;
            if (!text) return res.status(400).json({ statusCode: 400, message: 'Bad Request' });

            const createDiscussion = await Discussion.create({ text, user: user._id, challenge: challenge[0]._id });

            user.discussions.push(createDiscussion._id);
            await user.save()
            challenge[0].discussions.push(createDiscussion._id)
            await challenge[0].save()

            res.status(201).json({ statusCode: 201, createDiscussion });
        } catch (err) {
            if (err.message == 'Invalid Challenge') {
                res.status(404).send(err.message)
            }
            else {
                res.status(500).send('Server Error');
            }
        }
    },

    //@desc:FOR ORGANIZING A CONTEST
    //@access:PRIVATE
    async contest(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }
        try {
            const details = req.body
            const user = req.user;
            details.createdBy = user._id
            const contest = await Contest.create(details)
            user.moderator.push(contest)
            await user.save()
            res.status(201).json({ contest: contest })

        }
        catch (err) {
            console.log(err)
            if (err.code == 11000) {
                res.status(409).send("duplicate value")
            }
            else if(err.name=='ValidationError'){
                res.status(409).send('validation error')
            }
            else {
                res.status(500).send('Server Error')

            }
        }
    },

    //@desc:For praticipating in The contest
    //@access:Private
    async signup(req, res) {
        try {
            const user = req.user
            const contestname = req.params.contest
            const contest = await Contest.find({ name: contestname })
            if (contest[0].signups.includes(user._id.toString())) {
                throw new Error('Already Signed Up')
            }
            await contest[0].signups.push(user._id)
            await contest[0].save()
            await user.contests.push(contest[0]);
            await user.save()
            res.status(201).json({ message:"User Signed Up Succesfully"})
        }
        catch (err) {
            if (err.message == 'Already Signed Up') {
                res.status(409).json({error:"Already Signed UP"})
            }
            else {
                res.status(500).json({error:"Server Error"})
            }
        }

    },

    //@desc:For Displaying All the challenge available for a user.
    //@access:Private
    async getChallenge(req, res) {
        try {
            const user = req.user
            const challenge = await
                Challenge.find({
                    $and: [
                        {
                            $or: [
                                { 'createdBy': user._id },
                                { 'createdBy': null }
                            ]
                        },
                        { $or: [{ 'contest': null }] }
                    ]
                }).select('name');
            if (String(challenge[0].createdBy) == String(user._id)) {
                res.send(challenge)
            } else {
                res.send(challenge)
            }

        } catch (err) {
            console.log(err);
            res.send('Server Error')
        }
    },

    //@desc:All Admin Challenge
    //@access:PUBLIC
    async allChallenge(req, res) {
        try {
            const page = req.query.page
            const challenge = await
                Challenge.find({
                    $and: [        
                        { 'createdBy': null },
                        { 'contest': null }
                    ]
                }).skip((page-1)*10).limit(10)
            if(challenge.length==0){
                throw new Error('Page limit exceeded')
            }
            res.status(200).json({Challenges:challenge})

        } catch (err) {
            console.log(err)
            if (err.message == 'Page limit exceeded') {
                res.status(404).json({error:err.message})
            }
            else {
                res.status(500).send('Server Error')
            }
        }
    },

    //@desc:Get specific Challenge
    //@access:PUBLIC
    async specChallenge(req, res) {
        try {
            const challengename = req.params.challengename
            const challenge = await Challenge.find({name:challengename}).populate('challenges')
            if(challenge.length==0){
                throw new Error('Challenge Not Found')
            }
            res.status(200).json({Challenge:challenge})

        } catch (err) {
            console.log(err)
            if (err.message == 'Challenge Not Found') {
                res.status(404).json({error:err.message})
            }
            else {
                res.status(500).send('Server Error')
            }
        }
    },

    //@desc:Get specific Contest
    //@access:PUBLIC
    async specContest(req, res) {
        try {
            const contestname = req.params.contestname
            const contest = await Contest.find({name:contestname}).populate('challenges')
            if(contest.length==0){
                throw new Error('contest not found')
            }
            res.status(200).json({Contest:contest})

    } catch(err) {
            console.log(err)
            if (err.message == 'contest Not Found') {
                res.status(404).json({error:err.message})
            }
            else {
                res.status(500).send('Server Error')
            }
        }
    },

    //@desc:Get All contest
    //@access:PUBLIC
    async allContest(req, res) {
        try {
            const page = req.query.page
            let contest = await
                Contest.find({ endTime: { '$gte': new Date()}}).sort('startTime')
                .skip((page-1)*10).limit(10)
            if(contest.length==0){
                throw new Error('Page limit exceeded')
            }
            console.log(contest)
            let length = await Contest.find({startTime: { '$gte': new Date()}}).sort('startTime')
            res.status(200).json({totalContest:length.length,contests:contest})
            

        } catch (err) {
            console.log(err)
            if (err.message == 'Page limit exceeded') {
                res.status(404).json({error:err.message})
            }
            else {
                res.status(500).send('Server Error')
            }
        }
    },

    //@desc:Adding challenge in the Contest
    //@access:Private 
    async contestChallenge(req, res) {
        try {
            const user = req.user;
            const contestName = req.params.contest;
            const challengeName = req.params.challenge;
            const contest = await Contest.find({ name: contestName });
            if (contest.length == 0) {
                throw new Error('contest not found')
            }
            if(contest[0].createdBy.toString()!=user._id.toString()){
                throw new Error('You are not authorized')
            }
            const challenge = await Challenge.find({ name: challengeName });
            if (challenge.length == 0) {
                throw new Error('challenge not found')
            }
            const name = challenge[0].name + '-' + contestName;
            const question = challenge[0].question + '-';
            const func_py = challenge[0].func_py;
            const func_node = challenge[0].func_node
            const func_name = challenge[0].func_name
            const func_java = challenge[0].func_java
            const func_c = challenge[0].func_c
            const func_cpp = challenge[0].func_cpp
            const description = challenge[0].description;
            const output = challenge[0].output;
            const testCase = challenge[0].testCases;
            const editorial = challenge[0].editorial;
            const maxScore = challenge[0].maxScore;
            const no_of_args = challenge[0].no_of_args
            const input = challenge[0].input
            const constraints = challenge[0].constraints
            const challengeCreation = await Challenge.create({ name, description,constraints ,question, output, input, editorial, maxScore, func_name, func_py, func_node, func_java, func_c, func_cpp, no_of_args, testCases: testCase, createdBy: user._id, contest: contest[0]._id })
            contest[0].challenges.push(challengeCreation)
            contest[0].save()
            res.json({ challenge: challengeCreation })
        } catch (err) {
            if (err.message == 'You are not authorized') {
                res.status(403).json({error:err.message})
            }
            else if (err.message == 'challenge not found') {
                res.status(404).json({error:"challenge not found"})
            }
            else if (err.message == 'contest not found') {
                res.status(404).json({error:"contest not found"})
            }
            else {
                res.status(500).json({error:'Server Error'})
            }

        }
    },

    //@desc:Adding Moderators in contest
    //@access:PRIVATE ONLY ORGANIZER
    async contestModerator(req, res) {
        try {
            const users = req.user
            const contestname = req.params.contest
            const username = req.params.username
            const contest = await Contest.find({ name: contestname })
            if (users._id.toString() != contest[0].createdBy.toString()) {
                throw new Error('You are not authorized')
            }
            const user = await User.find({ username: username })
            if (user.length == 0) {
                throw new Error('user not found')
            }
            if(user[0].verified==false){
                throw new Error('User is Not verified')
            }
            if (contest[0].moderators.includes(user[0]._id.toString())) {
                throw new Error('Already Added as moderator')
            }
            await user[0].moderator.push(contest[0])
            await user[0].save()
            await contest[0].moderators.push(user[0])
            await contest[0].save()
            res.status(201).json({response:'User added as moderator',moderator:contest[0]})
        }
        catch (err) {
            if (err.message == 'You are not authorized') {
                res.status(403).json({error:err.message})
            }
            else if (err.message == 'Already Added as moderator') {
                res.status(409).json({error:err.message})
            }
            else if (err.message == 'User is Not verified') {
                res.status(401).json({error:err.message})
            }
            
            else if (err.message == 'user not found') {
                res.status(404).json({error:"user not found"})
            }
            else {
                res.status(500).json({error:'Server Error'})

            }
        }
    },

    //@desc:FOR CHECKING THE LEADERBOARD OF A CHALLENGE
    //@access:PUBLIC
    async challengeLeaderboard(req, res) {
        try {
            const challengename = req.params.challenge
            let challenges = await Challenge.find({ name: challengename })
            if (challenges.length == 0) {
                throw new Error('Invalid Challenge')
            }
            let submission = await Submission.find({ challenge: challenges[0]._id }).sort({ 'score': -1 }).populate('user')
            let submissions = submission.map(el => {
                const user = el.user.username
                const score = el.score
                return { user: user, score: score, language: el.language }
            })
            var sub = {};
            var newSubmission = submissions.filter(function (entry) {
                if (sub[entry.user]) {
                    return false;
                }
                sub[entry.user] = true;
                return true;
            });
            res.status(200).json({ sub: newSubmission })
        }
        catch (err) {
            console.log(err.message)
            if (err.message == 'Invalid Challenge') {
                res.status(404).json({error:"Invalid Challenge"})
            }
            else {
            res.status(500).send("Server Error");
            }
        }
    },

    //@desc:FOR UPDATING USER DEFINED AND ADMIN CHALLENGE
    //@access:PRIVATE
    async updateChallenge(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }
        try {
            const funct_node = (name, no_of_args) => {
                const func = `
# Complete the ${name} function below.
#You dont need to provide value in arguement it will be given by compiler
function ${name}('use ${no_of_args} args here'){
    return
    }`
                return func
            }
            const funct_py = (name, no_of_args) => {
                const func =
`#!/bin/python3
import math
import os
import random
import re
import sys
# Complete the ${name} function below.
#You dont need to provide value in arguement it will be given by compiler
def ${name}('use ${no_of_args} args here'):
    return
`
                return func
            }
            const funct_c = (no_of_args, input, output) => {
                const func = `#include<stdio.h>
/**
* Complete this method
* I will be sending ${no_of_args} input
* sample ${input} so use symbol in scanf according to the sample.
* Sample output should be like this ${output} 
*/
void main()
    {    
    scanf("");
    printf("",result);
    return 0;
}`
                return func
            }
            const funct_cpp = (no_of_args, input, output) => {
                const func = `#include <iostream>
using namespace std;
// Complete this method
// I will be sending ${no_of_args} arguements as input
// sample input :${input}
// Sample output: ${output} 
              
int main()
    {
    int a, b;
    // All the required Input Should be taken in single Statement
    cin >> b >> a;
    sumOfTwoNumbers = firstNumber + secondNumber;
    // Only One Print Statement Should be used
    cout << ;     
    return 0;
}`
                return func
            }
            const funct_java = (no_of_args, input, output) => {
                const func = `import java.util.*;
public class Solution {
    // Complete this method
    // I will be sending ${no_of_args} input so use ${no_of_args} inputs
    // sample input: ${input} .
    // Sample output : ${output} 
    public static void main(String[] args) {
      Scanner sc=new Scanner(System.in);
      
      System.out.println();
    }
}`
                return func
            }
            const user = req.user
            const challengename = req.params.challenge
            const details = req.body
            const challenge = await Challenge.find({ name: challengename })
            if (challenge.length == 0) {
                throw new Error('challenge not found')
            }
            if (details.hasOwnProperty('func_name')) {
                if (details.hasOwnProperty('no_of_args') == false) {
                    details.no_of_args = challenge[0].no_of_args
                }
                if (details.hasOwnProperty('input') == false) {
                    details.input = challenge[0].input
                }
                if (details.hasOwnProperty('output') == false) {
                    details.output = challenge[0].output
                }
                const { func_name, no_of_args, input, output } = details
                details.func_py = funct_py(func_name, no_of_args)
                details.func_node = funct_node(func_name, no_of_args)
                details.func_c = funct_c(no_of_args, input, output)
                details.func_cpp = funct_cpp(no_of_args, input, output)
                details.func_java = funct_java(no_of_args, input, output)

            }
            if (user === undefined) {
                const newchallenge = await Challenge.updateOne(
                    { name: challengename, createdBy: null },
                    { ...details }
                )
                res.json({ updatechallenge: newchallenge })
            } else {
                if (String(user._id) != challenge[0].createdBy) {
                    throw new Error('You are not authorized')
                }
                const newchallenge = await Challenge.updateOne(
                    { name: challengename, createdBy: user._id },
                    { ...details }
                )
                res.json({ updatechallenge: newchallenge })
            }
        }
        catch (err) {
            if (err.message == 'You are not authorized') {
                res.status(403).send(err.message)
            }
            else if (err.message == 'challenge not found') {
                res.status(404).send("challenge not found")
            }
            else {
                res.status(500).send('Server Error')

            }
        }
    },


    //@desc:Adding challenge as bookmark
    //@access:Private
    async addBookmark(req, res) {
        try {
            const challengename = req.params.challenge
            const user = req.user
            const challenge = await Challenge.find({ name: challengename })
            if (challenge.length == 0) {
                throw new Error('challenge not found')
            }
            if (challenge[0].bookmarkedBy.includes(user._id)) {
                throw new Error('Already Bookmarked')
            }
            challenge[0].bookmarkedBy.push(user)
            user.bookmarks.push(challenge[0])
            await challenge[0].save()
            await user.save()

            res.status(201).send('Challenge bookmarked')
        }
        catch (err) {
            console.log(err)
            if (err.message == 'Already Bookmarked') {
                res.status(409).send(err.message)
            }
            else if (err.message == 'challenge not found') {
                res.status(404).send(err.message)
            }
            else {
                res.status(500).send('Server Error')

            }
        }
    },

    //@desc:For deleting bookmark of a user
    //@access:PRIVATE
    async deleteBookmark(req, res) {
        try {
            let user = req.user
            const challengename = req.params.challenge
            const challenge = await Challenge.find({ name: challengename })
            if (challenge.length == 0) {
                throw new Error('challenge not found')
            }
            if (!challenge[0].bookmarkedBy.includes(user._id)) {
                throw new Error('Not bookmarked')
            }
            await Challenge.updateOne({ name: challengename }, { $pull: { bookmarkedBy: user._id } })
            await User.updateOne({ _id: user._id }, { $pull: { bookmarks: challenge[0]._id } })
            res.send('Bookmark deleted')
        }
        catch (err) {
            console.log(err)
            if (err.message == 'Not bookmarked') {
                res.status(403).send(err.message)
            }
            else if (err.message == 'challenge not found') {
                res.status(404).send(err.message)
            }
            else {
                res.status(500).send('Server Error')

            }
        }
    },

    //@desc:for updating test case of a challenge
    //@access:Private
    async testCaseUpdate(req, res) {
        try {
            const user = req.user;
            const challengeName = req.params.challenge;
            const testCaseId = req.params.testCaseId;
            let {result,input} = req.body;
            const challenge = await Challenge.find({ name: challengeName });
            if (challenge.length == 0) {
                throw new Error('challenge not found')
            }

            let func = challenge[0].func_name
            input = input.split(";")
            let newinput = [];
            for (i = 0; i < input.length; i++) {
                if (isNaN(input[i]) == false) {
                    newinput.push(parseInt(input[i]))
                }
                else if(input[i].includes('[')||input[i].includes('{')){
                    newinput.push(input[i])
                }
                else if (typeof (input[i]) == 'string') {
                    newinput.push(`"${input[i]}"`)
                }
                else {
                    newinput.push(input[i])
                }
            }
            if (user === undefined) {
                

                if (typeof (input) == 'string') {
                    updatetestCase = await Testcase.updateOne(
                        { challenge: challenge[0]._id, user: null, _id: testCaseId },
                        ({rawinput: `${newinput}`, result, input: `${func}(${newinput})`, challenge: challenge[0]._id  }),
                        {new:true}
                    );
                }
                else {
                    updatetestCase = await Testcase.updateOne(
                        { challenge: challenge[0]._id, user: null, _id: testCaseId },
                        ({rawinput: `${newinput}`, result, input: `${func}(${newinput})`, challenge: challenge[0]._id  }),
                        {new:true}
                    );
    
                }
            } else {
                if (String(user._id) != challenge[0].createdBy) {
                    throw new Error('You are not authorized')
                }
                if (typeof (input) == 'string') {
                    updatetestCase = await Testcase.updateOne(
                        { challenge: challenge[0]._id, _id: testCaseId },
                        {rawinput: `${newinput}`, result, input: `${func}(${newinput})`, challenge: challenge[0]._id  }
                    );
                }
                else {
                    updatetestCase = await Testcase.updateOne(
                        { challenge: challenge[0]._id, _id: testCaseId },
                        {rawinput: `${newinput}`, result, input: `${func}(${newinput})`, challenge: challenge[0]._id  }
                    );
                }
            }
            res.json({ statusCode: 201, updatedtestCase: updatetestCase,});


        } catch (err) {
            console.log(err);
            if (err.message == 'You are not authorized') {
                res.status(403).send(err.message)
            }
            else if (err.message == 'challenge not found') {
                res.status(404).send(err.message)
            }
            else {
                res.status(500).send('Server Error')

            }
        }
    },

    //@desc:For deleting a testcase of a challenge
    //@access:Private
    async testCaseDelete(req, res) {
        try {
            const user = req.user;
            const challengeName = req.params.challenge;
            const testCaseId = req.params.testCaseId;

            const challenge = await Challenge.find({ name: challengeName });
            if (challenge.length == 0) {
                throw new Error('challenge not found')
            }

            if (user === undefined) {
                await Challenge.updateOne({ name: challengeName }, { $pull: { testCases: testCaseId } })
                const deletetestCase = await Testcase.deleteOne(
                    { challenge: challenge[0]._id, user: null, _id: testCaseId },
                )
                res.json({ statusCode: 201, deletetestCase: deletetestCase });
            }
            else {
                if (String(user._id) != challenge[0].createdBy) {
                    throw new Error('You are not authorized')
                }
                await Challenge.updateOne({ name: challengeName }, { $pull: { testCases: testCaseId } })
                const deletetestCase = await Testcase.deleteOne(
                    { challenge: challenge[0]._id, user: user._id, _id: testCaseId },
                )
                res.json({ statusCode: 201, deletetestCase: deletetestCase });
            }
        } catch (err) {
            console.log(err.message);
            if (err.message == 'You are not authorized') {
                res.status(403).send(err.message)
            }
            else if (err.message == 'challenge not found') {
                res.status(404).send(err.message)
            }
            else {
                res.status(500).send('Server Error')

            }
        }
    },


    //@desc:For updating details of a challenge
    //@access:PRIVATE
    async contestUpdate(req, res) {
        try {
            const contestName = req.params.contest;
            const contest = await Contest.find({ name: contestName })
            if (contest.length == 0) {
                throw new Error('contest not found')
            }
            const user = req.user;
            const details = req.body;
            if (contest[0].createdBy.toString()!=user._id.toString() && !contest[0].moderators.includes(user._id)) {
                throw new Error('You are not authorized')
            }
            const contestUpdate = await Contest.updateOne(
                { name: contestName},
                { ...details }
            )
            res.json({ statusCode: 201, updatedContest: contestUpdate });
        } catch (err) {
            console.log(err)
            if (err.message == 'You are not authorized') {
                res.status(403).send(err.message)
            }
            else if (err.message == 'contest not found') {
                res.status(404).send(err.message)
            }
            else {
                res.status(500).send('Server Error')

            }
        }
    },


    //@desc:Deleting Challenge
    //@access:PRIVATE
    async deleteChallenge(req, res) {
        try {
            const user = req.user
            const challengeName = req.params.challenge

            if (user === undefined) {

                const challenge = await Challenge.find({ name: challengeName });

                const submission = await Submission.find({ challenge: challenge[0]._id });

                const discussion = await Discussion.find({ challenge: challenge[0]._id });

                const deleteChallenge = await Challenge.deleteOne({ name: challengeName, createdBy: null });

                const deleteTestCase = await Testcase.deleteMany({ challenge: challenge[0]._id, user: null });

                const deleteDiscussion = await Discussion.deleteMany({ challenge: challenge[0]._id });

                const deleteSubmission = await Submission.deleteMany({ challenge: challenge[0]._id });

                await User.updateMany(
                    { bookmarks: challenge[0].id },
                    { $pull: { bookmarks: challenge[0]._id } },
                    { multi: true }
                )


                const subsId = submission.map(el => el._id);

                const dicusId = discussion.map(el => el._id);

                await User.updateMany(
                    {},
                    { $pull: { submissions: { $in: subsId } } },
                    { multi: true }
                )

                await User.updateMany(
                    {},
                    { $pull: { discussions: { $in: dicusId } } },
                    { multi: true }
                )

                res.send({ challenge: deleteChallenge, deleteDiscussion, deleteSubmission, deleteTestCase });

            } else {

                const challenge = await Challenge.find({ name: challengeName });
                if (challenge.length == 0) {
                    throw new Error('challenge not found')
                }

                if (String(user._id) != challenge[0].createdBy) {
                    throw new Error('You are not authorized')
                }

                const submission = await Submission.find({ challenge: challenge[0]._id });

                const discussion = await Discussion.find({ challenge: challenge[0]._id });

                const deleteChallenge = await Challenge.deleteOne({ name: challengeName, createdBy: user._id });

                const deleteTestCase = await Testcase.deleteMany({ challenge: challenge[0]._id, user: user._id });

                const deleteDiscussion = await Discussion.deleteMany({ challenge: challenge[0]._id, user: user._id });

                const deleteSubmission = await Submission.deleteMany({ challenge: challenge[0]._id, user: user._id });

                await User.updateOne({ _id: user._id }, { $pull: { challenge: challenge[0]._id } })

                await User.updateMany(
                    { bookmarks: challenge[0].id },
                    { $pull: { bookmarks: challenge[0]._id } },
                    { multi: true }
                )


                const subsId = submission.map(el => el._id);

                const dicusId = discussion.map(el => el._id);

                await User.updateMany(
                    {},
                    { $pull: { submissions: { $in: subsId } } },
                    { multi: true }
                )

                await User.updateMany(
                    {},
                    { $pull: { discussions: { $in: dicusId } } },
                    { multi: true }
                )

                res.send({ challenge: deleteChallenge, deleteDiscussion, deleteSubmission, deleteTestCase });

            }

        } catch (err) {
            console.log(err.message);
            if (err.message == 'You are not authorized') {
                res.status(403).send(err.message)
            }
            else if (err.message == 'challenge not found') {
                res.status(404).send(err.message)
            }
            else {
                res.status(500).send('Server Error')

            }
        }
    },


    //@desc:Deleting moderator from the contest
    //@access:PRIVATE
    async deleteContestModerator(req, res) {
        try {

            const loginuser = req.user
            const contestName = req.params.contest;

            const username = req.params.username;

            const contest = await Contest.find({ name: contestName });
            if (contest.length == 0) {
                throw new Error('contest not found')
            }
            if(contest[0].createdBy.toString()!=loginuser._id.toString()){
                throw new Error('You are not authorized')
            }

            const user = await User.find({ username: username });
            if (user.length == 0) {
                throw new Error('user not found')
            }

            await Contest.updateOne({ name: contestName }, { $pull: { moderators: user[0]._id } });

            await User.updateOne({ username: username }, { $pull: { moderator: contest[0]._id } });

            res.send(`${username} is removed as moderator for the contest ${contestName}`);

        } catch (err) {
            console.log(err);
            if (err.message == 'You are not authorized') {
                res.status(403).send(err.message)
            }
            else if (err.message == 'contest not found') {
                res.status(404).send(err.message)
            }
            else if (err.message == 'user not found') {
                res.status(404).send(err.message)
            }
            else {
                res.status(500).send('Server Error')

            }
        }
    },

    //@desc:For deleting the contest
    //@access:PRIVATE
    async deleteContest(req, res) {
        try {
            const contestName = req.params.contest;
            const user = req.user;

            const contest = await Contest.find({ name: contestName });
            if (contest.length == 0) {
                throw new Error('contest not found')
            }
            if (user._id.toString() != contest[0].createdBy.toString()) {
                throw new Error('You are not authorized')
            }

            const challenge = await Challenge.find({ contest: contest[0]._id });

            if (challenge.length === 0) {

                await User.updateMany({}, { $pull: { moderator: contest[0]._id } });

                await User.updateMany({}, { $pull: { contests: contest[0]._id } });

                const deleteContest = await Contest.deleteOne({ name: contestName });

                res.json({ deleteContest });

            } else {

                const submission = await Submission.find({ challenge: challenge[0]._id });

                const discussion = await Discussion.find({ challenge: challenge[0]._id });

                const deleteChallenge = await Challenge.deleteOne({ name: challenge[0].name, createdBy: user._id, contest: contest[0]._id });

                const deleteDiscussion = await Discussion.deleteMany({ challenge: challenge[0]._id });

                const deleteSubmission = await Submission.deleteMany({ challenge: challenge[0]._id });

                const deleteContest = await Contest.deleteOne({ name: contestName });

                await User.updateMany(
                    { bookmarks: challenge[0].id },
                    { $pull: { bookmarks: challenge[0]._id } },
                    { multi: true }
                )


                const subsId = submission.map(el => el._id);

                const dicusId = discussion.map(el => el._id);

                await User.updateMany(
                    {},
                    { $pull: { submissions: { $in: subsId } } },
                    { multi: true }
                )

                await User.updateMany(
                    {},
                    { $pull: { discussions: { $in: dicusId } } },
                    { multi: true }
                )

                await User.updateMany({}, { $pull: { moderator: contest[0]._id } });

                await User.updateMany({}, { $pull: { contests: contest[0]._id } });

                res.json({ challenge: deleteChallenge, deleteDiscussion, deleteSubmission, deleteContest });

            }
        } catch (err) {
            console.log(err);
            if (err.message == 'You are not authorized') {
                res.status(403).send(err.message)
            }
            else if (err.message == 'contest not found') {
                res.status(404).send(err.message)
            }
            else {
                res.status(500).send('Server Error')

            }
        }
    },
    //@desc:For Getting all the submissions
    //@access:PRIVATE

    async getAllSubmissons(req, res) {
        const user = req.user;
        try {
            const submissions = await Submission.find({
                user: user._id
            }).populate('challenge','name')
            if(submissions.length==0){
                res.status(404).json({message:'You have no Submissions Yet' })
            }
            res.status(200).json({submission: submissions});
            
        } catch (err) {
            console.log(err)
            res.status(500).send('Server Error');
        }
    },

    //@desc:For Getting  the specific  challenge submissions
    //@access:PRIVATE

    async getChallengeSubmission(req, res){
        const user = req.user;
        const challengeName = req.params.challenge;
        try {
            const challenge = await Challenge.find({ name: challengeName });

            const oneSubmission = await Submission.find({
                user: user._id,
                challenge: challenge[0]._id
            })
            res.status(200).json({submission: oneSubmission});
            
        } catch (err) {
            console.log(err)
            res.status(500).send('Server Error');
        }
    },

    async getAllBookmarks(req, res){
        try {
            const user = req.user;
            const bookmarkUser = await User.find({
                _id: user._id
            }).populate('bookmarks')
            if(bookmarkUser[0].bookmarks.length==0){
                res.status(404).json({message:'You have no bookmarks Yet' })
            }
            res.status(200).json({bookmarks: bookmarkUser[0].bookmarks[0].name});
        } catch (err) {
            console.log(err)
            res.status(500).send('Server Error');
        }
    }

}
