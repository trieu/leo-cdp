/**
 * @license MediaPlayer.ONE
 * Version 2.2.3
 * Updated Time: Mar 07, 2019 15h
 */
window.mediaPlayerTracking = function () {
    var allowTracking = true;
    if (window.mediaPlayerOneDoNotTrack) {
        allowTracking = false;
    }

    function callPlayerTracking() {
        var trackUrl = location.protocol + '//log.mediaplayer.one/trackplayer?metric=loadjs';
        trackUrl += ('&t=' + document.title);
        trackUrl += ('&r=' + encodeURIComponent(document.referrer));
        trackUrl += ('&u=' + encodeURIComponent(location.href));
        trackUrl += ('&h=' + encodeURIComponent(location.host));
        new Image().src = trackUrl;
    }

    if (allowTracking) {
        //callPlayerTracking();
    }
}