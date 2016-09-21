/*
 * AdsPLAY.js for iTVAd - version 1.1.9 - date:15/08/2016
 */
if(!window.AdsPlayReady&&(function(f,h){function e(){var e=window.ActiveXObject&&"file:"===location.protocol;if(window.XMLHttpRequest&&!e)return new XMLHttpRequest;try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(m){}window.console&&window.console.error("Your browser doesn't support XML handling!");return null}f.AdsPlayCorsRequest={get:function(f,m,b,a){var d=null,c=function(){if(0==d.readyState||4==d.readyState)if(0==d.status||200<=d.status&&300>d.status||304==d.status||1223==d.status){for(var c=
{},e=0;e<b.length;e++){var f=b[e],h=d.getResponseHeader(f);h&&(c[f]=h)}a(c,d.responseText)}else window.console&&window.console.error("Operation failed by AdsPlayRequest.get: "+m)};d||(d=e());d&&(d.open("GET",m,!0),d.onreadystatechange=c,d.withCredentials=f,d.send())}}}("undefined"===typeof window?this:window),function(f,h){function e(){if(!b){b=!0;for(var a=0;a<m.length;a++)m[a].fn.call(window,m[a].ctx);m=[]}}function p(){"complete"===document.readyState&&e()}h=h||window;var m=[],b=!1,a=!1;h[f||"AdsPlayReady"]=
function(d,c){b?setTimeout(function(){d(c)},1):(m.push({fn:d,ctx:c}),"complete"===document.readyState?setTimeout(e,1):a||(document.addEventListener?(document.addEventListener("DOMContentLoaded",e,!1),window.addEventListener("load",e,!1)):(document.attachEvent("onreadystatechange",p),window.attachEvent("onload",e)),a=!0))}}("AdsPlayReady",window),function(f,h){var e=function(e){if("object"!==typeof e.document)throw Error("AdsPlayCookies.js requires a `window` with a `document` object");var b=function(a,
d,c){return 1===arguments.length?b.get(a):b.set(a,d,c)};b._document=e.document;b._cacheKeyPrefix="cookey.";b._maxExpireDate=new Date("Fri, 31 Dec 9999 23:59:59 UTC");b.defaults={path:"/",secure:!1};b.get=function(a){b._cachedDocumentCookie!==b._document.cookie&&b._renewCache();return b._cache[b._cacheKeyPrefix+a]};b.set=function(a,d,c){c=b._getExtendedOptions(c);c.expires=b._getExpiresDate(d===h?-1:c.expires);b._document.cookie=b._generateAdsPlayCookiestring(a,d,c);return b};b.expire=function(a,d){return b.set(a,
h,d)};b._getExtendedOptions=function(a){return{path:a&&a.path||b.defaults.path,domain:a&&a.domain||b.defaults.domain,expires:a&&a.expires||b.defaults.expires,secure:a&&a.secure!==h?a.secure:b.defaults.secure}};b._isValidDate=function(a){return"[object Date]"===Object.prototype.toString.call(a)&&!isNaN(a.getTime())};b._getExpiresDate=function(a,d){d=d||new Date;"number"===typeof a?a=Infinity===a?b._maxExpireDate:new Date(d.getTime()+1E3*a):"string"===typeof a&&(a=new Date(a));if(a&&!b._isValidDate(a))throw Error("`expires` parameter cannot be converted to a valid Date instance");
return a};b._generateAdsPlayCookiestring=function(a,b,c){a=a.replace(/[^#$&+\^`|]/g,encodeURIComponent);a=a.replace(/\(/g,"%28").replace(/\)/g,"%29");b=(b+"").replace(/[^!#$&-+\--:<-\[\]-~]/g,encodeURIComponent);c=c||{};a=a+"="+b+(c.path?";path="+c.path:"");a+=c.domain?";domain="+c.domain:"";a+=c.expires?";expires="+c.expires.toUTCString():"";return a+=c.secure?";secure":""};b._getCacheFromString=function(a){var d={};a=a?a.split("; "):[];for(var c=0;c<a.length;c++){var e=b._getKeyValuePairFromAdsPlayCookiestring(a[c]);
d[b._cacheKeyPrefix+e.key]===h&&(d[b._cacheKeyPrefix+e.key]=e.value)}return d};b._getKeyValuePairFromAdsPlayCookiestring=function(a){var b=a.indexOf("="),b=0>b?a.length:b;return{key:decodeURIComponent(a.substr(0,b)),value:decodeURIComponent(a.substr(b+1))}};b._renewCache=function(){b._cache=b._getCacheFromString(b._document.cookie);b._cachedDocumentCookie=b._document.cookie};b._areEnabled=function(){var a="1"===b.set("AdsPlayCookies.js",1).get("AdsPlayCookies.js");b.expire("AdsPlayCookies.js");return a};
b.enabled=b._areEnabled();return b},p="object"===typeof f.document?e(f):e;"function"===typeof define&&define.amd?define(function(){return p}):"object"===typeof exports?exports.AdsPlayCookies=p:f.AdsPlayCookies=p}("undefined"===typeof window?this:window),function(f,h){function e(g){g=g||{};g.url=g.url||null;g.vars=g.vars||{};g.error=g.error||function(){};g.success=g.success||function(){};g.vars.cb=Math.floor(1E13*Math.random());var a=[],b;for(b in g.vars)a.push(encodeURIComponent(b)+"="+encodeURIComponent(g.vars[b]));
a=a.join("&");g.url&&(b=new Image,b.onerror&&(b.onerror=g.error),b.onload&&(b.onload=g.success),b.src=g.url+"?"+a)}function p(){var g=(new Date).getTime();return"xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(b){var a=(g+16*Math.random())%16|0;g=Math.floor(g/16);return("x"==b?a:a&3|8).toString(16)})}function m(){var g=AdsPlayCookies.get("apluuid");g||(g=p(),AdsPlayCookies.set("apluuid",g,{expires:315569520}));return g}function b(){var g=AdsPlayCookies.get("aplloc");if("string"!==typeof g){var b=
"https://static.fptplay.net/zone.html?time"+(new Date).getTime();AdsPlayCorsRequest.get(!1,b,["x-zone","content-type"],function(b,a){g="vn-"+b["x-zone"];AdsPlayCookies.set("aplloc",g,{expires:604800})});g=""}return g}function a(g,b,a,d,c,f){g.firstChild&&(b='<p id="marquee-'+c+'" style="margin-top:2px; font-size:17px;color:#FFFFFF;animation: marquee 7s linear infinite;white-space: nowrap;" > '+b+(' - <a style="color: #F28807;" onclick="AdsPlay.trackClick('+c+')" href="'+a+'" target="_blank" >'+d+
"</a></p>"),a=document.createElement("div"),a.id="div-ad-"+c,a.style.position="absolute",a.style["text-align"]="center",a.style["background-color"]="rgba(7, 7, 7, 0.72)",a.style.width=g.offsetWidth+"px",a.style.top=g.offsetTop+"px",a.style["z-index"]="2147483647",a.innerHTML=b,g.insertBefore(a,g.firstChild),e({url:r,vars:{metric:"impression",adid:c,beacon:q[c]}}),g=.13*document.getElementById("marquee-"+c).offsetWidth,g="@keyframes marquee  {  0%  { text-indent: -"+g+"px } 100% { text-indent: "+g+
"px } }",document.styleSheets&&document.styleSheets.length?document.styleSheets[0].insertRule(g,0):(b=document.createElement("style"),b.innerHTML=g,document.getElementsByTagName("head")[0].appendChild(b)),setTimeout(function(){document.getElementById("div-ad-"+c).style.display="none"},f))}function d(b,a,c,d,f,h,k,n){c.firstChild&&(b='<a onclick="AdsPlay.trackClick('+k+')" href="'+f+'" title="'+h+'" target="_blank" >'+('<img style="width:'+b+"px;height:"+a+'px" src="'+d+'" />')+"</a>",a=document.createElement("div"),
a.id="div-ad-"+k,a.style.position="absolute",a.style["text-align"]="center",a.style["background-color"]="rgba(221, 221, 221, 0)",a.style.width=c.offsetWidth+"px",a.style.top=c.offsetTop+c.offsetHeight-130+"px",a.style["z-index"]="2147483647",a.innerHTML=b,c.insertBefore(a,c.firstChild),e({url:r,vars:{metric:"impression",adid:k,beacon:q[k]}}),setTimeout(function(){document.getElementById("div-ad-"+k).style.display="none"},n))}var c=function(a,c){var d,e,f,h=(new Date).getTime();e=0;d=f="";for(var k=
document.getElementsByTagName("meta"),n=0;n<k.length;n++){var l=k[n];l.getAttribute&&("user"===l.getAttribute("name")&&(e=l.getAttribute("content")),"category"===l.getAttribute("name")&&""===f&&(f=l.getAttribute("content")),"contentid"===l.getAttribute("name")&&""===d&&(d=l.getAttribute("content")),"og:image"===l.getAttribute("name")&&""===f&&(f=l.getAttribute("content")))}f=f.substr(0,100);k="uuid="+m();for(n=0;n<c.length;n++)k+="&placement="+c[n];k+="&referrer="+encodeURIComponent(document.referrer?
document.referrer:"");k+="&url="+encodeURIComponent(document.location.href);n=encodeURIComponent;(l=document.getElementById("livetv_title"))||(l=document.getElementById("vod_url"));l=l?l.innerHTML:document.title;l=l.substr(0,100);k+="&cxt="+n(l);k+="&cxkw="+encodeURIComponent(f);k+="&ut="+encodeURIComponent(e);k+="&cid="+encodeURIComponent(d);k+="&loc="+encodeURIComponent(b());d="d3";e=h%3;1===e?d="d1":2===e&&(d="d2");return document.location.protocol+"//"+d+".adsplay.net/delivery?"+(k+("&t="+h))},
t={getVastUrl:function(a,b){var d=location.href;if(0>d.indexOf("fptplay.net/xem-video/")){var e=location.protocol+"//tag.gammaplatform.com/adx/request/zid_1469030993/wid_1469030741/?content_page_url=__page-url__&cb=__random-number__&player_width=__player-width__&player_height=__player-height__&device_id=__device-id__",e=e.replace("__page-url__",encodeURIComponent(d)),e=e.replace("__random-number__",(new Date).getTime()),e=e.replace("__player-width__","640"),e=e.replace("__player-height__","360");
return e=e.replace("__device-id__",m())}d=[];d.push(b);return c(a,d)+"&at=tvc"},trackClick:function(a){document.getElementById("div-ad-"+a).style.display="none";e({url:r,vars:{metric:"click",adid:a,beacon:q[a]}});return!0}},r=document.location.protocol+"//log.adsplay.net/track/ads",q={},u=function(b){var d=b.adMedia,c=b.clickthroughUrl,e=b.clickActionText,f=b.adId,h=b.adBeacon,k=b.autoHideTimeout;if(b=document.getElementById(b.videoPlayerId))q[f]=h,a(b,d,c,e,f,k)},v=function(a){var b=a.width,c=a.height,
e=a.adMedia,f=a.clickthroughUrl,h=a.clickActionText,k=a.adId,n=a.adBeacon,l=a.autoHideTimeout;(a=document.getElementById(a.videoPlayerId))&&"string"===typeof e&&(q[k]=n,d(b,c,a,e,f,h,k,l))},w=function(a){a=a.tracking3rdUrls;if("object"===typeof a)for(var b=0;b<a.length;b++){var d=a[b];d&&setTimeout(function(a){e({url:a,vars:{}})},1E3*d.delay,d.url)}};t.loadOverlayAds=function(a,b,d){a=c(a,b)+"&at=overlay";AdsPlayCorsRequest.get(!1,a,[],function(a,b){for(var d=JSON.parse(b),e=0;e<d.length;e++){var c=
d[e],g=c.timeToShow,f=-1;"Microsoft Internet Explorer"==navigator.appName&&null!=/MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent)&&(f=parseFloat(RegExp.$1));if(f=-1==f){var f=!1,h=navigator.userAgent||navigator.vendor||window.opera;if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(h)||
/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(h.substr(0,
4)))f=!0;f=!f}f&&(4===c.adType?setTimeout(u,g,c):3===c.adType&&setTimeout(v,g,c));5===c.adType&&(g="aplpm"+c.placementId,f='<a target="_blank" href="'+c.clickthroughUrl+'" title="'+c.clickActionText+'">',f+='<img src="'+c.adMedia+'" width="'+c.width+'" height="'+c.height+'" alt="" border="0/"></a>',document.getElementById(g).innerHTML=f);10===c.adType&&w(c)}window.console&&window.console.log(d)})};f.AdsPlay=t}("undefined"===typeof window?this:window),AdsPlayReady(function(){0<location.href.indexOf("//fptplay.net")&&
(window.console&&window.console.log("AdsPlayReady ..."),setTimeout(function(){for(var f=[401,501],h=document.getElementsByClassName("adsplay-placement"),e={},p=0;p<h.length;p++){var m=h[p];f.push(m.getAttribute("data-placement-id"));e[m.getAttribute("id")]=m}AdsPlay.loadOverlayAds(1001,f,e)},5E3))}),0<location.href.indexOf("//fptplay.net"))){var _urq=_urq||[];_urq.push(["initSite","77d087a8-b93c-4f3b-aa2e-b0cfb1f0b7ad"]);(function(){var f=document.createElement("script");f.type="text/javascript";
f.async=!0;f.src="https:"==document.location.protocol?"https://st.adsplay.net/js/userreport.js":"http://st.adsplay.net/js/userreport.js";var h=document.getElementsByTagName("script")[0];h.parentNode.insertBefore(f,h)})()};