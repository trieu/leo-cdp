/**
 * AdsPlayAnalytics 1.0 for iTVad.vn - built on 30/09/2015
 */
(function(f,g){var h=function(e){if("object"!==typeof e.document)throw Error("AdsPlayCookies.js requires a `window` with a `document` object");var b=function(a,d,c){return 1===arguments.length?b.get(a):b.set(a,d,c)};b._document=e.document;b._cacheKeyPrefix="cookey.";b._maxExpireDate=new Date("Fri, 31 Dec 9999 23:59:59 UTC");b.defaults={path:"/",secure:!1};b.get=function(a){b._cachedDocumentCookie!==b._document.cookie&&b._renewCache();return b._cache[b._cacheKeyPrefix+a]};b.set=function(a,d,c){c=b._getExtendedOptions(c);
    c.expires=b._getExpiresDate(d===g?-1:c.expires);b._document.cookie=b._generateAdsPlayCookiestring(a,d,c);return b};b.expire=function(a,d){return b.set(a,g,d)};b._getExtendedOptions=function(a){return{path:a&&a.path||b.defaults.path,domain:a&&a.domain||b.defaults.domain,expires:a&&a.expires||b.defaults.expires,secure:a&&a.secure!==g?a.secure:b.defaults.secure}};b._isValidDate=function(a){return"[object Date]"===Object.prototype.toString.call(a)&&!isNaN(a.getTime())};b._getExpiresDate=function(a,d){d=
    d||new Date;"number"===typeof a?a=Infinity===a?b._maxExpireDate:new Date(d.getTime()+1E3*a):"string"===typeof a&&(a=new Date(a));if(a&&!b._isValidDate(a))throw Error("`expires` parameter cannot be converted to a valid Date instance");return a};b._generateAdsPlayCookiestring=function(a,b,c){a=a.replace(/[^#$&+\^`|]/g,encodeURIComponent);a=a.replace(/\(/g,"%28").replace(/\)/g,"%29");b=(b+"").replace(/[^!#$&-+\--:<-\[\]-~]/g,encodeURIComponent);c=c||{};a=a+"="+b+(c.path?";path="+c.path:"");a+=c.domain?
    ";domain="+c.domain:"";a+=c.expires?";expires="+c.expires.toUTCString():"";return a+=c.secure?";secure":""};b._getCacheFromString=function(a){var d={};a=a?a.split("; "):[];for(var c=0;c<a.length;c++){var e=b._getKeyValuePairFromAdsPlayCookiestring(a[c]);d[b._cacheKeyPrefix+e.key]===g&&(d[b._cacheKeyPrefix+e.key]=e.value)}return d};b._getKeyValuePairFromAdsPlayCookiestring=function(a){var b=a.indexOf("="),b=0>b?a.length:b;return{key:decodeURIComponent(a.substr(0,b)),value:decodeURIComponent(a.substr(b+
    1))}};b._renewCache=function(){b._cache=b._getCacheFromString(b._document.cookie);b._cachedDocumentCookie=b._document.cookie};b._areEnabled=function(){var a="1"===b.set("AdsPlayCookies.js",1).get("AdsPlayCookies.js");b.expire("AdsPlayCookies.js");return a};b.enabled=b._areEnabled();return b},e="object"===typeof f.document?h(f):h;"function"===typeof define&&define.amd?define(function(){return e}):"object"===typeof exports?exports.AdsPlayCookies=e:f.AdsPlayCookies=e})("undefined"===typeof window?this:
    window);
(function(f,g){function h(){var e=(new Date).getTime();return"xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(f){var b=(e+16*Math.random())%16|0;e=Math.floor(e/16);return("x"==f?b:b&3|8).toString(16)})}f.AdsPlayAnalytics={doTracking:function(e,f){var b=new Image,a=AdsPlayCookies.get("apluuid");a||(a=h(),AdsPlayCookies.set("apluuid",a,{expires:315569520}));var a="uuid="+a+"&"+f,d=location.protocol+"//log.adsplay.net/metric/",c=Math.round(10*Math.random())%3;1===c?d=location.protocol+"//log1.adsplay.net/metric/":
    2===c&&(d=location.protocol+"//log2.adsplay.net/metric/");b.src=d+e+"?"+a;b.setAttribute("style","width:0px!important;height:0px!important;display:none!important");document.body.appendChild(b)}}})("undefined"===typeof window?this:window);