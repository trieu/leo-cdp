var loadMediaPlayerOne = function (callback) {
    var headNode = document.getElementsByTagName("head")[0];
    var prefix = location.protocol === 'https:' ? 'https:' : 'http:';
    var cssUrl = prefix + '//static.hadarone.com/ajs/video-player/css/mediaplayer-one.css';
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', cssUrl);
    headNode.appendChild(link);

    var jsUrl = prefix + '//static.hadarone.com/ajs/video-player/hadarone-video-player.min.js';
    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                if (callback) callback();
            }
        };
    } else { //Others
        script.onload = function () {
            if (callback) callback();
        };
    }
    script.src = jsUrl;
    headNode.appendChild(script);
}
loadMediaPlayerOne();