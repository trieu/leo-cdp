//symmetric-key algorithms
var pbkdf2 = require('pbkdf2');
var Common = require('../configs/common');
var salt = Common.privateKey;

exports.hash = function(password) {
    return pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha512');
};

exports.compare = function(password, hash) {
	return pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha512') == hash;
};