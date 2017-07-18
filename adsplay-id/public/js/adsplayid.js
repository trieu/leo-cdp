window.$$ = function(selector) {
    var selectorType = 'querySelectorAll';
    if (selector.indexOf('#') === 0) {
        selectorType = 'getElementById';
        selector = selector.substr(1, selector.length);
    }
    return document[selectorType](selector);
};
/**
 *  Copyright 2012-2013 (c) Pierre Duquesne <stackp@online.fr>
 *  Licensed under the New BSD License.
 *  https://github.com/stackp/promisejs
 */
(function(exports) {

    function Promise() {
        this._callbacks = [];
    }

    Promise.prototype.then = function(func, context) {
        var p;
        if (this._isdone) {
            p = func.apply(context, this.result);
        } else {
            p = new Promise();
            this._callbacks.push(function () {
                var res = func.apply(context, arguments);
                if (res && typeof res.then === 'function')
                    res.then(p.done, p);
            });
        }
        return p;
    };

    Promise.prototype.done = function() {
        this.result = arguments;
        this._isdone = true;
        for (var i = 0; i < this._callbacks.length; i++) {
            this._callbacks[i].apply(null, arguments);
        }
        this._callbacks = [];
    };

    function join(promises) {
        var p = new Promise();
        var results = [];

        if (!promises || !promises.length) {
            p.done(results);
            return p;
        }

        var numdone = 0;
        var total = promises.length;

        function notifier(i) {
            return function() {
                numdone += 1;
                results[i] = Array.prototype.slice.call(arguments);
                if (numdone === total) {
                    p.done(results);
                }
            };
        }

        for (var i = 0; i < total; i++) {
            promises[i].then(notifier(i));
        }

        return p;
    }

    function chain(funcs, args) {
        var p = new Promise();
        if (funcs.length === 0) {
            p.done.apply(p, args);
        } else {
            funcs[0].apply(null, args).then(function() {
                funcs.splice(0, 1);
                chain(funcs, arguments).then(function() {
                    p.done.apply(p, arguments);
                });
            });
        }
        return p;
    }

    /*
     * AJAX requests
     */

    function _encode(data) {
        var payload = "";
        if (typeof data === "string") {
            payload = data;
        } else {
            var e = encodeURIComponent;
            var params = [];

            for (var k in data) {
                if (data.hasOwnProperty(k)) {
                    params.push(e(k) + '=' + e(data[k]));
                }
            }
            payload = params.join('&')
        }
        return payload;
    }

    function new_xhr() {
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        return xhr;
    }


    function ajax(method, url, data, headers) {
        var p = new Promise();
        var xhr, payload;
        data = data || {};
        headers = headers || {};

        try {
            xhr = new_xhr();
        } catch (e) {
            p.done(promise.ENOXHR, "");
            return p;
        }

        payload = _encode(data);
        if (method === 'GET' && payload) {
            url += '?' + payload;
            payload = null;
        }

        xhr.open(method, url);

        var content_type = 'application/x-www-form-urlencoded';
        for (var h in headers) {
            if (headers.hasOwnProperty(h)) {
                if (h.toLowerCase() === 'content-type')
                    content_type = headers[h];
                else
                    xhr.setRequestHeader(h, headers[h]);
            }
        }
        xhr.setRequestHeader('Content-type', content_type);


        function onTimeout() {
            xhr.abort();
            p.done(promise.ETIMEOUT, "", xhr);
        }

        var timeout = promise.ajaxTimeout;
        if (timeout) {
            var tid = setTimeout(onTimeout, timeout);
        }

        xhr.onreadystatechange = function() {
            if (timeout) {
                clearTimeout(tid);
            }
            if (xhr.readyState === 4) {
                var err = (!xhr.status ||
                           (xhr.status < 200 || xhr.status >= 300) &&
                           xhr.status !== 304);
                p.done(err, xhr.responseText, xhr);
            }
        };

        xhr.send(payload);
        return p;
    }

    function _ajaxer(method) {
        return function(url, data, headers) {
            return ajax(method, url, data, headers);
        };
    }

    var promise = {
        Promise: Promise,
        join: join,
        chain: chain,
        ajax: ajax,
        get: _ajaxer('GET'),
        post: _ajaxer('POST'),
        put: _ajaxer('PUT'),
        del: _ajaxer('DELETE'),

        /* Error codes */
        ENOXHR: 1,
        ETIMEOUT: 2,

        /**
         * Configuration parameter: time in milliseconds after which a
         * pending AJAX request is considered unresponsive and is
         * aborted. Useful to deal with bad connectivity (e.g. on a
         * mobile network). A 0 value disables AJAX timeouts.
         *
         * Aborted requests resolve the promise with a ETIMEOUT error
         * code.
         */
        ajaxTimeout: 0
    };

    if (typeof define === 'function' && define.amd) {
        /* AMD support */
        define(function() {
            return promise;
        });
    } else {
        exports.promise = promise;
    }

})(this);
/**
 * cookie
 */
