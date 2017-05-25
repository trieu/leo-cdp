module.exports = function(app) {

  // all other routes are handled by Angular
  app.get('/*', function(req, res) {
      res.sendFile('./index.html', { root: __dirname + "/../public"});
  });

};
