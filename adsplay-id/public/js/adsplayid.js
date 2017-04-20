function AdsPlayID (server, authServerApp, authUrl, expiryDays) {
    var URL_HOST = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':'+window.location.port: '');
    var key = '.adsplay';
    var that = this;
    //config
    that.server = server || "//id.adsplay.net/"; //sso server
    that.redirect_uri = window.location.href;
    that.attach = ''; //user_info
    that.expiryDays = expiryDays || 2;
    that.login_placement = "[data-login]";
    that.logout_placement = "[data-logout]";

    // test --> http://id.adsplay.net:4000/login?redirect_uri=http://localhost:3000
    
    if(!that.checkCookie("user_token")){
        var user_token = that.getParameterByName('access_token');
        //console.log(user_token)
        if(user_token != null && user_token != ''){
            that.setCookie('user_token', user_token, that.expiryDays);
            that.redirect_uri = that.removeParameterURL('access_token', that.redirect_uri);
            //if authServerApp true => set authorization from server webapp
            if(typeof (authServerApp) !== "undefined" && authServerApp){
                that.authUrl = authUrl || URL_HOST+'/callback';
                var parameter = "access_token="+that.getParameterByName('access_token');
                //console.log(that.authUrl, parameter);
                that.request(that.authUrl, parameter);
            }
        }
        var user_info = that.getParameterByName('user_info');
        if(user_info != null && user_info != ''){
            that.setCookie('user_info', user_info, that.expiryDays);
            that.redirect_uri = that.removeParameterURL('user_info', that.redirect_uri);
        }

        if((user_token != null && user_token != '') && user_token.indexOf(key) != -1){
            return window.location.href = that.redirect_uri;
        }
        
        return window.location.href = this.server + "login?redirect_uri=" + that.redirect_uri;
    }

    window.onclick= function(e, b){
        var dataLogin = document.querySelectorAll(that.login_placement);
        for (var i in dataLogin){
            if (dataLogin.hasOwnProperty(i)) {
                dataLogin[i].addEventListener('click', function() {
                    var attach = (that.attach == 'user_info') ? '&attach=' + that.user_info : "";
                    window.location.href = this.server + "login?redirect_uri=" + that.redirect_uri + attach;
                }, false);
            }
        }

        var dataLogout = document.querySelectorAll(that.logout_placement);
        for (var i in dataLogout){
            if (dataLogout.hasOwnProperty(i)) {
                dataLogout[i].addEventListener('click', function() {
                    window.localStorage.removeItem('user_token');
                    window.localStorage.removeItem('user_info');
                    window.location.href = this.server + "logout";
                }, false);
            }
        }
    };

}

/**
 * set option
 */
AdsPlayID.prototype.setAttach = function(value){
    this.attach = value;
}
AdsPlayID.prototype.setLoginPlacement = function(value){
    this.login_placement = value;
}
AdsPlayID.prototype.setLogoutPlacement = function(value){
    this.logout_placement = value;
}
/**
 * cookie
 */
AdsPlayID.prototype.setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    var exd = exdays || 2;
    d.setTime(d.getTime() + (exd * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

AdsPlayID.prototype.getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

AdsPlayID.prototype.checkCookie = function(cname) {
    var user = this.getCookie(cname);
    if (user != "") {
        return true;
    }
    return false;
}
/**
 * helper
 */
AdsPlayID.prototype.request = function(url, params) {
    
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            console.log(http.responseText);
        }
    }
    http.send(params);
}
// query string: ?foo=lorem&bar=&baz
// var foo = getParameterByName('foo'); // "lorem"
AdsPlayID.prototype.getParameterByName = function(name, url) {
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

AdsPlayID.prototype.removeParameterURL = function(parameter, url) {
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