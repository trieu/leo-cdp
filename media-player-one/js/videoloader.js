/// Begin global video player config

window.playerOneAutoplay = true; // default autoplay for all videos
window.playerOneSkipAdTime = 6; // force show skip button after 6 seconds
window.playerOneSkipAdLabel = "Skip Ad"; // text on skip button
window.playerOneGoogleAnalyticsId = 'UA-49439869-1';

setTimeout(function () {
    var nodes = document.querySelectorAll('div.playerholder');
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var encodedData = node.getAttribute('data-video');
        poseVideoLoader(node, encodedData, true)
    }
}, 321);

(function () {

    var cssList = [
        'https://static.hadarone.com/ajs/video-player/css/video-js.min.css',
        'https://static.hadarone.com/ajs/video-player/css/pose-player-skin.css'
    ]

    function getVastTags() {
        // HadarOne Ads Placement ID
        var pmId = window.isDesktop ? 1405 : 1407;
        var d = Math.floor(Math.random() * 5) + 1;
        var purl = encodeURIComponent(document.referrer);
        var cb = (new Date().getTime());
        var vastUrls = [];
        var adURL1 = 'https://d' + d + '.hadarone.com/vast3?plm=' + pmId + '&url=' + purl + '&cb=' + cb;
        vastUrls.push(adURL1);
        if (window.isDesktop) {
            //backup
            var pmIdbk = 1405;
            var adURL2 = 'https://d' + d + '.hadarone.com/vast3?plm=' + pmIdbk + '&url=' + purl + '&cb=' + cb;
            vastUrls.push(adURL2);
        } else {
            //backup
            var pmIdbk = 1408;
            var adURL2 = 'https://d' + d + '.hadarone.com/vast3?plm=' + pmIdbk + '&url=' + purl + '&cb=' + cb;
            vastUrls.push(adURL2);
        }
        vastUrls = ['https://d1.blueseed.tv/vast3?plm=1405&li=3635'];
        return vastUrls;
    }

    function loadCss(list) {
        for (var i = 0; i < list.length; i++) {
            var link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');
            link.setAttribute('href', list[i]);
            document.head.appendChild(link);
        }
    }

    function loadSingleScript(src, callback) {
        var s, r, t;
        r = false;
        s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = src;
        s.onload = s.onreadystatechange = function () {
            if (!r && (!this.readyState || this.readyState == 'complete')) {
                r = true;
                if (callback) callback();
            }
        };
        t = document.getElementsByTagName('script')[0];
        t.parentNode.insertBefore(s, t);
    }

    function poseVideoLoader(where, encodedData, autoScanDocument) {
        var ran = Math.floor(Math.random() * 9999999);
        var vhid = "posevideo_" + ran;
        var div = document.createElement('div');
        div.setAttribute('style', 'width: 100%; margin: 0 !important;');
        div.setAttribute('class', 'pose-player');
        div.setAttribute('id', vhid);
        if (!autoScanDocument) {
            div.setAttribute('data-video', encodedData);
        }
        where.appendChild(div);

        if (typeof window.poseLoadVideo === 'function' && window.hadarOnePlacementId > 0) {
            poseLoadVideo(encodedData, vhid);
        } else {
            //PRODUCTION
            var jsSrc = 'https://static.blueseed.tv/ajs/video-player/posevideoplayer.min.js';
            loadSingleScript(jsSrc, function () {
                poseLoadVideo(encodedData, vhid, getVastTags());
            });
        }
    }

    loadCss(cssList);
    window.poseVideoLoader = poseVideoLoader;
})();

// GA tracking init
if (window.ga === undefined) {
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
}
ga('create', playerOneGoogleAnalyticsId);