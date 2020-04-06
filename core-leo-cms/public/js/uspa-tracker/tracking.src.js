/**
 * USPA_Tracker 1.0 - built on 22/01/2020
 */
(function (global, undefined) {
    'use strict';

    var factory = function (window) {
        if (typeof window.document !== 'object') {
            throw new Error('USPA_Cookies.js requires a `window` with a `document` object');
        }

        var USPA_Cookies = function (key, value, options) {
            return arguments.length === 1 ?
                USPA_Cookies.get(key) : USPA_Cookies.set(key, value, options);
        };

        // Allows for setter injection in unit tests
        USPA_Cookies._document = window.document;

        // Used to ensure cookie keys do not collide with
        // built-in `Object` properties
        USPA_Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)

        USPA_Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

        USPA_Cookies.defaults = {
            path: '/',
            secure: false
        };

        USPA_Cookies.get = function (key) {
            if (USPA_Cookies._cachedDocumentCookie !== USPA_Cookies._document.cookie) {
                USPA_Cookies._renewCache();
            }

            return USPA_Cookies._cache[USPA_Cookies._cacheKeyPrefix + key];
        };

        USPA_Cookies.set = function (key, value, options) {
            options = USPA_Cookies._getExtendedOptions(options);
            options.expires = USPA_Cookies._getExpiresDate(value === undefined ? -1 : options.expires);

            USPA_Cookies._document.cookie = USPA_Cookies._generateUSPA_Cookiestring(key, value, options);

            return USPA_Cookies;
        };

        USPA_Cookies.expire = function (key, options) {
            return USPA_Cookies.set(key, undefined, options);
        };

        USPA_Cookies._getExtendedOptions = function (options) {
            return {
                path: options && options.path || USPA_Cookies.defaults.path,
                domain: options && options.domain || USPA_Cookies.defaults.domain,
                expires: options && options.expires || USPA_Cookies.defaults.expires,
                secure: options && options.secure !== undefined ? options.secure : USPA_Cookies.defaults.secure
            };
        };

        USPA_Cookies._isValidDate = function (date) {
            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
        };

        USPA_Cookies._getExpiresDate = function (expires, now) {
            now = now || new Date();

            if (typeof expires === 'number') {
                expires = expires === Infinity ?
                    USPA_Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
            } else if (typeof expires === 'string') {
                expires = new Date(expires);
            }

            if (expires && !USPA_Cookies._isValidDate(expires)) {
                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
            }

            return expires;
        };

        USPA_Cookies._generateUSPA_Cookiestring = function (key, value, options) {
            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
            options = options || {};

            var USPA_Cookiestring = key + '=' + value;
            USPA_Cookiestring += options.path ? ';path=' + options.path : '';
            USPA_Cookiestring += options.domain ? ';domain=' + options.domain : '';
            USPA_Cookiestring += options.expires ? ';expires=' + options.expires.toUTCString() : '';
            USPA_Cookiestring += options.secure ? ';secure' : '';

            return USPA_Cookiestring;
        };

        USPA_Cookies._getCacheFromString = function (documentCookie) {
            var cookieCache = {};
            var USPA_CookiesArray = documentCookie ? documentCookie.split('; ') : [];

            for (var i = 0; i < USPA_CookiesArray.length; i++) {
                var cookieKvp = USPA_Cookies._getKeyValuePairFromUSPA_Cookiestring(USPA_CookiesArray[i]);

                if (cookieCache[USPA_Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
                    cookieCache[USPA_Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
                }
            }

            return cookieCache;
        };

        USPA_Cookies._getKeyValuePairFromUSPA_Cookiestring = function (USPA_Cookiestring) {
            // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
            var separatorIndex = USPA_Cookiestring.indexOf('=');

            // IE omits the "=" when the cookie value is an empty string
            separatorIndex = separatorIndex < 0 ? USPA_Cookiestring.length : separatorIndex;

            return {
                key: decodeURIComponent(USPA_Cookiestring.substr(0, separatorIndex)),
                value: decodeURIComponent(USPA_Cookiestring.substr(separatorIndex + 1))
            };
        };

        USPA_Cookies._renewCache = function () {
            USPA_Cookies._cache = USPA_Cookies._getCacheFromString(USPA_Cookies._document.cookie);
            USPA_Cookies._cachedDocumentCookie = USPA_Cookies._document.cookie;
        };

        USPA_Cookies._areEnabled = function () {
            var testKey = 'USPA_Cookies.js';
            var areEnabled = USPA_Cookies.set(testKey, 1).get(testKey) === '1';
            USPA_Cookies.expire(testKey);
            return areEnabled;
        };

        USPA_Cookies.enabled = USPA_Cookies._areEnabled();

        return USPA_Cookies;
    };

    var USPA_CookiesExport = typeof global.document === 'object' ? factory(global) : factory;

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return USPA_CookiesExport;
        });
        // CommonJS/Node.js support
    } else if (typeof exports === 'object') {
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.USPA_Cookies = USPA_CookiesExport;
    } else {
        global.USPA_Cookies = USPA_CookiesExport;
    }
})(typeof window === 'undefined' ? this : window);


(function (global, undefined) {
    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    function getHashedId(uri) {
        var url = getBaseUrl() + uri;
        return new UUID(5, "ns:URL", url).format("b16").toLowerCase()
    }

    function getBaseUrl(){
        return window.__uspaBaseLogUrl || 'http://localhost:8181/sdc/v1';
    }

    function getUUID() {
        var key = 'uspa_uid';
        var uuid = USPA_Cookies.get(key);
        if (!uuid) {
            uuid = getHashedId(generateUUID());
            USPA_Cookies.set(key, uuid, { expires: 315569520 }); // Expires in 10 years
        }
        return uuid;
    }

    var getTrackingUrl = function (metric, trackedData) {
        var uuid = getUUID();
        var q = '&uuid=' + uuid + '&' + trackedData;

        //sharding base log domain
        var baseUrl = getBaseUrl();
        var ran = Math.round(Math.random() * 10) % 3;
        if (ran === 1) {
         
        } else if (ran === 2) {
           
        }
        return baseUrl + '?metric=' + metric  + q;
    };

    var doTracking = function (metric, trackedData) {
        var imgTracking = new Image();
        imgTracking.src = getTrackingUrl(metric, trackedData);
        imgTracking.setAttribute('style', 'width:0px!important;height:0px!important;display:none!important');
        document.body.appendChild(imgTracking);
    }

    var USPA_Tracker = {};
    USPA_Tracker.doTracking = doTracking;
    global.USPA_Tracker = USPA_Tracker;

})(typeof window === 'undefined' ? this : window);
