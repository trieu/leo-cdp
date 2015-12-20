/**
 * Created by trieu on 5/27/15.
 */

var statuses = {0:'Invalid', 1:'Pending', 2: 'Running', 3 : 'Finished', 4 : 'Expired'};
var adTypes = {0:'Invalid', 1:'In-Stream', 2: 'Expandable Overlay Banner', 3 : 'Overlay Banner', 4 : 'Break-News'};
var placements = {100:'Demo', 101:'Live TV for Web', 102:'VOD for Web', 103:'Nhacso.net', 201: 'Live TV for SmartTV', 202: 'VOD for SmartTV', 301 : 'Live TV for Mobile App', 302 : 'VOD for Mobile App'};
var userNames = {1000:'Admin', 1001: 'Manager', 1002: 'Customer'};
var sites = {'www.fshare.vn': 'FShare'};

exports.getStatus = function(id) {
    return statuses[id];
};

exports.getAdType = function(id) {
    return adTypes[id];
};

exports.getUserName = function(id) {
    return userNames[id];
};

exports.getPlacement = function(id) {
    return placements[id];
};

exports.getSite = function(id) {
    return sites[id];
};

exports.statuses= statuses;
exports.placements = placements;
exports.sites = sites;