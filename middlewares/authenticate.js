const User = require('../models/User');
const { verify } = require('jsonwebtoken');

//Middleware to authenticate the user
module.exports = async (req, res, next) => {
    try {
        const authToken = req.params.token;
        if(authToken) {
            const token = await verify(authToken, process.env.JWT_SECRET_KEY);

            const user = await User.findOne({ _id: token.id})
            
            req.user = user
            next()
        }
    } catch (err) {
        console.log(err.message)
        res.status(403).json({error:err.message});
    }
}
