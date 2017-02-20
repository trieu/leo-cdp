var CryptoJS = require("crypto-js");
var Common = require('../configs/common');
var privateKey = Common.privateKey;

exports.encrypt = function(password) {
    return CryptoJS.AES.encrypt(password, privateKey);
};

exports.decrypt = function(password) {
    var bytes  = CryptoJS.AES.decrypt(password.toString(), privateKey);
	return bytes.toString(CryptoJS.enc.Utf8);
};