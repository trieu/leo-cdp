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

    roles: { type: Array, default: ['user'] },

    local: {
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
        isVerified: {
            type: Boolean,
            default: false
        }
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
    field: '_id'
});

User.statics = {
    saveUser: function(data, callback) {
        var obj = {local: {}};
        obj.local = data;
        this.create(obj, callback);
    },
    findUserUpdate: function(query, user, callback) {
        this.findOneAndUpdate(query, user, callback);
    },
    updateUser: function(user, callback) {
        user.save(callback);
    },

    findUser: function(email, callback) {
        this.findOne({'local.email': email}, callback);
    },

    findUserByIdAndemail: function(id, email, callback) {
        this.findOne({ 'local.email': email, _id: id }, callback);
    }
}

var user = mongoose.model('user', User);

/** export schema */
module.exports = {
    User: user
};