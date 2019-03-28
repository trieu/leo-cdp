# HadarOne Video Player

Video Player with Video Ad Player for Digital Media Publisher
* Support VAST 3.0, VPAID 2.0
* Metric Analytics with Google Analytics
* Custom Logo Player
* Support play video from multiple source (MP4, Adaptive streaming, YouTube, Facebook)
* Autoplay only in viewability

## Demo

* https://videotonghopbongda.blogspot.com/2018/08/test-video-player.html
* http://static-org.hadarone.com/ajs/video-player/examples/pose-desktop-test-vplayer.html

## Getting Started

See example code

### Prerequisites for Development
* npm install --global gulp-cli
* npm install
* Install https://gulpjs.org/getting-started.html and https://www.npmjs.com/package/gulp-closure-compiler
* Download https://dl.google.com/closure-compiler/compiler-latest.zip

```
 sudo npm install --global gulp-cli
 npm install
 gulp
```

### Examples

A simple example:

```
<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="stylesheet" href="https://static.hadarone.com/ajs/video-player/video-js.min.css">
  <link rel="stylesheet" href="https://static.hadarone.com/ajs/video-player/hadarone-player-skin.css">

  <script src="https://static.hadarone.com/ajs/video-player/hadarone-video-player.min.js"></script>
  <script src="https://static.hadarone.com/ajs/video-player/videojs-http-streaming.min.js"></script>

  <style>
    h1 {
      margin: auto;
      text-align: center;
    }
    h3 {
      width: 90%;
      margin: auto;
      text-align: center;
      font-size: 18px;
    }
    .videoholder {
      width: 50%;
      margin: auto;
    }
    body {
      padding: 12px;
    }
    @media only screen and (max-width: 768px) {
      /* For mobile phones: */
      [class="videoholder"] {
        width: 90%;
      }
    }
  </style>
</head>

<body onload="init()">
  <h1>Demo V2 Video Player with VAST Ads</h1>

  <hr>
  <h3>Adaptive bitrate streaming source </h3>
  <div id="videoPlaceholder4" class="videoholder"></div>

  <hr>
  <h3>MP4 video source </h3>
  <div id="videoPlaceholder1" class="videoholder"></div>

  <hr>
  <h3>YouTube video source </h3>
  <div id="videoPlaceholder2" class="videoholder"></div>

  <hr>
  <h3>Facebook video source </h3>
  <div id="videoPlaceholder3" class="videoholder"></div>

  <script>
    function loadVideoMp4() {
      var placeHolderId = 'videoPlaceholder1';
      var videoSource = 'https://clip.vietnamnetjsc.vn/media/2018/03/02/23/12/CNT7-02032018-ok_vnn.mp4';
      var posterUrl = 'https://clip.vietnamnetjsc.vn/media/2018/03/02/23/12/CNT7-02032018-ok_1.png';
      var adUrls = ['https://d2.hadarone.com/vast3?li=1531'];
      var skipAdTime = 2; // show skip button after 5 seconds
      var autoplay = false;
      var onReady = function (player) {
        player.volume(0.6);
      }
      HadarOnePlayer.create(autoplay, placeHolderId, videoSource, posterUrl, adUrls, skipAdTime, 0, onReady);
    }

    function loadVideoYoutube() {
      var placeHolderId = 'videoPlaceholder2';
      var videoSource = 'https://www.youtube.com/watch?v=jWchv7tGDwM';
      var adUrls = ['https://d2.hadarone.com/vast3?li=2082'];
      var skipAdTime = 2; // show skip button after 5 seconds
      var autoplay = false;
      var onReady = function (player) {
        player.volume(0.6);
      }
      HadarOnePlayer.create(autoplay, placeHolderId, videoSource, '', adUrls, skipAdTime, 0, onReady);
    }

    function loadVideoFacebook() {
      var placeHolderId = 'videoPlaceholder3';
      var videoSource = 'https://www.facebook.com/baotuoitre/videos/2179999532289307/';
      var adUrls = ['https://d2.hadarone.com/vast3?li=2082'];
      var skipAdTime = 2; // show skip button after 5 seconds
      var autoplay = true;
      var onReady = function (player) {
        player.volume(0.6);
      }
      HadarOnePlayer.create(autoplay, placeHolderId, videoSource, '', adUrls, skipAdTime, 0, onReady);
    }

    function loadVideoStreaming() {
      var placeHolderId = 'videoPlaceholder4';
      var videoSource =
        'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';
      var adUrls = ['https://d2.hadarone.com/vast3?li=2082'];
      var skipAdTime = 2; // show skip button after 5 seconds
      var autoplay = false;
      var onReady = function (player) {
        player.volume(0.6);
        player.ga(); // enable GA tracking video metrics
      }
      HadarOnePlayer.create(autoplay, placeHolderId, videoSource, '', adUrls, skipAdTime, 0, onReady);
    }

    var init = function () {
      loadVideoMp4();
      loadVideoYoutube();
      loadVideoFacebook();
      loadVideoStreaming();
    };

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
    })(window, document, 'script', 'http://www.google-analytics.com/analytics.js', 'ga');
    ga('create', 'UA-XXX-X');
  </script>

</body>

</html>

```

## Contributing

TrieuNT@blueseed.tv

## Versioning

1.2 on August 30, 2018

## Authors

* **Trieu Nguyen** - *Core Engineer* - TrieuNT@blueseed.tv


## License

This project is licensed under Blueseed.tv

## Acknowledgments

* Nothing

