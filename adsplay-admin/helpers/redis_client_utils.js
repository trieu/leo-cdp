/**
 * Created by trieu on 7/6/15.
 */

var redis = require('redis');
var redisPoolsConfig = require('../configs/redis-pools');

var hostAdServer = redisPoolsConfig.hostAdServer.host;
var portAdServer = redisPoolsConfig.hostAdServer.port;

var hostAdData = redisPoolsConfig.hostAdData.host;
var portAdData = redisPoolsConfig.hostAdData.port;

var hostLocationData =  redisPoolsConfig.hostLocationData.host;
var portLocationData = redisPoolsConfig.hostLocationData.port;

var clientAdServer = redis.createClient(portAdServer, hostAdServer);
clientAdServer.on("error", function (err) {
    console.log("Error " + err);
});

var clientAdData = redis.createClient(portAdData, hostAdData);
clientAdData.on("error", function (err) {
    console.log("Error " + err);
});

var clientLocationData = redis.createClient(portLocationData, hostLocationData);
clientLocationData.on("error", function (err) {
    console.log("Error " + err);
});

exports.getRedisClientAdServer = function(){
    return clientAdServer;
}

exports.getRedisAdData= function(){
    return clientAdData;
}

exports.getRedisLocationData= function(){
    return clientLocationData;
}