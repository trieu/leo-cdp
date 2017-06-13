var Common = require('../configs/common.js');
var request = require('request');

module.exports = function(app) {

  app.post('/callback', function(req, res) {
      var urlApp = req.protocol + '://' + req.get('host');
      var user_token = req.query.access_token || req.cookies['user_token'];
      if(user_token){
        request(Common.SSO+'userinfo?access_token='+user_token, function (error, response, body) {
          //console.log(body)
          if(!error && response.statusCode == 200){
            var result = JSON.parse(body);
            //console.log(result);
            req.session.user = result.user_info;
            // set cookie if need
            // res.cookie('user_info', JSON.stringify(result.user_info), { signed: false, encode: String, maxAge: Common.session });
            return res.json(result);
          }
          else{
            return res.json({success: false, redirect_uri: Common.SSO+'login?redirect_uri='+urlApp});
          }
        });
      }
      else{
        return res.json({success: false, redirect_uri: Common.SSO+'login?redirect_uri='+urlApp});
      }
  });

  // all other routes are handled by Angular
  app.get('/*', function(req, res) {
      res.sendFile('./index.html', { root: __dirname + "/../public"});
  });

};
