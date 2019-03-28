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
        var pmId = window.isDesktop ? 1281 : 1407;
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

            // overide for development mode
            var devJsList = [
                'http://devjs.hadarone.com/js/video.src.js',
                'http://devjs.hadarone.com/js/vast-player.js',
                'http://devjs.hadarone.com/js/videojs.youtube.src.js',
                'http://devjs.hadarone.com/js/mediaplayer.src.js',
                'http://devjs.hadarone.com/js/posevideoplayer.js'
            ];
            loadJS(devJsList)
                .then(function () {
                    console.log("DEV MODE, ready to load video...");
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

// from https://github.com/MiguelCastillo/load-js
(function (global, factory) {
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS support
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        // Do AMD support
        define(["loadJS"], factory);
    } else {
        // Do browser support
        global.loadJS = factory();
    }
})(this, function () {
    var cache = {};

    function exec(options) {
        if (typeof options === "string") {
            options = {
                url: options
            };
        }

        var id = options.id || options.url;
        var script = cache[id];

        if (script) {
            console.log('load-js cache hit', id);
            return script;
        }

        if (!options.url && !options.text) {
            throw new Error("must provide a url or text to load");
        }

        script = document.createElement("script");
        script.charset = options.charset || "utf-8";
        script.type = options.type || "text/javascript";
        script.async = !!options.async;
        script.id = id;

        var head = document.getElementsByTagName("head")[0] || document.documentElement;
        var pending;

        if (options.url) {
            script.src = options.url;
            pending = loadScript(head, script);
        } else {
            script.text = options.text;
            pending = runScript(head, script);
        }

        if (options.cache !== false && id) {
            cache[id] = pending;
        }

        return pending;
    }

    function runScript(head, script) {
        head.appendChild(script);
        return Promise.resolve(script);
    }

    function loadScript(head, script) {
        return new Promise(function (resolve) {
            // Handle Script loading
            var done = false;
            script.onload = script.onreadystatechange = function () {
                if (!done && (!this.readyState ||
                        this.readyState === "loaded" ||
                        this.readyState === "complete")) {
                    done = true;
                    script.onload = script.onreadystatechange = null;
                    resolve(script);
                }
            };

            head.appendChild(script);
        });
    }

    return function load(items) {
        return items instanceof Array ?
            Promise.all(items.map(exec)) :
            exec(items);
    }
});