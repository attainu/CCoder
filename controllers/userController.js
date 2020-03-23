const User = require('../models/User');
const Discussion = require('../models/Discussion');

module.exports = {
    async userRegister(req, res) {
        try {
            const user = req.body;
            if(!user.email || !user.password || !user.name ){
                return res.status(400).send({ statusCode: 400, message: "Bad request"});
            }
            const createUser = await User.create(user);
            const accessToken = await createUser.generateAuthToken();
            res.status(201).json({
                statusCode:201,
                createUser,
                accessToken: accessToken,
                expiresIn: "24h"
            });
        } catch (err) {
            console.log(err)
            res.status(500).send('Server Error');
        }
    },

    async userLogin(req, res) {
        try {
            const {email, password} = req.body;
            if(!email || !password) return res.status(400).json({statusCode:400, message: 'Invalid Credentials'});
            const user = await User.findByEmailAndPassword(email, password);
            const accessToken = await user.generateAuthToken();
            res.status(200).json({
                statusCode:200,
                user,
                accessToken: accessToken,
                expiresIn: "24h"
            });
            
        } catch (err) {
            if(err.name === 'AuthError'){
                res.json({message: err.message})
            }
        }
    },

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

    async singleUser(req, res){
        res.json(req.user)
    }

}