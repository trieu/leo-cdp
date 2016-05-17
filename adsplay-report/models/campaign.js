/**
 * Created by trieu on 5/27/15.
 */


// Create new campaign in your database and return its id
exports.create = function(user, text, cb) {
    cb('12345')
}

// Get a particular campaign
exports.get = function(id, data, cb) {
    data.cpid = id;
    cb(null, data)
}

// Get all campaigns
exports.all = function(cb) {
    cb(null, data)
}

// Get all campaigns by a particular user
exports.allByUser = function(sessionId, data , cb) {
    cb(null, data)
}