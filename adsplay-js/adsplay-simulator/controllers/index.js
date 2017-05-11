

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

    app.route('/banner').get(function (req, res) {
        var data = {};
        data.head_title = "Demo ad banner";
        res.render('ad-demo/display-ad-banner', data);
    });

    app.route('/masthead').get(function (req, res) {
        var data = {};
        data.head_title = "Demo Ad Masthead";
        res.render('ad-demo/display-ad-masthead', data);
    });

    app.route('/masthead-313').get(function (req, res) {
        var data = {};
        data.head_title = "Demo Ad Masthead";
        data.min = "";
        data.version = "";
        res.render('ad-demo/display-ad-masthead-mobile-1', data);
    });

    app.route('/masthead-314').get(function (req, res) {
        var data = {};
        data.head_title = "Demo Ad Masthead";
        data.min = "";
        data.version = "";
        res.render('ad-demo/display-ad-masthead-mobile', data);
    });

    app.route('/epl-demo').get(function (req, res) {
        var data = {};
        data.head_title = "Demo EPL page";
        res.render('ad-demo/epl-demo-view', data);
    });
   
    app.route('/*').get(function (req, res) {
        var data = {};
        data.head_title = "PAGE NOT FOUND";
        res.render('error/404', data);
    });

};