/**
 * Created by trieu on 5/27/15.
 */

var constant_utils = require('./constant_utils');

var display_utils = require('./display_utils');

exports.baseModel = function(req) {
    var data = {};
    if (NODE_ENV == 'product') {
        data.NODE_ENV = NODE_ENV;
    }
    data.site = siteConfigs;
    data.menus = [];
    data.actions = null;
    data.helpers = {
        buildUrl: function (uri) { return siteConfigs.base_domain + uri ; }
        , formatCurrency: function (value) { return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); }
        , json: function (value) { return JSON.stringify(value);}
    };
    data.dashboard_title = "Real-time Dashboard";
    data.user = display_utils.getUserGuest;
    data.isSuperAdmin = false;
    if(req.session.user){
        data.user = req.session.user;
        data.isSuperAdmin = (data.user.roles['superadmin']) ? true : false;
        data.menus = display_utils.getMenus(data.user.roles);
        data.actions = display_utils.getActions(data.user.roles);
    }
    
    return data;
}
