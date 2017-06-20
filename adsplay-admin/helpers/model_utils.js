/**
 * Created by trieu on 5/27/15.
 */

var constant_utils = require('./constant_utils');

var adminIds = {1000: 1, 1001: 1};
var operatorIds = {1000: 1, 1001: 1, 1007: 1, 1003: 1, 1006: 1, 1008 : 1};
var liveEventIds = {1000: 1, 1001: 1, 1007: 1, 1003: 1, 1006: 1, 1008 : 1, 1017: 1};

exports.baseModel = function(req) {
    var data = {};
    if (NODE_ENV == 'product') {
        data.NODE_ENV = NODE_ENV;
    }
    data.site = siteConfigs;
    data.helpers = {
        buildUrl: function (uri) { return siteConfigs.base_domain + uri ; }
        , formatCurrency: function (value) { return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); }
        , json: function (value) { return JSON.stringify(value);}
    };
    data.dashboard_title = "Real-time Dashboard";
    if(req){
        //console.log(req.user);
        var ssid = -1;
        if( typeof req.user != 'undefined' || req.user != null ){
            ssid = parseInt(req.user.id);
            data.userName = req.user.username;
            data.roles = req.user.roles;
        }

        data.auth = (ssid > 0);
        data.ssid = ssid;
        data.isSuperAdminGroup = (ssid == 1000);
        data.isAdminGroup = adminIds[ssid] == 1;
        data.editable = operatorIds[ssid] == 1;
        data.isOperatorGroup = operatorIds[ssid] == 1;
        data.isliveEventGroup = liveEventIds[ssid] == 1;

    } else {
        data.auth = false;
        data.ssid = -1;
        data.isAdminGroup = false;
        data.isOperatorGroup = false;
        data.userName = "Guest";
    }

    return data;
}
