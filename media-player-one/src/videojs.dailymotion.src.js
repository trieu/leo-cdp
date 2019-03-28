/**
 * @license TrieuNT
 */
(function (root, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        var videojs = require('video.js');
        module.exports = factory(videojs.default || videojs);
    } else if (typeof define === 'function' && define.amd) {
        define(['videojs'], function (videojs) {
            return (root.Facebook = factory(videojs));
        });
    } else {
        root.Facebook = factory(root.videojs);
    }
}(this, function (videojs) {
    'use strict';

    var _isOnMobile = videojs.browser.IS_IOS || videojs.browser.IS_NATIVE_ANDROID;
    var Tech = videojs.getTech('Tech');

    var Facebook = videojs.extend(Tech, {

        constructor: function (options, ready) {
            mpl1DebugLog('constructor', options);
            Tech.call(this, options, ready);

            this.setPoster(options.poster);
            this.setSrc(this.options_.source, true);

            // Set the vjs-facebook class to the player
            // Parent is not set yet so we have to wait a tick
            this.setTimeout(function () {
                if (this.el_) {
                    this.el_.parentNode.className += ' vjs-facebook';

                    if (_isOnMobile) {
                        this.el_.parentNode.className += ' vjs-facebook-mobile';
                    }
                    this.initFBPlayer();
                }
            }.bind(this));
        },

        dispose: function () {
            if (this.fbPlayer) {
                //Dispose of the Facebook Player       
                this.fbPlayer.pause();
                if (this.iframeFbVideo) {
                    this.iframeFbVideo.remove();
                }
            }
            this.fbPlayer = null;

            this.el_.parentNode.className = this.el_.parentNode.className
                .replace(' vjs-facebook', '')
                .replace(' vjs-facebook-mobile', '');
            this.el_.parentNode.removeChild(this.el_);

            //Needs to be called after the YouTube player is destroyed, otherwise there will be a null reference exception
            Tech.prototype.dispose.call(this);
        },

        createEl: function () {
            var div = document.createElement('div');
            div.setAttribute('id', this.options_.techId);
            div.setAttribute('style', 'width:100%;height:100%;top:0;left:0;position:absolute');
            div.setAttribute('class', 'vjs-tech');

            var ifId = 'f_' + this.options_.techId;
            var iframeStr = '<iframe id="' + ifId + '" src="about:blank"  frameborder="0" style="visibility:visible;border:0;overflow:hidden;"></iframe>';
            div.innerHTML = iframeStr;

            var divWrapper = document.createElement('div');
            divWrapper.appendChild(div);

            if (!_isOnMobile && !this.options_.ytControls) {

                var divBlocker = document.createElement('div');
                divBlocker.setAttribute('class', 'vjs-iframe-blocker');
                divBlocker.setAttribute('style', 'position:absolute;top:0;left:0;width:100%;height:100%');

                // In case the blocker is still there and we want to pause
                divBlocker.onclick = function () {
                    this.pause();
                }.bind(this);

                divWrapper.appendChild(divBlocker);
            }
            mpl1DebugLog('createEl', divWrapper);

            return divWrapper;
        },



        initFBPlayer: function () {
            mpl1DebugLog('initFBPlayer')
            mpl1DebugLog(this.options_);

            var width = this.options_.source.width;
            var height = this.options_.source.height;


            var ifId = 'f_' + this.options_.techId;
            var iframeV = document.getElementById(ifId);
            iframeV.setAttribute("width", width);
            iframeV.setAttribute("height", height);

            console.log('initFBPlayer', iframeV, width, height)
            this.iframeFbVideo = iframeV;

            if (!window.isDesktop) {
                //FIXME
            }

            this.fbVideoSetup();
        },

        fbVideoSetup: function () {
            var ran = Math.floor(Math.random() * 9999999);
            var fbVideoSrc = this.options_.source.src;
            var autoplay = this.options_.autoplay;
            var width = this.options_.source.width;
            var height = this.options_.source.height;
            var playerHandlerId = "hd1fbh_" + ran;

            var jsFbVideoStr =
                ` var done = false, callAdPlayer = false;
            window.fbAsyncInit = function () {       
                if(done) return;          
                done = true;
                FB.init({ appId: '', status:true, xfbml:true, version: 'v3.2'});          
                FB.Event.subscribe('xfbml.ready', function (msg) {
                  console.log('===========> xfbml.ready');
                  if (msg.type === 'video') {                       
                      var node = document.querySelector('iframe');
                      if(node) {
                          node.removeAttribute('allowfullscreen'); 
                          //node.style.height = '` + height + `px';
                      }
                      //if(node) node.setAttribute('donotallowfullscreen','true');                     
                      parent['` + playerHandlerId + `'](msg.instance);
                      callAdPlayer = true;
                  }
                });
                setTimeout(function(){
                  if(!callAdPlayer) parent['` + playerHandlerId + `'](false);
                },5000)
            };           
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0], r = false;               
                js = d.createElement(s);
                js.id = id;
                js.src = location.protocol + "//static.blueseed.tv/ajs/video-player/facebook.sdk.js";
                js.onload = s.onreadystatechange = function () {
                  if (!r && (!this.readyState || this.readyState == 'complete')) {
                      r = true;
                      window.fbAsyncInit();
                  }
              };
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
            setTimeout(fbAsyncInit,5000);
        `;

            var styleStr = `
          <style>
          body { overflow:hidden; margin:0 auto;background-color:#000; }    
          </style>
        `;

            var dstDoc = false;
            var div = document.createElement("div");
            var attrs = {
                id: "fb" + ran,
                "data-href": fbVideoSrc,
                "class": "fb-video",
                "data-show-captions": "false",
                "data-show-text": "false",
                "data-controls": "false",
                "data-width": width,
                "data-height": height,
                "data-autoplay": "false",
                "style": "width:" + width + "px;height:" + height + "px"
                // "data-allowfullscreen" : "false"
            };
            for (var k in attrs) {
                div.setAttribute(k, attrs[k]);
            }
            var tmp = document.createElement("div");
            tmp.appendChild(div);
            dstDoc = this.iframeFbVideo.contentDocument || this.iframeFbVideo.contentWindow.document;
            dstDoc.write(styleStr);
            dstDoc.write(tmp.innerHTML);
            dstDoc.write('<div id="fb-controller" style="display:none;" class="fbv-controller play-button"></div>');
            dstDoc.write('<div id="fb-root" style="display:none;"></div>');
            dstDoc.write(`<script>` + jsFbVideoStr + `<\/script>`);
            dstDoc.close();

            this.on('fullscreenchange', function () {});
            ///////////

            var vjsThis = this;

            window[playerHandlerId] = function (fbVideoPlayer) {
                vjsThis.fbPlayer = fbVideoPlayer;
                mpl1DebugLog(vjsThis.fbPlayer)

                // WHY ? resize to new height of Facebook iframe video
                var fbvH = dstDoc.documentElement.clientHeight;
                vjsThis.iframeFbVideo.setAttribute("height", fbvH);

                fbVideoPlayer.subscribe("startedBuffering", function (e) {
                    mpl1DebugLog("fbVideoPlayer startedBuffering Ok");
                    vjsThis.onPlayerStateChange({
                        data: -1
                    })
                });
                fbVideoPlayer.subscribe("startedPlaying", function (e) {
                    mpl1DebugLog("fbVideoPlayer startedPlaying Ok");
                    vjsThis.onPlayerStateChange({
                        data: 2
                    })
                });

                fbVideoPlayer.subscribe("paused", function (e) {
                    vjsThis.onPlayerStateChange({
                        data: 1
                    })
                    mpl1DebugLog("fbVideoPlayer paused Ok");
                });

                fbVideoPlayer.subscribe("error", function (e) {
                    vjsThis.onPlayerStateChange({
                        data: 4
                    })
                    mpl1DebugLog("fbVideoPlayer error");
                    console.error(e);
                });
                fbVideoPlayer.subscribe("finishedPlaying", function (e) {
                    vjsThis.onPlayerStateChange({
                        data: 4
                    })
                    mpl1DebugLog("fbVideoPlayer finishedPlaying Ok");
                    if (typeof eventCallback['ended'] === 'function') {
                        eventCallback['ended']();
                    }
                });
                fbVideoPlayer.subscribe("finishedBuffering", function (e) {
                    mpl1DebugLog("fbVideoPlayer finishedBuffering Ok");
                    vjsThis.onPlayerStateChange({
                        data: 2
                    })
                });

                if (autoplay) {
                    fbVideoPlayer.mute()
                } else {
                    fbVideoPlayer.unmute()
                }
                //ready for videojs handler
                vjsThis.onPlayerReady();
            };

        },

        onPlayerReady: function () {
            mpl1DebugLog('onPlayerReady')
            if (this.options_.muted) {
                this.fbPlayer.mute();
            }

            this.playerReady_ = true;
            this.triggerReady();

            if (this.playOnReady) {
                this.play();
            }
        },

        onPlayerPlaybackQualityChange: function () {

        },

        onPlayerPlaybackRateChange: function () {
            this.trigger('ratechange');
        },

        onPlayerStateChange: function (e) {
            mpl1DebugLog('onPlayerStateChange', e)
            var state = e.data;

            if (state === this.lastState || this.errorNumber) {
                mpl1DebugLog('onPlayerStateChange, skip', e)
                return;
            }

            this.lastState = state;

            switch (state) {
                case -1: //STARTED
                    this.trigger('loadstart');
                    this.trigger('loadedmetadata');
                    this.trigger('durationchange');
                    this.trigger('ratechange');
                    break;

                case 1: //PAUSED
                    this.trigger('canplay');
                    if (this.isSeeking) {
                        this.onSeeked();
                    } else {
                        this.trigger('pause');
                    }
                    break;

                case 2: //PLAYING
                    this.trigger('timeupdate');
                    this.trigger('durationchange');
                    this.trigger('playing');
                    this.trigger('play');

                    if (this.isSeeking) {
                        this.onSeeked();
                    }
                    break;

                case 3: //BUFFERING
                    this.player_.trigger('timeupdate');
                    this.player_.trigger('waiting');
                    break;

                case 4: //ENDED
                    this.trigger('ended');
                    break;
            }
        },

        onPlayerVolumeChange: function () {
            this.trigger('volumechange');
        },

        onPlayerError: function (e) {
            this.errorNumber = e.data;
            this.trigger('pause');
            this.trigger('error');
        },

        error: function () {
            var code = 1000 + this.errorNumber; // as smaller codes are reserved
            switch (this.errorNumber) {
                case 5:
                    return {
                        code: code,
                        message: 'Error while trying to play the video'
                    };

                case 2:
                case 100:
                    return {
                        code: code,
                        message: 'Unable to find the video'
                    };

                case 101:
                case 150:
                    return {
                        code: code,
                        message: 'Playback on other Websites has been disabled by the video owner.'
                    };
            }

            return {
                code: code,
                message: 'YouTube unknown error (' + this.errorNumber + ')'
            };
        },


        src: function (src) {
            mpl1DebugLog('src', src)
            if (src) {
                this.setSrc({
                    src: src
                });
            }

            return this.source;
        },

        poster: function () {
            // You can't start programmaticlly a video with a mobile
            // through the iframe so we hide the poster and the play button (with CSS)
            if (_isOnMobile) {
                return null;
            }

            return this.poster_;
        },

        setPoster: function (poster) {
            this.poster_ = poster;
        },

        setSrc: function (source) {
            mpl1DebugLog('setSrc', source)
            if (!source || !source.src) {
                return;
            }

            delete this.errorNumber;
            this.source = source;
            this.url = Facebook.parseUrl(source.src).dataHref;

            if (this.options_.autoplay) {
                if (this.isReady_) {
                    this.play();
                } else {
                    this.playOnReady = true;
                }
            } else if (this.activeVideoId !== this.url.videoId) {
                if (this.isReady_) {
                    this.activeVideoId = this.url.videoId;
                }
            }
        },

        autoplay: function () {
            return this.options_.autoplay;
        },

        setAutoplay: function (val) {
            this.options_.autoplay = val;
        },

        loop: function () {
            return this.options_.loop;
        },

        setLoop: function (val) {
            this.options_.loop = val;
        },

        play: function () {
            mpl1DebugLog('fbVideoPlayer.play ...... ', this.url, this.lastState)
            if (!this.url) {
                return;
            }

            this.wasPausedBeforeSeek = false;
            if (this.fbPlayer && !this.lastState) {
                this.lastState = 1;
            }

            if (this.lastState !== 2) {
                this.fbPlayer.play();
            }
        },

        pause: function () {
            mpl1DebugLog(this.lastState + ' fbVideoPlayer.pause ...... ', this.url)
            if (this.lastState === 2) {
                this.fbPlayer.pause();
                this.onPlayerStateChange({
                    data: 1
                })
            } else {
                this.fbPlayer.play();
                this.onPlayerStateChange({
                    data: 2
                })
            }
        },

        paused: function () {
            return (this.fbPlayer) ?
                (this.lastState !== 2 && this.lastState !== 3) :
                true;
        },

        currentTime: function () {
            return this.fbPlayer ? this.fbPlayer.getCurrentPosition() : 0;
        },

        setCurrentTime: function (seconds) {
            if (this.lastState === YT.PlayerState.PAUSED) {
                this.timeBeforeSeek = this.currentTime();
            }

            if (!this.isSeeking) {
                this.wasPausedBeforeSeek = this.paused();
            }

            this.fbPlayer.seek(seconds);
            this.trigger('timeupdate');
            this.trigger('seeking');
            this.isSeeking = true;

            // A seek event during pause does not return an event to trigger a seeked event,
            // so run an interval timer to look for the currentTime to change
            if (this.lastState === 1 && this.timeBeforeSeek !== seconds) {
                clearInterval(this.checkSeekedInPauseInterval);
                this.checkSeekedInPauseInterval = setInterval(function () {
                    if (this.lastState !== 1 || !this.isSeeking) {
                        // If something changed while we were waiting for the currentTime to change,
                        //  clear the interval timer
                        clearInterval(this.checkSeekedInPauseInterval);
                    } else if (this.currentTime() !== this.timeBeforeSeek) {
                        this.trigger('timeupdate');
                        this.onSeeked();
                    }
                }.bind(this), 250);
            }
        },

        seeking: function () {
            return this.isSeeking;
        },

        seekable: function () {
            if (!this.fbPlayer) {
                return videojs.createTimeRange();
            }
            return videojs.createTimeRange(0, this.fbPlayer.getDuration());
        },

        onSeeked: function () {
            clearInterval(this.checkSeekedInPauseInterval);
            this.isSeeking = false;

            if (this.wasPausedBeforeSeek) {
                this.pause();
            }

            this.trigger('seeked');
        },

        playbackRate: function () {
            return 1;
        },

        setPlaybackRate: function (suggestedRate) {
            if (!this.fbPlayer) {
                return;
            }

            this.fbPlayer.setPlaybackRate(suggestedRate);
        },

        duration: function () {
            return this.fbPlayer ? this.fbPlayer.getDuration() : 0;
        },

        currentSrc: function () {
            return this.source && this.source.src;
        },

        ended: function () {
            return this.fbPlayer ? (this.lastState === YT.PlayerState.ENDED) : false;
        },

        volume: function () {
            return this.fbPlayer ? this.fbPlayer.getVolume() / 100.0 : 1;
        },

        setVolume: function (percentAsDecimal) {
            if (!this.fbPlayer) {
                return;
            }
            this.fbPlayer.setVolume(percentAsDecimal);
        },

        muted: function () {
            return this.fbPlayer ? this.fbPlayer.isMuted() : false;
        },

        setMuted: function (mute) {
            if (!this.fbPlayer) {
                return;
            } else {
                this.muted(true);
            }

            if (mute) {
                this.fbPlayer.mute();
            } else {
                this.fbPlayer.unmute();
            }
            this.setTimeout(function () {
                this.trigger('volumechange');
            }, 50);
        },

        buffered: function () {
            if (!this.fbPlayer || !this.fbPlayer.getVideoLoadedFraction) {
                return videojs.createTimeRange();
            }

            var bufferedEnd = this.fbPlayer.getVideoLoadedFraction() * this.fbPlayer.getDuration();

            return videojs.createTimeRange(0, bufferedEnd);
        },

        // TODO: Can we really do something with this on YouTUbe?
        preload: function () {},
        load: function () {},
        reset: function () {},
        networkState: function () {
            if (!this.fbPlayer) {
                return 0; //NETWORK_EMPTY
            } else {
                return 2; //NETWORK_LOADING
            }
        },

        supportsFullScreen: function () {
            return document.fullscreenEnabled ||
                document.webkitFullscreenEnabled ||
                document.mozFullScreenEnabled ||
                document.msFullscreenEnabled;
        },

    });

    Facebook.isSupported = function () {
        return true;
    };

    Facebook.canPlaySource = function (e) {
        return Facebook.canPlayType(e.type);
    };

    Facebook.canPlayType = function (e) {
        return (e === 'video/facebook');
    };

    Facebook.parseUrl = function (url) {
        var result = {
            videoId: null,
            dataHref: url
        };
        //TODO

        return result;
    };

    function injectCss() {
        var css = // iframe blocker to catch mouse events
            '.vjs-facebook .vjs-iframe-blocker { display: none; }' +
            '.vjs-facebook.vjs-user-inactive .vjs-iframe-blocker { display: block; }' +
            '.vjs-facebook .vjs-poster { background-size: cover; }' +
            '.vjs-facebook-mobile .vjs-big-play-button { display: none; }';

        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    }

    if (typeof document !== 'undefined') {
        injectCss();
    }
    // Older versions of VJS5 doesn't have the registerTech function
    if (typeof videojs.registerTech !== 'undefined') {
        videojs.registerTech('facebook', Facebook);
    } else {
        videojs.registerComponent('facebook', Facebook);
    }
}));