module.exports = function(app){
    // API Server Endpoints
    var Ads = require('./controller');

    app.get('/ads/api-roles-ads', Ads.apiRolesAds);
    app.get('/ads/api-roles-placement', Ads.apiRolesPlacement);

};