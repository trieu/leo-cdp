/**
 * ################### Cookie util functions ##################
 */
(function (global, undefined) {
	'use strict';

	var factory = function (window) {
		if (typeof window.document !== 'object') {
			throw new Error(
				'LeoCmsCookieUtil.js requires a `window` with a `document` object');
		}

		var LeoCmsCookieUtil = function (key, value, options) {
			return arguments.length === 1 ? LeoCmsCookieUtil.get(key) :
				LeoCmsCookieUtil.set(key, value, options);
		};

		// Allows for setter injection in unit tests
		LeoCmsCookieUtil._document = window.document;

		// Used to ensure cookie keys do not collide with built-in `Object`
		// properties
		LeoCmsCookieUtil._cacheKeyPrefix = 'cookey.';

		LeoCmsCookieUtil._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

		LeoCmsCookieUtil.defaults = {
			path: '/',
			secure: false
		};

		LeoCmsCookieUtil.get = function (key) {
			if (LeoCmsCookieUtil._cachedDocumentCookie !== LeoCmsCookieUtil._document.cookie) {
				LeoCmsCookieUtil._renewCache();
			}

			return LeoCmsCookieUtil._cache[LeoCmsCookieUtil._cacheKeyPrefix + key];
		};

		LeoCmsCookieUtil.set = function (key, value, options) {
			options = LeoCmsCookieUtil._getExtendedOptions(options);
			options.expires = LeoCmsCookieUtil
				._getExpiresDate(value === undefined ? -1 : options.expires);

			LeoCmsCookieUtil._document.cookie = LeoCmsCookieUtil
				._generateAdCookiestring(key, value, options);

			return LeoCmsCookieUtil;
		};

		LeoCmsCookieUtil.expire = function (key, options) {
			return LeoCmsCookieUtil.set(key, undefined, options);
		};

		LeoCmsCookieUtil._getExtendedOptions = function (options) {
			return {
				path: options && options.path || LeoCmsCookieUtil.defaults.path,
				domain: options && options.domain ||
					LeoCmsCookieUtil.defaults.domain,
				expires: options && options.expires ||
					LeoCmsCookieUtil.defaults.expires,
				secure: options && options.secure !== undefined ? options.secure : LeoCmsCookieUtil.defaults.secure
			};
		};

		LeoCmsCookieUtil._isValidDate = function (date) {
			return Object.prototype.toString.call(date) === '[object Date]' &&
				!isNaN(date.getTime());
		};

		LeoCmsCookieUtil._getExpiresDate = function (expires, now) {
			now = now || new Date();

			if (typeof expires === 'number') {
				expires = expires === Infinity ? LeoCmsCookieUtil._maxExpireDate :
					new Date(now.getTime() + expires * 1000);
			} else if (typeof expires === 'string') {
				expires = new Date(expires);
			}

			if (expires && !LeoCmsCookieUtil._isValidDate(expires)) {
				throw new Error(
					'`expires` parameter cannot be converted to a valid Date instance');
			}

			return expires;
		};

		LeoCmsCookieUtil._generateAdCookiestring = function (key, value,
			options) {
			key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
			key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
			value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g,
				encodeURIComponent);
			options = options || {};

			var AdCookiestring = key + '=' + value;
			AdCookiestring += options.path ? ';path=' + options.path : '';
			AdCookiestring += options.domain ? ';domain=' + options.domain :
				'';
			AdCookiestring += options.expires ? ';expires=' +
				options.expires.toUTCString() : '';
			AdCookiestring += options.secure ? ';secure' : '';

			return AdCookiestring;
		};

		LeoCmsCookieUtil._getCacheFromString = function (documentCookie) {
			var cookieCache = {};
			var AdCookiesArray = documentCookie ? documentCookie
				.split('; ') : [];

			for (var i = 0; i < AdCookiesArray.length; i++) {
				var cookieKvp = LeoCmsCookieUtil
					._getKeyValuePairFromAdCookiestring(AdCookiesArray[i]);

				if (cookieCache[LeoCmsCookieUtil._cacheKeyPrefix + cookieKvp.key] === undefined) {
					cookieCache[LeoCmsCookieUtil._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
				}
			}

			return cookieCache;
		};

		LeoCmsCookieUtil._getKeyValuePairFromAdCookiestring = function (
			AdCookiestring) {
			// "=" is a valid character in a cookie value according to RFC6265,
			// so cannot `split('=')`
			var separatorIndex = AdCookiestring.indexOf('=');

			// IE omits the "=" when the cookie value is an empty string
			separatorIndex = separatorIndex < 0 ? AdCookiestring.length :
				separatorIndex;

			return {
				key: decodeURIComponent(AdCookiestring.substr(0,
					separatorIndex)),
				value: decodeURIComponent(AdCookiestring
					.substr(separatorIndex + 1))
			};
		};

		LeoCmsCookieUtil._renewCache = function () {
			LeoCmsCookieUtil._cache = LeoCmsCookieUtil
				._getCacheFromString(LeoCmsCookieUtil._document.cookie);
			LeoCmsCookieUtil._cachedDocumentCookie = LeoCmsCookieUtil._document.cookie;
		};

		LeoCmsCookieUtil._areEnabled = function () {
			var testKey = 'LeoCmsCookieUtil.js';
			var areEnabled = LeoCmsCookieUtil.set(testKey, 1).get(testKey) === '1';
			LeoCmsCookieUtil.expire(testKey);
			return areEnabled;
		};

		LeoCmsCookieUtil.enabled = LeoCmsCookieUtil._areEnabled();

		return LeoCmsCookieUtil;
	};

	var AdCookiesExport = typeof global.document === 'object' ? factory(global) :
		factory;

	// AMD support
	if (typeof define === 'function' && define.amd) {
		define(function () {
			return AdCookiesExport;
		});
		// CommonJS/Node.js support
	} else if (typeof exports === 'object') {
		// But always support CommonJS module 1.1.1 spec (`exports` cannot be a
		// function)
		exports.LeoCmsCookieUtil = AdCookiesExport;
	} else {
		global.LeoCmsCookieUtil = AdCookiesExport;
	}
})(typeof window === 'undefined' ? this : window);

