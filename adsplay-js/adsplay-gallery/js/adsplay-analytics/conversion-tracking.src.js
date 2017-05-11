/**
 * AdsPlayConversion 1.0 for iTVad.vn - built on 06/08/2015
 */
(function (global, undefined) {

    var getTrackingUrl = function(metric){
        var d = new Date().getTime();
        var q = 'data='+ encodeURIComponent(location.hash) ;
        q += ( '&referrer=' + encodeURIComponent(document.referrer ? document.referrer : '') );
        q += ( '&url=' + encodeURIComponent(document.location.href) );
        q += ( '&host=' + encodeURIComponent(document.location.host) )
        q += ('&t=' + d);

        var baseUrl = 'http://log.adsplay.net/metric/';
        var ran = Math.round(Math.random()*10)%3;
        if(ran === 1){
            baseUrl = 'http://log1.adsplay.net/metric/';
        } else if(ran === 2){
            baseUrl = 'http://log2.adsplay.net/metric/';
        }
        return baseUrl+metric + '?' + q;
    };

    var doTracking = function(metric,data){
        var data = encodeURIComponent(data instanceof String ? data : '');
        var imgTracking = new Image();
        imgTracking.src = getTrackingUrl(metric) + "&data="+ data;
        imgTracking.setAttribute('style','width:0px!important;height:0px!important;display:none!important');
        document.body.appendChild(imgTracking);
    }

    if(! global.__AdsPlayConversionTracked ){
        doTracking('conversion');
        global.__AdsPlayConversionTracked = true;
    }

})(typeof window === 'undefined' ? this : window);