function AuthModule (auth_server, redirect_uri, callback_method, attach, login_placement, logout_placement) {
    //config
    this.redirect_uri = redirect_uri || window.location.protocol + '//' + window.location.hostname;
    this.callback_method = callback_method || "GET";
    this.attach = attach || 'user_info';
    this.login_placement = login_placement || "[data-login]";
    this.logout_placement = logout_placement || "[data-logout]";

    //check token and set
    var BASE_URL = this.redirect_uri;
    var user_token = this.getParameterByName('access_token');
    if(user_token != null && user_token != ''){
        window.localStorage.setItem('user_token', user_token);
        BASE_URL = this.removeParameterURL('access_token');
    }
    var user_info = this.getParameterByName('user_info');
    if(user_info != null && user_info != ''){
        window.localStorage.setItem('user_info', user_info);
        BASE_URL = this.removeParameterURL('user_info', BASE_URL);
    }

    if((user_token != null && user_token != '') || (user_info != null && user_info != '')){
        window.location.href = BASE_URL;
    }

    $(document).on("click", this.login_placement, function(){
        var attach = (attach == 'user_info') ? '&attach=' + this.user_info : "";
        window.location.href = auth_server + "login?redirect_uri=" + this.redirect_uri + attach;
    });

    $(document).on("click", this.logout_placement, function(){
        window.localStorage.removeItem('user_token');
        window.localStorage.removeItem('user_info');
        window.location.href = auth_server + "logout";
    });

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