/**
 * ################## common utils functions ####################
 */

window.loadView = window.loadView || function (uri, divSelector, callback) {

	var time2Live = typeof window.apiCacheTime2Live === 'number' ? window.apiCacheTime2Live : 1; // in munute
	var apiCacheEnabled = typeof window.apiCacheEnabled === 'boolean' ? window.apiCacheEnabled : true;
	var cacheKey = 'lview_' + getCacheKey(uri + divSelector, {});
	var result = false;
	if (apiCacheEnabled) {
		result = lscache.get(cacheKey);
	}
	if (result) {
		$(divSelector).empty().html(result);
		if (typeof callback === 'function') {
			try {
				callback.apply();
			} catch (error) {
				alert(error);
				location.href = '/';
			}
		}
	} else {
		var fullUrl = window.baseStaticUrl + uri;
		$.ajax({
			url: fullUrl,
			type: 'GET',
			success: function (data) {
				$(divSelector).empty().html(data);
				if (typeof callback === 'function') {
					try {
						callback.apply();
						lscache.set(cacheKey, data, time2Live);
					} catch (error) {
						alert(error);
						location.href = '/';
					}
				}
			},
			error: function (data) {
				console.error("loadView.error: ", data);
			}
		});
	}
}

Handlebars.registerHelper('formatCurrency', function (value) {
	return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
});

Handlebars.registerHelper('eachProperty', function (context, options) {
	var ret = "";
	for (var prop in context) {
		ret = ret + options.fn({
			property: prop,
			value: context[prop]
		});
	}
	return ret;
});


function getCompiledTemplate(domSelector) {
	return Handlebars.compile($(domSelector).html().trim());
}

