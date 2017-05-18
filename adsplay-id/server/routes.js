var path = require('path')

module.exports = function(app){
    
    var passport = require('passport');
    require('./middlewares/passport')(passport); // pass passport for configuration
    
	// API Server Endpoints
    app.get('/ping', function(req, res){
        res.send('PONG');
    });

    app.get('/file/adsplayid', function (req, res, next) {
        res.sendFile(pathRoot + '/public/js/adsplayid.js');
    });

	require("./base/user/route")(app);

    require("./base/ads/route")(app);

}