/**
 * LeoEventObserver 1.0 - built on 01/05/2020
 */

// ------------------------------ LeoCorsRequest ----------------------------------------//
(function(global, undefined) {
    'use strict';

    function logError(e) {
        if (window.console) {
            window.console.error(e);
        }
    }

    function CreateHTTPRequestObject() {
        // although IE supports the XMLHttpRequest object, but it does not work on local files.
        var forceActiveX = (window.ActiveXObject && location.protocol === "file:");
        if (window.XMLHttpRequest && !forceActiveX) {
            return new XMLHttpRequest();
        } else {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
        logError("Your browser doesn't support XML handling!");
        return null;
    }

    function CreateMSXMLDocumentObject() {
        if (typeof(ActiveXObject) != "undefined") {
            var progIDs = [
                "Msxml2.DOMDocument.6.0",
                "Msxml2.DOMDocument.5.0",
                "Msxml2.DOMDocument.4.0",
                "Msxml2.DOMDocument.3.0",
                "MSXML2.DOMDocument",
                "MSXML.DOMDocument"
            ];
            for (var i = 0; i < progIDs.length; i++) {
                try {
                    return new ActiveXObject(progIDs[i]);
                } catch (e) {};
            }
        }
        return null;
    }

    function CreateXMLDocumentObject(rootName) {
        if (!rootName) {
            rootName = "";
        }
        var xmlDoc = CreateMSXMLDocumentObject();
        if (xmlDoc) {
            if (rootName) {
                var rootNode = xmlDoc.createElement(rootName);
                xmlDoc.appendChild(rootNode);
            }
        } else {
            if (document.implementation.createDocument) {
                xmlDoc = document.implementation.createDocument("", rootName, null);
            }
        }

        return xmlDoc;
    }

    function ParseHTTPResponse(httpRequest) {
        var xmlDoc = httpRequest.responseXML;

        // if responseXML is not valid, try to create the XML document from the responseText property
        if (!xmlDoc || !xmlDoc.documentElement) {
            if (window.DOMParser) {
                var parser = new DOMParser();
                try {
                    xmlDoc = parser.parseFromString(httpRequest.responseText, "text/xml");
                } catch (e) {
                    alert("XML parsing error");
                    return null;
                };
            } else {
                xmlDoc = CreateMSXMLDocumentObject();
                if (!xmlDoc) {
                    return null;
                }
                xmlDoc.loadXML(httpRequest.responseText);

            }
        }

        // if there was an error while parsing the XML document
        var errorMsg = null;
        if (xmlDoc.parseError && xmlDoc.parseError.errorCode != 0) {
            errorMsg = "XML Parsing Error: " + xmlDoc.parseError.reason +
                " at line " + xmlDoc.parseError.line +
                " at position " + xmlDoc.parseError.linepos;
        } else {
            if (xmlDoc.documentElement) {
                if (xmlDoc.documentElement.nodeName == "parsererror") {
                    errorMsg = xmlDoc.documentElement.childNodes[0].nodeValue;
                }
            }
        }
        if (errorMsg) {
            logError(errorMsg);
            return null;
        }

        // ok, the XML document is valid
        return xmlDoc;
    }

    // returns whether the HTTP request was successful
    function IsRequestSuccessful(httpRequest) {
        // IE: sometimes 1223 instead of 204
        var success = (httpRequest.status == 0 ||
            (httpRequest.status >= 200 && httpRequest.status < 300) ||
            httpRequest.status == 304 || httpRequest.status == 1223);
        return success;
    }

    var LeoCorsRequest = {};

    LeoCorsRequest.get = function(withCredentials, url, respHeaderNames, callback) {
        var httpRequest = null;
        var onStateChange = function() {
            if (httpRequest.readyState == 0 || httpRequest.readyState == 4) {
                if (IsRequestSuccessful(httpRequest)) {
                    var resHeaders = {};
                    for (var i = 0; i < respHeaderNames.length; i++) {
                        var name = respHeaderNames[i];
                        var val = httpRequest.getResponseHeader(name);
                        if (val) {
                            resHeaders[name] = val;
                        }
                    }
                    callback(resHeaders, httpRequest.responseText);
                } else {
                    logError("Operation failed by AdsPlayRequest.get: " + url);
                }
            }
        }

        if (!httpRequest) {
            httpRequest = CreateHTTPRequestObject();
        }
        if (httpRequest) {
            httpRequest.open("GET", url, true); // async
            httpRequest.onreadystatechange = onStateChange;
            httpRequest.withCredentials = withCredentials;
            httpRequest.send();
        }
    }
    global.LeoCorsRequest = LeoCorsRequest;
})(typeof window === 'undefined' ? this : window);

// ------------------------------------------------------------------------------------//

// ------------------------------ LeoCookieUtil ----------------------------------------//

(function(global, undefined) {
    'use strict';

    var factory = function(window) {
        if (typeof window.document !== 'object') {
            throw new Error('LeoCookieUtil.js requires a `window` with a `document` object');
        }

        var LeoCookieUtil = function(key, value, options) {
            return arguments.length === 1 ?
                LeoCookieUtil.get(key) : LeoCookieUtil.set(key, value, options);
        };

        // Allows for setter injection in unit tests
        LeoCookieUtil._document = window.document;

        // Used to ensure cookie keys do not collide with
        // built-in `Object` properties
        LeoCookieUtil._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)

        LeoCookieUtil._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

        LeoCookieUtil.defaults = {
            path: '/',
            secure: false
        };

        LeoCookieUtil.get = function(key) {
            if (LeoCookieUtil._cachedDocumentCookie !== LeoCookieUtil._document.cookie) {
                LeoCookieUtil._renewCache();
            }

            return LeoCookieUtil._cache[LeoCookieUtil._cacheKeyPrefix + key];
        };

        LeoCookieUtil.set = function(key, value, options) {
            options = LeoCookieUtil._getExtendedOptions(options);
            options.expires = LeoCookieUtil._getExpiresDate(value === undefined ? -1 : options.expires);

            LeoCookieUtil._document.cookie = LeoCookieUtil._generateLeoCookieUtiltring(key, value, options);

            return LeoCookieUtil;
        };

        LeoCookieUtil.expire = function(key, options) {
            return LeoCookieUtil.set(key, undefined, options);
        };

        LeoCookieUtil._getExtendedOptions = function(options) {
            return {
                path: options && options.path || LeoCookieUtil.defaults.path,
                domain: options && options.domain || LeoCookieUtil.defaults.domain,
                expires: options && options.expires || LeoCookieUtil.defaults.expires,
                secure: options && options.secure !== undefined ? options.secure : LeoCookieUtil.defaults.secure
            };
        };

        LeoCookieUtil._isValidDate = function(date) {
            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
        };

        LeoCookieUtil._getExpiresDate = function(expires, now) {
            now = now || new Date();

            if (typeof expires === 'number') {
                expires = expires === Infinity ?
                    LeoCookieUtil._maxExpireDate : new Date(now.getTime() + expires * 1000);
            } else if (typeof expires === 'string') {
                expires = new Date(expires);
            }

            if (expires && !LeoCookieUtil._isValidDate(expires)) {
                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
            }

            return expires;
        };

        LeoCookieUtil._generateLeoCookieUtiltring = function(key, value, options) {
            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
            options = options || {};

            var LeoCookieUtiltring = key + '=' + value;
            LeoCookieUtiltring += options.path ? ';path=' + options.path : '';
            LeoCookieUtiltring += options.domain ? ';domain=' + options.domain : '';
            LeoCookieUtiltring += options.expires ? ';expires=' + options.expires.toUTCString() : '';
            LeoCookieUtiltring += options.secure ? ';secure' : '';

            return LeoCookieUtiltring;
        };

        LeoCookieUtil._getCacheFromString = function(documentCookie) {
            var cookieCache = {};
            var LeoCookieUtilArray = documentCookie ? documentCookie.split('; ') : [];

            for (var i = 0; i < LeoCookieUtilArray.length; i++) {
                var cookieKvp = LeoCookieUtil._getKeyValuePairFromLeoCookieUtiltring(LeoCookieUtilArray[i]);

                if (cookieCache[LeoCookieUtil._cacheKeyPrefix + cookieKvp.key] === undefined) {
                    cookieCache[LeoCookieUtil._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
                }
            }

            return cookieCache;
        };

        LeoCookieUtil._getKeyValuePairFromLeoCookieUtiltring = function(LeoCookieUtiltring) {
            // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
            var separatorIndex = LeoCookieUtiltring.indexOf('=');

            // IE omits the "=" when the cookie value is an empty string
            separatorIndex = separatorIndex < 0 ? LeoCookieUtiltring.length : separatorIndex;

            return {
                key: decodeURIComponent(LeoCookieUtiltring.substr(0, separatorIndex)),
                value: decodeURIComponent(LeoCookieUtiltring.substr(separatorIndex + 1))
            };
        };

        LeoCookieUtil._renewCache = function() {
            LeoCookieUtil._cache = LeoCookieUtil._getCacheFromString(LeoCookieUtil._document.cookie);
            LeoCookieUtil._cachedDocumentCookie = LeoCookieUtil._document.cookie;
        };

        LeoCookieUtil._areEnabled = function() {
            var testKey = 'LeoCookieUtil.js';
            var areEnabled = LeoCookieUtil.set(testKey, 1).get(testKey) === '1';
            LeoCookieUtil.expire(testKey);
            return areEnabled;
        };

        LeoCookieUtil.enabled = LeoCookieUtil._areEnabled();

        return LeoCookieUtil;
    };

    var LeoCookieUtilExport = typeof global.document === 'object' ? factory(global) : factory;

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return LeoCookieUtilExport;
        });
        // CommonJS/Node.js support
    } else if (typeof exports === 'object') {
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.LeoCookieUtil = LeoCookieUtilExport;
    } else {
        global.LeoCookieUtil = LeoCookieUtilExport;
    }
})(typeof window === 'undefined' ? this : window);