function getFullUrlStaticMedia(uri, defaultUriIfEmpty, staticBaseUrl) {
	var st = (staticBaseUrl || window.staticBaseUrl) || '';
	if (uri && uri !== '' && uri.indexOf('http') < 0) {
		return st + uri;
	}
	return defaultUriIfEmpty || '';
}

function getQueryMapFromUrl(url) {
	var vars = [],
		hash;
	var hashes = url.slice(url.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function textTruncate(str, length, ending) {
	if (length == null) {
		length = 100;
	}
	if (ending == null) {
		ending = '...';
	}
	if (str.length > length) {
		return str.substring(0, length - ending.length) + ending;
	} else {
		return str;
	}
};

function toTitleCase(str) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


function toDateStringVN(date) {
	var dd = date.getDate();
	var mm = date.getMonth() + 1; //January is 0!

	var yyyy = date.getFullYear();
	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}
	var str = dd + '/' + mm + '/' + yyyy;
	return str;
}

function getCacheKey(url, params) {
	var text = url + JSON.stringify(params);
	return md5(text);
}

function isMobileDevice() {
	var isMobile = false; //initiate as false
	// device detection
	if (
		/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
		.test(navigator.userAgent) ||
		/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
		.test(navigator.userAgent.substr(0, 4))) {
		isMobile = true;
	}
	return isMobile;
}

/**
 * ################## LeoCmsApiUtil functions ####################
 * 
 */
var LeoCmsApiUtil = window.LeoCmsApiUtil || {};

if (LeoCmsApiUtil.isLoaded !== true) {
	(function () {
		var obj = {
			isLoaded: false,
			debug: false,
			baseAdminApi: window.baseAdminApi || 'http://localhost:9070',
			baseUploadApi: window.baseUploadApi || 'http://localhost:9070'
		};

		function getUserSession() {
			var key = 'leousersession';
			var usersession = LeoCmsCookieUtil.get(key);
			if (!usersession) {
				usersession = lscache.get('usersession');
				if (usersession) {
					LeoCmsCookieUtil.set(key, usersession, {
						expires: 10080
					}); // Expires
					// in 7
					// days
				} else {
					console.error('getUserSession is empty');
					return "";
				}
			}
			return usersession;
		}

		obj.callPostApi = function (urlStr, data, callback) {
			if (typeof callback !== 'function') {
				console.error('callback must be a function');
			}
			if (typeof urlStr !== 'string') {
				console.error('urlStr must be a string');
			}
			$.ajax({
				url: urlStr,
				crossDomain: true,
				data: JSON.stringify(data),
				contentType: 'application/json',
				type: 'POST'
			}).done(function (json) {
				//console.log("callPostApi", urlStr, data, json);
				callback(json);
			});
		}

		obj.callPostAdminApi = function (urlStr, data, callback) {
			console.log('callPostAdminApi ...');
			if (typeof callback !== 'function') {
				console.error('callback must be a function');
			}
			var usersession = lscache.get('usersession');
			if (usersession) {
				data['usersession'] = usersession;

				jQuery.ajax({
					type: 'POST',
					crossDomain: true,
					url: urlStr,
					data: JSON.stringify(data),
					contentType: 'application/json',
					dataType: "json",
					success: function (json) {
						callback(json);
					},
					error: function (responseData, textStatus, errorThrown) {
						console.error('callPostAdminApi POST failed.' + responseData);
					}
				});

			} else {
				callback({
					"uri": urlStr,
					"data": "",
					"errorMessage": "No Authentication",
					"errorCode": 501
				});
			}
		}

		obj.getSecuredData = function (urlStr, data, callback) {
			console.log('getSecuredData ...');
			if (typeof callback !== 'function') {
				console.error('callback must be a function');
			}
			var usersession = lscache.get('usersession');
			if (typeof usersession === 'string') {

				var time2Live = typeof window.apiCacheTime2Live === 'number' ? window.apiCacheTime2Live : 1; // in munute
				var apiCacheEnabled = typeof window.apiCacheEnabled === 'boolean' ? window.apiCacheEnabled : true;
				var cacheKey = 'hget_' + getCacheKey(urlStr, data);
				var result = false;
				//
				if (apiCacheEnabled) {
					result = lscache.get(cacheKey);
				}
				if (result) {
					try {
						var json = JSON.parse(result);
						callback(json);
					} catch (e) {
						console.error(e);
					}
				} else {
					data['_t'] = new Date().getTime();
					jQuery.ajax({
						type: 'GET',
						crossDomain: true,
						url: urlStr,
						data: data,
						beforeSend: function (xhr) {
							xhr.setRequestHeader('leouss', usersession);
						},
						contentType: 'application/json',
						dataType: "json",
						success: function (json) {
							lscache.set(cacheKey, JSON.stringify(json), time2Live);
							callback(json);
						},
						error: function (responseData, textStatus, errorThrown) {
							console.error('getSecuredData POST failed.' + responseData);
						}
					});
				}


			} else {
				callback({
					"uri": urlStr,
					"data": "",
					"errorMessage": "No Authentication",
					"errorCode": 501
				});
			}
		}

		obj.renderViewForSecuredData = function (apiURI, objParams, containerIdSelector, tplIdSelector, beforeRenderCallback, afterRenderCallback) {
			if (!window.baseDeliveryApi || !apiURI) {
				console.error('baseDeliveryApi and apiURI must be not NULL');
				return;
			}

			//build with client cache busting
			var urlStr = baseDeliveryApi + apiURI;
			LeoCmsApiUtil.getSecuredData(urlStr, objParams, function (json) {
				var stUrl = json.staticBaseUrl || '';
				if (json.errorCode === 0 && json.errorMessage === '' && json.data) {
					var data = json.data;

					var template = getCompiledTemplate(tplIdSelector); //ID selector of template
					var containerNode = $(containerIdSelector); //ID selector of container list
					containerNode.empty();

					for (var k in data) {
						var obj = data[k];
						var contentType = obj.type;

						//before append
						if (typeof beforeRenderCallback === 'function') {
							obj = beforeRenderCallback(obj, stUrl);
						}

						//render DOM
						var html = template(obj);
						containerNode.append(html);

						// after append
						if (typeof afterRenderCallback === 'function') {
							var domNode = containerNode.children().last()
							afterRenderCallback(contentType, domNode, stUrl);
						}
					}
				}
			});
		}

		obj.httpGetDataJson = function (uriStr) {
			var usersession = lscache.get('usersession');
			if (usersession) {
				return jQuery.ajax({
					url: obj.baseAdminApi + uriStr,
					type: 'GET',
					dataType: 'json',
					beforeSend: function (xhr) {
						xhr.setRequestHeader('leouss', usersession);
					}
				});
			} else {
				console.error('No usersession found in lscache')
			}
		}

		obj.debugLog = function (data) {
			if (window.debugMode === true) {
				console.log("caller context: ", obj.debugLog.caller);
				[].forEach.call(arguments, function (el) {
					console.log(el);
				});
			}
		}

		obj.logErrorPayload = function (json) {
			console.log("caller context: ", obj.logErrorPayload.caller)
			console.error(json.errorMessage + " errorCode: " + json.errorCode);
		}

		obj.isLoginSessionOK = function () {
			var usersession = lscache.get('usersession');
			var encryptionkey = lscache.get('encryptionkey');
			return typeof usersession === 'string' && typeof encryptionkey === 'string';
		}

		obj.logout = function (callback) {
			lscache.flush();
			LeoCmsCookieUtil.expire('leousersession');
			setTimeout(function () {
				if (typeof callback === 'function') callback();
				else window.location = '/';
			}, 500);
		}

		obj.formater = {
			toDateString: function (data) {
				return moment(parseFloat(data)).format('YYYY-MM-DD HH:mm:ss')
			}
		}

		LeoCmsApiUtil = obj;
		LeoCmsApiUtil.isLoaded = true;
	}());
}