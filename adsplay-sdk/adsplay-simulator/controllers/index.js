

module.exports = function (app) {

   
    app.route('/ping').get(function (req, res) {
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.end('PONG');
    });

    app.route('/web-masthead').get(function (req, res) {
        var data = {};
        data.head_title = "Demo Web Masthead";
        res.render('ad-demo/web-masthead', data);
    });

    app.route('/mobile-masthead').get(function (req, res) {
        var data = {};
        data.head_title = "Demo Mobile Masthead";
        res.render('ad-demo/mobile-masthead', data);
    });
   
    app.route('/*').get(function (req, res) {
        var data = {};
        data.head_title = "PAGE NOT FOUND";
        res.render('error/404', data);
    });

};