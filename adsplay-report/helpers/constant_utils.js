/**
 * Created by trieu on 5/27/15.
 */

var statuses = {0:'Invalid', 1:'Pending', 2: 'Running', 3 : 'Finished', 4 : 'Expired'};
var adTypes = {0:'Invalid', 1:'In-Stream', 2: 'Expandable Overlay Banner', 3 : 'Overlay Banner', 4 : 'Break-News'};

var placements = {
    0 : 'Demo',
    100:'Demo', 101:'Live TV for Web', 102:'VOD for Web', 103:'Nhacso.net',120:'FShare-TVC',121:'FShare-DisplayAds',
    201: 'Live TV for SmartTV', 202: 'VOD for SmartTV',
    301 : 'Live TV for Mobile App', 302 : 'VOD for Mobile App',333 : 'Demo', 307 : 'Android-Box LiveTV',308 : 'Android-Box VOD',
    401 : 'FptPlay-Overlay'
};
var userNames = {1000:'Admin', 1001: 'Manager', 1002: 'Customer', 1003 : 'epl_fptplay', 1004: 'Lava', 1005: 'Ambient'};
var sites = {'www.fshare.vn': 'FShare' , 'fptplay-live':'FptPlay-LiveEvent' };
var platforms = {1: 'PC Web' , 2:'Mobile Web', 3: 'Tablet', 4:'Mobile App' , 5:'SmartTV' , 6:'IPTV'};

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


exports.getPlatform = function(id) {
    return platforms[id];
};

exports.statuses= statuses;
exports.placements = placements;
exports.sites = sites;
exports.platforms = platforms;