// ------------ END LeoCookieUtil ------------------

// ------------ BEGIN lscache ------------------
/**
 * lscache library https://github.com/pamelafox/lscache
 * Copyright (c) 2011, Pamela Fox
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module !== "undefined" && module.exports) {
        // CommonJS/Node module
        module.exports = factory();
    } else {
        // Browser globals
        root.lscache = factory();
    }
}(this, function() {

    // Prefix for all lscache keys
    var CACHE_PREFIX = 'leocache-';

    // Suffix for the key name on the expiration items in localStorage
    var CACHE_SUFFIX = '-cacheexpiration';

    // expiration date radix (set to Base-36 for most space savings)
    var EXPIRY_RADIX = 10;

    // time resolution in milliseconds
    var expiryMilliseconds = 60 * 1000;
    // ECMAScript max Date (epoch + 1e8 days)
    var maxDate = calculateMaxDate(expiryMilliseconds);

    var cachedStorage;
    var cachedJSON;
    var cacheBucket = '';
    var warnings = false;

    // Determines if localStorage is supported in the browser;
    // result is cached for better performance instead of being run each time.
    // Feature detection is based on how Modernizr does it;
    // it's not straightforward due to FF4 issues.
    // It's not run at parse-time as it takes 200ms in Android.
    function supportsStorage() {
        var key = '__lscachetest__';
        var value = key;

        if (cachedStorage !== undefined) {
            return cachedStorage;
        }

        // some browsers will throw an error if you try to access local storage (e.g. brave browser)
        // hence check is inside a try/catch
        try {
            if (!localStorage) {
                return false;
            }
        } catch (ex) {
            return false;
        }

        try {
            setItem(key, value);
            removeItem(key);
            cachedStorage = true;
        } catch (e) {
            // If we hit the limit, and we don't have an empty localStorage then it means we have support
            if (isOutOfSpace(e) && localStorage.length) {
                cachedStorage = true; // just maxed it out and even the set test failed.
            } else {
                cachedStorage = false;
            }
        }
        return cachedStorage;
    }

    // Check to set if the error is us dealing with being out of space
    function isOutOfSpace(e) {
        return e && (
            e.name === 'QUOTA_EXCEEDED_ERR' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
            e.name === 'QuotaExceededError'
        );
    }

    // Determines if native JSON (de-)serialization is supported in the browser.
    function supportsJSON() {
        /*jshint eqnull:true */
        if (cachedJSON === undefined) {
            cachedJSON = (window.JSON != null);
        }
        return cachedJSON;
    }

    /**
     * Returns a string where all RegExp special characters are escaped with a \.
     * @param {String} text
     * @return {string}
     */
    function escapeRegExpSpecialCharacters(text) {
        return text.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
    }

    /**
     * Returns the full string for the localStorage expiration item.
     * @param {String} key
     * @return {string}
     */
    function expirationKey(key) {
        return key + CACHE_SUFFIX;
    }

    /**
     * Returns the number of minutes since the epoch.
     * @return {number}
     */
    function currentTime() {
        return Math.floor((new Date().getTime()) / expiryMilliseconds);
    }

    /**
     * Wrapper functions for localStorage methods
     */

    function getItem(key) {
        return localStorage.getItem(CACHE_PREFIX + cacheBucket + key);
    }

    function setItem(key, value) {
        // Fix for iPad issue - sometimes throws QUOTA_EXCEEDED_ERR on setItem.
        localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
        localStorage.setItem(CACHE_PREFIX + cacheBucket + key, value);
    }

    function removeItem(key) {
        localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
    }

    function eachKey(fn) {
        var prefixRegExp = new RegExp('^' + CACHE_PREFIX + escapeRegExpSpecialCharacters(cacheBucket) + '(.*)');
        // Loop in reverse as removing items will change indices of tail
        for (var i = localStorage.length - 1; i >= 0; --i) {
            var key = localStorage.key(i);
            key = key && key.match(prefixRegExp);
            key = key && key[1];
            if (key && key.indexOf(CACHE_SUFFIX) < 0) {
                fn(key, expirationKey(key));
            }
        }
    }

    function flushItem(key) {
        var exprKey = expirationKey(key);

        removeItem(key);
        removeItem(exprKey);
    }

    function flushExpiredItem(key) {
        var exprKey = expirationKey(key);
        var expr = getItem(exprKey);

        if (expr) {
            var expirationTime = parseInt(expr, EXPIRY_RADIX);

            // Check if we should actually kick item out of storage
            if (currentTime() >= expirationTime) {
                removeItem(key);
                removeItem(exprKey);
                return true;
            }
        }
    }

    function warn(message, err) {
        if (!warnings) return;
        if (!('console' in window) || typeof window.console.warn !== 'function') return;
        window.console.warn("lscache - " + message);
        if (err) window.console.warn("lscache - The error was: " + err.message);
    }

    function calculateMaxDate(expiryMilliseconds) {
        return Math.floor(8.64e15 / expiryMilliseconds);
    }

    var lscache = {
        /**
         * Stores the value in localStorage. Expires after specified number of minutes.
         * @param {string} key
         * @param {Object|string} value
         * @param {number} time
         * @return {boolean} whether the value was inserted successfully
         */
        set: function(key, value, time) {
            if (!supportsStorage()) return false;

            // If we don't get a string value, try to stringify
            // In future, localStorage may properly support storing non-strings
            // and this can be removed.

            if (!supportsJSON()) return false;
            try {
                value = JSON.stringify(value);
            } catch (e) {
                // Sometimes we can't stringify due to circular refs
                // in complex objects, so we won't bother storing then.
                return false;
            }

            try {
                setItem(key, value);
            } catch (e) {
                if (isOutOfSpace(e)) {
                    // If we exceeded the quota, then we will sort
                    // by the expire time, and then remove the N oldest
                    var storedKeys = [];
                    var storedKey;
                    eachKey(function(key, exprKey) {
                        var expiration = getItem(exprKey);
                        if (expiration) {
                            expiration = parseInt(expiration, EXPIRY_RADIX);
                        } else {
                            // TODO: Store date added for non-expiring items for smarter removal
                            expiration = maxDate;
                        }
                        storedKeys.push({
                            key: key,
                            size: (getItem(key) || '').length,
                            expiration: expiration
                        });
                    });
                    // Sorts the keys with oldest expiration time last
                    storedKeys.sort(function(a, b) {
                        return (b.expiration - a.expiration);
                    });

                    var targetSize = (value || '').length;
                    while (storedKeys.length && targetSize > 0) {
                        storedKey = storedKeys.pop();
                        warn("Cache is full, removing item with key '" + key + "'");
                        flushItem(storedKey.key);
                        targetSize -= storedKey.size;
                    }
                    try {
                        setItem(key, value);
                    } catch (e) {
                        // value may be larger than total quota
                        warn("Could not add item with key '" + key + "', perhaps it's too big?", e);
                        return false;
                    }
                } else {
                    // If it was some other error, just give up.
                    warn("Could not add item with key '" + key + "'", e);
                    return false;
                }
            }

            // If a time is specified, store expiration info in localStorage
            if (time) {
                setItem(expirationKey(key), (currentTime() + time).toString(EXPIRY_RADIX));
            } else {
                // In case they previously set a time, remove that info from localStorage.
                removeItem(expirationKey(key));
            }
            return true;
        },

        /**
         * Retrieves specified value from localStorage, if not expired.
         * @param {string} key
         * @return {string|Object}
         */
        get: function(key) {
            if (!supportsStorage()) return null;

            // Return the de-serialized item if not expired
            if (flushExpiredItem(key)) {
                return null;
            }

            // Tries to de-serialize stored value if its an object, and returns the normal value otherwise.
            var value = getItem(key);
            if (!value || !supportsJSON()) {
                return value;
            }

            try {
                // We can't tell if its JSON or a string, so we try to parse
                return JSON.parse(value);
            } catch (e) {
                // If we can't parse, it's probably because it isn't an object
                return value;
            }
        },

        /**
         * Removes a value from localStorage.
         * Equivalent to 'delete' in memcache, but that's a keyword in JS.
         * @param {string} key
         */
        remove: function(key) {
            if (!supportsStorage()) return;

            flushItem(key);
        },

        /**
         * Returns whether local storage is supported.
         * Currently exposed for testing purposes.
         * @return {boolean}
         */
        supported: function() {
            return supportsStorage();
        },

        /**
         * Flushes all lscache items and expiry markers without affecting rest of localStorage
         */
        flush: function() {
            if (!supportsStorage()) return;

            eachKey(function(key) {
                flushItem(key);
            });
        },

        /**
         * Flushes expired lscache items and expiry markers without affecting rest of localStorage
         */
        flushExpired: function() {
            if (!supportsStorage()) return;

            eachKey(function(key) {
                flushExpiredItem(key);
            });
        },

        /**
         * Appends CACHE_PREFIX so lscache will partition data in to different buckets.
         * @param {string} bucket
         */
        setBucket: function(bucket) {
            cacheBucket = bucket;
        },

        /**
         * Resets the string being appended to CACHE_PREFIX so lscache will use the default storage behavior.
         */
        resetBucket: function() {
            cacheBucket = '';
        },

        /**
         * @returns {number} The currently set number of milliseconds each time unit represents in
         *   the set() function's "time" argument.
         */
        getExpiryMilliseconds: function() {
            return expiryMilliseconds;
        },

        /**
         * Sets the number of milliseconds each time unit represents in the set() function's
         *   "time" argument.
         * Sample values:
         *  1: each time unit = 1 millisecond
         *  1000: each time unit = 1 second
         *  60000: each time unit = 1 minute (Default value)
         *  360000: each time unit = 1 hour
         * @param {number} milliseconds
         */
        setExpiryMilliseconds: function(milliseconds) {
            expiryMilliseconds = milliseconds;
            maxDate = calculateMaxDate(expiryMilliseconds);
        },

        /**
         * Sets whether to display warnings when an item is removed from the cache or not.
         */
        enableWarnings: function(enabled) {
            warnings = enabled;
        }
    };

    // Return the module
    return lscache;
}));

