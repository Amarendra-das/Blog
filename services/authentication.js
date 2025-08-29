

const JWT = require("jsonwebtoken");

const secret = "$uperMan@123";

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.ProfileImageURL, 
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