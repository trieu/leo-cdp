(function () {
    if( window.__aplSiteId > 0 && (typeof window.__aplTag === 'string') )
    {
        //build query string
        var q = ( 'referrer=' + encodeURIComponent(document.referrer ? document.referrer : '') );
        q += ( '&url=' + encodeURIComponent(document.location.href) );
        q += ( '&host=' + encodeURIComponent(document.location.host) )
        q += ('&t=' + new Date().getTime());
        q += ('&sid=' + encodeURIComponent(window.__aplSiteId) );
        q += ('&tag=' + encodeURIComponent(window.__aplTag) );

        //cross domain iframe
        var iframe = document.createElement('iframe');
        iframe.width = 0;
        iframe.height = 0;
        iframe.setAttribute('style','width:0px!important;height:0px!important;display:none!important');
        iframe.src = location.protocol + '//adsplay.net/tracking/pageview.html#' + q;

        //append to trigger iframe post back data to server
        var body = document.getElementsByTagName('body');
        if(body.length > 0){
            body[0].appendChild(iframe);
        }
    }
})();