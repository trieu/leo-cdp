var CryptoJS = require("crypto-js");
var Common = require('../configs/common');
var privateKey = Common.privateKey;

exports.encode = function(password) {
    console.log(password, privateKey)
    return CryptoJS.AES.encrypt(password, privateKey, { iv: CryptoJS.enc.Hex.parse('00000000000000000000000000000000') });
};

exports.decode = function(password) {
    var bytes  = CryptoJS.AES.decrypt(password.toString(), privateKey, { iv: CryptoJS.enc.Hex.parse('00000000000000000000000000000000') });
	return bytes.toString(CryptoJS.enc.Utf8);
};