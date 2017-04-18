var bcrypt = require("bcryptjs");
var Common = require('../configs/common');
var salt = Common.privateKey;

exports.hash = function(password) {
    return bcrypt.hashSync(password, salt);
};

exports.compare = function(password, hash) {
	return bcrypt.compareSync(password, hash);
};