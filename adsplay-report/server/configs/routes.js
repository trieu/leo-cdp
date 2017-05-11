var request = require('request');
var commonConfigs = require('./common.js')(NODE_ENV);
var params = require('../helpers/params_utils.js');
module.exports = function(app) {
  
  // set user_info
  app.post('/callback', function(req, res) {
      var urlApp = req.protocol + '://' + req.get('host');
      var user_token = req.query.access_token || req.cookies['user_token'];
      
      request(commonConfigs.sso+'userinfo?access_token='+user_token, function (error, response, body) {
        //console.log(body)
        if(!error){
          var result = JSON.parse(body);
          req.session.user = result.user_info;
          // set cookie if need
          // res.cookie('user_info', JSON.stringify(result.user_info), { signed: false, encode: String, maxAge: commonConfigs.session });
          return res.json(result);
        }
        else{
          return res.json({success: false, redirect_uri: commonConfigs.sso+'login?redirect_uri='+urlApp});
        }
      });
  });

  // app.use((req, res, next) => {
  //   console.log(' ====== DEBUG ====== '); // DEBUG
  //   next();
  // });
  
  // all other routes are handled by Angular
  app.get('/*', function(req, res) {
      res.sendFile('./public/layout.html', { root: __dirname + "/../../"});
  });

};
