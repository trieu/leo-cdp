/**
 * Created by trieu on 6/29/16.
 */
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
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now},
    gender: {type: Number, default: 1},
    avatar: {type: String, default: ''}
});

userSchema.plugin(autoIncrement.plugin, {
    model: 'users',
    field: '_id',
    startAt: 1000
});

module.exports =  mongoose.model('users', userSchema);
