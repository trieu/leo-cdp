/*
 * tracking-event.js for USPA Analytics - version 1.0 - date:22/01/2020
 */
 
  // ------------------------------ LeoCorsRequest ----------------------------------------//
	
    (function (global, undefined) {
        'use strict';
        function logError(e){
            if(window.console){
                window.console.error(e);
            }
        }

        function CreateHTTPRequestObject() {
            // although IE supports the XMLHttpRequest object, but it does not work on local files.
            var forceActiveX = (window.ActiveXObject && location.protocol === "file:");
            if (window.XMLHttpRequest && !forceActiveX) {
                return new XMLHttpRequest();
            }
            else {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                }
            }
            logError("Your browser doesn't support XML handling!");
            return null;
        }

        function CreateMSXMLDocumentObject() {
            if (typeof (ActiveXObject) != "undefined") {
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
                    } catch (e) {
                    }
                    ;
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
            }
            else {
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
                    }
                    ;
                }
                else {
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
                errorMsg = "XML Parsing Error: " + xmlDoc.parseError.reason
                        + " at line " + xmlDoc.parseError.line
                        + " at position " + xmlDoc.parseError.linepos;
            }
            else {
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

        LeoCorsRequest.get = function(withCredentials, url, respHeaderNames, callback){
            var httpRequest = null;
            var onStateChange = function() {
                if (httpRequest.readyState == 0 || httpRequest.readyState == 4) {
                    if (IsRequestSuccessful(httpRequest)) {
                        var resHeaders = {};
                        for(var i=0;i<respHeaderNames.length;i++){
                            var name= respHeaderNames[i];
                            var val = httpRequest.getResponseHeader(name);
                            if(val){
                                resHeaders[name] = val;
                            }
                        }
                        callback(resHeaders, httpRequest.responseText);
                    }
                    else {
                        logError("Operation failed by AdsPlayRequest.get: " + url);
                    }
                }
            }

            if (!httpRequest) {
                httpRequest = CreateHTTPRequestObject();
            }
            if (httpRequest) {
                httpRequest.open("GET", url, true);// async
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
				throw new Error(
						'LeoCookieUtil.js requires a `window` with a `document` object');
			}
	
			var LeoCookieUtil = function(key, value, options) {
				return arguments.length === 1 ? LeoCookieUtil.get(key)
						: LeoCookieUtil.set(key, value, options);
			};
	
			// Allows for setter injection in unit tests
			LeoCookieUtil._document = window.document;
	
			// Used to ensure cookie keys do not collide with
			// built-in `Object` properties
			LeoCookieUtil._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
	
			LeoCookieUtil._maxExpireDate = new Date(
					'Fri, 31 Dec 9999 23:59:59 UTC');
	
			LeoCookieUtil.defaults = {
				path : '/',
				secure : false
			};
	
			LeoCookieUtil.get = function(key) {
				if (LeoCookieUtil._cachedDocumentCookie !== LeoCookieUtil._document.cookie) {
					LeoCookieUtil._renewCache();
				}
	
				return LeoCookieUtil._cache[LeoCookieUtil._cacheKeyPrefix + key];
			};
	
			LeoCookieUtil.set = function(key, value, options) {
				options = LeoCookieUtil._getExtendedOptions(options);
				options.expires = LeoCookieUtil
						._getExpiresDate(value === undefined ? -1 : options.expires);
	
				LeoCookieUtil._document.cookie = LeoCookieUtil
						._generateLeoCookieUtiltring(key, value, options);
	
				return LeoCookieUtil;
			};
	
			LeoCookieUtil.expire = function(key, options) {
				return LeoCookieUtil.set(key, undefined, options);
			};
	
			LeoCookieUtil._getExtendedOptions = function(options) {
				return {
					path : options && options.path || LeoCookieUtil.defaults.path,
					domain : options && options.domain
							|| LeoCookieUtil.defaults.domain,
					expires : options && options.expires
							|| LeoCookieUtil.defaults.expires,
					secure : options && options.secure !== undefined ? options.secure
							: LeoCookieUtil.defaults.secure
				};
			};
	
			LeoCookieUtil._isValidDate = function(date) {
				return Object.prototype.toString.call(date) === '[object Date]'
						&& !isNaN(date.getTime());
			};
	
			LeoCookieUtil._getExpiresDate = function(expires, now) {
				now = now || new Date();
	
				if (typeof expires === 'number') {
					expires = expires === Infinity ? LeoCookieUtil._maxExpireDate
							: new Date(now.getTime() + expires * 1000);
				} else if (typeof expires === 'string') {
					expires = new Date(expires);
				}
	
				if (expires && !LeoCookieUtil._isValidDate(expires)) {
					throw new Error(
							'`expires` parameter cannot be converted to a valid Date instance');
				}
	
				return expires;
			};
	
			LeoCookieUtil._generateLeoCookieUtiltring = function(key, value,
					options) {
				key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
				key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
				value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g,
						encodeURIComponent);
				options = options || {};
	
				var LeoCookieUtiltring = key + '=' + value;
				LeoCookieUtiltring += options.path ? ';path=' + options.path : '';
				LeoCookieUtiltring += options.domain ? ';domain=' + options.domain
						: '';
				LeoCookieUtiltring += options.expires ? ';expires='
						+ options.expires.toUTCString() : '';
				LeoCookieUtiltring += options.secure ? ';secure' : '';
	
				return LeoCookieUtiltring;
			};
	
			LeoCookieUtil._getCacheFromString = function(documentCookie) {
				var cookieCache = {};
				var LeoCookieUtilArray = documentCookie ? documentCookie
						.split('; ') : [];
	
				for (var i = 0; i < LeoCookieUtilArray.length; i++) {
					var cookieKvp = LeoCookieUtil
							._getKeyValuePairFromLeoCookieUtiltring(LeoCookieUtilArray[i]);
	
					if (cookieCache[LeoCookieUtil._cacheKeyPrefix + cookieKvp.key] === undefined) {
						cookieCache[LeoCookieUtil._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
					}
				}
	
				return cookieCache;
			};
	
			LeoCookieUtil._getKeyValuePairFromLeoCookieUtiltring = function(
					LeoCookieUtiltring) {
				// "=" is a valid character in a cookie value according to RFC6265,
				// so cannot `split('=')`
				var separatorIndex = LeoCookieUtiltring.indexOf('=');
	
				// IE omits the "=" when the cookie value is an empty string
				separatorIndex = separatorIndex < 0 ? LeoCookieUtiltring.length
						: separatorIndex;
	
				return {
					key : decodeURIComponent(LeoCookieUtiltring.substr(0,
							separatorIndex)),
					value : decodeURIComponent(LeoCookieUtiltring
							.substr(separatorIndex + 1))
				};
			};
	
			LeoCookieUtil._renewCache = function() {
				LeoCookieUtil._cache = LeoCookieUtil
						._getCacheFromString(LeoCookieUtil._document.cookie);
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
	
		var LeoCookieUtilExport = typeof global.document === 'object' ? factory(global)
				: factory;
	
		// AMD support
		if (typeof define === 'function' && define.amd) {
			define(function() {
				return LeoCookieUtilExport;
			});
			// CommonJS/Node.js support
		} else if (typeof exports === 'object') {
			// But always support CommonJS module 1.1.1 spec (`exports` cannot be a
			// function)
			exports.LeoCookieUtil = LeoCookieUtilExport;
		} else {
			global.LeoCookieUtil = LeoCookieUtilExport;
		}
	})(typeof window === 'undefined' ? this : window);
	// ------------------------------------------------------------------------------------//
	
 
 // ------------ LEO Proxy ------------------
 
(function() {
  var Leo_Observer_Proxy = {};
  const cssIframe = "width:0px!important;height:0px!important;display:none!important";
  const baseUrl = "//xemgiday.com/public/html/leo-event-proxy.html#";
  const baseDataObserverUrl = 'http://log.xemgiday.com/css-pf-init';


  Leo_Observer_Proxy.trackEvent = function(eventData) {
    if (typeof eventData === "object") {
      //build query string
      var q ="referrer=" + encodeURIComponent(document.referrer ? document.referrer : "");
      q += "&url=" + encodeURIComponent(document.location.href);
      q += "&host=" + encodeURIComponent(document.location.host);
      q += "&t=" + new Date().getTime();
      q += "&event=" + encodeURIComponent(JSON.stringify(eventData));

      //cross domain iframe
      var iframe = document.createElement("iframe");
      iframe.width = 0;
      iframe.height = 0;
      iframe.setAttribute("style", cssIframe);
      const fullUrl = baseUrl + q;
      iframe.src = fullUrl;

      //append to trigger iframe post back data to server
      var body = document.getElementsByTagName("body");
      if (body.length > 0) {
        body[0].appendChild(iframe);
      }
    }
  };
  
  function generateUUID() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g,
				function(c) {
					var r = (d + Math.random() * 16) % 16 | 0;
					d = Math.floor(d / 16);
					return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
				});
		return uuid;
	}	
	
	function getUUID() {
		var key = 'leovsid';
		var uuid = LeoCookieUtil.get(key);
		if (!uuid) {
			uuid = generateUUID();
			LeoCookieUtil.set(key, uuid, {
				expires : 315569520
			}); // Expires in 10 years
		}
		return uuid;
	}
  
  Leo_Observer_Proxy.getContextSession = function(callback){				
	var h = function(resHeaders,text){
		var data = JSON.parse(text);
		if(typeof callback === "function"){
			callback(data);
		}
	}			
	
	var obsId = window.LeoObserverId;
	if(obsId){
		var media = encodeURIComponent(document.location.host);
		var ctxUrl = encodeURIComponent(document.location.href);
		var vsId = getUUID()
		var url = baseDataObserverUrl + '?observer='+obsId + '&media='+media+'&ctxUrl='+ctxUrl+'&visid='+vsId;
		LeoCorsRequest.get(false, url,[], h);
	}
  }	

  if (typeof window.Leo_Observer_Proxy === "undefined") {
	window.Leo_Observer_Proxy = Leo_Observer_Proxy;
	if (typeof window.Leo_Observer_Proxy_Ready === "function") {
		Leo_Observer_Proxy.getContextSession(window.Leo_Observer_Proxy_Ready)
	}
  }
 
  
})();
