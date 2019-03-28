/**
 * @license MediaPlayer.ONE
 * Version 2.2.1
 * Updated Time: Jan 07, 2019 14h
 */
window.mediaPlayerTracking = function () {
    var allowTracking = true;
    if (window.mediaPlayerOneDoNotTrack) {
        allowTracking = false;
    }

    function callPlayerTracking() {
        var r = Math.floor(Math.random() * (5 - 2 + 1)) + 2; // random number between 2 and 5     
        var trackUrl = location.protocol + '//c' + r + '.blueseed.tv/trackplayer?metric=loadjs';
        trackUrl += ('&t=' + document.title);
        trackUrl += ('&r=' + encodeURIComponent(document.referrer));
        trackUrl += ('&u=' + encodeURIComponent(location.href));
        trackUrl += ('&h=' + encodeURIComponent(location.host));
        new Image().src = trackUrl;
    }

    if (allowTracking) {
        callPlayerTracking();

        //Rigelink
        (function (p, l, o, w, i, n, g) {
            if (!p[i]) {
                p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || [];
                p.GlobalSnowplowNamespace.push(i);
                p[i] = function () {
                    (p[i].q = p[i].q || []).push(arguments)
                };
                p[i].q = p[i].q || [];
                n = l.createElement(o);
                g = l.getElementsByTagName(o)[0];
                n.async = 1;
                n.src = w;
                g.parentNode.insertBefore(n, g)
            }
        }(window, document, "script", location.protocol + "//dd1cga2rr0zyp.cloudfront.net/rg.js", "rigel"));

        window.rigel('newTracker', 'netlife', 'c.rigelink.com', {
            appId: "netlife",
            platform: "web",
            cookieDomain: null,
            discoverRootDomain: true,
            cookieName: "_rg_",
            respectDoNotTrack: false,
            forceSecureTracker: true,
            sessionCookieTimeout: 1800
        });

        window.rigel('trackPageView');
    }
}