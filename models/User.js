const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const Schema = mongoose.Schema;

// Schema for userS
const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        username:{
            type:String,
            trim:true,
            unique:true,
            required: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required:  function() {
                return !this.isThirdPartyUser;
              },
            trim: true
        },
        experience: {
            type: String,
            trim: true
        },
        education: {
            type: String,
            trim: true
        },
        accessToken: {
            type: String
        },
        contests: [
            {
                type: Schema.Types.ObjectId,
                ref: "contest"
            }
        ],
        moderator: [
            {
                type: Schema.Types.ObjectId,
                ref: "contest"
            }
        ],
        discussions: [
            {
                type: Schema.Types.ObjectId,
                ref: "discussion"
            }
        ],
        bookmarks: [
            {
                type: Schema.Types.ObjectId,
                ref: "challenge",
            }
        ],
        submissions: [
            {
                type: Schema.Types.ObjectId,
                ref: "submission"
            }
        ],
        challenge:[
            {
                type: Schema.Types.ObjectId,
                ref: "challenge"
            }
        ],
        isThirdPartyUser: {
            type: Boolean,
            required: true
          }
    },
    { timestamps: true}
);

//static method to find user by email and password
userSchema.statics.findByEmailAndPassword = async (email, password) => {
    try {
        const user = await User.findOne({ email: email});
        if(!user) throw new Error("Invalid Credentials");
        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched) throw new Error("Invalid Credentials");
        return user;
    } catch (err) {
        err.name = 'AuthError';
        throw err;
    }
};

//method to generate a authToken
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    
    const accessToken = await sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "24h"
    });
    user.accessToken = accessToken;
    await user.save();
    return accessToken;
}

//static method to null the accessToken of the user
userSchema.statics.nullifyToken = async (token) => {
    try {
        const user = await User.findOne({accessToken: token})
        user.accessToken = null;
        user.save();
        return user
        
    } catch (err) {
        console.log(err.message)   
    }
}

//static method to find user by password

userSchema.statics.findByPassword = async (accessToken, oldpassword) => {
    try {
        const user = await User.findOne({accessToken:accessToken});
        if(!user) throw new Error("Invalid Credentials");
        const isMatched = await bcrypt.compare(oldpassword, user.password);
        if(!isMatched) throw new Error("Invalid Credentials");
        return user;
    } catch (err) {
        err.name = 'AuthError';
        throw err;
    }
};

userSchema.pre("save", async function(next) {
    const user = this;
    try {
        if(user.isModified("password")) {
            const hashedpassword = await bcrypt.hash(user.password, 10);
            user.password = hashedpassword;
            next()
        }
    } catch (err) {
        console.log(err.message)
        next(err)        
    }

});

const User = mongoose.model("user", userSchema);

module.exports = User;