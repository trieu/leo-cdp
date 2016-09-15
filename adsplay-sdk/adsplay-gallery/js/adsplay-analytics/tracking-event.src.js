/*
 * tracking-event.js for AdsPlay Real-time Marketing Analytics - version 1.0 - date:20/12/2015
 */
(function () {
    if( typeof window.__aplEvent === 'string' )
    {
        //build query string
        var q = ( 'referrer=' + encodeURIComponent(document.referrer ? document.referrer : '') );
        q += ( '&url=' + encodeURIComponent(document.location.href) );
        q += ( '&host=' + encodeURIComponent(document.location.host) )
        q += ('&t=' + new Date().getTime());
        q += ('&event=' + encodeURIComponent(window.__aplEvent) );

        //cross domain iframe
        var iframe = document.createElement('iframe');
        iframe.width = 0;
        iframe.height = 0;
        iframe.setAttribute('style','width:0px!important;height:0px!important;display:none!important');
        iframe.src = location.protocol + '//adsplay.net/tracking/event.html#' + q;

        //append to trigger iframe post back data to server
        var body = document.getElementsByTagName('body');
        if(body.length > 0){
            body[0].appendChild(iframe);
        }
    }
})();