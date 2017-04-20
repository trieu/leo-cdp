var request = require('request');
module.exports = function(app) {

  //passport
  var passport = require('passport');
  app.use(passport.initialize());
  app.use(passport.session());

  var auth = require('../middlewares/passport_utils.js')(passport);
  app.get('/loggedin', auth.isLoggedIn);
  app.post('/login', auth.loginLocal);
  app.get('/logout', auth.logOut);
  //end passport

  app.post('/callback', function(req, res) {
      var user_token = req.query.access_token || req.cookies['user_token'];
      console.log(user_token);
      request('http://id.adsplay.net/userinfo?access_token='+user_token, function (error, response, body) {
        if(!error){
          var result = JSON.parse(body);
          console.log(result)
          req.session.user = result.user_info;
          res.cookie('user_info', 'value', {maxAge : 9999});
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
