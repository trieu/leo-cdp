/*
 * AdsPLAY.js for iTVAd - version 1.1.9 - date:15/08/2016
 */
if( ! window.AdsPlayReady ) {
	
	// ------------------------------ AdsPlayCorsRequest ----------------------------------------//
	
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

        var AdsPlayCorsRequest = {};

        AdsPlayCorsRequest.get = function(withCredentials, url, respHeaderNames, callback){
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
        global.AdsPlayCorsRequest = AdsPlayCorsRequest;
    })(typeof window === 'undefined' ? this : window);
    // ------------------------------------------------------------------------------------//
	
    
    // ------------------------------ AdsPlayReady ----------------------------------------//
	(function(funcName, baseObj) {
	    // The public function name defaults to window.AdsPlayReady
	    // but you can pass in your own object and own function name and those will be used
	    // if you want to put them in a different namespace
	    funcName = funcName || "AdsPlayReady";
	    baseObj = baseObj || window;
	    var readyList = [];
	    var readyFired = false;
	    var readyEventHandlersInstalled = false;
	
	    // call this when the document is ready
	    // this function protects itself against being called more than once
	    function ready() {
	        if (!readyFired) {
	            // this must be set to true before we start calling callbacks
	            readyFired = true;
	            for (var i = 0; i < readyList.length; i++) {
	                readyList[i].fn.call(window, readyList[i].ctx);
	            }
	            // allow any closures held by these functions to free
	            readyList = [];
	        }
	    }
	
	    function readyStateChange() {
	        if ( document.readyState === "complete" ) {
	            ready();
	        }
	    }
	
	    baseObj[funcName] = function(callback, context) {
	        // if ready has already fired, then just schedule the callback
	        // to fire asynchronously, but right away
	        if (readyFired) {
	            setTimeout(function() {callback(context);}, 1);
	            return;
	        } else {
	            // add the function and context to the list
	            readyList.push({fn: callback, ctx: context});
	        }
	        // if document already ready to go, schedule the ready function to run
	        if (document.readyState === "complete") {
	            setTimeout(ready, 1);
	        } else if (!readyEventHandlersInstalled) {
	            // otherwise if we don't have event handlers installed, install them
	            if (document.addEventListener) {
	                // first choice is DOMContentLoaded event
	                document.addEventListener("DOMContentLoaded", ready, false);
	                // backup is window load event
	                window.addEventListener("load", ready, false);
	            } else {
	                // must be IE
	                document.attachEvent("onreadystatechange", readyStateChange);
	                window.attachEvent("onload", ready);
	            }
	            readyEventHandlersInstalled = true;
	        }
	    }
	})("AdsPlayReady", window);
	// ------------------------------------------------------------------------------------//
	
	// ------------------------------ AdsPlayCookies ----------------------------------------//
	(function(global, undefined) {
		'use strict';
	
		var factory = function(window) {
			if (typeof window.document !== 'object') {
				throw new Error(
						'AdsPlayCookies.js requires a `window` with a `document` object');
			}
	
			var AdsPlayCookies = function(key, value, options) {
				return arguments.length === 1 ? AdsPlayCookies.get(key)
						: AdsPlayCookies.set(key, value, options);
			};
	
			// Allows for setter injection in unit tests
			AdsPlayCookies._document = window.document;
	
			// Used to ensure cookie keys do not collide with
			// built-in `Object` properties
			AdsPlayCookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
	
			AdsPlayCookies._maxExpireDate = new Date(
					'Fri, 31 Dec 9999 23:59:59 UTC');
	
			AdsPlayCookies.defaults = {
				path : '/',
				secure : false
			};
	
			AdsPlayCookies.get = function(key) {
				if (AdsPlayCookies._cachedDocumentCookie !== AdsPlayCookies._document.cookie) {
					AdsPlayCookies._renewCache();
				}
	
				return AdsPlayCookies._cache[AdsPlayCookies._cacheKeyPrefix + key];
			};
	
			AdsPlayCookies.set = function(key, value, options) {
				options = AdsPlayCookies._getExtendedOptions(options);
				options.expires = AdsPlayCookies
						._getExpiresDate(value === undefined ? -1 : options.expires);
	
				AdsPlayCookies._document.cookie = AdsPlayCookies
						._generateAdsPlayCookiestring(key, value, options);
	
				return AdsPlayCookies;
			};
	
			AdsPlayCookies.expire = function(key, options) {
				return AdsPlayCookies.set(key, undefined, options);
			};
	
			AdsPlayCookies._getExtendedOptions = function(options) {
				return {
					path : options && options.path || AdsPlayCookies.defaults.path,
					domain : options && options.domain
							|| AdsPlayCookies.defaults.domain,
					expires : options && options.expires
							|| AdsPlayCookies.defaults.expires,
					secure : options && options.secure !== undefined ? options.secure
							: AdsPlayCookies.defaults.secure
				};
			};
	
			AdsPlayCookies._isValidDate = function(date) {
				return Object.prototype.toString.call(date) === '[object Date]'
						&& !isNaN(date.getTime());
			};
	
			AdsPlayCookies._getExpiresDate = function(expires, now) {
				now = now || new Date();
	
				if (typeof expires === 'number') {
					expires = expires === Infinity ? AdsPlayCookies._maxExpireDate
							: new Date(now.getTime() + expires * 1000);
				} else if (typeof expires === 'string') {
					expires = new Date(expires);
				}
	
				if (expires && !AdsPlayCookies._isValidDate(expires)) {
					throw new Error(
							'`expires` parameter cannot be converted to a valid Date instance');
				}
	
				return expires;
			};
	
			AdsPlayCookies._generateAdsPlayCookiestring = function(key, value,
					options) {
				key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
				key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
				value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g,
						encodeURIComponent);
				options = options || {};
	
				var AdsPlayCookiestring = key + '=' + value;
				AdsPlayCookiestring += options.path ? ';path=' + options.path : '';
				AdsPlayCookiestring += options.domain ? ';domain=' + options.domain
						: '';
				AdsPlayCookiestring += options.expires ? ';expires='
						+ options.expires.toUTCString() : '';
				AdsPlayCookiestring += options.secure ? ';secure' : '';
	
				return AdsPlayCookiestring;
			};
	
			AdsPlayCookies._getCacheFromString = function(documentCookie) {
				var cookieCache = {};
				var AdsPlayCookiesArray = documentCookie ? documentCookie
						.split('; ') : [];
	
				for (var i = 0; i < AdsPlayCookiesArray.length; i++) {
					var cookieKvp = AdsPlayCookies
							._getKeyValuePairFromAdsPlayCookiestring(AdsPlayCookiesArray[i]);
	
					if (cookieCache[AdsPlayCookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
						cookieCache[AdsPlayCookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
					}
				}
	
				return cookieCache;
			};
	
			AdsPlayCookies._getKeyValuePairFromAdsPlayCookiestring = function(
					AdsPlayCookiestring) {
				// "=" is a valid character in a cookie value according to RFC6265,
				// so cannot `split('=')`
				var separatorIndex = AdsPlayCookiestring.indexOf('=');
	
				// IE omits the "=" when the cookie value is an empty string
				separatorIndex = separatorIndex < 0 ? AdsPlayCookiestring.length
						: separatorIndex;
	
				return {
					key : decodeURIComponent(AdsPlayCookiestring.substr(0,
							separatorIndex)),
					value : decodeURIComponent(AdsPlayCookiestring
							.substr(separatorIndex + 1))
				};
			};
	
			AdsPlayCookies._renewCache = function() {
				AdsPlayCookies._cache = AdsPlayCookies
						._getCacheFromString(AdsPlayCookies._document.cookie);
				AdsPlayCookies._cachedDocumentCookie = AdsPlayCookies._document.cookie;
			};
	
			AdsPlayCookies._areEnabled = function() {
				var testKey = 'AdsPlayCookies.js';
				var areEnabled = AdsPlayCookies.set(testKey, 1).get(testKey) === '1';
				AdsPlayCookies.expire(testKey);
				return areEnabled;
			};
	
			AdsPlayCookies.enabled = AdsPlayCookies._areEnabled();
	
			return AdsPlayCookies;
		};
	
		var AdsPlayCookiesExport = typeof global.document === 'object' ? factory(global)
				: factory;
	
		// AMD support
		if (typeof define === 'function' && define.amd) {
			define(function() {
				return AdsPlayCookiesExport;
			});
			// CommonJS/Node.js support
		} else if (typeof exports === 'object') {
			// But always support CommonJS module 1.1.1 spec (`exports` cannot be a
			// function)
			exports.AdsPlayCookies = AdsPlayCookiesExport;
		} else {
			global.AdsPlayCookies = AdsPlayCookiesExport;
		}
	})(typeof window === 'undefined' ? this : window);
	// ------------------------------------------------------------------------------------//
	
	
	// --------------------------  AdsPlay ---------------------------------//
	(function(global, undefined) {
			
		function callBeaconLogTracking(opts) {
			// Make sure we have a base object for opts
			opts = opts || {};
			// Setup defaults for options
			opts.url = opts.url || null;
			opts.vars = opts.vars || {};
			opts.error = opts.error || function() {
			};
			opts.success = opts.success || function() {
			};
			opts.vars.cb = Math.floor(Math.random() * 10e12);
	
			// Split up vars object into an array
			var varsArray = [];
			for ( var key in opts.vars) {
				varsArray.push(encodeURIComponent(key) + '='
						+ encodeURIComponent(opts.vars[key]));
			}
			// Build query string
			var qString = varsArray.join('&');
	
			// Create a beacon if a url is provided
			if (opts.url) {
				// Create a brand NEW image object
				var beacon = new Image();
				// Attach the event handlers to the image object
				if (beacon.onerror) {
					beacon.onerror = opts.error;
				}
				if (beacon.onload) {
					beacon.onload = opts.success;
				}	
				// Attach the src for the script call
				beacon.src = opts.url + '?' + qString;
			}
		}
	
		// Returns the version of Internet Explorer or a -1
		// (indicating the use of another browser).
		function isNotIE() {
			var rv = -1; // Return value assumes failure.
			if (navigator.appName == 'Microsoft Internet Explorer') {
				var ua = navigator.userAgent;
				var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
				if (re.exec(ua) != null)
					rv = parseFloat(RegExp.$1);
			}
			return rv == -1;
		}
		
		function isDevicePC() {
			  var check = false;
			  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
			  return !check;
		}
	
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
			var key = 'apluuid';
			var uuid = AdsPlayCookies.get(key);
			if (!uuid) {
				uuid = generateUUID();
				AdsPlayCookies.set(key, uuid, {
					expires : 315569520
				}); // Expires in 10 years
			}
			return uuid;
		}
		
		function getLocationInfo() {
			var key = 'aplloc';
			var area = AdsPlayCookies.get(key);
			if (typeof area !== 'string') {				
				var url = 'https://static.fptplay.net/zone.html?time' + (new Date()).getTime();
				AdsPlayCorsRequest.get(false, url,['x-zone','content-type'], function (resHeaders, body) {
					area = 'vn-'+resHeaders['x-zone'];
					AdsPlayCookies.set(key, area, {	expires : 604800 }); // Expires in 7 days   
				});
				area = '';
			}
			return area;
		}
	
		function getMetaInfo() {
			var userType = 0, ckw = '', image, desc, contentid = '';
			var arr = document.getElementsByTagName('meta');
			for (var i = 0; i < arr.length; i++) {
				var n = arr[i];
				if(n.getAttribute){
					if( n.getAttribute('name') === 'user') {
						userType = n.getAttribute('content');
					}
					if( n.getAttribute('name') === 'category') {
						if (ckw === '') {
							ckw = n.getAttribute('content');
						}
					}
					if( n.getAttribute('name') === 'contentid') {
						if (contentid === '') {
							contentid = n.getAttribute('content');
						}
					}
					if( n.getAttribute('name') === 'og:image') {
						if (ckw === '') {
							ckw = n.getAttribute('content');
						}
					}					
				}
				
			}
			return { cid: contentid, ut : userType,	ckw : ckw.substr(0,100) };
		}
	
	
		function getContextTitle() {
			var title = '';			
			var node = document.getElementById('livetv_title');
			if(!node){
				node = document.getElementById('vod_url');
			}			
			if(node){
				title = node.innerHTML;
			} else {
				title = document.title;
			}
			title = title.substr(0,100);
			return title;
		}
			
		var buildAdUrlRequest = function(zoneId, placementIds){
			var time = new Date().getTime();
			var metaInfos = getMetaInfo();
			var q = 'uuid=' + getUUID();
			for (var i = 0; i < placementIds.length; i++) {
				q += ('&placement=' + placementIds[i]); 
			}
			q += ('&referrer=' + encodeURIComponent(document.referrer ? document.referrer : ''));
			q += ('&url=' + encodeURIComponent(document.location.href));
			q += ('&cxt=' + encodeURIComponent(getContextTitle()));
			q += ('&cxkw=' + encodeURIComponent(metaInfos.ckw));
			q += ('&ut=' + encodeURIComponent(metaInfos.ut));
			q += ('&cid=' + encodeURIComponent(metaInfos.cid));
			q += ('&loc=' + encodeURIComponent(getLocationInfo()));
			
			q += ('&t=' + time);		
			var adServerId = 'd3';
			var ran = time % 3;
			if (ran === 1) {
				adServerId = 'd1';
			} 
			else if (ran === 2) {
				adServerId = 'd2';
			} 			
			var baseUrl = document.location.protocol + '//' + adServerId + '.adsplay.net/delivery';
			return baseUrl + '?' + q;
		}
	
		var AdsPlay = {};
		AdsPlay.getVastUrl = function(zoneId, placementId) {
			var pageUrl = location.href;
			if( pageUrl.indexOf('fptplay.net/xem-video/') < 0 )
			{
				var sspUrl = location.protocol + '//tag.gammaplatform.com/adx/request/zid_1469030993/wid_1469030741/?content_page_url=__page-url__&cb=__random-number__&player_width=__player-width__&player_height=__player-height__&device_id=__device-id__';
				sspUrl = sspUrl.replace('__page-url__', encodeURIComponent(pageUrl) );
				sspUrl = sspUrl.replace('__random-number__', (new Date().getTime()) );
				sspUrl = sspUrl.replace('__player-width__', '640');
				sspUrl = sspUrl.replace('__player-height__', '360');
				sspUrl = sspUrl.replace('__device-id__', getUUID());				
				return sspUrl;	
			} 
			else 
			{
				var pmIds = [];
				pmIds.push(placementId);
				return buildAdUrlRequest(zoneId, pmIds) +  '&at=tvc';
			}
		};
			
		AdsPlay.trackClick = function(adId) {
			document.getElementById('div-ad-'+ adId).style.display = "none";
			// log click
			callBeaconLogTracking({
				url : baseUrlTrackingAds,
				vars : {
					metric : 'click',
					adid : adId,
					beacon : adBeacons[adId]
				}
			});
			return true;
		}
	
		var baseUrlTrackingAds = document.location.protocol	+ "//log.adsplay.net/track/ads";
		var adBeacons = {};
	
		// ----------- Overlay Ad - format Breaking News ------------------------ 		
		function renderBreakingNewsAd(playerWrapper, adTextMsg, adLink, adActionMsg, adId, autoHideTimeout) {
			if (playerWrapper.firstChild) {
				var marqueeStyle = 'style="margin-top:2px; font-size:17px;color:#FFFFFF;animation: marquee 7s linear infinite;white-space: nowrap;"';
				var adHtml = '<p id="marquee-'+adId+'" '+marqueeStyle+' > ' + adTextMsg;
				adHtml += ' - <a style="color: #F28807;" onclick="AdsPlay.trackClick('+adId+')" href="' + adLink + '" target="_blank" >'  + adActionMsg + '</a></p>';	
				var div = document.createElement("div");
				div.id = "div-ad-" + adId;
				div.style.position = 'absolute';
				div.style['text-align'] = 'center';
				div.style['background-color'] = 'rgba(7, 7, 7, 0.72)';
				div.style.width =  playerWrapper.offsetWidth + 'px';
				div.style.top =  playerWrapper.offsetTop +'px';
				div.style['z-index'] = '2147483647';
							
				div.innerHTML = adHtml;
				playerWrapper.insertBefore(div, playerWrapper.firstChild);
	
				// log imp
				callBeaconLogTracking({
					url : baseUrlTrackingAds,
					vars : {
						metric : 'impression',
						adid : adId,
						beacon : adBeacons[adId]
					}
				});
				
				var textWidth = document.getElementById('marquee-'+ adId).offsetWidth * 0.13;
				var keyframes = '@keyframes marquee  {  0%  { text-indent: -' + textWidth +'px } 100% { text-indent: '+ textWidth +'px } }';
	
				if( document.styleSheets && document.styleSheets.length ) {			
					document.styleSheets[0].insertRule( keyframes, 0 );			
				} else {			
					var s = document.createElement( 'style' );
					s.innerHTML = keyframes;
					document.getElementsByTagName( 'head' )[ 0 ].appendChild( s );			
				}			
	
				setTimeout(function() {
					document.getElementById('div-ad-'+ adId).style.display = "none";
				}, autoHideTimeout);
			}
		}	
		
		var initBreakingNewsAd = function(data) {		
			var adTextMsg = data.adMedia;
			var adLink = data.clickthroughUrl;
			var adActionMsg = data.clickActionText;
			var adId =  data.adId;
			var adBeacon = data.adBeacon;
			var videoPlayerId = data.videoPlayerId;	
			var autoHideTimeout = data.autoHideTimeout;
			
			var playerWrapper = document.getElementById(videoPlayerId);
			if (playerWrapper) {
				adBeacons[adId] = adBeacon;
				renderBreakingNewsAd(playerWrapper, adTextMsg, adLink, adActionMsg, adId, autoHideTimeout);
			}		
		}
	
		// ----------- Overlay Ad - format Image Banner ------------------------	
		function renderOverlayAd(width, height,playerWrapper, adImgSrc, adLink, adActionMsg, adId, autoHideTimeout) {
			if (playerWrapper.firstChild) {
				var img = '<img style="width:'+width+'px;height:'+height+'px" src="' + adImgSrc + '" />';
				var adHtml = '<a onclick="AdsPlay.trackClick(' + adId + ')" href="' + adLink + '" title="'+adActionMsg+'" target="_blank" >'+ img + '</a>';
				var div = document.createElement("div");
				div.id = "div-ad-" + adId;
				div.style.position = 'absolute';
				div.style['text-align'] = 'center';
				div.style['background-color'] = 'rgba(221, 221, 221, 0)';
				div.style.width =  playerWrapper.offsetWidth + 'px';
				div.style.top =  (playerWrapper.offsetTop + playerWrapper.offsetHeight - 130) +'px';
				div.style['z-index'] = '2147483647';
							
				div.innerHTML = adHtml;
				playerWrapper.insertBefore(div, playerWrapper.firstChild);
	
				// log imp
				callBeaconLogTracking({
					url : baseUrlTrackingAds,
					vars : {
						metric : 'impression',
						adid : adId,
						beacon : adBeacons[adId]
					}
				});
	
				setTimeout(function() {
					document.getElementById('div-ad-'+ adId).style.display = "none";
				}, autoHideTimeout);
			}
		}
		
		var initOverlayAd = function(data) {
			var width = data.width;
			var height = data.height;
			var adImgSrc = data.adMedia;
			var adLink = data.clickthroughUrl;
			var adActionMsg = data.clickActionText;
			var adId =  data.adId;
			var adBeacon = data.adBeacon;
			var videoPlayerId = data.videoPlayerId;						
			var autoHideTimeout = data.autoHideTimeout;
			
			
			var playerWrapper = document.getElementById(videoPlayerId);
			if (playerWrapper && (typeof adImgSrc === 'string') ) {
				adBeacons[adId] = adBeacon;
				renderOverlayAd(width, height, playerWrapper, adImgSrc, adLink, adActionMsg, adId, autoHideTimeout)
			}
		}
		
		var initTrackingLogStreamingAd = function(data) {
			var tracking3rdUrls = data.tracking3rdUrls;
			//log all 3rd tracking URL
			if(typeof tracking3rdUrls === 'object'){				
				for(var i=0;i < tracking3rdUrls.length;i++){
					var obj = tracking3rdUrls[i];
					if(obj){
						var delay = obj.delay * 1000;
						var url = obj.url;
						setTimeout(function(u){
							callBeaconLogTracking({	url : u, vars : {} });
						}, delay, url);
					}
				}				
			}
		}
		
		AdsPlay.loadOverlayAds = function(zoneId,pmIds, pmNodes){				
			var h = function(resHeaders,text){
				var ads = JSON.parse(text);
				for(var i=0; i < ads.length; i++){
					var data = ads[i];				
					var tm = data.timeToShow;
					
					if (isNotIE() && isDevicePC() ) {
						//just support for non-IE browser and non-mobile devices for now
						if(data.adType === 4){					
							setTimeout(initBreakingNewsAd, tm , data);
						}
						else if(data.adType === 3){					
							setTimeout(initOverlayAd, tm , data);
						}
					}	
					if(data.adType === 5){					
						var nodeId = 'aplpm' + data.placementId;
						var html = '<a target="_blank" href="'+data.clickthroughUrl+'" title="'+data.clickActionText+'">';
						html += ('<img src="'+data.adMedia+'" width="'+data.width+'" height="'+data.height+'" alt="" border="0/"></a>');				        
						document.getElementById(nodeId).innerHTML = html;
					}
					if(data.adType === 10){	
						initTrackingLogStreamingAd(data);
					}
				}			
				if(window.console){					
					window.console.log(ads);
				}
			}			
			var url = buildAdUrlRequest(zoneId, pmIds) + '&at=overlay';
			AdsPlayCorsRequest.get(false, url,[], h);
		}		
				
		global.AdsPlay = AdsPlay;
	})(typeof window === 'undefined' ? this : window);
	
	
	//put at the end
	AdsPlayReady(function() {
		if (location.href.indexOf('//fptplay.net') > 0) {
			if(window.console){					
				window.console.log("AdsPlayReady ...");
			}
			setTimeout(function(){
				var pmIds = [401, 501];		
				var pmNodes = document.getElementsByClassName('adsplay-placement');
				var mapPmNodes = {};
				for (var i = 0; i < pmNodes.length; i++) {
					var node = pmNodes[i];
					pmIds.push(node.getAttribute('data-placement-id'));
					mapPmNodes[node.getAttribute('id')] = node;
				}
				AdsPlay.loadOverlayAds(1001, pmIds, mapPmNodes);
				//FIXME hard code for FptPlay
			}, 5000);			
		}				
	});
	
	
	//Epinion Code for FPTPlay Web
	if (location.href.indexOf('//fptplay.net') > 0) {
		var _urq = _urq || [];
		_urq.push(['initSite', '77d087a8-b93c-4f3b-aa2e-b0cfb1f0b7ad']);
		(function() {
		var ur = document.createElement('script'); ur.type = 'text/javascript'; ur.async = true;
		ur.src = ('https:' == document.location.protocol ? 'https://st.adsplay.net/js/userreport.js' : 'http://st.adsplay.net/js/userreport.js');
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ur, s);
		})();
	}	
}