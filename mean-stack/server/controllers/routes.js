var creative = require('./creative.js');

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

  creative(app);
  // app.use((req, res, next) => {
  //   console.log(' ====== DEBUG ====== '); // DEBUG
  //   next();
  // });
  
  // all other routes are handled by Angular
  app.get('/*', function(req, res) {
      res.sendFile('/app/layout.html', { root: __dirname + "/../../"});
  });

};
