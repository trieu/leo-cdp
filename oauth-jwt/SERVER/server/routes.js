var path = require('path')

module.exports = function(app){
    
    var passport = require('passport');
    require('./middlewares/passport')(passport); // pass passport for configuration

	// API Server Endpoints
    app.get('/', function(req, res){
        res.setHeader('Content-Type', 'text/html');
        res.send('<h1>Server API Authetication</h1>');
    });

    app.get('/ping', function(req, res){
        res.send('PONG');
    });

	require("./base/user/route")(app);

}