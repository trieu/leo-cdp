function AuthModule (auth_server, redirect_uri, callback_method, attach, login_placement, logout_placement) {
    var that = this;
    //config
    that.redirect_uri = redirect_uri || window.location.protocol + '//' + window.location.hostname;
    that.callback_method = callback_method || "GET";
    that.attach = attach || 'user_info';
    that.login_placement = login_placement || "[data-login]";
    that.logout_placement = logout_placement || "[data-logout]";

    //check token and set
    var BASE_URL = that.redirect_uri;
    var user_token = that.getParameterByName('access_token');
    if(user_token != null && user_token != ''){
        window.localStorage.setItem('user_token', user_token);
        BASE_URL = that.removeParameterURL('access_token');
    }
    var user_info = that.getParameterByName('user_info');
    if(user_info != null && user_info != ''){
        window.localStorage.setItem('user_info', user_info);
        BASE_URL = that.removeParameterURL('user_info', BASE_URL);
    }

    if((user_token != null && user_token != '') || (user_info != null && user_info != '')){
        window.location.href = BASE_URL;
    }

    window.onclick= function(e, b){
        var dataLogin = document.querySelectorAll(that.login_placement);
        for (var i in dataLogin){
            if (dataLogin.hasOwnProperty(i)) {
                dataLogin[i].addEventListener('click', function() {
                    var attach = (attach == 'user_info') ? '&attach=' + that.user_info : "";
                    window.location.href = auth_server + "login?redirect_uri=" + that.redirect_uri + attach;
                }, false);
            }
        }

        var dataLogout = document.querySelectorAll(that.logout_placement);
        for (var i in dataLogout){
            if (dataLogout.hasOwnProperty(i)) {
                dataLogout[i].addEventListener('click', function() {
                    window.localStorage.removeItem('user_token');
                    window.localStorage.removeItem('user_info');
                    window.location.href = auth_server + "logout";
                }, false);
            }
        }
    };

}

// query string: ?foo=lorem&bar=&baz
// var foo = getParameterByName('foo'); // "lorem"
AuthModule.prototype.getParameterByName = function(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

AuthModule.prototype.removeParameterURL = function(parameter, url) {
    //prefer to use l.search if you have a location/link object
    if (!url) {
      url = window.location.href;
    }
    var urlparts= url.split('?');   
    if (urlparts.length>=2) {

        var prefix= encodeURIComponent(parameter)+'=';
        var pars= urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i= pars.length; i-- > 0;) {    
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                pars.splice(i, 1);
            }
        }

        url= urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
        return url;
    } else {
        return url;
    }
}