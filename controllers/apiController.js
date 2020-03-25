const Testcase = require("../models/Testcase");
const Discussion = require('../models/Discussion');
const Challenge = require("../models/Challenge");
const Submission = require('../models/Submission');
const Contest = require('../models/Contest');



const { c, cpp, node, python, java } = require('compile-run');


module.exports = {
    async challenge(req, res) {
        try {
            const funct_node = (name) => {
                const func = `
        # Complete the ${name} function below.
        #You dont need to provide value in arguement it will be given by compiler
        function ${name}(arg){
            return
        }`
                return func
            }
            const funct_py = (name) => {
                const func =
                    `#!/bin/python3
        import math
        import os
        import random
        import re
        import sys
        # Complete the ${name} function below.
        #You dont need to provide value in arguement it will be given by compiler
        def ${name}(arg):
            return
        `
                return func
            }
            const user = req.user
            const { name, description, question, output, editorial, maxScore, func_name } = req.body;
            const func_py = funct_py(func_name)
            const func_node = funct_node(func_name)
            const func_java = 'not defined'
            const func_c = 'not defined'
            const func_cpp = 'not defined'
            if(user === undefined){
                const challenge = await Challenge.create({ name, description, question, output, editorial, maxScore, func_name, func_py, func_node, func_java, func_c, func_cpp });
                res.status(201).json({ status: 201, challenge: challenge });
            }
            else {
                const challenge = await Challenge.create({ name, description, question, output, editorial, maxScore, createdBy: user._id, func_name, func_py, func_node, func_java, func_c, func_cpp });
                user.problems.push(challenge._id)
                await user.save()
                res.status(201).json({ status: 201, challenge: challenge, createdBy: user._id });
            }

        } catch (err) {
            console.log(err.message);
            if (err.message === 'Mongo Error') {
                res.status(400).send("Problem Name Should be Different");
            } else {
                res.status(500).send("Server Error");
            }
        }
    },
    async testCase(req, res) {
        try {
            const challengename = req.params.challenge
            let challenge = await Challenge.find({ name: challengename })
            const {result, input} = req.body
            let func = challenge[0].func_name

            let testCase = 0
            if (typeof (input) == 'string') {
                testCase = await Testcase.create({ result, input: `${func}('${input}')`, challenge: challenge[0]._id });
            }
            else {
                testCase = await Testcase.create({ result, input: `${func}(` + input + `)`, challenge: challenge[0]._id });
            }
            challenge[0].testCases.push(testCase)
            await challenge[0].save()
            res.status(201).json({ statuscode: 201, testCase: testCase })
        }

        catch (err) {
            console.log(err)
            res.status(500).send("Server Error");
        }
    },
    async submission(req, res) {
        try {
            const user = req.user;
            const { language, code } = req.body
            console.log(language)
            const challengename = req.params.challenge
            let challenge = await Challenge.find({ name: challengename }).populate('testCases')
 
            const maxScore = challenge[0].maxScore
            let score = 0;
            let scorepertc = maxScore / challenge[0].testCases.length

            
            if (language == 'python') {
                for (i = 0; i < challenge[0].testCases.length; i++) {
                    const input = '\n' + challenge[0].testCases[i].input
                    const newcode = code + input
                    const result = await python.runSource(newcode);
                    if (code.includes('\n') == false) {
                        result.stdout = result.stdout.replace('\n', '')
                    }
                    else if (code.includes('\n')) {
                        result.stdout = result.stdout.slice(0, -1)
                    }
                    if (result.stderr.length != 0) console.log(result.stderr)
                    else if (result.stdout == challenge[0].testCases[i].result) {
                        score = score + scorepertc
                    }
                    else {
                        score = score
                    }
                }
                const submission = await Submission.create({ code: code, score: score, challenge: challenge[0]._id, user: user._id,language: language });
                challenge[0].submissions.push(submission)
                await challenge[0].save()
                console.log(user)
                user.submissions.push(submission);
                await user.save()
                res.json({ score: score })
            }
            else if (language == 'node') {
                for (i = 0; i < challenge[0].testCases.length; i++) {
                    const input = '\n' + challenge[0].testCases[i].input
                    const newcode = code + input

                    const result = await node.runSource(newcode);
                    if (code.includes('\n') == false) {
                        result.stdout = result.stdout.replace('\n', '')
                    }
                    else if (code.includes('\n')) {
                        result.stdout = result.stdout.slice(0, -1)
                    }
                    if (result.stderr.length != 0) console.log(result.stderr)
                    else if (result.stdout == challenge[0].testCases[i].result) {
                        score = score + scorepertc
                    }
                    else {
                        score = score
                    }
                }
                const submission = await Submission.create({ code: code, score: score, challenge: challenge[0]._id, user: user._id, language: language });
                console.log(submission)
                challenge[0].submissions.push(submission)
                await challenge[0].save()
                console.log(user)
                user.submissions.push(submission);
                await user.save()
                res.json({ score: score })
            }

        }
        catch (err) {
            res.status(500).send(err)
        }
    },
    async challengeDiscussion(req, res) {
        try {
            const challengename = req.params.challenge
            let challenge = await Challenge.find({ name: challengename })
            const user = req.user;
            const { text } = req.body;
            if (!text) return res.status(400).json({ statusCode: 400, message: 'Bad Request' });

            const createDiscussion = await Discussion.create({ text, user: user._id });

            user.discussions.push(createDiscussion._id);
            await user.save()
            challenge[0].discussions.push(submission)
            await challenge[0].save()

            res.status(201).json({ statusCode: 201, createDiscussion });
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error')
        }
    },
    async contest(req,res){
        try{
            const details = req.body
            const user = req.user;
            details.moderators=user._id
            const contest = await Contest.create(details)
            user.moderator.push(contest)
            await user.save()
            res.json({contest:contest})
            
        }
        catch(err){
            console.log(err.message)
            res.status(500).send('Server Error')
        }
    },
    async signup(req,res){
       try{
        const user = req.user
        const contestname = req.params.contest
        const contest = await Contest.find({name:contestname})
        await contest[0].signups.push(user._id)
        await contest[0].save()
        await user.contests.push(contest[0]);
        await user.save()
        res.json({user:user})
       } 
       catch(err){
           console.log(err)
           res.send('Server Error')
       }
       

    }
};
