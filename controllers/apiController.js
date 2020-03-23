const Adminchallenge = require("../models/Adminchallenge");
const Testcase = require("../models/Testcase");
const Discussion = require('../models/Discussion');
const User = require('../models/User');

const {c, cpp, node, python, java} = require('compile-run');

// let compile = (sourcecode) =>{
//     const result = python.runSource(sourcecode);
//     result
//         .then(result =>{
//             if(result.stderr.length==0) console.log(result.stdout)
//             else{
//                 console.log(result.stderr)
//             }
//         })
//         .catch(err =>{
//             console.log(err)
//         })
// }
// sourcecode =  `num = 7
// factorial = 1
// if num < 0:
//     print("Sorry, factorial does not exist for negative numbers")
// elif num == 0:
//    print("The factorial of 0 is 1")
// else:
//    for i in range(1,num + 1):
//        factorial = factorial*i
//    print("The factorial of",num,"is",factorial)`;
// compile(sourcecode)


module.exports = {
  async adminChallenge(req, res) {
    try {
      const { name,description, question, output,editorial,maxScore } = req.body;
      const challenge = await Adminchallenge.create({name,description,question,output,editorial,maxScore });
      res.status(201).json({status:201,challenge:challenge})
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  },
  async testCase(req,res){
    try{
    const challengename = req.params.challenge
    let challenge = await Adminchallenge.find({name:challengename})
    const { body } = req.body;
    const testCase = await Testcase.create({body,adminChallenge:challenge[0]._id});
    challenge[0].testCases.push(testCase)
    await challenge[0].save()
    res.status(201).json({statuscode:201,testCase:testCase})
    }
    catch (err) {
        res.status(500).send("Server Error");
      }
  },
  async submission(req,res){
      try{
        // let result;
        const {language,code} = req.body
        console.log(language)
        const challengename = req.params.challenge
        let challenge = await Adminchallenge.find({name:challengename}).populate('testCases')
        if(language=='c'){
            const result = await c.runSource(code);
            if(result.stderr.length!=0) console.log(result.stderr)
                else{
                    for(i=0;i<challenge[0].testCases.length;i++){
                        if(result.stdout==challenge[0].testCases[i].body){
                            console.log(challenge[0].testCases[i].body)
                            console.log(result)
                            console.log('pass'+i)
                        }
                        else{
                            console.log(challenge[0].testCases[i].body)
                            console.log(result)
                            console.log('fail'+i)
                        }
                    }
                }

        }
        else if(language=='python'){
            const result = await python.runSource(code);
            if(result.stderr.length!=0) console.log(result.stderr)
                else{
                    for(i=0;i<challenge[0].testCases.length;i++){
                        if(result.stdout==challenge[0].testCases[i].body){
                            console.log(challenge[0].testCases[i].body)
                            console.log(result)
                            console.log('pass'+i)
                        }
                        else{
                            console.log(challenge[0].testCases[i].body)
                            console.log(result)
                            console.log('fail'+i)
                        }
                    }
                }
        }
        else if(language=='java'){
            const result = await java.runSource(code);
            if(result.stderr.length!=0) console.log(result.stderr)
                else{
                    for(i=0;i<challenge[0].testCases.length;i++){
                        if(result.stdout==challenge[0].testCases[i].body){
                            console.log(challenge[0].testCases[i].body)
                            console.log(result)
                            console.log('pass'+i)
                        }
                        else{
                            console.log(challenge[0].testCases[i].body)
                            console.log(result)
                            console.log('fail'+i)
                        }
                    }
                }
        }
        else if(language=='cpp'){
            const result = await cpp.runSource(code);
            if(result.stderr.length!=0) console.log(result.stderr)
                else{
                    for(i=0;i<challenge[0].testCases.length;i++){
                        if(result.stdout==challenge[0].testCases[i].body){
                            console.log(challenge[0].testCases[i].body)
                            console.log(result)
                            console.log('pass'+i)
                        }
                        else{
                            console.log(challenge[0].testCases[i].body)
                            console.log(result)
                            console.log('fail'+i)
                        }
                    }
                }
        }
        else if(language=='node'){
            const result = await node.runSource(code);
            if(result.stderr.length!=0) console.log(result.stderr)
                else{
                    for(i=0;i<challenge[0].testCases.length;i++){
                        if(result.stdout==challenge[0].testCases[i].body){
                            console.log(challenge[0].testCases[i].body)
                            console.log(result)
                            console.log('pass'+i)
                        }
                        else{
                            console.log(challenge[0].testCases[i].body)
                            console.log(result)
                            console.log('fail'+i)
                        }
                    }
                }
        }        
      }
      catch(err){
          res.status(500).send(err)
      }
  },
  async challengeDiscussion(req, res) {
    try {
        const user = req.user;
        const { text } = req.body;

        if(!text) return res.status(400).json({statusCode: 400, message: 'Bad Request'});

        const createDiscussion = await Discussion.create({text, user: user._id});

        user.discussions.push(createDiscussion._id);
        await user.save()

        res.status(201).json({statusCode: 201, createDiscussion});
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
}
};
