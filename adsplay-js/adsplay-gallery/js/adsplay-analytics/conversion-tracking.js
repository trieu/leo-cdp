/**
 * AdsPlayConversion 1.0 for iTVad.vn - built on 06/08/2015
 */
(function(e,g){if(!e.__AdsPlayConversionTracked){var c=void 0,c=encodeURIComponent(c instanceof String?c:""),d=new Image,b=(new Date).getTime(),a="data="+encodeURIComponent(location.hash),a=a+("&referrer="+encodeURIComponent(document.referrer?document.referrer:"")),a=a+("&url="+encodeURIComponent(document.location.href)),a=a+("&host="+encodeURIComponent(document.location.host)),a=a+("&t="+b),b="http://log.adsplay.net/metric/",f=Math.round(10*Math.random())%3;1===f?b="http://log1.adsplay.net/metric/":
2===f&&(b="http://log2.adsplay.net/metric/");d.src=b+"conversion?"+a+"&data="+c;d.setAttribute("style","width:0px!important;height:0px!important;display:none!important");document.body.appendChild(d);e.__AdsPlayConversionTracked=!0}})("undefined"===typeof window?this:window);