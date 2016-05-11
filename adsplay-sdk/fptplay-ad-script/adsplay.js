/*
 * AdsPLAY.js for iTVAd - version 1.1.5 - date:04/05/2016
 */
if(!window.AdsPlayReady&&(function(c,g){function f(){var c=window.ActiveXObject&&"file:"===location.protocol;if(window.XMLHttpRequest&&!c)return new XMLHttpRequest;try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(l){}window.console&&window.console.error("Your browser doesn't support XML handling!");return null}c.AdsPlayCorsRequest={get:function(c,l,a,b){var d=null,e=function(){if(0==d.readyState||4==d.readyState)if(0==d.status||200<=d.status&&300>d.status||304==d.status||1223==d.status){for(var e=
{},c=0;c<a.length;c++){var f=a[c],g=d.getResponseHeader(f);g&&(e[f]=g)}b(e,d.responseText)}else window.console&&window.console.error("Operation failed by AdsPlayRequest.get: "+l)};d||(d=f());d&&(d.open("GET",l,!0),d.onreadystatechange=e,d.withCredentials=c,d.send())}}}("undefined"===typeof window?this:window),function(c,g){function f(){if(!a){a=!0;for(var b=0;b<l.length;b++)l[b].fn.call(window,l[b].ctx);l=[]}}function n(){"complete"===document.readyState&&f()}g=g||window;var l=[],a=!1,b=!1;g[c||"AdsPlayReady"]=
function(d,e){a?setTimeout(function(){d(e)},1):(l.push({fn:d,ctx:e}),"complete"===document.readyState?setTimeout(f,1):b||(document.addEventListener?(document.addEventListener("DOMContentLoaded",f,!1),window.addEventListener("load",f,!1)):(document.attachEvent("onreadystatechange",n),window.attachEvent("onload",f)),b=!0))}}("AdsPlayReady",window),function(c,g){var f=function(c){if("object"!==typeof c.document)throw Error("AdsPlayCookies.js requires a `window` with a `document` object");var a=function(b,
d,e){return 1===arguments.length?a.get(b):a.set(b,d,e)};a._document=c.document;a._cacheKeyPrefix="cookey.";a._maxExpireDate=new Date("Fri, 31 Dec 9999 23:59:59 UTC");a.defaults={path:"/",secure:!1};a.get=function(b){a._cachedDocumentCookie!==a._document.cookie&&a._renewCache();return a._cache[a._cacheKeyPrefix+b]};a.set=function(b,d,e){e=a._getExtendedOptions(e);e.expires=a._getExpiresDate(d===g?-1:e.expires);a._document.cookie=a._generateAdsPlayCookiestring(b,d,e);return a};a.expire=function(b,d){return a.set(b,
g,d)};a._getExtendedOptions=function(b){return{path:b&&b.path||a.defaults.path,domain:b&&b.domain||a.defaults.domain,expires:b&&b.expires||a.defaults.expires,secure:b&&b.secure!==g?b.secure:a.defaults.secure}};a._isValidDate=function(b){return"[object Date]"===Object.prototype.toString.call(b)&&!isNaN(b.getTime())};a._getExpiresDate=function(b,d){d=d||new Date;"number"===typeof b?b=Infinity===b?a._maxExpireDate:new Date(d.getTime()+1E3*b):"string"===typeof b&&(b=new Date(b));if(b&&!a._isValidDate(b))throw Error("`expires` parameter cannot be converted to a valid Date instance");
return b};a._generateAdsPlayCookiestring=function(b,a,e){b=b.replace(/[^#$&+\^`|]/g,encodeURIComponent);b=b.replace(/\(/g,"%28").replace(/\)/g,"%29");a=(a+"").replace(/[^!#$&-+\--:<-\[\]-~]/g,encodeURIComponent);e=e||{};b=b+"="+a+(e.path?";path="+e.path:"");b+=e.domain?";domain="+e.domain:"";b+=e.expires?";expires="+e.expires.toUTCString():"";return b+=e.secure?";secure":""};a._getCacheFromString=function(b){var d={};b=b?b.split("; "):[];for(var e=0;e<b.length;e++){var c=a._getKeyValuePairFromAdsPlayCookiestring(b[e]);
d[a._cacheKeyPrefix+c.key]===g&&(d[a._cacheKeyPrefix+c.key]=c.value)}return d};a._getKeyValuePairFromAdsPlayCookiestring=function(b){var a=b.indexOf("="),a=0>a?b.length:a;return{key:decodeURIComponent(b.substr(0,a)),value:decodeURIComponent(b.substr(a+1))}};a._renewCache=function(){a._cache=a._getCacheFromString(a._document.cookie);a._cachedDocumentCookie=a._document.cookie};a._areEnabled=function(){var b="1"===a.set("AdsPlayCookies.js",1).get("AdsPlayCookies.js");a.expire("AdsPlayCookies.js");return b};
a.enabled=a._areEnabled();return a},n="object"===typeof c.document?f(c):f;"function"===typeof define&&define.amd?define(function(){return n}):"object"===typeof exports?exports.AdsPlayCookies=n:c.AdsPlayCookies=n}("undefined"===typeof window?this:window),function(c,g){function f(k){k=k||{};k.url=k.url||null;k.vars=k.vars||{};k.error=k.error||function(){};k.success=k.success||function(){};k.vars.cb=Math.floor(1E13*Math.random());var b=[],a;for(a in k.vars)b.push(encodeURIComponent(a)+"="+encodeURIComponent(k.vars[a]));
b=b.join("&");k.url&&(a=new Image,a.onerror&&(a.onerror=k.error),a.onload&&(a.onload=k.success),a.src=k.url+"?"+b)}function n(){var k=(new Date).getTime();return"xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=(k+16*Math.random())%16|0;k=Math.floor(k/16);return("x"==a?b:b&3|8).toString(16)})}function l(){var a=AdsPlayCookies.get("aplloc");if("string"!==typeof a){var b="https://static.fptplay.net/zone.html?time"+(new Date).getTime();AdsPlayCorsRequest.get(!1,b,["x-zone","content-type"],
function(b,d){a="vn-"+b["x-zone"];AdsPlayCookies.set("aplloc",a,{expires:604800})});a=""}return a}function a(a,b,p,d,c,h){a.firstChild&&(b='<p id="marquee-'+c+'" style="margin-top:2px; font-size:17px;color:#FFFFFF;animation: marquee 7s linear infinite;white-space: nowrap;" > '+b+(' - <a style="color: #F28807;" onclick="AdsPlay.trackClick('+c+')" href="'+p+'" target="_blank" >'+d+"</a></p>"),p=document.createElement("div"),p.id="div-ad-"+c,p.style.position="absolute",p.style["text-align"]="center",
p.style["background-color"]="rgba(7, 7, 7, 0.72)",p.style.width=a.offsetWidth+"px",p.style.top=a.offsetTop+"px",p.style["z-index"]="2147483647",p.innerHTML=b,a.insertBefore(p,a.firstChild),f({url:r,vars:{metric:"impression",adid:c,beacon:q[c]}}),a=.13*document.getElementById("marquee-"+c).offsetWidth,a="@keyframes marquee  {  0%  { text-indent: -"+a+"px } 100% { text-indent: "+a+"px } }",document.styleSheets&&document.styleSheets.length?document.styleSheets[0].insertRule(a,0):(b=document.createElement("style"),
b.innerHTML=a,document.getElementsByTagName("head")[0].appendChild(b)),setTimeout(function(){document.getElementById("div-ad-"+c).style.display="none"},h))}function b(a,b,c,d,e,h){a.firstChild&&(b='<a onclick="AdsPlay.trackClick('+e+')" href="'+c+'" title="'+d+'" target="_blank" >'+('<img style="width:480px;height:120px" src="'+b+'" />')+"</a>",c=document.createElement("div"),c.id="div-ad-"+e,c.style.position="absolute",c.style["text-align"]="center",c.style["background-color"]="rgba(221, 221, 221, 0)",
c.style.width=a.offsetWidth+"px",c.style.top=a.offsetTop+a.offsetHeight-130+"px",c.style["z-index"]="2147483647",c.innerHTML=b,a.insertBefore(c,a.firstChild),f({url:r,vars:{metric:"impression",adid:e,beacon:q[e]}}),setTimeout(function(){document.getElementById("div-ad-"+e).style.display="none"},h))}var d=function(a,b){var c,d,e=(new Date).getTime();c=0;d="";for(var h=document.getElementsByTagName("meta"),f=0;f<h.length;f++){var m=h[f];m.getAttribute&&"user"===m.getAttribute("name")&&(c=m.getAttribute("content"));
m.getAttribute&&"category"===m.getAttribute("name")&&""===d&&(d=m.getAttribute("content"))}d=d.substr(0,100);h=AdsPlayCookies.get("apluuid");h||(h=n(),AdsPlayCookies.set("apluuid",h,{expires:315569520}));h="uuid="+h;for(f=0;f<b.length;f++)h+="&placement="+b[f];h+="&referrer="+encodeURIComponent(document.referrer?document.referrer:"");h+="&url="+encodeURIComponent(document.location.href);f=encodeURIComponent;m="";(m=document.getElementById("livetv_title"))||(m=document.getElementById("vod_url"));m=
m?m.innerHTML:document.title;m=m.substr(0,100);h+="&cxt="+f(m);h+="&cxkw="+encodeURIComponent(d);h+="&ut="+encodeURIComponent(c);h+="&loc="+encodeURIComponent(l());c="d3";d=e%6;1===d?c="d1":2===d?c="d2":4===d&&(c="d4");return document.location.protocol+"//"+c+".adsplay.net/delivery/zone/"+a+"?"+(h+("&t="+e))},e={getVastUrl:function(a,b){var c=[];c.push(b);return d(a,c)+"&at=tvc"},trackClick:function(a){document.getElementById("div-ad-"+a).style.display="none";f({url:r,vars:{metric:"click",adid:a,
beacon:q[a]}});return!0}},r=document.location.protocol+"//log.adsplay.net/track/ads",q={},t=function(b){var c=b.adMedia,d=b.clickthroughUrl,e=b.clickActionText,f=b.adId,h=b.adBeacon,g=b.autoHideTimeout;if(b=document.getElementById(b.videoPlayerId))q[f]=h,a(b,c,d,e,f,g)},u=function(a){var c=a.adMedia,d=a.clickthroughUrl,e=a.clickActionText,f=a.adId,h=a.adBeacon,g=a.autoHideTimeout;if(a=document.getElementById(a.videoPlayerId))q[f]=h,b(a,c,d,e,f,g)};e.loadOverlayAds=function(a,b,c){a=d(a,b)+"&at=overlay";
AdsPlayCorsRequest.get(!1,a,[],function(a,b){for(var c=JSON.parse(b),d=0;d<c.length;d++){var e=c[d],f=e.timeToShow,g=-1;"Microsoft Internet Explorer"==navigator.appName&&null!=/MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent)&&(g=parseFloat(RegExp.$1));if(g=-1==g){var g=!1,k=navigator.userAgent||navigator.vendor||window.opera;if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(k)||
/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(k.substr(0,
4)))g=!0;g=!g}g&&(4===e.adType?setTimeout(t,f,e):3===e.adType&&setTimeout(u,f,e));5===e.adType&&(f="aplpm"+e.placementId,g='<a target="_blank" href="'+e.clickthroughUrl+'" title="'+e.clickActionText+'">',g+='<img src="'+e.adMedia+'" width="'+e.width+'" height="'+e.height+'" alt="" border="0/"></a>',document.getElementById(f).innerHTML=g)}window.console&&window.console.log(c)})};c.AdsPlay=e}("undefined"===typeof window?this:window),AdsPlayReady(function(){0<location.href.indexOf("//fptplay.net")&&
(window.console&&window.console.log("AdsPlayReady ..."),setTimeout(function(){for(var c=[401,501],g=document.getElementsByClassName("adsplay-placement"),f={},n=0;n<g.length;n++){var l=g[n];c.push(l.getAttribute("data-placement-id"));f[l.getAttribute("id")]=l}AdsPlay.loadOverlayAds(1001,c,f)},5E3))}),0<location.href.indexOf("//fptplay.net"))){var _urq=_urq||[];_urq.push(["initSite","77d087a8-b93c-4f3b-aa2e-b0cfb1f0b7ad"]);(function(){var c=document.createElement("script");c.type="text/javascript";
c.async=!0;c.src="https:"==document.location.protocol?"https://st.adsplay.net/js/userreport.js":"http://st.adsplay.net/js/userreport.js";var g=document.getElementsByTagName("script")[0];g.parentNode.insertBefore(c,g)})()};