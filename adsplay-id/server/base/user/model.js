/*
    @model user
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    db = require('../../configs/database').db;

autoIncrement.initialize(db);

/**
 * @module  User
 * @description contain the details of Attribute
 */

var User = new Schema({
    status: { type: Boolean, default: true },

    roles: { type: Schema.Types.Mixed, default: {"user": true} },

    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },

});

User.plugin(autoIncrement.plugin, {
    model: 'user',
    field: '_id',
    startAt: 1000
});

User.statics = {
    saveUser: function(data, callback) {
        var obj = {};
        obj = data;
        this.create(obj, callback);
    },
    findUserUpdate: function(query, user, callback) {
        this.findOneAndUpdate(query, {$set: user}, callback);
    },
    updateUser: function(user, callback) {
        user.save(callback);
    },

    findUser: function(username, callback) {
        this.findOne({'username': username}, callback);
    },

    findUserByIdAndemail: function(id, username, callback) {
        this.findOne({ 'username': username, _id: id }, callback);
    }
}

var user = mongoose.model('user', User);

/** export schema */
module.exports = {
    User: user
};