module.exports = function(app){
    // API Server Endpoints
    var Ads = require('./controller');

    app.get('/ads/api-roles-ads', Ads.apiRolesAds);
    app.get('/ads/api-roles-placement', Ads.apiRolesPlacement);

    app.get('/ads/api-roles-ads/list', Ads.apiRolesAdsList);
    app.get('/ads/api-roles-ads/detail', Ads.apiRolesAdsDetail);
    app.get('/ads/api-roles-ads/update/status', Ads.apiRolesAdsUpdateStatus);

};