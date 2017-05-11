/**
 * Created by trieu on 7/14/15.
 */

(function (global, undefined) {

    function loadScript(src, callback) {
        var s,
            r,
            t;
        r = false;
        s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = src;
        s.onload = s.onreadystatechange = function () {
            //console.log( this.readyState ); //uncomment this line to see which ready states are called.
            if (!r && (!this.readyState || this.readyState == 'complete')) {
                r = true;
                if(callback instanceof Function){
                    callback();
                }
            }
        };
        t = document.getElementsByTagName('script')[0];
        t.parentNode.insertBefore(s, t);
    }

    var obj = {};
    obj.loadZone = function(zoneId){
        //var url = 'http://localhost:63342/adsplay-website/js/'+zoneId+'.js';
        //loadScript(url);
        var url = 'http://e.eclick.vn/delivery/zone/'+zoneId+'.js'
        document.write('<script type="text/javascript" src="'+url+'"><\/script>');
    };
    global.RfxAds = obj;
})(typeof window === 'undefined' ? this : window);