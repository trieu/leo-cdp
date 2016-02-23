/**
 * Created by trieu on 5/27/15.
 */

var siteConfigs = require('../configs/site');
var constant_utils = require('./constant_utils');

exports.baseModel = function(req) {
    var data = {};
    data.site = siteConfigs;
    data.helpers = {
        buildUrl: function (uri) { return siteConfigs.base_domain + uri ; }
        , formatCurrency: function (value) { return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); }
        , json: function (value) { return JSON.stringify(value);}
    };
    data.dashboard_title = siteConfigs.default_title;
    if(req){
        var ssid = parseInt(req.sessionid ? req.sessionid : -1);
        data.auth = (ssid > 0);
        data.ssid = ssid;
        data.isAdminGroup = (ssid == 1000 || ssid == 1001);
        data.userName = constant_utils.getUserName(ssid);
    } else {
        data.auth = false;
        data.ssid = -1;
        data.isAdminGroup = false;
    }

    //Facebook Open Graph
    data.og_url = req.protocol + '://' + req.get('host') + req.originalUrl;
    data.og_image = 'http://xemgiday.com/images/xemgiday.png';
    data.og_description = '';

    return data;
}