var CookieToken = function(cookieName){
    var that = this;

    that.cname = cookieName || 'token_adsplayid';

    that.set = function(cvalue, exdays) {
        var d = new Date();
        var exd = exdays || 2;
        d.setTime(d.getTime() + (exd * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = that.cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    that.get = function() {
        var name = that.cname + "=";
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

    that.delete = function() {
        document.cookie = that.cname+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    that.check = function() {
        var user = that.get();
        if (user != "") {
            return true;
        }
        return false;
    }

}

// query string: ?foo=lorem&bar=&baz
// var foo = getParameterByName('foo'); // "lorem"
function getParameterByName(name, url) {
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

function removeParameterURL(parameter, url) {
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

var AdsPlayID = function (SSO) {
    if($$('[data-adsplayid]').length <= 0){
        console.log("Can not find placement authentication");
        return;
    }
    var that = this;
    //static
    var SSO_URL = '//id.adsplay.net';
    var COOKIE_NAME = 'adsplayid';

    var URL_HOST = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':'+window.location.port: '');
    var URL_BASE = removeParameterURL('access_token', window.location.href);

    //config
    that.SSO = SSO || SSO_URL;
    that.el = $$('[data-adsplayid]')[0];
    that.key = that.el.getAttribute('data-key') || '.adsplay';
    that.expiryDays = that.el.getAttribute('data-expiryDays') || 2; //2 day
    that.refreshToken = that.el.getAttribute('data-refreshToken') || 1; //1 hour
    that.serverVerify = that.el.getAttribute('data-serverVerify') || false;
    that.serverVerifyUrl = that.el.getAttribute('data-serverVerifyUrl') || '/callback';

    that.login_placement = "[data-adsplayid-login]";
    that.logout_placement = "[data-adsplayid-logout]";

    that.cookie = new CookieToken(COOKIE_NAME);

    that.getCookie = function(){
        return that.cookie.get();
    }

    function setToken(){
        var location_token = window.location.href;
        var access_token = getParameterByName('access_token');
        if(location_token.indexOf(that.key) && (access_token != null && access_token != '')){
            that.cookie.set(access_token, that.expiryDays);
            var newUri = removeParameterURL('access_token', location_token);
            history.pushState(null, null, newUri);
            return true;
        }
        return false;
    }

    function check(){
        if(that.cookie.get() == ""){
            if(!setToken()){
                //authentication
                return window.location.href = that.SSO+"/authentication?redirect_uri=" + URL_BASE;
            }
        }
        else{
            if(!setToken()){

                //check valid token
                promise.get(that.SSO+'/check-token?access_token='+that.cookie.get())
                .then(function(error, text, xhr) {
                    if (error) {
                        console.log('Error ' + xhr.status);
                        return;
                    }
                    text = JSON.parse(text);
                    if(!text.success){
                        if(text.message == "jwt expired"){
                            return window.location.href = that.SSO+"/authentication?redirect_uri=" + URL_BASE;
                        }
                        return window.location.href = that.SSO+"/login?redirect_uri=" + URL_BASE;
                    }
                    
                });

            }
        }
    }
    check();

    // //request refresh token
    setTimeout(function(){
        check();
    }, that.refreshToken * 1000 * 60 * 60);
    

    window.onclick= function(e, b){
        var dataLogin = document.querySelectorAll(that.login_placement);
        for (var i in dataLogin){
            if (dataLogin.hasOwnProperty(i)) {
                dataLogin[i].addEventListener('click', function() {
                    window.location.href = that.SSO + "/login?redirect_uri=" + URL_BASE;
                }, false);
            }
        }

        var dataLogout = document.querySelectorAll(that.logout_placement);
        for (var i in dataLogout){
            if (dataLogout.hasOwnProperty(i)) {
                dataLogout[i].addEventListener('click', function() {
                    that.cookie.delete();
                    window.location.href = that.SSO + "/logout?redirect_uri=" + URL_BASE;
                }, false);
            }
        }
    };

}