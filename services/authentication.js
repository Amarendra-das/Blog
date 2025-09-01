const JWT = require("jsonwebtoken");
require('dotenv').config();

const secret = process.env.JWT_SECRET;

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        ProfileImageURL: user.ProfileImageURL, 
        role: user.role,
        fullName: user.fullName,
    };
    
    const token = JWT.sign(payload, secret);
    
    return token;
}

function validateToken(token) {
    if (!token) return null;
    
    try {
        return JWT.verify(token, secret);
    } catch (error) {
        return null;
    }
}

module.exports = {
    createTokenForUser,
    validateToken,
};