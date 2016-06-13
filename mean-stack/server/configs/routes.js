var passport = require('passport');

module.exports = function(app) {

  //passport
  app.use(passport.initialize());
  app.use(passport.session());

  var auth = require('../middlewares/passport-utils.js')(passport);
  app.get('/loggedin', auth.isLoggedIn);
  app.post('/login', auth.loginLocal);
  app.get('/logout', auth.logOut);
  //end passport

  app.use((req, res, next) => {
    console.log('I sense a disturbance in the force...'); // DEBUG
    next();
  });
  
  // all other routes are handled by Angular
  app.get('/*', function(req, res) {
      res.sendFile('/app/layout.html', { root: __dirname + "/../../"});
  });

};
