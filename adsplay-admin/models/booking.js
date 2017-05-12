/**
 * Created by trieu on 5/27/15.
 */

var redisClientUtils = require('../helpers/redis_client_utils');
var client = redisClientUtils.getRedisAdData();

// Create new creative in your database and return its id
exports.create = function(name, des, imp, youtube,runDate, tgpms, tgpfs, tggds, tglocs , cb) {

    var sampleAdData =
    {
        "id":0,
        "name":name,
        "desc":desc,
        "imp":imp,
        "youtube":youtube,

        "runDate": runDate,

        "tgpms": tgpms,
        "tgpfs":tgpfs,
        "tggds":tggds,
        "tglocs":tglocs
    };

}

// Get a particular bookings
exports.get = function(id, data, cb) {
    data.cpid = id;
    cb(null, data)
}

// Get all bookings
exports.all = function(cb) {
    cb(null, [])
}

// Get all bookings by a particular user
exports.allByUser = function(sessionId, data , cb) {
    cb(null, data)
}




