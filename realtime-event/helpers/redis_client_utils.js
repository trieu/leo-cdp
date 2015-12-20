/**
 * Created by trieu on 7/6/15.
 */

var redis = require('redis');

var hostAdServer = "127.0.0.1"
var portAdServer = 6379

var hostAdData = "127.0.0.1"
var portAdData = 6379

var hostLocationData =  "127.0.0.1"
var portLocationData = 6379

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