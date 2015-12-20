/**
 * Created by trieu on 5/27/15.
 */

var redisClientUtils = require('../helpers/redis_client_utils');
var client = redisClientUtils.getRedisAdData();

// Create new creative in your database and return its id
exports.create = function(user, text, cb) {
    cb('12345')
}

// Get a particular creative
exports.get = function(id, data, cb) {
    data.cpid = id;
    cb(null, data)
}

// Get all creatives
exports.all = function(cb) {
    cb(null, [])
}

// Get all creatives by a particular user
exports.allByUser = function(sessionId, data , cb) {
    cb(null, data)
}


