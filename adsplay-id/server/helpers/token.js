var Jwt = require('jsonwebtoken')
var Common = require('../configs/common')

var lastToken = '.adsplay';
exports.lastToken = lastToken;
// ---------------------------------------------------------
// decode token
// ---------------------------------------------------------
var decodeToken = function(token){
    try {
        token = token.replace(".adsplay", "");
        var decoded = Jwt.verify(token, Common.privateKey);
        decoded = (decoded._doc) ? decoded._doc : decoded;
        return { success: true, user_info: decoded };
    } catch(err) {
        //'Failed to authenticate token.'
        return { success: false, message: err.message };
    }
}
exports.decodeToken = decodeToken;

// ---------------------------------------------------------
// create token
// ---------------------------------------------------------
exports.createToken = function(user){
    var token = Jwt.sign(user, Common.privateKey, {
        expiresIn: Common.tokenExpiry
    });
    return token + lastToken;
}


// ---------------------------------------------------------
// check token
// ---------------------------------------------------------
exports.checkToken = function(token){
    if (token && token.indexOf(lastToken) != -1) {
        return decodeToken(token);
    }
    else{
        return { success: false, message: 'Failed to authenticate token' };
    }
}
