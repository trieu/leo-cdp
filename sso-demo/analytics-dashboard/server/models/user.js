/**
 * Created by trieu on 6/29/16.
 */
var CryptoJS = require("crypto-js");
var dbConfig = require('../configs/database');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

//setup connect autoIncrement
var connection = mongoose.createConnection(dbConfig.url);
autoIncrement.initialize(connection);

var userSchema = new mongoose.Schema({
    _id: {type: Number, required: true, index: true},
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    roles: {type: String, default: 'user'},
    status: {type: Number, default: 0}, //status = {0: "disable", 1: "enable", 2: "banner"}
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    gender: {type: Number, default: 1},
    avatar: {type: String, default: ''}
});

userSchema.plugin(autoIncrement.plugin, {
    model: 'users',
    field: '_id',
    startAt: 1000
});

// generating a hash
userSchema.methods.generateHash = function(password) {
	// Encrypt 
	return CryptoJS.AES.encrypt(password, SALT);
};

// checking if password is valid
userSchema.methods.validPassword = function(password, passwordHash) {
	// Decrypt 
	var bytes  = CryptoJS.AES.decrypt(passwordHash.toString(), SALT);
	var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    console.log(plaintext)
	return (password == plaintext);
};

module.exports =  mongoose.model('users', userSchema);
