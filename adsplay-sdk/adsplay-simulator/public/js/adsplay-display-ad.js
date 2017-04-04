/*
 * AdsPlay Display Ad Banner - version 1.7.1 - date: October 13, 2016
 */
if( ! window.AdsPlayBannerReady ) {
	// BEGIN window.AdsPlayBannerReady
	
	(function(funcName, baseObj) {
	    // The public function name defaults to window.AdsPlayBannerReady
	    // but you can pass in your own object and own function name and those will be used
	    // if you want to put them in a different namespace
	    funcName = funcName || "AdsPlayBannerReady";
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
	
	    // This is the one public interface
	    // AdsPlayBannerReady(fn, context);
	    // the context argument is optional - if present, it will be passed
	    // as an argument to the callback
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
	})("AdsPlayBannerReady", window);
	
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
	
	(function(global, undefined) {
			
		function callBeaconLogTracking(opts) {
			// Make sure we have a base object for opts
			opts = opts || {};
			// Setup defaults for options
			opts.url = opts.url || null;
			opts.vars = opts.vars || {};
			opts.error = opts.error || function() {};
			opts.success = opts.success || function() {};
			
			//cache busting
			opts.vars.cb = Math.floor(Math.random() * 10e12);
			
			// Split up vars object into an array
			var varsArray = [];
			for ( var key in opts.vars) {
				varsArray.push(encodeURIComponent(key) + '=' + encodeURIComponent(opts.vars[key]));
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
				if(opts.noParameter){
					beacon.src = opts.url;
				} else {
					beacon.src = opts.url + '?' + qString;
				}				
			}
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
		
		
		function ajaxCorsRequest(url, callback) {
			var xhttp = new XMLHttpRequest();	
			
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200 && (typeof callback === 'function') ) {
					callback(xhttp.responseText);
				}
			}
			xhttp.onerror = function() {
				if(window.console){
					window.console.error(' ajaxCorsRequest for URL: ' + url );
				}
			};
			xhttp.open("GET", url, true);
			xhttp.withCredentials = true;
			xhttp.send();
		}
		
		var buildAdUrlRequest = function(placementIds){
			var time = new Date().getTime();
			
			var q = 'uuid=' + getUUID();
			for (var i = 0; i < placementIds.length; i++) {
				q += ('&placement=' + placementIds[i]); 
			}
			q += ('&referrer=' + encodeURIComponent(document.referrer ? document.referrer : ''));
			q += ('&url=' + encodeURIComponent(document.location.href));
			q += ('&cxt=' + encodeURIComponent(document.title));						
			q += ('&t=' + time);		
			var adServerId = 'd4';
			var ran = time % 8;
			if (ran === 1) {
				adServerId = 'd1';
			} 
			else if (ran === 2) {
				adServerId = 'd2';
			} 
			else if (ran === 4) {
				adServerId = 'd4';
			}
			
			var baseUrl = document.location.protocol + '//' + adServerId + '.adsplay.net/delivery';
			return baseUrl + '?' + q;
		}
		
		function navigateToUrl(url) {
			//window.open(url,'_blank');
			setTimeout(function() {			     
			      //window.location.href = url;
			      window.open(url, '_blank');
			      //setTimeout(function(){ location.reload(); }, 2000);           
			 }, 1000);
		}
	
		var AdsPlayBanner = {};			
		
		AdsPlayBanner.handleAdClick = function(adId) {			
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
		
		function getImageNode(title, width, height, srcUrl, adId, beacon, clickthroughUrl){
			   var imgId = 'adsplay-iframe-ad-'+adId;
		       var img = document.createElement('img');
		       img.setAttribute('style','width:'+width+'px;height:'+height+'px');		       
		       img.setAttribute('width', width)
		       img.setAttribute('height',height)
		       img.setAttribute('src',srcUrl);
		       img.setAttribute('id',imgId);

		       var ins = document.createElement('ins');
		       ins.style.display = 'inline-table';
		       ins.style.border = 'none';
		       ins.style.margin = '0px';
		       ins.style.padding = '0';
		       ins.style.position = 'relative';
		       ins.style['background-color'] = 'transparent';
		       ins.style.width = width + 'px';
		       ins.setAttribute('title',title);
		       ins.appendChild(img);
		       
		       var aNode = document.createElement('a');
		       aNode.setAttribute('href',clickthroughUrl);
		       aNode.setAttribute('target','_blank');
		       aNode.setAttribute('id','adsplay-click-handle-'+adId);
		       aNode.setAttribute('onclick','AdsPlayBanner.handleAdClick('+adId+')');		       
		       aNode.appendChild(ins);
		       
		       return aNode;
		}
		
		function getIframeNode(title, width, height, srcUrl, adId, beacon, clickTag){
			   var iframeId = 'adsplay-iframe-ad-'+adId;
		       var iframe = document.createElement('iframe');
		       iframe.setAttribute('frameborder','0');
		       iframe.setAttribute('marginwidth','0');
		       iframe.setAttribute('vspace','0');
		       iframe.setAttribute('hspace','0');
		       iframe.setAttribute('allowtransparency','true');
		       iframe.setAttribute('scrolling','no');
		       iframe.setAttribute('allowfullscreen','true');
		       iframe.setAttribute('style','left:0;position:absolute;top:0;');

		       iframe.setAttribute('allowfullscreen','true');
		       iframe.setAttribute('width', width)
		       iframe.setAttribute('height',height)
		       iframe.setAttribute('src',srcUrl);
		       iframe.setAttribute('id',iframeId);

		       var ins = document.createElement('ins');
		       ins.style.display = 'inline-table';
		       ins.style.border = 'none';
		       ins.style.margin = '0px';
		       ins.style.padding = '0';
		       ins.style.position = 'relative';
		       ins.style['background-color'] = 'transparent';
		       ins.style.width = width + 'px';
		       ins.setAttribute('title',title);
		       ins.appendChild(iframe);		       
		       
		       return ins;
		}
		
		
		
		function processAdData(data, placementNode) {
			var css = 'display:block;border:none;margin:0 auto;padding:0;position:relative;visibility:visible;background-color:transparent;text-align: center;';
			if(data.width > 0){
	    		css = css + ';width:' + width+'px';	
	    	}
	    	if(data.height > 0){
	    		css = css + ';height:'+ height+'px';	
	    	}	
	    	
			var clickTag = data.clickthroughUrl;
		    var adUrl = data.adMedia;
		    var adId = data.adId;
		    var beacon = data.adBeacon;
		    var width =  data.width == 0  ? '100%' : data.width;
		    var height = data.height == 0 ? '100%' : data.height;
		    var placementId = data.placementId;
		    var title = data.clickActionText;
		    var adType = data.adType;
		    var adCode = data.adCode;
		    var tracking3rdUrls = data.tracking3rdUrls || [];
		    
		    adBeacons[adId] = beacon;
		    		    
	    	var pmadid = placementNode.getAttribute('data-adsplay-adid');
	    	if( ! pmadid ){
	    		placementNode.setAttribute('style',css);
		    	placementNode.setAttribute('data-adsplay-adid',adId);
				
			    var displayOk = false;
			    if(adType === 5){
			    	//ADTYPE_HTML5_DISPLAY_AD = 5;//HTML5 Interactive Ad
			    	var srcUrl = adUrl + '#adid='+adId+'&beacon='+beacon+'&clicktag='+clickTag;						
					var renderedAdNode = getIframeNode(title,width,height,srcUrl, adId, beacon, clickTag);
					placementNode.appendChild(renderedAdNode);
					displayOk = true;
			    }
			    else if(adType === 6){
			    	//ADTYPE_IMAGE_DISPLAY_AD = 6;// static banner: jpeg, gif, png
			    	var renderedAdNode = getImageNode(title,width,height,adUrl, adId, beacon, clickTag);				
					placementNode.appendChild(renderedAdNode);
			    	displayOk = true;
			    }
			    else if(adType === 9 && adCode != ''){
					
			    	//ADTYPE_BIDDING_AD = 9;//Google Ad JavaScript	
			    				    	
			    	var adIframe = document.createElement("iframe");
			    	adIframe.setAttribute('width',width);
			    	adIframe.setAttribute('height',height);
			    	adIframe.setAttribute('src','about:blank');
			    	//adIframe.setAttribute('style','position:absolute;left:0;top:0;');				    					    	
			    	adIframe.setAttribute('frameborder','0');				    					    	
			    	adIframe.setAttribute('marginwidth','0');
			    	adIframe.setAttribute('marginheight','0');
			    	adIframe.setAttribute('vspace','0');
			    	adIframe.setAttribute('hspace','0');				    	
			    	adIframe.setAttribute('allowtransparency','true');
			    	adIframe.setAttribute('scrolling','no');
			    	adIframe.setAttribute('allowfullscreen','true');
			    	adIframe.setAttribute('id','adsplay_frame_'+placementId);				  
			    	
			    	placementNode.appendChild(adIframe);				    	
			    	adIframe.contentDocument.write(adCode);
			    } else if(adType === 11) {
					console.log('mastershead')
                    //ADTYPE_MASTHEAD_AD = 11 master head for mobile app, smart-tv and Web
					//var placementNode = document.createElement("div");
					var renderedAdNode = renderMastheadView(data);				
					placementNode.appendChild(renderedAdNode);
                    displayOk = true;
                }
			    
			    if(displayOk){
			    	
			    	// log imp for AdsPlay
			    	callBeaconLogTracking({
						url : baseUrlTrackingAds,
						vars : {metric : 'impression', adid : adId,	beacon :  adBeacons[adId] }
					});
			    	
			    	// log imp for 3rd party
					for(var j=0; j< tracking3rdUrls.length; j++){
						var trackUrl = tracking3rdUrls[j];					
						callBeaconLogTracking({ url : trackUrl, vars : {} , noParameter : true });
					}
			    }
	    	}		    			    
		}

        // ADTYPE_MASTHEAD_AD rendering
        function renderMastheadView(data){
            var div = document.createElement('div');
				div.style.position = 'relative';
			console.log(data)
			/**
			 * background element
			 */
			var bg = document.createElement('div');
			bg.className = 'background';
			// background image inner
			var bgImage = document.createElement('div');
			bgImage.style.backgroundImage = 'url("'+data.backgroundImage+'")';
			bgImage.style.backgroundColor = '#000';
			bgImage.style.backgroundRepeat = 'no-repeat';
			bgImage.style.backgroundPosition = 'center center';
			bgImage.style.backgroundSize = 'cover';
			bgImage.style.cursor = 'default';
			bgImage.style.width ='970px';
			bgImage.style.height ='250px';
			bgImage.style.position = 'relative';
			bgImage.style.top = 0;
			bgImage.style.left = 0;
			bgImage.style.margin = '0 auto';
			bg.appendChild(bgImage);
			/**
			 * video element
			 */
			var v = document.createElement('div');
			v.className = 'video';
			v.style.cssText = 'position:absolute; '+ data.styleAttr;
			//video inner
			var vIframe = '';
			if(typeof (data.adMedia) != 'undefined' && 
			(data.adMedia.indexOf('youtu.be') == -1 || data.adMedia.indexOf('youtube') == -1)){
				vIframe = '<video width="100%" height="100%" controls><source src="'+data.adMedia+'" type="video/mp4"></video>';
			}
			else{
				vIframe = '<iframe frameborder="0" allowfullscreen="1" width="100%" height="100%" src="'+data.adMedia+'"></iframe>';
			}
			v.innerHTML += vIframe;
			/**
			 * brand element
			 */
			var brand = document.createElement('div');
				brand.className = 'brand';
				brand.style.cssText = 'position: absolute; width: 40%; top: 50%; left: 80px; margin-top: -40px;';
			
			var brandIcon = '<img src="'+data.brandIcon+'" style="width: 80px;float: left;margin-right: 10px;" />';
			var headlineText = '<p style="text-align: left; font-size: 26px; color: #fff; margin: 0 0 5px; vertical-align: middle; line-height: 80px;">'
									+data.headlineText+
									'<button style="background-color: #222; color: #fff; border-radius: 6px; border: 1px solid transparent; padding: 4px 8px; vertical-align: text-bottom; margin-left: 10px; font-size: 16px;" >'
										+data.clickActionText+
									'</button>'
								'</p>';

			brand.innerHTML += brandIcon;
			brand.innerHTML += headlineText;

            div.appendChild(bg);
			div.appendChild(v);
			div.appendChild(brand);
			return div;
		}
		
		AdsPlayBanner.getAds = function(pmIds, mapPmIdsNodes){	       	       
	       var h = function(text){
	    	   var ads = JSON.parse(text);
	    	   for(var i=0; i < ads.length; i++){	    		   	
					var data = ads[i];
					var placementId = data.placementId+'';
					var pmNodes = mapPmIdsNodes[placementId];
					// //FIXME
					// 	data.adType = 11;
					// 	pmNodes = mapPmIdsNodes[113];
					// //END FIXME	
					if(pmNodes){
						var node = pmNodes.pop();
						if(node){							
							processAdData(data,node);
							if(window.console){
								window.console.log(placementId  + ' -> ' + data.adId);
							}
						}							
					}					
				}
				if(window.console){					
					window.console.log(ads);					
				}
			}
	        // make request server
			var url = buildAdUrlRequest(pmIds) + '&at=display';		
			ajaxCorsRequest(url, h)	;		
	   }
				
		global.AdsPlayBanner = AdsPlayBanner;
		
		var AdsPlayTracker = {};
		
		AdsPlayTracker.doImpressionLog = function(pmIds){
			var h = function(text){
				var ads = JSON.parse(text);
				for(var i=0; i < ads.length; i++){
					var data = ads[i];				
					var tm = data.timeToShow;
					if(data.adType === 10){
						//autobot for impression logger
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
						initTrackingLogStreamingAd(data);
					}
				}
				if(window.console){					
					window.console.log(ads);
				}
			}			
			var url = buildAdUrlRequest(pmIds) + '&at=overlay';
			ajaxCorsRequest(url, h)	;	
		}
		
		global.AdsPlayTracker = AdsPlayTracker;		
		
	})(typeof window === 'undefined' ? this : window);
	
	
	//put at the end
	AdsPlayBannerReady(function() {	 		
		if(window.console){					
			window.console.log("AdsPlayBannerReady ...");
		}
		
		var nodes = document.getElementsByClassName('adsplay-placement');		
		var pmIds = [], mapPmIdsNodes = [];
		
	    for(var i=0; i < nodes.length; i++){
	    	if(nodes[i]){
	    		var spmid = nodes[i].getAttribute('id');
		    	var pmId = 0;
		    	if(typeof spmid === 'string' ){	    		
		    		//case if tag is <ins class="adsplay-placement" id="aplpm-1001" >	
		    		pmId = parseInt(spmid.replace('aplpm-',''));
		    		pmIds.push(pmId);	    		
		    	} else {	    		
		    		//case if tag is <ins class="adsplay-placement" data-aplpm="1001" >
		    		var spmid = nodes[i].getAttribute('data-aplpm');
		    		if(typeof spmid === 'string'){		    		
		    			pmId = parseInt(spmid);
		    			pmIds.push(parseInt(spmid));	
			    	}
		    	}
		    	if(pmId >0){
		    		var k = pmId+'';
		    		if(typeof mapPmIdsNodes[k] !== 'object'){
		    			mapPmIdsNodes[k] = [];		    			
		    		}
		    		mapPmIdsNodes[k].push(nodes[i]);		    		
		    	}	
	    	}	    	
		}
		// //FIXME
		// // get demo data
		// console.log(pmIds, mapPmIdsNodes)
		// pmIds = [1002];
	    AdsPlayBanner.getAds(pmIds, mapPmIdsNodes);
	    // //END FIXME
		
	    var meta = document.createElement('meta');
	    meta.setAttribute('name','referrer');
	    meta.setAttribute('content','unsafe-url');
	    var head = document.getElementsByTagName('head')[0];
	    if(head){
	    	head.appendChild(meta);
	    }	
	    
	    //---------------------BEGIN the age of autobot------------------------
	    setTimeout(function(){			
			AdsPlayTracker.doImpressionLog([446]);
		}, 3000);	
	    //---------------------END the age of autobot------------------------
	});	
	
	// END window.AdsPlayBannerReady
}
