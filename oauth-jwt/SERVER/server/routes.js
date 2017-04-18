var path = require('path')

module.exports = function(app){
    
    var passport = require('passport');
    require('./middlewares/passport')(passport); // pass passport for configuration

	// API Server Endpoints
    app.get('/ping', function(req, res){
        res.send('PONG');
    });

	require("./base/user/route")(app);

}