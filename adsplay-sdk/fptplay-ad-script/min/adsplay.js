/*
 * AdsPLAY.js for iTVAd - version 1.6 - date: October 7,2016
 */
if(!window.AdsPlayReady&&(function(f,h){function c(){var c=window.ActiveXObject&&"file:"===location.protocol;if(window.XMLHttpRequest&&!c)return new XMLHttpRequest;try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(m){}window.console&&window.console.error("Your browser doesn't support XML handling!");return null}f.AdsPlayCorsRequest={get:function(f,m,b,a){var e=null,d=function(){if(0==e.readyState||4==e.readyState)if(0==e.status||200<=e.status&&300>e.status||304==e.status||1223==e.status){for(var d=
{},c=0;c<b.length;c++){var f=b[c],h=e.getResponseHeader(f);h&&(d[f]=h)}a(d,e.responseText)}else window.console&&window.console.error("Operation failed by AdsPlayRequest.get: "+m)};e||(e=c());e&&(e.open("GET",m,!0),e.onreadystatechange=d,e.withCredentials=f,e.send())}}}("undefined"===typeof window?this:window),function(f,h){function c(){if(!b){b=!0;for(var a=0;a<m.length;a++)m[a].fn.call(window,m[a].ctx);m=[]}}function n(){"complete"===document.readyState&&c()}h=h||window;var m=[],b=!1,a=!1;h[f||"AdsPlayReady"]=
function(e,d){b?setTimeout(function(){e(d)},1):(m.push({fn:e,ctx:d}),"complete"===document.readyState?setTimeout(c,1):a||(document.addEventListener?(document.addEventListener("DOMContentLoaded",c,!1),window.addEventListener("load",c,!1)):(document.attachEvent("onreadystatechange",n),window.attachEvent("onload",c)),a=!0))}}("AdsPlayReady",window),function(f,h){var c=function(c){if("object"!==typeof c.document)throw Error("AdsPlayCookies.js requires a `window` with a `document` object");var b=function(a,
e,d){return 1===arguments.length?b.get(a):b.set(a,e,d)};b._document=c.document;b._cacheKeyPrefix="cookey.";b._maxExpireDate=new Date("Fri, 31 Dec 9999 23:59:59 UTC");b.defaults={path:"/",secure:!1};b.get=function(a){b._cachedDocumentCookie!==b._document.cookie&&b._renewCache();return b._cache[b._cacheKeyPrefix+a]};b.set=function(a,e,d){d=b._getExtendedOptions(d);d.expires=b._getExpiresDate(e===h?-1:d.expires);b._document.cookie=b._generateAdsPlayCookiestring(a,e,d);return b};b.expire=function(a,e){return b.set(a,
h,e)};b._getExtendedOptions=function(a){return{path:a&&a.path||b.defaults.path,domain:a&&a.domain||b.defaults.domain,expires:a&&a.expires||b.defaults.expires,secure:a&&a.secure!==h?a.secure:b.defaults.secure}};b._isValidDate=function(a){return"[object Date]"===Object.prototype.toString.call(a)&&!isNaN(a.getTime())};b._getExpiresDate=function(a,e){e=e||new Date;"number"===typeof a?a=Infinity===a?b._maxExpireDate:new Date(e.getTime()+1E3*a):"string"===typeof a&&(a=new Date(a));if(a&&!b._isValidDate(a))throw Error("`expires` parameter cannot be converted to a valid Date instance");
return a};b._generateAdsPlayCookiestring=function(a,b,d){a=a.replace(/[^#$&+\^`|]/g,encodeURIComponent);a=a.replace(/\(/g,"%28").replace(/\)/g,"%29");b=(b+"").replace(/[^!#$&-+\--:<-\[\]-~]/g,encodeURIComponent);d=d||{};a=a+"="+b+(d.path?";path="+d.path:"");a+=d.domain?";domain="+d.domain:"";a+=d.expires?";expires="+d.expires.toUTCString():"";return a+=d.secure?";secure":""};b._getCacheFromString=function(a){var e={};a=a?a.split("; "):[];for(var d=0;d<a.length;d++){var c=b._getKeyValuePairFromAdsPlayCookiestring(a[d]);
e[b._cacheKeyPrefix+c.key]===h&&(e[b._cacheKeyPrefix+c.key]=c.value)}return e};b._getKeyValuePairFromAdsPlayCookiestring=function(a){var b=a.indexOf("="),b=0>b?a.length:b;return{key:decodeURIComponent(a.substr(0,b)),value:decodeURIComponent(a.substr(b+1))}};b._renewCache=function(){b._cache=b._getCacheFromString(b._document.cookie);b._cachedDocumentCookie=b._document.cookie};b._areEnabled=function(){var a="1"===b.set("AdsPlayCookies.js",1).get("AdsPlayCookies.js");b.expire("AdsPlayCookies.js");return a};
b.enabled=b._areEnabled();return b},n="object"===typeof f.document?c(f):c;"function"===typeof define&&define.amd?define(function(){return n}):"object"===typeof exports?exports.AdsPlayCookies=n:f.AdsPlayCookies=n}("undefined"===typeof window?this:window),function(f,h){function c(g){g=g||{};g.url=g.url||null;g.vars=g.vars||{};g.error=g.error||function(){};g.success=g.success||function(){};g.vars.cb=Math.floor(1E13*Math.random());var a=[],b;for(b in g.vars)a.push(encodeURIComponent(b)+"="+encodeURIComponent(g.vars[b]));
a=a.join("&");g.url&&(b=new Image,b.onerror&&(b.onerror=g.error),b.onload&&(b.onload=g.success),b.src=g.noParameter?g.url:g.url+"?"+a)}function n(){var g=(new Date).getTime();return"xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(b){var a=(g+16*Math.random())%16|0;g=Math.floor(g/16);return("x"==b?a:a&3|8).toString(16)})}function m(){var g=AdsPlayCookies.get("apluuid");g||(g=n(),AdsPlayCookies.set("apluuid",g,{expires:315569520}));return g}function b(){var g=AdsPlayCookies.get("aplloc");
if("string"!==typeof g){var b="https://static.fptplay.net/zone.html?time"+(new Date).getTime();AdsPlayCorsRequest.get(!1,b,["x-zone","content-type"],function(b,a){g="vn-"+b["x-zone"];AdsPlayCookies.set("aplloc",g,{expires:604800})});g=""}return g}function a(g,b,a,e,d,f){g.firstChild&&(b='<p id="marquee-'+d+'" style="margin-top:2px; font-size:17px;color:#FFFFFF;animation: marquee 7s linear infinite;white-space: nowrap;" > '+b+(' - <a style="color: #F28807;" onclick="AdsPlay.trackClick('+d+')" href="'+
a+'" target="_blank" >'+e+"</a></p>"),a=document.createElement("div"),a.id="div-ad-"+d,a.style.position="absolute",a.style["text-align"]="center",a.style["background-color"]="rgba(7, 7, 7, 0.72)",a.style.width=g.offsetWidth+"px",a.style.top=g.offsetTop+"px",a.style["z-index"]="2147483647",a.innerHTML=b,g.insertBefore(a,g.firstChild),c({url:r,vars:{metric:"impression",adid:d,beacon:q[d]}}),g=.13*document.getElementById("marquee-"+d).offsetWidth,g="@keyframes marquee  {  0%  { text-indent: -"+g+"px } 100% { text-indent: "+
g+"px } }",document.styleSheets&&document.styleSheets.length?document.styleSheets[0].insertRule(g,0):(b=document.createElement("style"),b.innerHTML=g,document.getElementsByTagName("head")[0].appendChild(b)),setTimeout(function(){document.getElementById("div-ad-"+d).style.display="none"},f))}function e(b,a,d,e,f,h,k,p,l){if(d.firstChild){b='<a onclick="AdsPlay.trackClick('+k+')" href="'+f+'" title="'+h+'" target="_blank" >'+('<img style="width:'+b+"px;height:"+a+'px" src="'+e+'" />')+"</a>";a=document.createElement("div");
a.id="div-ad-"+k;a.style.position="absolute";a.style["text-align"]="center";a.style["background-color"]="rgba(221, 221, 221, 0)";a.style.width=d.offsetWidth+"px";a.style.top=d.offsetTop+d.offsetHeight-130+"px";a.style["z-index"]="2147483647";a.innerHTML=b;d.insertBefore(a,d.firstChild);c({url:r,vars:{metric:"impression",adid:k,beacon:q[k]}});for(d=0;d<l.length;d++)c({url:l[d],vars:{},noParameter:!0});setTimeout(function(){document.getElementById("div-ad-"+k).style.display="none"},p)}}var d=function(a,
d){var e,c,f,h=(new Date).getTime();c=0;e=f="";for(var k=document.getElementsByTagName("meta"),p=0;p<k.length;p++){var l=k[p];l.getAttribute&&("user"===l.getAttribute("name")&&(c=l.getAttribute("content")),"category"===l.getAttribute("name")&&""===f&&(f=l.getAttribute("content")),"contentid"===l.getAttribute("name")&&""===e&&(e=l.getAttribute("content")),"og:image"===l.getAttribute("name")&&""===f&&(f=l.getAttribute("content")))}f=f.substr(0,100);k="uuid="+m();for(p=0;p<d.length;p++)k+="&placement="+
d[p];k+="&referrer="+encodeURIComponent(document.referrer?document.referrer:"");k+="&url="+encodeURIComponent(document.location.href);p=encodeURIComponent;(l=document.getElementById("livetv_title"))||(l=document.getElementById("vod_url"));l=l?l.innerHTML:document.title;l=l.substr(0,100);k+="&cxt="+p(l);k+="&cxkw="+encodeURIComponent(f);k+="&ut="+encodeURIComponent(c);k+="&cid="+encodeURIComponent(e);k+="&loc="+encodeURIComponent(b());e="d3";c=h%3;1===c?e="d1":2===c&&(e="d2");return document.location.protocol+
"//"+e+".adsplay.net/delivery?"+(k+("&t="+h))},t={getVastUrl:function(a,b){var e=location.href;if(0>e.indexOf("fptplay.net/xem-video/")){var c=location.protocol+"//tag.gammaplatform.com/adx/request/zid_1469030993/wid_1469030741/?content_page_url=__page-url__&cb=__random-number__&player_width=__player-width__&player_height=__player-height__&device_id=__device-id__",c=c.replace("__page-url__",encodeURIComponent(e)),c=c.replace("__random-number__",(new Date).getTime()),c=c.replace("__player-width__",
"640"),c=c.replace("__player-height__","360");return c=c.replace("__device-id__",m())}e=[];e.push(b);return d(a,e)+"&at=tvc"},trackClick:function(a){document.getElementById("div-ad-"+a).style.display="none";c({url:r,vars:{metric:"click",adid:a,beacon:q[a]}});return!0}},r=document.location.protocol+"//log.adsplay.net/track/ads",q={},u=function(b){var e=b.adMedia,d=b.clickthroughUrl,c=b.clickActionText,f=b.adId,h=b.adBeacon,k=b.autoHideTimeout;if(b=document.getElementById(b.videoPlayerId))q[f]=h,a(b,
e,d,c,f,k)},v=function(a){var b=a.adId,d=a.adBeacon,c=a.clickthroughUrl,f=a.adMedia,h=document.getElementById(a.videoPlayerId);h&&"string"===typeof f&&(q[b]=d,e(a.width,a.height,h,f,c,a.clickActionText,b,a.autoHideTimeout,a.tracking3rdUrls))},w=function(a){a=a.tracking3rdUrls;if("object"===typeof a)for(var b=0;b<a.length;b++){var d=a[b];d&&setTimeout(function(a){c({url:a,vars:{}})},1E3*d.delay,d.url)}};t.loadOverlayAds=function(a,b,e){a=d(a,b)+"&at=overlay";AdsPlayCorsRequest.get(!1,a,[],function(a,
b){for(var d=JSON.parse(b),e=0;e<d.length;e++){var c=d[e],g=c.timeToShow,f=-1;"Microsoft Internet Explorer"==navigator.appName&&null!=/MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent)&&(f=parseFloat(RegExp.$1));if(f=-1==f){var f=!1,h=navigator.userAgent||navigator.vendor||window.opera;if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(h)||
/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(h.substr(0,
4)))f=!0;f=!f}f&&(4===c.adType?setTimeout(u,g,c):3===c.adType&&setTimeout(v,g,c));5===c.adType&&(g="aplpm"+c.placementId,f='<a target="_blank" href="'+c.clickthroughUrl+'" title="'+c.clickActionText+'">',f+='<img src="'+c.adMedia+'" width="'+c.width+'" height="'+c.height+'" alt="" border="0/"></a>',document.getElementById(g).innerHTML=f);10===c.adType&&w(c)}window.console&&window.console.log(d)})};f.AdsPlay=t}("undefined"===typeof window?this:window),AdsPlayReady(function(){0<location.href.indexOf("//fptplay.net")&&
(window.console&&window.console.log("AdsPlayReady ..."),setTimeout(function(){for(var f=[401,501],h=document.getElementsByClassName("adsplay-placement"),c={},n=0;n<h.length;n++){var m=h[n];f.push(m.getAttribute("data-placement-id"));c[m.getAttribute("id")]=m}AdsPlay.loadOverlayAds(1001,f,c)},4E3))}),0<location.href.indexOf("//fptplay.net"))){var _urq=_urq||[];_urq.push(["initSite","77d087a8-b93c-4f3b-aa2e-b0cfb1f0b7ad"]);(function(){var f=document.createElement("script");f.type="text/javascript";
f.async=!0;f.src="https:"==document.location.protocol?"https://st.adsplay.net/js/userreport.js":"http://st.adsplay.net/js/userreport.js";var h=document.getElementsByTagName("script")[0];h.parentNode.insertBefore(f,h)})()};
