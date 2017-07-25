var request = require('request');

module.exports = function(config){

    var sso_url = 'http://id.adsplay.net';
    var sso_url_ssl = 'https://id.adsplay.net';
    var callback_url = "/callback";

    if(config){
        if(config.sso_url){
            sso_url = config.sso_url;
        }
        if(config.sso_url_ssl){
            sso_url_ssl = config.sso_url_ssl;
        }
        if(config.callback_url){
            callback_url = config.callback_url;
        }
    };
    
    var authentication = function(req, res, next) {
        console.log('authentication');
        var URL_BASE = 'https://' + req.get('host');
        //var URL_BASE = req.protocol + '://' + req.get('host');

        if(req.session.user){
            next();
        }
        else{
            if(req.path == config.callback_url && req.query.access_token){
                return request(sso_url + '/userinfo?access_token='+ req.query.access_token, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var user = JSON.parse(body);
                        if(user.success){
                            //save session
                            req.session.user = user.user_info;
                            res.redirect('/');
                        }
                        else{
                            return res.redirect(sso_url_ssl+'/authentication?redirect_uri=' + URL_BASE + callback_url)
                        }
                    }
                })
            }
            else{
                return res.redirect(sso_url_ssl+'/login?redirect_uri=' + URL_BASE + callback_url)
            }
        }
        
    };

    var logout = function(req, res, next) {
        var URL_BASE = 'https://' + req.get('host');
        //var URL_BASE = req.protocol + '://' + req.get('host');
        console.log('logout');
        req.session.destroy();
        return res.redirect(sso_url_ssl+"/logout?redirect_uri=" + URL_BASE + callback_url);
    }

    return {
        authentication: authentication,
        logout: logout
    }
}