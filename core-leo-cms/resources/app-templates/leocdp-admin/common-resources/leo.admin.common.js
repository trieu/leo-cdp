
/**
 * ################## common utils functions ####################
 */

var LeoCdpAdmin = window.LeoCdpAdmin || {}

LeoCdpAdmin.loadView = LeoCdpAdmin.loadView || function(uri, divSelector, callback, i18nTurnOff ) {
	//caching view in LocalStorage
	var time2Live = typeof window.apiCacheTime2Live === 'number' ? window.apiCacheTime2Live : 1; // in munute
	var apiCacheEnabled = typeof window.apiCacheEnabled === 'boolean' ? window.apiCacheEnabled : true;
	var cacheKey = 'lview_' + getCacheKey(uri + divSelector, {});
	var resultHtml = false;
	if (apiCacheEnabled) {
		resultHtml = lscache.get(cacheKey);
	}
	
	if (resultHtml) {
		//set HTML into view placeholder from cached
		$(divSelector).empty().html(resultHtml);
		$(window).scrollTop(0);

		if (typeof callback === 'function') {
			try {
				callback.apply();
			} catch (error) {
				console.error(error);
			}
		}
	} else {
		var fullUrl = window.baseStaticUrl + uri;
		$.ajax({
			url: fullUrl,
			type: 'GET',
			success: function (htmlTpl) {
				// load HTML with i18n data
				if(i18nTurnOff === true) {
					$(divSelector).empty().html(htmlTpl);
					lscache.set(cacheKey, htmlTpl, time2Live);
				} else {
					var i18nModel = typeof window.i18nLeoAdminData === 'function' ? window.i18nLeoAdminData() : {};
					var finalHtml = Handlebars.compile(htmlTpl)(i18nModel);
					$(divSelector).empty().html(finalHtml);
					lscache.set(cacheKey, finalHtml, time2Live);
				}
				$(window).scrollTop(0);
				
				console.log(LeoCdpAdmin);
				
				if (typeof callback === 'function') {
					try {
						callback.apply();
					} catch (error) {
						console.error(error);
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

function getUserSession() {
	var usersession = lscache.get('usersession');
	if (usersession) {
		return usersession;
	} else {
		console.error('usersession is empty');
		return "";
	}
}

/**
 * ################## LeoAdminApiUtil functions ####################
 * 
 */
var LeoAdminApiUtil = window.LeoAdminApiUtil || {};

if (LeoAdminApiUtil.isLoaded !== true) {
	(function () {
		var obj = {
			isLoaded: false,
			debug: false,
			baseAdminApi: window.baseAdminApi || 'http://localhost:9070',
			baseUploadApi: window.baseUploadApi || 'http://localhost:9070'
		};

		

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
					"httpCode": 501
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
					"httpCode": 501
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
			LeoAdminApiUtil.getSecuredData(urlStr, objParams, function (json) {
				var stUrl = json.staticBaseUrl || '';
				if (json.httpCode === 0 && json.errorMessage === '' && json.data) {
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
			console.error(json.errorMessage + " httpCode: " + json.httpCode);
		}

		obj.isLoginSessionOK = function () {
			var usersession = lscache.get('usersession');
			var encryptionkey = lscache.get('encryptionkey');
			return typeof usersession === 'string' && typeof encryptionkey === 'string';
		}

		obj.logout = function (callback) {
			lscache.flush();
			setTimeout(function () {
				if (typeof callback === 'function') callback();
				else window.location = '/';
			}, 500);
		}

		obj.formater = {
			toDateString: function (data) {
				var date = moment.utc(parseFloat(data)).local().format('YYYY-MM-DD HH:mm:ss');
				return date;
			}
		}

		LeoAdminApiUtil = obj;
		LeoAdminApiUtil.isLoaded = true;
	}());
}

var errorNoAuthorization = errorNoAuthorization || function(){
	iziToast.error({
	    title: 'Error',
	    message: 'You don not have authorization to use this function, please contact your system administrator.',
	    onClosing: function(instance, toast, closedBy){
	    	// log error
	    }
	});
}