// ------------ END LEO Cache ------------------

// ------------ BEGIN LEO Event Observer -------

(function(global, undefined) {
    var LeoEventObserver = {};

    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    function getUUID() {
        var key = 'leotech_vid';
        var uuid = LeoCookieUtil.get(key);
        if (!uuid) {
            uuid = getHashedId(generateUUID());
            LeoCookieUtil.set(key, uuid, {
                expires: 315569520
            }); // Expires in 10 years
        }
        return uuid;
    }
    
    function getHashedUrl(url) {
        return new UUID(5, "ns:URL", url).format("b16").toLowerCase()
    }

    var doTracking = function(metric, params, callback) {
        var h = function(resHeaders, text) {
            var data = JSON.parse(text);
            if (typeof callback === "function") {
                callback(data);
            }
        }

        var obsId = params.observerId,
            media = params.host,
            ctxUrl = params.contextUrl;

        var vsId = getUUID()
        var url = PREFIX_EVENT_SESSION_INIT + '?observer=' + obsId + '&media=' + media + '&ctxUrl=' + ctxUrl + '&visid=' + vsId;
        LeoCorsRequest.get(false, url, [], h);
    }

    var getContextSession = function(params, callback) {
        var h = function(resHeaders, text) {
            var data = JSON.parse(text);
            if (typeof callback === "function") {
                callback(data);
            }
        }

        var obsId = params.observerId,
            media = params.host,
            
            tpurl = params.tpurl;

        var vsId = getUUID()
        var url = PREFIX_EVENT_SESSION_INIT + '?obsid=' + obsId + '&media=' + media + '&tpurl=' + tpurl + '&visid=' + vsId;
        LeoCorsRequest.get(false, url, [], h);
    }

    LeoEventObserver.doTracking = doTracking;
    LeoEventObserver.getContextSession = getContextSession;

    global.LeoEventObserver = LeoEventObserver;

})(typeof window === 'undefined' ? this : window);