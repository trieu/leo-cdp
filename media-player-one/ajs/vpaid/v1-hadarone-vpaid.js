// HadarOne VPAID 2.0 with Header Bidding - July 05, 2018
(function () {
    var auth = "v1-hadarone-vpaid.js";
    var yoVideoId = Math.floor(1E5 * Math.random());

    var DisplayBanner = function (vpaidContainer, adCodeJs) {
        this._slot = null;
        this._vpaidContainer = vpaidContainer;

        this.eventsCallbacks = {};
        this._adCodeJs = adCodeJs;
        this._linear = true;
        this._width = 300;
        this._height = 250;

        this._remainingTime = 5;
        this._skippableState = false;
        this._viewMode = "normal";
        this._skipoffset = 5;
        this._creativeData = {};
        this._environmentVars = null;


        this.uniqueEvent = {
            AdImpression: 0
        }
        this.isPaused = false;

        this.initAd = function (width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
            console.log('VAST.initAd');
            this._slot = environmentVars.slot;
            var _videoSlot = environmentVars.videoSlot;
            this._width = width;
            this._height = height;
            this._viewMode = viewMode;
            this._desiredBitrate = desiredBitrate;
            this._creativeData = creativeData;
            this._environmentVars = environmentVars;

            this.setSource(this._vast.mediaFile.url);
            this.eventsCallbacks["AdLoaded"]();
        };

        this.resizeAd = function (width, height, viewMode) {
            this._width = width;
            this._height = height;
            this._viewMode = viewMode;
        };

        this.startAd = function () {
            var _this = this;
            this.eventsCallbacks["AdStarted"]();

        };

        this.stopAd = function () {
            this.eventsCallbacks["AdStopped"]();;
        };

        this.pauseAd = function () {
            this.isPaused = true;
            this.eventsCallbacks["AdPaused"]();
        };

        this.resumeAd = function () {
            this.eventsCallbacks["AdPlaying"]();
        };

        this.expandAd = function () {

        };

        this.collapseAd = function () {

        };

        this.skipAd = function () {
            vpaidContainer.onSkipAd();
            this.eventsCallbacks["AdSkipped"]();
        };

        this.getAdLinear = function () {
            return this._linear;
        };

        this.getAdWidth = function () {
            return this._width;
        };

        this.getAdHeight = function () {

        };

        this.getAdExpanded = function () {
            return this._expanded;
        };

        this.getAdSkippableState = function () {
            return this._skippableState;
        };

        this.getAdRemainingTime = function () {
            return this._remainingTime;
        };

        this.getAdDuration = function () {
            return this._duration;
        };

        this.getAdVolume = function () {
            return this._volume;
        };

        this.getAdCompanions = function () {
            return this._companions;
        };

        this.getAdIcons = function () {
            return this._icons;
        };

        this.setAdLinear = function (val) {
            this._linear = val;
        };

        this.setAdWidth = function (val) {
            this._width = val;
        };

        this.setAdHeight = function (val) {
            this._height = val;
        };

        this.setAdExpanded = function (val) {
            this._expanded = val;
        };

        this.setAdSkippableState = function (val) {
            this._skippableState = val;
        };

        this.setAdRemainingTime = function (val) {
            this._remainingTime = val;
        };

        this.setAdDuration = function (val) {
            this._duration = val;
        };

        this.setAdVolume = function (val) {};

        this.setAdCompanions = function (val) {};

        this.setAdIcons = function (val) {};

        this.subscribe = function (aCallback, eventName, aContext) {
            var callBack = aCallback.bind(aContext);
            this.eventsCallbacks[eventName] = callBack;
        };

        this.unsubscribe = function (eventName) {
            console.log("unsubscribe");
        };

        this.setSource = function (src) {
            if (src) {
                Dom.setProperty(this._videoSlot, "src", src);
            }
        }
    }

    var VAST = function (vast) {
        this._slot = null;
        this._videoSlot = null;
        this.eventsCallbacks = {};
        this._vast = vast;
        this._linear = true;
        this._width = 0;
        this._height = 0;
        this._duration = 0;
        this._companions = null;
        this._icons = null;
        this._desiredBitrate = 256;
        this._expanded = false;
        this._remainingTime = 10;
        this._skippableState = false;
        this._viewMode = "normal";
        this._skipoffset = 7;
        this._creativeData = {};
        this._environmentVars = null;
        this._volume = 1;

        this.uniqueEvent = {
            AdImpression: 0,
            AdVideoStart: 0,
            AdVideoFirstQuartile: 0,
            AdVideoMidpoint: 0,
            AdVideoThirdQuartile: 0,
            AdVideoComplete: 0
        }
        this.isPaused = false;

        this.initAd = function (width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
            console.log('VAST.initAd');
            this._slot = environmentVars.slot;
            this._videoSlot = environmentVars.videoSlot;
            this._width = width;
            this._height = height;
            this._viewMode = viewMode;
            this._desiredBitrate = desiredBitrate;
            this._creativeData = creativeData;
            this._environmentVars = environmentVars;

            this.setSource(this._vast.mediaFile.url);
            this.eventsCallbacks["AdLoaded"]();
        };

        this.resizeAd = function (width, height, viewMode) {
            this._width = width;
            this._height = height;
            this._viewMode = viewMode;
        };

        this.startAd = function () {
            var _this = this;
            this.eventsCallbacks["AdStarted"]();
            this._videoSlot.play();
            this.setAdDuration(this._videoSlot.duration);
            var index = 0;
            var eventVideo = [{
                    callback: "AdVideoFirstQuartile",
                    condition: 0.25
                },
                {
                    callback: "AdVideoMidpoint",
                    condition: 0.5
                },
                {
                    callback: "AdVideoThirdQuartile",
                    condition: 0.75
                },
                {
                    callback: "AdVideoComplete",
                    condition: 1
                },
            ];
            Dom.addEventListener(this._videoSlot, "timeupdate", function timeupdate() {
                if (index >= eventVideo.length) {
                    return;
                }
                var played = _this._videoSlot.currentTime / _this._videoSlot.duration;
                if (played >= eventVideo[index].condition) {
                    _this.eventsCallbacks[eventVideo[index].callback]();
                    index++;
                }
            });
            Dom.addEventListener(this._videoSlot, "volumechange", function volumechange() {
                _this.eventsCallbacks["AdVolumeChange"]();
            });
            Dom.addEventListener(this._videoSlot, "playing", function playing() {
                if (!_this.uniqueEvent.AdImpression) {
                    _this.eventsCallbacks["AdImpression"]();
                    _this.uniqueEvent.AdImpression++;
                }
                if (!_this.uniqueEvent.AdVideoStart) {
                    _this.eventsCallbacks["AdVideoStart"]();
                    _this.uniqueEvent.AdVideoStart++;
                }
            });
            Dom.addEventListener(this._videoSlot, "ended", function ended() {
                setTimeout(_this.eventsCallbacks["AdStopped"], 200);
            });
        };

        this.stopAd = function () {
            this.eventsCallbacks["AdStopped"]();;
        };

        this.pauseAd = function () {
            this._videoSlot.pause();
            this.isPaused = true;
            this.eventsCallbacks["AdPaused"]();
        };

        this.resumeAd = function () {
            this.eventsCallbacks["AdPlaying"]();
        };

        this.expandAd = function () {

        };

        this.collapseAd = function () {

        };

        this.skipAd = function () {
            this.eventsCallbacks["AdSkipped"]();
        };

        this.getAdLinear = function () {
            return this._linear;
        };

        this.getAdWidth = function () {
            return this._width;
        };

        this.getAdHeight = function () {

        };

        this.getAdExpanded = function () {
            return this._expanded;
        };

        this.getAdSkippableState = function () {
            return this._skippableState;
        };

        this.getAdRemainingTime = function () {
            return this._remainingTime;
        };

        this.getAdDuration = function () {
            return this._duration;
        };

        this.getAdVolume = function () {
            return this._volume;
        };

        this.getAdCompanions = function () {
            return this._companions;
        };

        this.getAdIcons = function () {
            return this._icons;
        };

        this.setAdLinear = function (val) {
            this._linear = val;
        };

        this.setAdWidth = function (val) {
            this._width = val;
        };

        this.setAdHeight = function (val) {
            this._height = val;
        };

        this.setAdExpanded = function (val) {
            this._expanded = val;
        };

        this.setAdSkippableState = function (val) {
            this._skippableState = val;
        };

        this.setAdRemainingTime = function (val) {
            this._remainingTime = val;
        };

        this.setAdDuration = function (val) {
            this._duration = val;
        };

        this.setAdVolume = function (val) {
            this._volume = val;
        };

        this.setAdCompanions = function (val) {
            this._companions = val;
        };

        this.setAdIcons = function (val) {
            this._icons = val;
        };

        this.subscribe = function (aCallback, eventName, aContext) {
            var callBack = aCallback.bind(aContext);
            this.eventsCallbacks[eventName] = callBack;
        };

        this.unsubscribe = function (eventName) {
            console.log("unsubscribe");
        };

        this.setSource = function (src) {
            if (src) {
                Dom.setProperty(this._videoSlot, "src", src);
            }
        }
    }

    VPAIDAdUnit = function () {
        this._width;
        this._height;
        this._viewMode;
        this._desiredBitrate;
        this._creativeData;
        this._environmentVars;
        this._slot = null;
        this._videoSlot = null;
        this.eventsCallbacks = {};
        this._vastTree = {};
        this._backup = 0;
        this._loop = 1;
        this._skipButton = null;
        this._iframe = null;
        this._playerHadarOne = false;
        this.handshakeVersion = function (version) {
            return "2.0";
        };

        var doInitLinearAd = function (thisAd, width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
            console.log('doInitLinearAd');
            console.log(environmentVars.slot);
            console.log(environmentVars.videoSlot);

            thisAd._width = width || 640;
            thisAd._height = height || 360;
            thisAd._viewMode = viewMode || 'normal';
            thisAd._desiredBitrate = desiredBitrate || -1;
            thisAd._creativeData = creativeData || {
                AdParameters: ""
            };
            thisAd._environmentVars = environmentVars;
            thisAd._slot = environmentVars.slot;
            thisAd._videoSlot = environmentVars.videoSlot;
            thisAd._ad = null;
            thisAd.initializeAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars);
        }

        var doInitNonLinearAd = function (thisAd, width, height, environmentVars, adCode) {
            console.log('doInitNonLinearAd');

            thisAd._width = width || 300;
            thisAd._height = height || 250;
            thisAd._environmentVars = environmentVars;
            thisAd._slot = environmentVars.slot;
            thisAd._videoSlot = environmentVars.videoSlot;
            thisAd._ad = DisplayBanner(thisAd, adCode);

            var iframe = Dom.createIframe(thisAd._slot, null);

            thisAd._slot.appendChild(iframe);

            Dom.setIframeContent(iframe, thisAd.getIframeHadarOnePlayer());
            var iframeWin = iframe.contentWindow;
            var iframeDoc = iframe.contentDocument || iframeWin.document;


            loadScript(iframeDoc, 'https://static.hadarone.com/ajs/postscribe.min.js', function () {
                var adContainer = iframeDoc.getElementById('ad-container');
                iframeWin.postscribe('#ad-container', adCode);

                var skipAfter = 3;
                var skipButtonLabel = "Skip Ad";
                var skipButton = document.createElement("div");
                skipButton.className = "preroll-skip-button";

                function showSkipButton() {
                    skipButton.innerHTML = skipButtonLabel;
                    skipButton.onclick = function (e) {
                        var Event = Event || window.Event;
                        thisAd.onStopAd();
                        if (Event.prototype.stopPropagation !== undefined) {
                            e.stopPropagation();
                        } else {
                            return false;
                        }
                    };
                }

                function updateRemainingTime(counter) {
                    skipButton.innerHTML = " " + counter + "s";
                }

                //make sure skip button is displayed after load ad OK
                adContainer.appendChild(skipButton);
                updateRemainingTime(skipAfter);

                //the counter for skip
                var counter = skipAfter;
                var ti = setInterval(function () {
                    counter--;
                    updateRemainingTime(counter);
                }, 1000);

                setTimeout(function () {
                    clearInterval(ti);
                    showSkipButton();
                }, 1000 * skipAfter);

            });

        }

        this.initAd = function (width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
            
            var _this = this;
            var skiptime = Dom.getQueryParamByName("skiptime") || 6;
            var debugMode = Dom.getQueryParamByName("db") == '1';

            if (debugMode) {

                console.log('VPAIDAdUnit.initAd ', creativeData.AdParameters);
            }

            // TODO HadarOne Header Bidding processing
            var isBiddingMode = creativeData.AdParameters.indexOf('$$VAST_URL$$') > 0;
            this._playerHadarOne = true; //environmentVars.playerHadarOne === true;
            if (isBiddingMode) {
                var gmwid = Dom.getQueryParamByName("gmwid") || 0;
                var gmzid = Dom.getQueryParamByName("gmzid") || 0;
                var hdpmid = Dom.getQueryParamByName("hdpmid") || 0;
                if (gmwid == 0 || gmwid == 0 || hdpmid == 0) {
                    console.error("gmwid:" + gmwid, "gmzid:" + gmzid, "hdpmid:" + hdpmid);
                    _this.onStopAd();
                }
                console.log("gmwid:" + gmwid, "gmzid:" + gmzid, "hdpmid:" + hdpmid)

                var jsUrl = 'https://static.hadarone.com/ajs/vpaid/hadarone-prebid-utils.js';

                loadScript(document, jsUrl, function () {
                    var pbjs = pbjs || {};
                    pbjs.que = pbjs.que || [];
                    pbjs.que.push(new handlerHeaderBidding(gmwid, gmzid, hdpmid, function (vastUrl) {
                        if (debugMode) {
                            console.log('HeaderBidding, win vastUrl ' + vastUrl);
                        }
                        var bidCrtData = creativeData;
                        bidCrtData.AdParameters = bidCrtData.AdParameters.replace('$$VAST_URL$$', vastUrl);
                        environmentVars.adUrl = vastUrl;
                        doInitLinearAd(_this, width, height, viewMode, desiredBitrate, bidCrtData, environmentVars);
                    }));
                })
            } else {
                var adParam = decodeURIComponent(creativeData.AdParameters);
                if (this._playerHadarOne && adParam.indexOf('VASTAdTagURI') > 0) {

                    var xmlDoc = Dom.parseXML(adParam);
                    var vastTag = Dom.getOne("VASTAdTagURI", xmlDoc);
                    environmentVars.adUrl = vastTag.textContent.trim();
                    doInitLinearAd(_this, width, height, viewMode, desiredBitrate, creativeData, environmentVars);

                }
                //FIMXE some issues in JW player and Google IMA
                else if (adParam.indexOf('InPlayerDisplayAd') > 0) {
                    console.log(adParam);
                    doInitNonLinearAd(_this, width, height, environmentVars, adParam);
                } else {
                    doInitLinearAd(_this, width, height, viewMode, desiredBitrate, creativeData, environmentVars);
                }
            }
        };

        this.initVpaid = function (iframe) {
            var env = Object.assign({}, this._environmentVars);
            env.slot = iframe.contentWindow.document.body;

            var _this = this;
            if (_this._playerHadarOne && env.adUrl) {
                _this.startHadarOneVastPlayer(iframe.contentWindow, env.adUrl);

            } else {

                var fn = iframe.contentWindow["getVPAIDAd"];
                VPAIDCreative = fn();
                this._ad = VPAIDCreative;
                this.setCallbacks();

                this._ad.initAd(this._width, this._height, this._viewMode, this._desiredBitrate, this._vastTree.creativeData, env);

                var skipOffset = this._vastTree.mediaFile.getSkipoffset() ? this._vastTree.mediaFile.getSkipoffset() : "00:00:03";
                this.addSkipButtonToPlayer(document.body, Common.toSecond(skipOffset));
            }
            this.eventsCallbacks["AdLoaded"]();
        };

        this.getContentIframe = function () {
            var iframeHTML = '<!DOCTYPE html>' +
                '<html lang="en">' +
                '<head>' +
                '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
                '</head>' +
                '<body style="margin:0;padding:0">' +
                '<script type="text/javascript">' +
                'var fjs, js = document.createElement("script");' +
                'js.onload = function () {window.parent.postMessage(\'{"event": "ready", "id": "vpaidIframe_1"}\', \'*\');};' +
                'js.src = "' + this._vastTree.mediaFile.url + '";' +
                'document.head.appendChild(js);' +
                '</script>' +
                '</body>' +
                '</html>';
            return iframeHTML;
        };

        this.getIframeHadarOnePlayer = function () {
            return '<!DOCTYPE html>' +
                '<html lang="en">' +
                '<head>' +
                '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
                `<style>
                .preroll-skip-button{
                    display: block; position: absolute;
                    top: 12px; right: 0; width: auto;
                    background-color: rgba(0, 0, 0, .5); color: #FFF;
                    font-size: 15px; font-weight: bold;
                    font-style: italic; line-height: 12px;
                    padding: 15px; z-index: 2;
                    border: 2px solid rgba(255, 255, 255, .35);
                    border-right: none; cursor: pointer;
                 }
                .preroll-skip-button.enabled {
                    cursor: pointer; color: #fff;
                }
                .preroll-skip-button.enabled:hover {
                    cursor: pointer; background: #333;
                }
                body {margin:0; padding:0; display: table;}
                #ad-container { vertical-align: middle; display: table-cell; text-align:center; }
                </style><script></script>` +
                '</head>' +
                '<body style="margin:0;padding:0;display: table;">' +
                '<div id="ad-container" style="width: ' + Dom.toPx(this._width) + '; height: ' + Dom.toPx(this._height) + ';"></div>' +
                '</body>' +
                '</html>';
        };



        this.startHadarOneVastPlayer = function (iframeWindow, adURL) {
            var _this = this;
            var iframeDoc = iframeWindow.document;
            var adContainer = iframeDoc.getElementById('ad-container');
            window['mutedVideoAd'] = true;
            loadScript(iframeDoc, 'https://static.hadarone.com/ajs/vpaid/vast-player.min.js', function () {
                var skipAfter = 4;
                var skipButtonLabel = "Skip Ad";
                var skipButton = document.createElement("div");
                skipButton.className = "preroll-skip-button";

                function updateRemainingTime(counter) {
                    skipButton.innerHTML = " " + counter + "s";
                }

                var adPlayer = new iframeWindow.VASTPlayer(adContainer);
                adPlayer.once('AdStopped', function () {
                    _this.onStopAd();
                });
                adPlayer.once('AdSkipped', function () {
                    _this.onSkipAd();
                });
                adPlayer.once('AdClickThru', function () {
                    _this.onAdClickThru();
                });

                adPlayer.load(adURL).then(function startAd() {

                    //make sure skip button is displayed after load ad OK
                    adContainer.appendChild(skipButton);
                    updateRemainingTime(skipAfter);

                    //the counter for skip
                    var counter = skipAfter;
                    var ti = setInterval(function () {
                        counter--;
                        updateRemainingTime(counter);
                    }, 1000);

                    setTimeout(function () {
                        clearInterval(ti);
                        // showSkipButton
                        skipButton.innerHTML = skipButtonLabel;
                        skipButton.onclick = function (e) {
                            var Event = Event || window.Event;
                            adPlayer.skipAd();
                            if (Event.prototype.stopPropagation !== undefined) {
                                e.stopPropagation();
                            } else {
                                return false;
                            }
                        };
                    }, 1000 * skipAfter);

                    setTimeout(function () {
                        var v = adContainer.childNodes[0].contentDocument.getElementsByTagName('video')[0];
                        v.muted = true;
                        var promise = v.play();

                        if (promise !== undefined) {
                            promise.then(_ => {
                                // Autoplay started!
                            }).catch(error => {
                                v.muted = true;
                                v.play();
                            });
                        }
                    }, 500);

                    return adPlayer.startAd();
                }).catch(function (reason) {
                    console.log(reason)
                });
            }).catch(function (reason) {
                if (debugMode) {
                    setTimeout(function () {
                        throw reason;
                    }, 0);
                }
                _this.onSkipAd();
            });
        }


        this.initializeAd = function (width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
            var _this = this;

            var adurl = Dom.getQueryParamByName("adurl") || "";
            var loop = Dom.getQueryParamByName("loop") || 0;
            if (loop) {
                this._loop = loop;
            }
            XML.getXml(width, height, desiredBitrate, creativeData, adurl).then(
                XML.provideXml,
                function (err) {
                    console.log(err);
                }
            ).then(function (a) {
                _this._vastTree = a;
                if (!a.mediaFile.isEmpty()) {
                    _this._slot.style.cursor = "pointer";
                    if (a.mediaFile.isVPAID()) {
                        var iframe = Dom.createIframe(_this._slot, null);
                        _this._iframe = iframe;
                        if (_this._playerHadarOne) {
                            Dom.setIframeContent(iframe, _this.getIframeHadarOnePlayer());
                            _this.initVpaid(iframe);
                        } else {

                            Dom.setIframeContent(iframe, _this.getContentIframe());
                            Dom.addEventListener(window, "message", function (e) {
                                try {
                                    //console.log(e.data);
                                    var data = JSON.parse(e.data);
                                    if (data.event === "ready") {
                                        _this.initVpaid(iframe);
                                    }
                                } catch (e) {
                                    //console.log(e);
                                }
                            });
                        }
                    } else {
                        _this._ad = new VAST(a);
                        _this.setCallbacks();
                        _this._ad.initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars);
                        Dom.addEventListener(_this._slot, "click", function () {
                            _this.onAdClickThru(a.clickThroughUrl, 1);
                        });
                        _this.addSkipButtonToPlayer(document.body, Common.toSecond(a.mediaFile.getSkipoffset()));
                    }
                } else {
                    _this.onAdError();
                }
            });
        }

        this.resizeAd = function (width, height, viewMode) {
            console.log('resizeAd...');
            if (this._ad) this._ad.resizeAd(width, height, viewMode);
        };

        this.startAd = function () {
            console.log('startAd...');
            // this.eventsCallbacks["AdStarted"]();
            if (this._ad) this._ad.startAd();
        };

        this.stopAd = function () {
            if (this._ad) setTimeout(this._ad.stopAd.bind(this), 200);
        };

        this.pauseAd = function () {
            if (this._ad) this._ad.pauseAd();
        };

        this.resumeAd = function () {
            if (this._ad) this._ad.resumeAd();
        };

        this.expandAd = function () {
            console.log('expandAd...');
            if (this._ad) this._ad.expandAd();
        };

        this.collapseAd = function () {
            if (this._ad) this._ad.collapseAd();
        };

        this.skipAd = function () {
            if (this._ad) this._ad.skipAd();
        };

        this.subscribe = function (aCallback, eventName, aContext) {
            var callBack = aCallback.bind(aContext);
            this.eventsCallbacks[eventName] = callBack;
        };

        this.unsubscribe = function (eventName) {
            this.eventsCallbacks[eventName] = null;
        };

        this.getAdLinear = function () {
            console.log('getAdLinear...');
            if (this._ad) return this._ad.getAdLinear();
            return {};
        };

        this.getAdWidth = function () {
            if (this._ad) return this._ad._width;
            return 300;
        };

        this.getAdHeight = function () {
            if (this._ad) return this._ad._height;
            return 250;
        };

        this.getAdExpanded = function () {
            if (this._ad) return this._ad.getAdExpanded();
            return false;
        };

        this.getAdSkippableState = function () {
            if (this._ad) return this._ad.getAdSkippableState();
            return false;
        };

        this.getAdRemainingTime = function () {
            if (this._ad) return this._ad.getAdRemainingTime();
            return 1;
        };

        this.getAdDuration = function () {
            if (this._ad) return this._ad.getAdDuration();
            return 1;
        };

        this.getAdVolume = function () {
            if (this._ad) return this._ad.getAdVolume();
            return 0;
        };

        this.getAdCompanions = function () {
            if (this._ad) return this._ad.getAdCompanions();
            return {};
        };

        this.getAdIcons = function () {
            if (this._ad) return this._ad.getAdIcons();
            return 0;
        };

        this.getAdLinear = function () {
            console.log('getAdLinear');
            if (this._ad) return this._ad.getAdLinear();
        };

        this.setAdLinear = function (val) {
            if (this._ad) this._ad.setAdLinear(val);
        };

        this.setAdWidth = function (val) {
            if (this._ad) this._ad.setAdWidth(val);
        };

        this.setAdHeight = function (val) {
            if (this._ad) this._ad.setAdHeight(val);
        };

        this.setAdExpanded = function (val) {
            if (this._ad) this._ad.setAdExpanded(val);
        };

        this.setAdSkippableState = function (val) {
            if (this._ad) this._ad.setAdSkippableState(val);
        };

        this.setAdRemainingTime = function (val) {
            if (this._ad) this._ad.setAdRemainingTime(val);
        };

        this.setAdDuration = function (val) {
            if (this._ad) this._ad.setAdDuration(val);
        };

        this.setAdVolume = function (val) {
            if (this._ad) this._ad.setAdVolume(val);
        };

        this.setAdCompanions = function (val) {
            if (this._ad) this._ad.setAdCompanions(val);
        };

        this.setAdIcons = function (val) {
            if (this._ad) this._ad.setAdIcons(val);
        };

        this.onAdPaused = function () {
            this.loadTracking(this.getUrlTracking("pause"));
            this.eventsCallbacks["AdPaused"]();
        };

        this.onAdPlaying = function () {
            this.loadTracking(this.getUrlTracking("resume"));
            this.eventsCallbacks["AdPlaying"]();
            if (this._videoSlot.pause) {
                this._videoSlot.play();
            }
        };

        this.onAdError = function () {
            this.loadTracking(this.getUrlTracking("error"));
            this.removeSkipButton();
            if (this._iframe) {
                this._iframe.remove();
            }
            if (this._backup < this._loop) {
                this._backup++;
                this.getAdBackup();
            } else {
                setTimeout(this.eventsCallbacks["AdStopped"].bind(this), 200);
            }
        };

        this.onAdLog = function (message) {
            console.log("onAdLog: " + message);
        };

        this.onAdUserAcceptInvitation = function () {
            this.loadTracking(this.getUrlTracking("acceptInvitation"));
        };

        this.onAdUserMinimize = function () {
            this.loadTracking(this.getUrlTracking("collapse"));
        };

        this.onAdUserClose = function () {
            this.loadTracking(this.getUrlTracking("close"));
        };

        this.onAdSkippableStateChange = function () {
            console.log("Ad Skippable State Changed to:", this._ad.getAdSkippableState());
        };

        this.onAdExpandedChange = function () {
            console.log("Ad Expanded Changed to:", this._ad.getAdExpanded());
        };

        this.onAdImpression = function () {
            this.loadTracking(this.getUrlTracking("impression"));
        };

        this.onAdClickThru = function (url, id, playerHandles) {
            console.log("Clickthrough portion of the ad was clicked");
            this.loadTracking(this.getUrlTracking("clicktracking"));
            this.eventsCallbacks["AdClickThru"](url, "0", true);
        };

        this.onAdInteraction = function (id) {
            console.log("A non-clickthrough event has occured");
        };

        this.onAdVideoStart = function () {
            this.loadTracking(this.getUrlTracking("start"));
        };

        this.onAdVideoFirstQuartile = function () {
            this.loadTracking(this.getUrlTracking("firstQuartile"));
        };

        this.onAdVideoMidpoint = function () {
            this.loadTracking(this.getUrlTracking("midpoint"));
        };

        this.onAdVideoThirdQuartile = function () {
            this.loadTracking(this.getUrlTracking("thirdQuartile"));
        };

        this.onAdVideoComplete = function () {
            this.loadTracking(this.getUrlTracking("complete"));
        };

        this.onAdLinearChange = function () {
            console.log("Ad linear has changed:", this._ad.getAdLinear());
        };

        this.onAdLoaded = function () {
            this.eventsCallbacks["AdLoaded"]();
        };

        this.onStartAd = function () {
            this.eventsCallbacks["AdStarted"]();
            this.loadTracking(this.getUrlTracking("creativeView"));
        };

        this.onStopAd = function () {
            this.eventsCallbacks["AdStopped"]();
        };

        this.onSkipAd = function () {
            this.loadTracking(this.getUrlTracking("skip"));
            this.eventsCallbacks["AdSkipped"]();
            setTimeout(this.eventsCallbacks["AdStopped"].bind(this), 200);
        };

        this.onAdVolumeChange = function () {
            if (this._videoSlot.muted) {
                this.loadTracking(this.getUrlTracking("mute"));
            } else if (this._videoSlot.volume > 0 && this._ad.getAdVolume() == 0) {
                this.loadTracking(this.getUrlTracking("unmute"));
            }
        };

        this.onAdDurationChange = function () {

        };

        this.onAdRemainingTimeChange = function () {

        };

        this.onAdSizeChange = function () {

        };

        this.setCallbacks = function () {
            var callbacks = {
                AdStarted: this.onStartAd,
                AdStopped: this.onStopAd,
                AdSkipped: this.onSkipAd,
                AdLoaded: this.onAdLoaded,
                AdLinearChange: this.onAdLinearChange,
                AdSizeChange: this.onAdSizeChange,
                AdExpandedChange: this.onAdExpandedChange,
                AdSkippableStateChange: this.onAdSkippableStateChange,
                AdDurationChange: this.onAdDurationChange,
                AdRemainingTimeChange: this.onAdRemainingTimeChange,
                AdVolumeChange: this.onAdVolumeChange,
                AdImpression: this.onAdImpression,
                AdClickThru: this.onAdClickThru,
                AdInteraction: this.onAdInteraction,
                AdVideoStart: this.onAdVideoStart,
                AdVideoFirstQuartile: this.onAdVideoFirstQuartile,
                AdVideoMidpoint: this.onAdVideoMidpoint,
                AdVideoThirdQuartile: this.onAdVideoThirdQuartile,
                AdVideoComplete: this.onAdVideoComplete,
                AdUserAcceptInvitation: this.onAdUserAcceptInvitation,
                AdUserMinimize: this.onAdUserMinimize,
                AdUserClose: this.onAdUserClose,
                AdPaused: this.onAdPaused,
                AdPlaying: this.onAdPlaying,
                AdError: this.onAdError,
                AdLog: this.onAdLog
            };
            for (var eventName in callbacks) {
                if (this._ad) this._ad.subscribe(callbacks[eventName], eventName, this);
            }
        };

        this.getUrlTracking = function (event) {
            var urls = [];
            switch (event) {
                case "impression":
                case "start":
                case "firstQuartile":
                case "midpoint":
                case "thirdQuartile":
                case "complete":
                case "clicktracking":
                case "fullscreen":
                case "mute":
                case "unmute":
                case "pause":
                case "resume":
                case "skip":
                    urls = this._vastTree.trackingEvents[event] ? this._vastTree.trackingEvents[event] : [];
                    break;
                case "error":
                    urls = this._vastTree ? this._vastTree.errorUrl : '';
                    break;
            }
            return urls;
        }

        this.loadTracking = function (urls) {
            try {
                urls.map(function (url) {
                    Dom.getImg(url).then(function (s) {}, function (e) {});
                });
            } catch (error) {}
        };

        this.createSkipButton = function (dom) {
            var skipButton = window.document.createElement("DIV");
            skipButton.setAttribute("id", "hd1-skip-btn");
            Dom.addClass("hd1-skip-button", skipButton);
            skipButton.setAttribute("style", "z-index:5; position: absolute; line-height: 3.25; text-align: center; vertical-align: middle; border-radius: 50%; display: block; top: 10px; right: 5px; color: #fff; font-size: 15px; width: 50px; height: 50px; background: rgba(0,0,0,.25); box-shadow: 0 0 10px 1px #fff;");
            var _this = this;
            Dom.addEventListener(skipButton, "click", function (e) {
                if (Dom.hasClass("enabled", skipButton)) {
                    _this.skipAd();
                }
            }, true);
            return skipButton;
        };

        this.removeSkipButton = function (skipButton) {
            var skipButton = document.getElementById("hd1-skip-btn");
            if (skipButton) {
                skipButton.remove();
            }
        };

        this.updateSkipButtonState = function (skipButton, skipOffset) {
                var timeLeft = Math.ceil(skipOffset - this._videoSlot.currentTime);
                if (timeLeft > 0) {
                    skipButton.innerHTML = Common.toFixedDigits(timeLeft, 1);
                } else {
                    if (!Dom.hasClass("enabled", skipButton)) {
                        Dom.addClass("enabled", skipButton);
                        skipButton.style.cursor = "pointer";
                        skipButton.innerHTML = "Skip";
                    }
                }
            },
            this.addSkipButtonToPlayer = function (dom, skipOffset) {
                if (skipOffset > 0) {
                    var skipButton = this.createSkipButton();
                    Dom.appendChild(dom, skipButton);
                    var updateSkipButton = this.updateSkipButtonState.bind(this, skipButton, skipOffset);
                    Dom.addEventListener(this._videoSlot, "timeupdate", updateSkipButton);
                }
            };



        this.isEmptyVast = function () {
            if (this._vastTree && this._vastTree.mediaFile.isEmpty()) {
                var events = ["start", "firstQuartile", "midpoint", "thirdQuartile", "complete"];
                for (var e in events) {
                    if (!this._vastTree.trackingEvents[events[e]] || this._vastTree.trackingEvents[events[e]].length == 0) {
                        return true;
                    }
                }
                return false;
            }
            return false;
        };

        this.getAdBackup = function () {
            var _this = this;
            var fallbackVast = Dom.getQueryParamByName("fb");
            XML.getXml(this._width, this._height, this._desiredBitrate, null, fallbackVast).then(
                XML.provideXml,
                function (err) {
                    console.log(err);
                }
            ).then(function (a) {
                _this._vastTree = a;
                if (a && !a.mediaFile.isEmpty()) {
                    _this._slot.style.cursor = "pointer";
                    if (a.mediaFile.isVPAID()) {
                        var iframe = Dom.createIframe(_this._slot, null);
                        Dom.setIframeContent(iframe, _this.getContentIframe());
                        Dom.addEventListener(window, "message", function (e) {
                            try {
                                var data = JSON.parse(e.data);
                                if (data.event === "ready") {
                                    _this.initVpaid(iframe);
                                }
                            } catch (e) {}

                        });
                    } else {
                        _this._ad = new VAST(a);
                        _this.setCallbacks();
                        _this._ad.initAd(_this._width, _this._height, _this._viewMode, _this._desiredBitrate, _this._creativeData, _this._environmentVars);
                        Dom.addEventListener(_this._slot, "click", function () {
                            _this.onAdClickThru(a.clickThroughUrl, 1);
                        });
                        _this.addSkipButtonToPlayer(document.body, Common.toSecond(a.mediaFile.getSkipoffset()));
                    }
                } else {
                    if (_this.isEmptyVast()) {
                        _this._backup = _this.loop;
                    }
                    _this.onAdError();
                }
            });
        }


    }

    var Http = function () {
        return {
            get: function (url) {
                if (!url) return Promise.reject("Timeout");
                var xhttp = new XMLHttpRequest();
                xhttp.open("GET", url);
                xhttp.withCredentials = true;
                xhttp.send(null);
                return new Promise(function (resolve, reject) {
                    xhttp.addEventListener("load", function () {
                        /^5/.test(xhttp.status) && reject("Timeout");
                        resolve(xhttp.response);
                    });
                    xhttp.addEventListener("error", function (error) {
                        reject("Timeout");
                    });
                });
            }
        }
    }();

    var Common = function () {
        return {
            toArray: function (obj) {
                return Array.prototype.slice.call(obj)
            },
            mergeObjects: function () {
                return Common.toArray(arguments).reduce(function (a, c) {
                    return Object.keys(c).reduce(function (a, b) {
                        var d = c[b];
                        a[b] ? Array.isArray(a[b]) ? a[b] = a[b].concat(d) : a[b] = [a[b]].concat(d) : a[b] = d;
                        return a
                    }, a)
                }, {})
            },
            isEmpty: function (item) {
                return !item || 0 === item.length
            },
            isDOMElement: function (a) {
                return !!a.nodeName
            },
            isFunction: function (a) {
                return "function" === typeof a
            },
            isNumber: function (num) {
                return typeof num === 'number';
            },
            toFixedDigits: function (num, digits) {
                var formattedNum = num + '';
                digits = Common.isNumber(digits) ? digits : 0;
                num = Common.isNumber(num) ? num : parseInt(num, 10);
                if (Common.isNumber(num) && !isNaN(num)) {
                    formattedNum = num + '';
                    while (formattedNum.length < digits) {
                        formattedNum = '0' + formattedNum;
                    }
                    return formattedNum;
                }
                return NaN + '';
            },
            toSecond: function (time) {
                if (time) {
                    return time.split(':').reduce((acc, time) => (60 * acc) + +time);
                }
                return 0;
            },
        }
    }();

    var Message = function () {
        return {
            postToVid: function (parent, message, targetOrigin) {
                if (null === targetOrigin || undefined === targetOrigin) {
                    targetOrigin = "*";
                }
                parent.postMessage(JSON.stringify(message), targetOrigin);
            }
        };
    }();

    var Dom = function () {
        var isInstance = function (obj) {
            return [Element, XMLDocument, HTMLDocument].some(function (item) {
                return obj instanceof item
            });
        };
        var a = ["svg", "circle", "polygon"],
            d = function (a, b) {
                a.contentWindow ? a.contentWindow.document.body.appendChild(b) : a.addEventListener("load", function () {
                    a.contentWindow.document.body.appendChild(b)
                }, !1)
            },
            b = function (a) {
                a.addEventListener("load", function () {
                    var b = a.contentWindow.document.body.style;
                    b.margin = 0;
                    b.width = a.style.width;
                    b.height = a.style.height;
                    b.border = a.style.border
                }, !1)
            },
            c = function (a) {
                return !/%$/.test(a) && /\d+/.test(a) && parseFloat(/\d+/.exec(a)[0])
            },
            f = function (a) {
                return [Element, XMLDocument, HTMLDocument].some(function (b) {
                    return a instanceof
                    b
                })
            };
        return {
            parseXML: function (str) {
                var xml;
                try {
                    if ("string" === typeof str) {
                        xml = (new DOMParser).parseFromString(str, "text/xml");
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    return xml;
                }
            },
            get: function (selector, dom) {
                return Common.toArray((isInstance(dom) ? dom : document).querySelectorAll(selector));
            },
            getOne: function (selector, dom) {
                return (isInstance(dom) ? dom : document).querySelector(selector);
            },
            getText: function (element) {
                return element ? Common.toArray(element.childNodes).map(function (e) {
                    return e.textContent.trim()
                }).join("") : ""
            },
            getCData: function (element) {
                if (element) {
                    return Common.toArray(element.childNodes).filter(function (element) {
                        return "#cdata-section" === element.nodeName;
                    }).map(function (element) {
                        return element.textContent.trim();
                    })[0];
                }
            },
            getData: function (element) {
                var cdata = Dom.getCData(element);
                element = Dom.getText(element);
                return cdata || element || ""
            },
            getAttribute: function (name, element) {
                try {
                    return element.getAttribute(name) || element[name] | "";
                } catch (error) {

                }
                return "";
            },
            getAttributes: function (element) {
                return element ? Common.toArray(element.attributes).reduce(function (a,
                    b) {
                    return a[b.name] = b.nodeValue, a
                }, {}) : {}
            },
            getName: function (element) {
                return element.tagName.toLowerCase();
            },
            getParent: function (element) {
                return element.parentElement || element.parentNode
            },
            getParentUntil: function (name, element) {
                for (var c = this.getParent(element); this.getParent(c) && c.tagName.toLowerCase() !== name.toLowerCase();) {
                    c = this.getParent(c);
                }
                return c;
            },
            serializeXMLNode: function (dom) {
                var text;
                try {
                    text = (new XMLSerializer).serializeToString(dom);
                } catch (err) {
                    console.error(err)
                } finally {
                    return text;
                }
            },
            getScript: function (src) {
                var script = document.createElement("script");
                script.setAttribute("type", "text/javascript");
                script.setAttribute("src", src);
                script.setAttribute("async", !1);
                document.body.appendChild(script);
                return new Promise(function (resolve, reject) {
                    script.addEventListener("load", resolve);
                    script.addEventListener("error", reject);
                })
            },
            getFullUrl: function (dom) {
                var url = null;
                var url_tmp = null;
                Array.prototype.slice.call(dom.getElementsByTagName("script")).forEach(function (script) {
                    if (null === url_tmp && 0 <= script.src.indexOf(auth)) {
                        url_tmp = script.src
                    }
                });
                url = url_tmp;
                return url;
            },
            getQueryString: function (dom) {
                try {
                    var fullUrl = Dom.getFullUrl(dom);
                    if (fullUrl) {
                        var query = fullUrl.split("?");
                        query.splice(0, 1);
                        var queryString = "?" + query.join("?");
                        return queryString;
                    }
                } catch (e) {
                    console.error(e);
                }
                return "";
            },
            getQueryParamByName: function (name, url) {
                var queryString = this.getQueryString(document);
                if (url) {
                    var rs = queryString.split(a + "=");
                    if (1 < rs.length) {
                        return rs.splice(0, 1), decodeURIComponent(rs.join(name + "="));
                    }
                }
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var reg = RegExp("[\\?&]" + name + "=([^&#]*)");
                queryString = reg.exec(queryString);
                null !== queryString || this.isXDomain() || (queryString = red.exec(window.getWindow().top.location.search));
                return null === queryString ? "" : decodeURIComponent(queryString[1].replace(/\+/g, " "))
            },
            isXDomain: function () {
                var check = null;
                try {
                    check = "string" !== typeof window.getTop().location.search;
                } catch (err) {
                    check = !0
                }
                return check;
            },
            checkNumber: function (a) {
                return !/%$/.test(a) && /\d+/.test(a) && parseFloat(/\d+/.exec(a)[0]);
            },
            toPx: function (a) {
                return (a = Dom.checkNumber(a)) && a + "px";
            },
            create: function (c, d, f) {
                Common.isDOMElement(c) || (f = f || document, c = -1 !== a.indexOf(c) ? f.createElementNS("http://www.w3.org/2000/svg", c) : f.createElement(c));
                d && Dom.setProperties(c, d);
                "iframe" === c.nodeName.toLowerCase() && b(c);
                return c
            },
            setProperties: function (a, b) {
                Object.keys(b).forEach(function (c) {
                    Dom.setProperty(a, c, b[c])
                }.bind(this))
            },
            setProperty: function (a, b, c) {
                b.split(".").reduce(function (a, b, d, e) {
                    if (d === e.length - 1) Common.isFunction(a.setAttribute) ? a.setAttribute(b, c) : a[b] = c;
                    else return a[b]
                }, a)
            },
            getNodeAndDo: function (a, b) {
                var c;
                a instanceof v ? c = a.element : Common.isDOMElement(a) && (c = a);
                if (c) return b(c)
            },
            appendChild: function (a, b) {
                Common.isDOMElement(a) && Common.isDOMElement(b) && ("iframe" === a.nodeName.toLowerCase() ? d(a, b) : a.appendChild(b))
            },
            createIframe: function (parent, url, zIndex) {
                var nEl = document.createElement("iframe");
                nEl.src = url || "about:blank";
                nEl.marginWidth = "0";
                nEl.marginHeight = "0";
                nEl.frameBorder = "0";
                nEl.width = "100%";
                nEl.height = "100%";
                Dom.setFullSizeStyle(nEl);

                if (zIndex) {
                    nEl.style.zIndex = zIndex;
                }

                nEl.setAttribute("SCROLLING", "NO");
                nEl.setAttribute("allow", "autoplay");
                parent.innerHTML = "";
                parent.appendChild(nEl);
                return nEl;
            },
            setFullSizeStyle: function (element) {
                element.style.position = "absolute";
                element.style.left = "0";
                element.style.top = "0";
                element.style.margin = "0px";
                element.style.padding = "0px";
                element.style.border = "none";
                element.style.width = "100%";
                element.style.height = "100%";
            },
            setIframeContent: function (iframeEl, content) {
                var iframeDoc = iframeEl.contentWindow && iframeEl.contentWindow.document;
                if (!iframeDoc) return false;
                iframeDoc.open();
                iframeDoc.write(content);
                iframeDoc.close();
                return true;
            },
            addEventListener: function (dom, event, func, useCapture) {
                useCapture = useCapture ? useCapture : false;
                if ("addEventListener" in dom) {
                    dom.addEventListener(event, func, useCapture);
                } else if ("attachEvent" in obj) { //IE
                    dom.attachEvent("on" + event, func);
                }
            },
            removeEventListener: function (dom, event, func, useCapture) {
                if (dom.removeEventListener) {
                    dom.removeEventListener(event, func, false);
                } else if (dom.detachEvent) {
                    dom.detachEvent("on" + event, func);
                }
            },
            getImg: function (src) {
                var img = new Image;
                img.src = src;
                return new Promise(function (resolve,
                    reject) {
                    img.addEventListener("load", resolve);
                    img.addEventListener("error", reject)
                })
            },
            hasClass: function (className, dom) {
                return (" " + dom.className + " ").indexOf(" " + className + " ") > -1;
            },
            addClass: function (className, dom) {
                dom.className += " " + className;
            }
        }
    }();

    var MediaFile = function (media) {
        var check = !arguments.length;
        check || Object.keys(media).forEach(function (item) {
            this[item] = media[item]
        }.bind(this));
        this.isEmpty = function () {
            return check;
        };
        this.getWidth = function () {
            return parseInt(this.width) || 0
        };
        this.getHeight = function () {
            return parseInt(this.height) || 0
        };
        this.getAspectRatio = function () {
            var ratio = this.getWidth() / this.getHeight();
            return !isNaN(ratio) && isFinite(ratio) ? ratio : 0
        };
        this.getBitrate = function () {
            return parseInt(this.bitrate) || parseInt(this.maxBitrate) || 0
        };
        this.getUrl = function () {
            return this.url
        };
        this.isProgressive = function () {
            return "progressive" === this.delivery
        };
        this.isMP4 = function () {
            return "video/mp4" === this.type
        };
        this.isVPAID = function () {
            return "VPAID" === this.apiFramework && ("application/javascript" === this.type || "application/x-javascript" === this.type)
        };
        this.isInvalid = function () {
            return [/^rtmp/i].some(function (item) {
                return item.test(this.url)
            }.bind(this))
        };
        this.getDuration = function () {
            return this.duration ||
                0
        };
        this.getSkipoffset = function () {
            return this.skipoffset || 0
        }
    }

    var ka = function () {
        this.vpaid = new A;
        this.mp4 = new A;
        this.other = new A;
        this.bucket = function (a) {
            this.mp4.push(a)
            a.isInvalid() || (a.isVPAID() ? this.vpaid.push(a) : a.isMP4() ? this.mp4.push(a) : this.other.push(a));
            return this
        }.bind(this);
        this.selectOptimum = function (a, d, b) {
            return this.vpaid.length ? this.vpaid.selectOptimum.apply(this.vpaid,
                arguments) : this.mp4.length ? this.mp4.selectOptimum.apply(this.mp4, arguments) : this.other.selectOptimum.apply(this.other, arguments)
        }.bind(this)
    };

    var A = function (a) {
        arguments.length && a.forEach(function (a) {
            this.push(a)
        }.bind(this));
        var d = function (a, b, c) {
                b = Math.abs(a - b.getAspectRatio());
                a = Math.abs(a - c.getAspectRatio());
                return b >= a ? 1 : -1
            },
            b = function (a, b, c) {
                b = Math.abs(a - b.getWidth());
                a = Math.abs(a - c.getWidth());
                return b >= a ? 1 : -1
            },
            c = function (a, b, c) {
                b = Math.abs(a - b.getBitrate());
                a = Math.abs(a - c.getBitrate());
                return b >= a ? 1 : -1
            };
        this.selectByBitrate = function (a) {
            a = ~a ? a : 0;
            var b = this.sort(c.bind(null,
                a));
            return a ? b[0] : b.slice(-1)[0]
        };
        this.widthSort = function (a) {
            this.sort(b.bind(null, a || screen.width));
            a = this.filter(function (a, b, c) {
                return a.getWidth() === c[0].getWidth()
            });
            return new A(a)
        };
        this.aspectRatioSort = function (a) {
            this.sort(d.bind(null, a));
            a = this.filter(function (a, b, c) {
                return a.getAspectRatio() === c[0].getAspectRatio()
            });
            return new A(a)
        };
        this.selectOptimum = function (a, b, c) {
            return this.aspectRatioSort(a / b).widthSort(a).selectByBitrate(c) || new MediaFile
        }
    };
    A.prototype = [];

    var v = function (a, d) {
        this.element = Dom.create(a, d);
        this.parent = void 0;
        this.children = [];
        this.remove = function () {
            this.parent instanceof v && this.parent.children.splice(this.parent.children.indexOf(this), 1);
            this.parent = void 0;
            this.children.forEach(function (a) {
                a.remove()
            });
            k.remove(this.element);
            return this
        };
        this.appendChild =
            function (a) {
                if (a instanceof v) return this.children.push(a), k.appendChild(this.element, a.element), a.parent = this, this
            };
        this.appendTo = function (a) {
            Dom.getNodeAndDo(a, function (c) {
                Dom.appendChild(c, this.element);
                this.parent = a;
                a instanceof v && a.children.push(this);
                return this
            }.bind(this))
        };
        this.updateProps = function (a) {
            k.setProperties(this.element, a);
            return this
        };
        this.updateProp = function (a, c) {
            k.setProperty(this.element, a, c);
            return this
        };
        this.getName = function () {
            return k.getName(this.element)
        };
        this.attr = function (a) {
            return k.getAttribute(this.element,
                a)
        };
        this.is = function (a) {
            return this.getName() === a
        };
        this.getWindow = function (a) {
            a = a || this;
            return void 0 === a.parent ? r.getWindow(a.element) : "iframe" === a.getName() ? a.element.contentWindow : this.getWindow(a.parent)
        };
        this.getDocument = function () {
            return this.element.ownerDocument
        };
        this.addEventListener = this.element.addEventListener.bind(this.element);
        this.removeEventListener = this.element.removeEventListener.bind(this.element);
        this.dispatchEvent = this.element.dispatchEvent.bind(this.element)
    };

    var VastTree = function (doc, width, height, desiredBitrate) {
        return {
            trackingEvents: function (doc) {
                return Dom.get("Impression, Tracking, ClickTracking", doc).map(function (item) {
                    return {
                        event: Dom.getAttribute("event", item) || Dom.getName(item).toLowerCase().split(/-|_/g).join(""),
                        url: Dom.getData(item)
                    }
                }).reduce(function (trackingEvents, item) {
                    if (trackingEvents[item.event]) {
                        trackingEvents[item.event].push(item.url)
                    } else {
                        trackingEvents[item.event] = [item.url]
                    }
                    return trackingEvents;
                }, {});
            }(doc),
            mediaFile: function (doc) {
                return Dom.get("MediaFile", doc).map(function (item) {
                    var media = Dom.getAttributes(item);
                    media.url = Dom.getData(item);
                    var until = Dom.getParentUntil("Linear", item);
                    item = Dom.getAttributes(until);
                    until = Dom.getOne("Duration", until);
                    item.duration = until ? Dom.getText(until) : void 0;
                    media = Common.mergeObjects(media, item);
                    return new MediaFile(media);
                }).reduce(function (a, b) {
                    return a.bucket(b)
                }, new ka).selectOptimum(width, height, desiredBitrate);
            }(doc),
            companionAds: function (doc) {
                return (doc = Dom.get("CompanionAds", doc)) && doc.length ? Dom.serializeXMLNode(doc[0]) : ""
            }(doc),
            creativeData: {
                AdParameters: Dom.getData(Dom.getOne("AdParameters", doc))
            },
            //errorUrl: Dom.getData(Dom.getOne("Error", doc)),
            errorUrl: function (doc) {
                return Dom.get("Error", doc).map(function (item) {
                    return Dom.getData(item);
                }).reduce(function (errorUrl, url) {
                    Common.toArray(errorUrl);
                    if (errorUrl) {
                        errorUrl.push(url)
                    }
                    return errorUrl;
                }, []);
                //return (doc = Dom.get("CompanionAds", doc)) && doc.length ? Dom.serializeXMLNode(a[0]) : ""
            }(doc),
            clickThroughUrl: Dom.getData(Dom.getOne("ClickThrough", doc)),
            progressOffsets: function (doc) {
                return Dom.get('Tracking[event="progress"]', doc).reduce(function (obj, item) {
                    var attribute = Dom.getAttribute(item, "offset"),
                        data = Dom.getData(item);
                    attribute && (obj[attribute] = data);
                    return obj;
                }, {})
            }(doc),
            version: function (doc) {
                var version;
                (doc = Dom.getOne("VAST", doc)) && (version = doc.getAttribute("version"));
                return version
            }(doc)
        }
    };

    var XML = function () {
        var _width, _height, _desiredBitrate;
        return {
            getXml: function (width, height, desiredBitrate, creativeData, fallback) {
                _width = width;
                _height = height;
                _desiredBitrate = desiredBitrate;
                if (creativeData && creativeData.AdParameters) {
                    return new Promise(function (resolve, reject) {
                        if ("string" === typeof creativeData.AdParameters) {
                            return resolve(creativeData.AdParameters);
                        } else {
                            return reject("AdParameters Error");
                        }
                    });
                } else {
                    return Http.get(fallback);
                }
            },
            mergeXml: function (vastTree, item) {
                Object.keys(item).forEach(function (i) {
                    switch (i) {
                        case "trackingEvents":
                            vastTree[i] = Common.mergeObjects(vastTree[i], item[i]);
                            break;
                        case "creativeData":
                            item[i].AdParameters && (vastTree[i].AdParameters = item[i].AdParameters);
                            break;
                        case "mediaFile":
                            Common.isEmpty(item[i]) || (vastTree[i] = item[i]);
                            break;
                        case "progressOffsets":
                            vastTree[i] = Common.mergeObjects(vastTree[i], item[i]);
                            break;
                        case "errorUrl":
                            vastTree[i] = vastTree[i].concat(item[i]);
                            break;
                        default:
                            item[i] && (vastTree[i] = item[i])
                    }
                });
                return vastTree;
            },
            getXmlDoc: function (resolve, reject, xml, str) {
                var xmlDoc = Dom.parseXML(str);
                xml.push(xmlDoc);
                var vastTag = Dom.getOne("VASTAdTagURI", xmlDoc);
                if (vastTag) {
                    return XML.getXml(_width, _height, _desiredBitrate, null, Dom.getData(vastTag)).then(XML.getXmlDoc.bind(this, resolve, reject, xml));
                } else {
                    return resolve(xml);
                }
            },
            provideXml: function (str) {
                var xmlDoc = [];
                return (new Promise(function (resolve, reject) {
                    XML.getXmlDoc(resolve, reject, xmlDoc, str);
                })).then(function (val) {
                    return val.map(function (doc) {
                        return new VastTree(doc, _width, _height, _desiredBitrate);
                    }).reduce(XML.mergeXml, new VastTree);
                })
            }
        }
    }();

    var loadScript = function (dom, src, callback) {
        var s, r, t;
        r = false;
        s = dom.createElement('script');
        s.type = 'text/javascript';
        s.src = src;
        s.onload = s.onreadystatechange = function () {
            if (!r && (!this.readyState || this.readyState == 'complete')) {
                r = true;
                if (typeof callback == 'function') callback();
            }
        };
        t = dom.getElementsByTagName('script')[0];
        t.parentNode.insertBefore(s, t);
    }

    window.getVPAIDAd = function () {
        return new VPAIDAdUnit();
    };
})();