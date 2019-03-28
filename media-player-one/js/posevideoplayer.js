/**
 * 
 * @license Pose.com.vn 
 * Build for Pose Media, version Sep 26, 2018 
 */
(function () {
    // default paramerter for Pose Video Player    
    var autoplay = window.playerOneAutoplay || false; //auto play content on PC
    var skipAdTime = window.playerOneSkipAdTime || 5; // force show skip button after 5 seconds
    var skipAdLabel = window.playerOneSkipAdLabel || "Skip Ad";
    var delayShowAd = window.playerOneDelayShowAd || 0;

    var poseLoadVideo = function (videoInfo, divId, vastUrls) {
        var videoValue = videoInfo || location.hash.substring(1);
        var data = JSON.parse(decodeURIComponent(b64DecodeUnicode(videoValue)));
        if (location.hash.indexOf('debug') > 0) {
            console.log({
                videoInfo: data
            });
        }

        var placeHolderId = divId || 'video_holder';
        autoplay = autoplay || data.autoplay;
        if (autoplay) {
            window.mutedVideoAd = true; // mute ads for autoplay
        }
        var videoSource = data.source[0].src;
        if (videoSource) {
            videoSource = videoSource.replace('cdn.pose.com.vn', 'iqawkerxyy.vcdn.com.vn/hls') + '/index.m3u8';
        }

        var posterUrl = data.source[0].poster;
        vastUrls = vastUrls || [];

        var readyCallback = function (player) {
            player.volume(0.7);
            player.ga({
                'eventLabel': document.location.pathname,
                'eventCategory': 'Video',                
                'eventsToTrack': ['play', 'pause', 'end']
            });
            //document.querySelector('div.playerlogo').style['background-image'] = '';
        }
        var d = document.getElementById(placeHolderId);
        if (!d) {
            console.error('Dom is not found for placeHolderId ' + placeHolderId);
            return;
        }
        var w = d.offsetWidth;
        if (w === 0) {
            // fix for Pose Home page in widget
            w = document.querySelector('.video-widget .row').offsetWidth - 20;
        }
        if (w === 0) {
            console.log(d);
            console.error('offsetWidth == 0 for placeHolderId ' + placeHolderId);
            return;
        }
        var h = d.offsetHeight === 0 ? Math.floor((w * 9) / 16) : d.offsetHeight;
        return HadarOnePlayer.createVideo(
            autoplay,
            placeHolderId,
            false,
            false,
            videoSource,
            posterUrl,
            w,
            h,
            vastUrls,
            skipAdTime,
            skipAdLabel,
            delayShowAd,
            readyCallback
        );
    };

    function b64DecodeUnicode(str) {
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
    window.poseLoadVideo = poseLoadVideo;
})();