var CryptoJS = require("crypto-js");
var Common = require('../configs/common');
var privateKey = Common.privateKey;

exports.encode = function(password) {
    console.log(password, privateKey)
    return CryptoJS.AES.encrypt(password, privateKey);
};

exports.decode = function(password) {
    var bytes  = CryptoJS.AES.decrypt(password.toString(), privateKey);
	return bytes.toString(CryptoJS.enc.Utf8);
};