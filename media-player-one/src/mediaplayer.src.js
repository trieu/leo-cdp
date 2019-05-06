(function (videojs, VASTPlayer) {
  "use strict";

  var MediaPlayerOne = {};

  MediaPlayerOne.videoAdIds = [];
  window.mpl1DebugLog = function (s) {
    var debugMode = window.debugMediaPlayerOne === true || location.hash.indexOf("player-debug") >= 0;
    if (debugMode) {
      console.log(s);
    }
  }

  // Safari HLS playback results in error with overrideNative
  videojs.options.hls.overrideNative = true;
  videojs.options.html5.nativeAudioTracks = false;
  videojs.options.html5.nativeVideoTracks = false;

  videojs.hook("setup", function (player) {
    //the container of video
    var vContainer = player.el_.parentElement;

    //set vastUrls from all data tri
    var vastUrls = [];
    var attrs = vContainer.attributes;
    for (var i = 0; i < attrs.length; i++) {
      var node = attrs[i];
      if (node) {
        var v = (node.nodeValue || "").trim();
        if (v.indexOf("http") === 0 && node.nodeName.indexOf("data-vast-url") === 0) {
          // mpl1DebugLog(v);
          vastUrls.push(v);
        }
      }
    }

    if (vastUrls.length > 0 && vContainer.className.indexOf("hadarone-video-player") > -1) {
      player.one("play", function () {
        setVideoAdPlayer(vContainer, player, vastUrls);
      });
    }
  });

  // VAST-PLAYER init for all video sources
  function setVideoAdPlayer(vContainer, videoPlayer, prerollAdUrls, adConfigs) {
    mpl1DebugLog(" set VAST-PLAYER from setVideoAdPlayer ..." + prerollAdUrls);

    var vcid = vContainer.getAttribute("id") || "hadarone_vpl_" + Math.floor(Math.random() * 9999999);
    if (MediaPlayerOne.videoAdIds[vcid] === true) {
      return;
    }

    //make sure data is not null
    prerollAdUrls = prerollAdUrls ? prerollAdUrls : [];
    adConfigs = adConfigs ? adConfigs : [];


    //check if Ad Info is set
    var hasAd = (prerollAdUrls.length > 0) || (adConfigs.length > 0) ? true : false
    if (!hasAd) {
      return false;
    }

    //store width and height
    var w = videoPlayer.width();
    var h = videoPlayer.height();

    //set the first state of ad placement is FALSE
    videoPlayer.adUnitPlayer = false;

    function prepareLoadAd(videoPlayer) {
      mpl1DebugLog('----------------prepareLoadAd is called ')
      //pause video first      
      videoPlayer.pause();
      videoPlayer.hide();
      videoPlayer.el_.parentNode.style['background-color'] = 'black';
      console.log(videoPlayer);
    }

    //call after skip Ad or no Ad
    function playContent(adDiv, videoPlayer, isPostroll) {
      videoPlayer.adUnitPlayer = false;
      mpl1DebugLog(videoPlayer.adUnitPlayer);
      videoPlayer.show();
      if (!isPostroll) videoPlayer.play();
      if (adDiv) {
        adDiv.setAttribute("style", "display:none!important");
      }
    }

    function isPlayAd() {
      return videoPlayer.adUnitPlayer !== false;
    }

    var loadVideoAds = function (vastUrl, skipAdTime, isPostroll, callbackForNextAd) {
      //mpl1DebugLog(videoPlayer.adUnitPlayer);

      if (isPlayAd()) {
        //seem there is another vast player in progress
        mpl1DebugLog('Skip due to duplicated vast-player session');
        return false;
      }

      mpl1DebugLog("loadVideoAds: vastUrl " + vastUrl);

      //check is valid url
      if (typeof vastUrl !== 'string' || vastUrl === '') {
        mpl1DebugLog("loadVideoAds: SKIP AD because vastUrl is not valid  ");
        return false;
      }

      //stop content player
      prepareLoadAd(videoPlayer);

      // ------------------------------------
      var isVolumeMuted = videoPlayer.muted();

      var skipAfter = skipAdTime || 5;
      var skipButtonLabel = vContainer.getAttribute("data-skip-label") || "Skip Ad";

      var adContainer = document.createElement("div");
      var adContainerId = "adContainer" + Math.floor(Math.random() * 9999999);
      var iframeVpaidSelector = "#" + adContainerId + " .hd1vplayer_iframe";
      var videoVastSelector = "#" + adContainerId + " .hd1vplayer_video";
      adContainer.setAttribute("id", adContainerId);
      adContainer.setAttribute("data-vastUrl", vastUrl);

      //update width and height of ad
      var cssAdDiv = "width:" + w + "px!important;height:" + h + "px!important;position:relative!important;background-color:#000;color:#FFF";
      adContainer.setAttribute("style", cssAdDiv);
      //mpl1DebugLog("setup width ", w, " height ", h);

      // append ad container to content player
      vContainer.appendChild(adContainer);

      //skip
      var skipButton = document.createElement("div");
      skipButton.className = "preroll-skip-button";

      //sound on/off
      var soundButton = document.createElement("div");
      soundButton.className = "preroll-sound-button";
      soundButton.style.padding = "9px 18px";
      soundButton.style["font-size"] = "22px";

      if (!window.isDesktop) {
        skipButton.style.padding = "9px";
        skipButton.style["font-size"] = "10px";
        soundButton.style["font-size"] = "18px";
      }

      if (isVolumeMuted) {
        soundButton.innerHTML = "&#128263;";
        soundButton.setAttribute("data-muted", "1");
      } else {
        soundButton.innerHTML = "&#128264;";
        soundButton.setAttribute("data-muted", "0");
      }
      soundButton.onclick = function (e) {
        var Event = Event || window.Event;
        var isMuted = soundButton.getAttribute("data-muted") === "1";

        //fix for Safari
        var iframe = document.querySelector(iframeVpaidSelector);
        if (iframe)
          iframe.contentWindow.document.body.querySelector(
            "video"
          ).muted = !isMuted;
        var video = document.querySelector(videoVastSelector);
        if (video) video.muted = !isMuted;

        soundButton.setAttribute("data-muted", isMuted ? "0" : "1");
        soundButton.innerHTML = isMuted ? "&#128264;" : "&#128263;";

        if (Event.prototype.stopPropagation !== undefined) {
          e.stopPropagation();
        } else {
          return false;
        }
      };
      if (!window.isDesktop) {
        soundButton.style.padding = "9px";
        soundButton.style["font-size"] = "10px";
      }

      function updateRemainingTime(counter) {
        skipButton.innerHTML = " " + counter + "s";
      }

      function showSkipButton(adPlayer) {
        skipButton.innerHTML = skipButtonLabel;
        skipButton.onclick = function (e) {
          var Event = Event || window.Event;

          //fix for Safari
          var iframe = document.querySelector(iframeVpaidSelector);
          if (iframe && iframe.contentWindow.document.body) {
            var vnode = iframe.contentWindow.document.body.querySelector(
              "video"
            );
            if (vnode) vnode.muted = true;
          }

          var video = document.querySelector(videoVastSelector);
          if (video) video.muted = true;

          adPlayer.stopAd();

          if (Event.prototype.stopPropagation !== undefined) {
            e.stopPropagation();
          } else {
            return false;
          }
        };
      }

      // --------------- init the VAST player

      var adPlayer = new VASTPlayer(adContainer, {
        mutedVideoAd: isVolumeMuted
      });
      videoPlayer.adUnitPlayer = adPlayer;
      adPlayer.once("AdStopped", function () {
        playContent(adContainer, videoPlayer, isPostroll);
        callbackForNextAd(true);
      });
      adPlayer
        .load(vastUrl)
        .then(function startAd() {
          //not show skip button on VPAID HadarOne, avoid duplicating skip button
          //var isVPAID = adContainer.childNodes[0] ? adContainer.childNodes[0].tagName === 'IFRAME' : false;
          //var showSkip = vastUrl.indexOf('hadarone') === -1 && !isVPAID;

          adContainer.appendChild(soundButton);
          if (skipAfter > 0) {
            //make sure skip button is displayed after load ad OK
            adContainer.appendChild(skipButton);
            updateRemainingTime(skipAfter);
            //the counter for skip
            var counter = skipAfter;
            var ti = setInterval(function () {
              counter--;
              updateRemainingTime(counter);
              //var d = adPlayer.adDuration - adPlayer.adRemainingTime;
            }, 1000);
            setTimeout(function () {
              clearInterval(ti);
              showSkipButton(adPlayer);
            }, 1000 * skipAfter);
          }

          //fix for mobile
          setTimeout(function () {
            var iframe = document.querySelector(iframeVpaidSelector);
            if (iframe && iframe.contentWindow.document.body) {
              var vnode = iframe.contentWindow.document.body.querySelector("video");
              if (vnode) vnode.play();
            }
            var video = document.querySelector(videoVastSelector);
            if (video) video.play();
          }, 1000);

          return adPlayer.startAd();
        })
        .catch(function (reason) {
          // all error from ad-player will be catched here
          if (typeof callbackForNextAd === 'function') {
            videoPlayer.adUnitPlayer = false;
            adContainer.setAttribute("style", "display:none!important");
            callbackForNextAd(false, videoPlayer);
            console.log("callbackForNextAd is NOT null 0")
          } else {
            //not found any ad, just play content           
            if (!isPostroll) {
              console.log("callbackForNextAd is null 1")
              playContent(adContainer, videoPlayer);
            } else {
              console.log("callbackForNextAd is null 2")
            }
          }

          mpl1DebugLog(reason);
        });
      return adPlayer;
    }

    // ------ begin the function as class for checking midroll ad ---------------------
    function LoadAdFunction(adPosition, timeCheck, adUrls, skipAdTime) {
      this.adPosition = adPosition;
      this.timeCheck = timeCheck;
      this.adUrls = adUrls;
      this.skipAdTime = skipAdTime;
      this.playedAdDone = false;
    }
    LoadAdFunction.prototype.checkToRun = function (currentTime) {

      mpl1DebugLog("midproll currentTime" + currentTime);
      mpl1DebugLog("midproll timeCheck " + this.timeCheck);
      mpl1DebugLog("midproll adUrls" + this.adUrls.length);

      var shouldPlayAd = this.adPosition === 'postproll' || this.adPosition === 'preroll';
      if (!shouldPlayAd) {
        shouldPlayAd = currentTime && currentTime >= this.timeCheck && currentTime > 0 && this.playedAdDone === false;
      }
      var isPostroll = this.adPosition === 'postproll';
      if (shouldPlayAd) {
        //ready to play ad
        this.playedAdDone = true;
        var adPosition = this.adPosition;
        var adUrls = this.adUrls;
        var adUrl = adUrls.length > 0 ? adUrls[0] : false;
        var skipAdTime = this.skipAdTime;
        var rs = false;
        if (typeof adUrl === 'string') {
          var callbackForNextAd1 = function (playAdOk, videoPlayer) {
            adUrls.shift();
            if (!playAdOk) {
              var adUrl = (adUrls.length > 0 && adUrls.length < 5) ? adUrls[0] : false;
              mpl1DebugLog(adPosition + ' callbackForNextAd1 adUrl ' + adUrl)
              if (adUrl) {
                loadVideoAds(adUrl, skipAdTime, isPostroll, callbackForNextAd1);
              } else {
                videoPlayer.show();
                videoPlayer.play();
              }
            }
            mpl1DebugLog(adPosition + ' callbackForNextAd1 adUrls.length ' + adUrls.length)
          };
          rs = loadVideoAds(adUrl, skipAdTime, isPostroll, callbackForNextAd1);
        }
        if (rs !== false) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    }
    LoadAdFunction.prototype.timeCheck = function () {
      return this.timeCheck;
    }
    // ------ end ----------------

    MediaPlayerOne.videoAdIds[vcid] = true;
    var skipAdTime = parseInt(vContainer.getAttribute("data-skip-after")) || 5;
    var midprollAdObjects = {},
      postrollAdUrls = [];

    //scan ad configs
    for (var i = 0; i < adConfigs.length; i++) {
      var adConfig = adConfigs[i];
      mpl1DebugLog(adConfig);
      if (adConfig) {
        var timeAfter = adConfig.timeAfter || 0;
        var adType = adConfig.adType || 'preroll';
        var adUrl = adConfig.adUrl || '';

        // pre-roll ad
        if (adType === 'preroll' && typeof adUrl === 'string') {
          prerollAdUrls.push(adUrl);
        }

        // mid-roll ad
        if (adType === 'midproll' && timeAfter > 0 && typeof adUrl === 'string') {
          var k = '' + timeAfter;
          var list = midprollAdObjects[k];
          if (typeof list === 'object') {
            list.push(adUrl);
          } else {
            list = [];
            list.push(adUrl);
            midprollAdObjects[k] = list;
          }
        }

        // Post-roll ad
        if (adType === 'postroll' && typeof adUrl === 'string') {
          postrollAdUrls.push(adUrl);
        }
      }
    }

    // ------------- preroll --------------
    if (prerollAdUrls.length > 0) {
      new LoadAdFunction('preroll', 0, prerollAdUrls, skipAdTime).checkToRun(1);
    } else {
      playContent(false, videoPlayer);
    }

    // ------------- midproll --------------
    var loadAdFunctions = [];
    for (var k in midprollAdObjects) {
      var timeAfter = parseInt(k);
      var midprollAdUrls = midprollAdObjects[k];
      mpl1DebugLog(' timeAfter' + timeAfter)
      console.log(' midprollAdUrls', midprollAdUrls)
      loadAdFunctions.push(new LoadAdFunction('midproll', timeAfter, midprollAdUrls, skipAdTime));
    }

    //sort mid-roll ad by timeCheck config
    loadAdFunctions.sort(function (a, b) {
      if (a.timeCheck < b.timeCheck)
        return -1;
      if (a.timeCheck > b.timeCheck)
        return 1;
      return 0;
    })

    //timer for check and play midroll ad
    var mdpT = setInterval(function () {
      mpl1DebugLog(loadAdFunctions);
      if (loadAdFunctions.length > 0) {
        var f = loadAdFunctions[0];
        var currentTime = Math.floor(videoPlayer.currentTime());
        mpl1DebugLog('currentTime ' + currentTime);
        mpl1DebugLog('timeCheck ' + f.timeCheck);
        var rs = f.checkToRun(currentTime);
        if (rs !== false) {
          loadAdFunctions.splice(0, 1);
        } else {
          mpl1DebugLog('wait for ad');
        }
      } else {
        clearInterval(mdpT);
        mdpT = 0;
      }
    }, 1200);
    mpl1DebugLog("setInterval for loadAdFunctions " + mdpT);

    // ------------- postproll --------------
    videoPlayer.on('ended', function () {
      if (mdpT > 0) {
        clearInterval(mdpT);
      }
      new LoadAdFunction('postproll', 0, postrollAdUrls, skipAdTime).checkToRun(1);
    });
  }

  var setVideoAd = function (vContainer, urls) {
    if (vContainer) {
      var vpl = vContainer.getElementsByTagName("video")[0];
      if (vpl) {
        var player = videojs(vpl);
        player.one("play", function () {
          //set VAST-PLAYER
          setVideoAdPlayer(vContainer, player, urls);
        });
      }
    }
  };

  // manually set vast url by ID
  var setVideoAdsById = function (vContainerId, urls) {
    var vContainer = document.getElementById(vContainerId);
    setVideoAd(vContainer, urls);
  };

  // manually set vast url by selected dom nodes
  var setVideoAds = function (vContainers, urls) {
    for (var i = 0; i < vContainers.length; i++) {
      var vContainer = vContainers[i];
      setVideoAd(vContainer, urls);
    }
  };

  var create = function (
    autoplay,
    placeHolderId,
    videoSource,
    posterUrl,
    adUrls,
    skipAdTime,
    adConfigs,
    readyCallback
  ) {
    var d = document.getElementById(placeHolderId);
    if (!d) return;
    var w = d.offsetWidth;
    if (w === 0) return;
    var h = d.offsetHeight === 0 ? Math.floor((w * 9) / 16) : d.offsetHeight;
    var skipAdLabel = "Skip Ad";
    var vastUrls = adUrls ? adUrls : [];
    skipAdTime = skipAdTime ? skipAdTime : 5;
    posterUrl = posterUrl ? posterUrl : "";

    var player = false;
    //YOUTUBE 
    if (videoSource.indexOf("//www.youtube.com") > 0) {
      player = createVideoFromYouTube(
        autoplay,
        placeHolderId,
        videoSource,
        w,
        h,
        vastUrls,
        skipAdTime,
        skipAdLabel,
        adConfigs,
        readyCallback
      );
    }
    //FACEBOOK 
    else if (videoSource.indexOf("//www.facebook.com") > 0) {
      player = createVideoFromFacebook(
        autoplay,
        placeHolderId,
        videoSource,
        w,
        h,
        vastUrls,
        skipAdTime,
        skipAdLabel,
        adConfigs,
        readyCallback
      );
    }
    //DAILYMOTION
    else if (videoSource.indexOf('//www.dailymotion.com') > 0) {
      player = createVideoFromDailymotion(
        autoplay,
        placeHolderId,
        videoSource,
        w,
        h,
        vastUrls,
        skipAdTime,
        skipAdLabel,
        adConfigs,
        readyCallback
      );
    }
    //VIMEO 
    else if (videoSource.indexOf('//vimeo.com') > 0) {
      player = createVideoFromVimeo(
        autoplay,
        placeHolderId,
        videoSource,
        w,
        h,
        vastUrls,
        skipAdTime,
        skipAdLabel,
        adConfigs,
        readyCallback
      );
    } else {
      if (videoSource.lastIndexOf(".mp4") > 0) {
        player = createVideo(
          autoplay,
          placeHolderId,
          videoSource,
          false,
          false,
          posterUrl,
          w,
          h,
          vastUrls,
          skipAdTime,
          skipAdLabel,
          adConfigs,
          readyCallback
        );
      } else if (videoSource.lastIndexOf(".webm") > 0) {
        player = createVideo(
          autoplay,
          placeHolderId,
          false,
          videoSource,
          false,
          posterUrl,
          w,
          h,
          vastUrls,
          skipAdTime,
          skipAdLabel,
          adConfigs,
          readyCallback
        );
      } else if (videoSource.lastIndexOf(".m3u8") > 0) {
        player = createVideo(
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
          adConfigs,
          readyCallback
        );
      }
    }
    if (window.mediaPlayer1Configs) {
      var configs = window.mediaPlayer1Configs;

      //video watermark
      if (configs.watermarkImage && configs.watermarkUrl && configs.watermarkPosition) {
        player.watermark({
          image: configs.watermarkImage,
          url: configs.watermarkUrl,
          position: configs.watermarkPosition,
        });
      }
    }

    return player;
  };

  var createVideo = function (
    autoplay,
    placeHolderId,
    mp4Url,
    webmUrl,
    mpegURL,
    posterUrl,
    w,
    h,
    vastUrls,
    skipAdTime,
    skipAdLabel,
    adConfigs,
    readyCallback
  ) {
    var ran = Math.floor(Math.random() * 9999999);
    var vcid = "hd1_c_" + ran,
      vid = "hd1_vpl_" + ran;

    var tpl = '<div class="hadarone-video-player" id="' + vcid + '"';
    if (typeof skipAdTime === "number") {
      tpl += ' data-skip-after="' + skipAdTime + '" ';
    }
    if (typeof skipAdLabel === "string") {
      tpl += ' data-skip-label="' + skipAdLabel + '" ';
    }
    tpl += ">";

    var attr = 'playsinline="true" class="video-js vjs-default-skin" ';
    tpl +=
      '<video id="' +
      vid +
      '" ' +
      attr +
      ' width="' +
      w +
      '" height="' +
      h +
      '" >';
    if (mp4Url && mp4Url != "") {
      tpl += '<source src="' + mp4Url + '" type="video/mp4" />';
    }
    if (webmUrl && webmUrl != "") {
      tpl += '<source src="' + webmUrl + '" type="video/webm" />';
    }
    if (mpegURL && mpegURL != "") {
      tpl += '<source src="' + mpegURL + '" type="application/x-mpegURL" />';
    }
    tpl += "</video></div>";
    var node = document.getElementById(placeHolderId);
    if (node) {
      node.innerHTML = tpl;
    }

    var player = videojs(vid, {
      controls: true,
      controlBar: {
        fullscreenToggle: false
      },
      autoplay: autoplay,
      muted: autoplay === true, //must muted video for autoplay
      preload: "auto",
      poster: posterUrl
    });

    player.one("play", function () {
      //set VAST-PLAYER
      MediaPlayerOne.setVideoAdPlayer(
        document.getElementById(vcid),
        player,
        vastUrls,
        adConfigs
      );

      var logoDiv = document.createElement('div');
      logoDiv.setAttribute('class', 'playerlogo')
      document.querySelector('#' + vid + ' .vjs-remaining-time').parentNode.appendChild(logoDiv);

      if (typeof readyCallback === "function") {
        readyCallback(player);
      }
    });

    return player;
  };

  var createVideoFromYouTube = function (
    autoplay,
    placeHolderId,
    youtubeSrc,
    w,
    h,
    vastUrls,
    skipAdTime,
    skipAdLabel,
    adConfigs,
    readyCallback
  ) {
    var ran = Math.floor(Math.random() * 9999999);
    var vcid = "hd1_c_" + ran,
      vid = "hd1_vpl_" + ran;

    var tpl = '<div class="hadarone-video-player" id="' + vcid + '"';
    if (typeof skipAdTime === "number") {
      tpl += ' data-skip-after="' + skipAdTime + '" ';
    }
    if (typeof skipAdLabel === "string") {
      tpl += ' data-skip-label="' + skipAdLabel + '" ';
    }
    tpl += ">";

    var attr = ' class="video-js vjs-default-skin" ';
    tpl +=
      '<video id="' +
      vid +
      '" ' +
      attr +
      ' width="' +
      w +
      '" height="' +
      h +
      '" >';
    tpl += "</video></div>";
    var node = document.getElementById(placeHolderId);
    if (node) {
      node.innerHTML = tpl;
    } else {
      return;
    }

    var player = videojs(vid, {
      controls: true,
      controlBar: {
        fullscreenToggle: true
      },
      autoplay: autoplay,
      preload: "auto",
      youtube: {
        "playsinline": 1
      },
      techOrder: ["youtube"],
      sources: [{
        type: "video/youtube",
        src: youtubeSrc
      }]
    });

    player.one("play", function () {
      //set VAST-PLAYER
      MediaPlayerOne.setVideoAdPlayer(
        document.getElementById(vcid),
        player,
        vastUrls,
        adConfigs
      );
      var logoDiv = document.createElement('div');
      logoDiv.setAttribute('class', 'playerlogo');

      document.querySelector('#' + vid + ' .vjs-remaining-time').parentNode.appendChild(logoDiv);
      if (typeof readyCallback === "function") {
        readyCallback(player);
      }
    });
    if (autoplay && player.muted()) {
      player.play();
    }
    return player;
  };

  var createVideoFromDailymotion = function (
    autoplay,
    placeHolderId,
    videoSrc,
    w,
    h,
    vastUrls,
    skipAdTime,
    skipAdLabel,
    adConfigs,
    readyCallback
  ) {
    var ran = Math.floor(Math.random() * 9999999);
    var vcid = "hd1_c_" + ran,
      vid = "hd1_vpl_" + ran;

    var tpl = '<div class="hadarone-video-player" id="' + vcid + '"';
    if (typeof skipAdTime === "number") {
      tpl += ' data-skip-after="' + skipAdTime + '" ';
    }
    if (typeof skipAdLabel === "string") {
      tpl += ' data-skip-label="' + skipAdLabel + '" ';
    }
    tpl += ">";

    var attr = ' class="video-js vjs-default-skin" ';
    tpl +=
      '<video id="' +
      vid +
      '" ' +
      attr +
      ' width="' +
      w +
      '" height="' +
      h +
      '" >';
    tpl += "</video></div>";
    var node = document.getElementById(placeHolderId);
    if (node) {
      node.innerHTML = tpl;
    } else {
      return;
    }

    var player = videojs(vid, {
      controls: true,
      controlBar: {
        fullscreenToggle: true
      },
      autoplay: autoplay,
      preload: "auto",
      youtube: {
        "playsinline": 1
      },
      techOrder: ["Dailymotion"],
      sources: [{
        type: "video/Dailymotion",
        src: videoSrc
      }]
    });

    player.one("play", function () {
      //set VAST-PLAYER
      MediaPlayerOne.setVideoAdPlayer(
        document.getElementById(vcid),
        player,
        vastUrls,
        adConfigs
      );
      var logoDiv = document.createElement('div');
      logoDiv.setAttribute('class', 'playerlogo');

      document.querySelector('#' + vid + ' .vjs-remaining-time').parentNode.appendChild(logoDiv);
      if (typeof readyCallback === "function") {
        readyCallback(player);
      }
    });
    if (autoplay && player.muted()) {
      player.play();
    }
    return player;
  }

  var createVideoFromVimeo = function (
    autoplay,
    placeHolderId,
    youtubeSrc,
    w,
    h,
    vastUrls,
    skipAdTime,
    skipAdLabel,
    adConfigs,
    readyCallback
  ) {
    var ran = Math.floor(Math.random() * 9999999);
    var vcid = "hd1_c_" + ran,
      vid = "hd1_vpl_" + ran;

    var tpl = '<div class="hadarone-video-player" id="' + vcid + '"';
    if (typeof skipAdTime === "number") {
      tpl += ' data-skip-after="' + skipAdTime + '" ';
    }
    if (typeof skipAdLabel === "string") {
      tpl += ' data-skip-label="' + skipAdLabel + '" ';
    }
    tpl += ">";

    var attr = ' class="video-js vjs-default-skin" ';
    tpl +=
      '<video id="' +
      vid +
      '" ' +
      attr +
      ' width="' +
      w +
      '" height="' +
      h +
      '" >';
    tpl += "</video></div>";
    var node = document.getElementById(placeHolderId);
    if (node) {
      node.innerHTML = tpl;
    } else {
      return;
    }

    var player = videojs(vid, {
      controls: true,
      controlBar: {
        fullscreenToggle: true
      },
      autoplay: autoplay,
      preload: "auto",
      youtube: {
        "playsinline": 1
      },
      techOrder: ["vimeo"],
      sources: [{
        type: "video/vimeo",
        src: youtubeSrc,
        "vimeo": {
          "color": "#fbc51b"
        }
      }]
    });

    player.one("play", function () {
      //set VAST-PLAYER
      MediaPlayerOne.setVideoAdPlayer(
        document.getElementById(vcid),
        player,
        vastUrls,
        adConfigs
      );
      var logoDiv = document.createElement('div');
      logoDiv.setAttribute('class', 'playerlogo');

      document.querySelector('#' + vid + ' .vjs-remaining-time').parentNode.appendChild(logoDiv);
      if (typeof readyCallback === "function") {
        readyCallback(player);
      }
    });
    if (autoplay && player.muted()) {
      player.play();
    }
    return player;
  };

  var createVideoFromFacebook = function (
    autoplay,
    placeHolderId,
    facebookSrc,
    w,
    h,
    vastUrls,
    skipAdTime,
    skipAdLabel,
    adConfigs,
    readyCallback
  ) {
    var ran = Math.floor(Math.random() * 9999999);
    var vcid = "hd1_c_" + ran,
      vid = "hd1_vpl_" + ran;

    var tpl = '<div class="hadarone-video-player" id="' + vcid + '"';
    if (typeof skipAdTime === "number") {
      tpl += ' data-skip-after="' + skipAdTime + '" ';
    }
    if (typeof skipAdLabel === "string") {
      tpl += ' data-skip-label="' + skipAdLabel + '" ';
    }
    tpl += ">";
    if (!window.isDesktop) {
      h = Math.floor(h * 2.03);
    }
    var attr = ' class="video-js vjs-default-skin" ';
    tpl +=
      '<video id="' +
      vid +
      '" ' +
      attr +
      ' width="' +
      w +
      '" height="' +
      h +
      '" >';
    tpl += "</video></div>";
    var node = document.getElementById(placeHolderId);
    if (node) {
      node.innerHTML = tpl;
    } else {
      return;
    }

    var player = videojs(vid, {
      controls: false,
      controlBar: {
        fullscreenToggle: false
      },
      autoplay: autoplay,
      preload: "auto",
      techOrder: ["facebook"],
      sources: [{
        type: "video/facebook",
        src: facebookSrc,
        width: w,
        height: h,
        autoplay: autoplay
      }]
    });

    //var playBtn = document.querySelector('#' + vid + ' .vjs-big-play-button');
    //playBtn.style.visibility = 'hidden';

    player.one("play", function () {
      //set VAST-PLAYER
      MediaPlayerOne.setVideoAdPlayer(
        document.getElementById(vcid),
        player,
        vastUrls,
        adConfigs
      );
      var logoDiv = document.createElement('div');
      logoDiv.setAttribute('class', 'playerlogo')
      document.querySelector('#' + vid + ' .vjs-remaining-time').parentNode.appendChild(logoDiv);

      if (typeof readyCallback === "function") {
        readyCallback(player);
      }
    });
    if (autoplay && player.muted()) {
      player.play();
    }
    return player;
  };

  //export to public
  MediaPlayerOne.setVideoAd = setVideoAd;
  MediaPlayerOne.setVideoAdsById = setVideoAdsById;
  MediaPlayerOne.setVideoAds = setVideoAds;
  MediaPlayerOne.setVideoAdPlayer = setVideoAdPlayer;
  MediaPlayerOne.createVideo = createVideo;
  MediaPlayerOne.create = create;

  // the export to public usage
  window.MediaPlayerOne = MediaPlayerOne;
  //for user using old version  
  window.HadarOnePlayer = MediaPlayerOne;

  setTimeout(function () {
    if (typeof window.mediaPlayerOneReady === 'function') {
      window.mediaPlayerOneReady();
    }
    if (typeof window.mediaPlayerTracking === 'function') {
      window.mediaPlayerTracking();
    }
  }, 123);

})(window.videojs, window.VASTPlayer);