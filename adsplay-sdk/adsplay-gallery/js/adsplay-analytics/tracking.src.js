/**
 * AdsPlayAnalytics 1.0 for iTVad.vn - built on 06/08/2015
 */
(function (global, undefined) {
    'use strict';

    var factory = function (window) {
        if (typeof window.document !== 'object') {
            throw new Error('AdsPlayCookies.js requires a `window` with a `document` object');
        }

        var AdsPlayCookies = function (key, value, options) {
            return arguments.length === 1 ?
                AdsPlayCookies.get(key) : AdsPlayCookies.set(key, value, options);
        };

        // Allows for setter injection in unit tests
        AdsPlayCookies._document = window.document;

        // Used to ensure cookie keys do not collide with
        // built-in `Object` properties
        AdsPlayCookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)

        AdsPlayCookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

        AdsPlayCookies.defaults = {
            path: '/',
            secure: false
        };

        AdsPlayCookies.get = function (key) {
            if (AdsPlayCookies._cachedDocumentCookie !== AdsPlayCookies._document.cookie) {
                AdsPlayCookies._renewCache();
            }

            return AdsPlayCookies._cache[AdsPlayCookies._cacheKeyPrefix + key];
        };

        AdsPlayCookies.set = function (key, value, options) {
            options = AdsPlayCookies._getExtendedOptions(options);
            options.expires = AdsPlayCookies._getExpiresDate(value === undefined ? -1 : options.expires);

            AdsPlayCookies._document.cookie = AdsPlayCookies._generateAdsPlayCookiestring(key, value, options);

            return AdsPlayCookies;
        };

        AdsPlayCookies.expire = function (key, options) {
            return AdsPlayCookies.set(key, undefined, options);
        };

        AdsPlayCookies._getExtendedOptions = function (options) {
            return {
                path: options && options.path || AdsPlayCookies.defaults.path,
                domain: options && options.domain || AdsPlayCookies.defaults.domain,
                expires: options && options.expires || AdsPlayCookies.defaults.expires,
                secure: options && options.secure !== undefined ? options.secure : AdsPlayCookies.defaults.secure
            };
        };

        AdsPlayCookies._isValidDate = function (date) {
            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
        };

        AdsPlayCookies._getExpiresDate = function (expires, now) {
            now = now || new Date();

            if (typeof expires === 'number') {
                expires = expires === Infinity ?
                    AdsPlayCookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
            } else if (typeof expires === 'string') {
                expires = new Date(expires);
            }

            if (expires && !AdsPlayCookies._isValidDate(expires)) {
                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
            }

            return expires;
        };

        AdsPlayCookies._generateAdsPlayCookiestring = function (key, value, options) {
            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
            options = options || {};

            var AdsPlayCookiestring = key + '=' + value;
            AdsPlayCookiestring += options.path ? ';path=' + options.path : '';
            AdsPlayCookiestring += options.domain ? ';domain=' + options.domain : '';
            AdsPlayCookiestring += options.expires ? ';expires=' + options.expires.toUTCString() : '';
            AdsPlayCookiestring += options.secure ? ';secure' : '';

            return AdsPlayCookiestring;
        };

        AdsPlayCookies._getCacheFromString = function (documentCookie) {
            var cookieCache = {};
            var AdsPlayCookiesArray = documentCookie ? documentCookie.split('; ') : [];

            for (var i = 0; i < AdsPlayCookiesArray.length; i++) {
                var cookieKvp = AdsPlayCookies._getKeyValuePairFromAdsPlayCookiestring(AdsPlayCookiesArray[i]);

                if (cookieCache[AdsPlayCookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
                    cookieCache[AdsPlayCookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
                }
            }

            return cookieCache;
        };

        AdsPlayCookies._getKeyValuePairFromAdsPlayCookiestring = function (AdsPlayCookiestring) {
            // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
            var separatorIndex = AdsPlayCookiestring.indexOf('=');

            // IE omits the "=" when the cookie value is an empty string
            separatorIndex = separatorIndex < 0 ? AdsPlayCookiestring.length : separatorIndex;

            return {
                key: decodeURIComponent(AdsPlayCookiestring.substr(0, separatorIndex)),
                value: decodeURIComponent(AdsPlayCookiestring.substr(separatorIndex + 1))
            };
        };

        AdsPlayCookies._renewCache = function () {
            AdsPlayCookies._cache = AdsPlayCookies._getCacheFromString(AdsPlayCookies._document.cookie);
            AdsPlayCookies._cachedDocumentCookie = AdsPlayCookies._document.cookie;
        };

        AdsPlayCookies._areEnabled = function () {
            var testKey = 'AdsPlayCookies.js';
            var areEnabled = AdsPlayCookies.set(testKey, 1).get(testKey) === '1';
            AdsPlayCookies.expire(testKey);
            return areEnabled;
        };

        AdsPlayCookies.enabled = AdsPlayCookies._areEnabled();

        return AdsPlayCookies;
    };

    var AdsPlayCookiesExport = typeof global.document === 'object' ? factory(global) : factory;

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return AdsPlayCookiesExport;
        });
        // CommonJS/Node.js support
    } else if (typeof exports === 'object') {
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.AdsPlayCookies = AdsPlayCookiesExport;
    } else {
        global.AdsPlayCookies = AdsPlayCookiesExport;
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

    function getUUID() {
        var key = 'apluuid';
        var uuid = AdsPlayCookies.get(key);
        if (!uuid) {
            uuid = generateUUID();
            AdsPlayCookies.set(key, uuid, { expires: 315569520 }); // Expires in 10 years
        }
        return uuid;
    }

    var getTrackingUrl = function (metric, trackedData) {
        var uuid = getUUID();
        var q = 'uuid=' + uuid + '&' + trackedData;

        //sharding base log domain
        var baseUrl = location.protocol + '//log.adsplay.net/metric/';
        var ran = Math.round(Math.random() * 10) % 3;
        if (ran === 1) {
            baseUrl = location.protocol + '//log1.adsplay.net/metric/';
        } else if (ran === 2) {
            baseUrl = location.protocol + '//log2.adsplay.net/metric/';
        }
        return baseUrl + metric + '?' + q;
    };

    var doTracking = function (metric, trackedData) {
        var imgTracking = new Image();
        imgTracking.src = getTrackingUrl(metric, trackedData);
        imgTracking.setAttribute('style', 'width:0px!important;height:0px!important;display:none!important');
        document.body.appendChild(imgTracking);
    }

    var AdsPlayAnalytics = {};
    AdsPlayAnalytics.doTracking = doTracking;
    global.AdsPlayAnalytics = AdsPlayAnalytics;

})(typeof window === 'undefined' ? this : window);
