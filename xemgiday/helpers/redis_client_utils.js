/**
 * Created by trieu on 7/6/15.
 */

var redis = require('redis');
var redisPoolsConfig = require('../configs/redis-pools');

var hostLocationData = redisPoolsConfig.dataLocation.host;
var portLocationData =  redisPoolsConfig.dataLocation.port;


var clientLocationData = redis.createClient(portLocationData, hostLocationData);
clientLocationData.on("error", function (err) {
    console.log("Error " + err);
});


exports.getRedisLocationData= function(){
    return clientLocationData;
}