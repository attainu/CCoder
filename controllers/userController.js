const User = require('../models/User');
const bcrypt = require("bcryptjs");
const { verify } = require("jsonwebtoken");
const { validationResult}=require("express-validator");
const cloudinary = require("../utils/cloudinary");
const convertBufferToString = require("../utils/convertBufferToString");

module.exports = {
    //@desc:For registering user
    //@access:PUBLIC
    async userRegister(req, res) {
        const errors = validationResult(req)
            if (!errors.isEmpty()) {
              return res.status(422).json({ errors: errors.array() })
        }
        try {
            const {name, username,email, password, experience, education} = req.body;
            const createUser = await User.create({name, username,email, password, experience, education,isThirdPartyUser: false});
            await createUser.generateAuthToken("confirm");
            createUser.accessToken = "please verify your email"
            res.status(201).json({
                statusCode:201,
                createUser,
                expiresIn: "24h"
            });
        } catch (err) {
            if(err.code===11000){
                res.status(409).send("User already Exists")
            }
            console.log(err)
            res.status(500).send('Server Error');
        }
    },

    //@desc:For Confirming the Registration
    //@access:Private
    async verifyUserEmail(req, res) {
        try {
            const confirmToken = req.params.token;
            const user = await User.findByToken(confirmToken);
            res.json({Message:"Your Account Is Verified Please Login On Our Platform"});
        } catch (err) {
            console.log(err.message);
            res.status(500).send("server error");
        }    
    },

    //@desc:For Login user
    //@access:PUBLIC
    async userLogin(req, res) {
        try {
            const {email, password} = req.body;
            if(!email || !password) return res.status(400).json({statusCode:400, message: 'Invalid Credentials'});
            const user = await User.findByEmailAndPassword(email, password);
            if(user.verified === false) {
                return res.json({message: "Please verify your email first"});
            }
            else {
                const accessToken = await user.regenerateAuthToken();
                res.status(200).json({
                    statusCode:200,
                    loginUser:user,
                    accessToken: accessToken,
                    expiresIn: "24h"
                });
            }
            
        } catch (err) {
            if(err.message=='Invalid Credentials'){
                res.status(400).json({statusCode:400, message: 'Invalid Credentials'});
            }
            else if(err.name === 'AuthError'){
                res.json({message: err.message})
            }
            else{
                res.status(500).json({statusCode:500, message: 'Sever error'});
            }
        }
    },

    //@desc:For user logout
    //@access:Private
    async userLogout (req,res){
        try {
            const token = req.params.token
            const user = await User.nullifyToken(token);
            res.json({user, message: 'Logout successfully'});
            
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
        
    },

    //@desc:For user details
    //@access:private
    async singleUser(req, res){
        res.json(req.user)
    },

    //@desc:For user profile update
    //@access:PRIVATE
    async userProfileUpdate(req, res){
        try {
            const token = req.params.token
            const profileUpdate = await User.updateOne({accessToken: token},{...req.body});
            res.status(201).send(profileUpdate);
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
    },

    //@desc:For Profile Pic Update for user
    //@access:PRIVATE 
    async userImageUpdate(req, res) {
        const user = req.user;
        const token = req.params.token
        try {
            let imageContent = convertBufferToString(
                req.file.originalname,
                req.file.buffer
              );
            let imageResponse = await cloudinary.uploader.upload(imageContent);
            user.fileUpload = imageResponse.secure_url;
            await user.save();
            res.send("Image uploaded Successfully");
        } catch (err) {
            console.log(err.message)
            res.send("server Error");
        }
    },

    //@desc:For Changing Password of user
    //@access:PRIVATE
    async userChangePassword(req,res){
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() })
    }
        try {
            const accessToken = req.params.token
            const {oldpassword, newpassword, confirmpassword} = req.body;
            const password = await User.findByPassword(accessToken, oldpassword);

            if(password === 'Invalid Credentials') {
                res.send(401).send('Bad Request')
            }else {
                if(newpassword === confirmpassword){
                    const hashedpassword = await bcrypt.hash(newpassword, 10);
                    const resetPassword = await User.updateOne({accessToken: accessToken},{password: hashedpassword}, {new: true});
                    res.status(200).send(resetPassword)
                }
                else {
                    res.status(401).send('Bad Request')
                }
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error')
        }
    },

    //@desc:For Forgot Password
    //@access:PUBLIC
    async forgotPassword(req, res) {
        const { email } = req.body;
        if(!email) return res.status(400).send("Email is required");
        const user = await User.findByEmail( email );
        if(user[0].verified === false) {
            return res.json({message: "please verify your email first"});
        }
        try {
            if(!user) {
                res.status(401).send('There is no user present. Kindly register');
            }
            else {
                await user[0].generateAuthToken("reset");
                res.send("Email sent Successfully. check your inbox");
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server Error");
        }
    },

    //@desc:For Update the Forgot Password
    //@access:PRIVATE
    async updateForgotPassword(req,res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
        }
        const { resetToken } = req.params;
        const {newpassword , confirmpassword} = req.body;
        if(newpassword !== confirmpassword) return res.send("password doesn't match");
        try {
            const payload = await verify(resetToken, process.env.JWT_SECRET_KEY);
            if(payload) {
                const user = await User.find({ resetToken: resetToken});
                user[0].password = newpassword
                user[0].save()
                res.send("password successfully changed");
            }
        } catch (err) {
            console.log(err.message);
            res.send("Server Error");
        }
    },

    //@desc:For registering/login user by Google
    //@access:PUBLIC
    async fetchUserFromGoogle(req, res) {
        const user = req.user;
        const accessToken = await user.generateAuthToken("confirm");
        // Send the token as a cookie ..
        res.cookie("accessToken", accessToken, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
          httpOnly: true,
          sameSite: "none"
        });
        // Redirect to the clients route (http://localhost:1234)
        // res.redirect("http://ccoder.herokuapp.com/#login");
        res.send("Received");
      },

    //@desc:For register/login user by Github
    //@access:PUBLIC
      async fetchUserFromGithub(req, res) {
        const user = req.user;
        const accessToken = await user.generateAuthToken("confirm");
        // Send the token as a cookie ..
        res.cookie("accessToken", accessToken, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
          httpOnly: true,
          sameSite: "none"
        });
        // Redirect to the clients route (http://localhost:1234)
        //res.redirect("http://localhost:1234/#dashboard");
        res.send("Received");
      }


}