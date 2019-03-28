// HadarOne VPAID 2.0 with Header Bidding
(function () {
    var auth = "hadarone-vpaid.js";
    var yoVideoId = Math.floor(1E5 * Math.random());

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

        this.handshakeVersion = function (version) {
            return "2.0";
        };

        this.loadScript = function (src, callback) {
            var s, r, t;
            r = false;
            s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = src;
            s.onload = s.onreadystatechange = function () {
                if (!r && (!this.readyState || this.readyState == 'complete')) {
                    r = true;
                    if (typeof callback == 'function') callback();
                }
            };
            t = document.getElementsByTagName('script')[0];
            t.parentNode.insertBefore(s, t);
        }

        this.initAd = function (width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
            console.log('VPAIDAdUnit', creativeData);
            var gmwid = Dom.getQueryParamByName("gmwid");
            var gmzid = Dom.getQueryParamByName("gmzid");
            var hdpmid = Dom.getQueryParamByName("hdpmid");
            var fbUrl = Dom.getQueryParamByName("fb");
            fbUrl = (fbUrl || 'https://d4.hadarone.com/vast3?plm=888').trim();;
            var debugMode = Dom.getQueryParamByName("db") == '1';

            if (debugMode) {
                console.log("gmwid:" + gmwid, "gmzid:" + gmzid, "hdpmid:" + hdpmid)
                console.log(width, height, viewMode, desiredBitrate, creativeData.AdParameters, environmentVars);
            }

            var thisAd = this;
            var doInitAd = function (crtData, adURL) {
                thisAd._width = width;
                thisAd._height = height;
                thisAd._viewMode = viewMode;
                thisAd._desiredBitrate = desiredBitrate;
                thisAd._creativeData = crtData;
                thisAd._environmentVars = environmentVars;
                thisAd._slot = environmentVars.slot;
                thisAd._videoSlot = environmentVars.videoSlot;
            
                thisAd.initializeAd(width, height, viewMode, desiredBitrate, crtData, environmentVars, adURL);
            }
            environmentVars.slot.innerHTML += "<h1 style='color:red;'>aaa</h1>";

            // HadarOne: Header Bidding processing
            if (creativeData.AdParameters.indexOf('HeaderBidding') > 0) {
                var jsUrl = 'https://static.hadarone.com/ajs/vpaid/hadarone-prebid-utils.js';
                this.loadScript(jsUrl, function () {
                    var pbjs = pbjs || {};
                    pbjs.que = pbjs.que || [];
                    pbjs.que.push(new handlerHeaderBidding(gmwid, gmzid, hdpmid, function (vastUrl) {

                        if (vastUrl) {
                            vastUrl = vastUrl.trim();
                            var bidCrtData = creativeData;
                            bidCrtData.AdParameters = bidCrtData.AdParameters.replace('$$VAST_URL$$', vastUrl)
                            doInitAd(bidCrtData, vastUrl);
                        } else {
                            console.log("No ads");
                            vastUrl = fbUrl;
                            creativeData.AdParameters = creativeData.AdParameters.replace('$$VAST_URL$$', vastUrl)
                            doInitAd(creativeData, vastUrl);

                        }
                        if (debugMode) {
                            console.log('HeaderBidding, win vastUrl ' + vastUrl);
                        }

                    }));
                })
            } else {
                doInitAd(creativeData, fbUrl);
            }
        };

        this.resizeAd = function (width, height, viewMode) {
            console.log('resizeAd');
        };

        this.startAd = function () {
            console.log('startAd');
        };

        this.stopAd = function () {
            console.log('stopAd');
        };

        this.pauseAd = function () {
            console.log('pauseAd');
        };

        this.resumeAd = function () {
            console.log('resumeAd');
        };

        this.expandAd = function () {
            console.log('expandAd');
        };

        this.collapseAd = function () {
            console.log('collapseAd');
        };

        this.skipAd = function () {
            console.log('skipAd');
        };

        this.subscribe = function (aCallback, eventName, aContext) {
            console.log('subscribe '+eventName, aCallback, aContext );
            var callBack = aCallback.bind(aContext);
            this.eventsCallbacks[eventName] = callBack;
        };

        this.unsubscribe = function (eventName) {
            console.log('unsubscribe');
            this.eventsCallbacks[eventName] = null;
        };

        this.getAdLinear = function () {
            console.log('getAdLinear');
        };

        this.getAdWidth = function () {
            console.log('getAdWidth');
        };

        this.getAdHeight = function () {
            console.log('getAdHeight');
        };

        this.getAdExpanded = function () {
            console.log('getAdExpanded');
        };

        this.getAdSkippableState = function () {
            console.log('getAdSkippableState');
        };

        this._AdRemainingTime = 15;
        this.getAdRemainingTime = function () {
            console.log('getAdRemainingTime ' + _AdRemainingTime);
            return _AdRemainingTime;
        };

        this.getAdDuration = function () {
            console.log('getAdDuration');
            return 15;
        };

        this.getAdVolume = function () {
            console.log('getAdVolume');
        };

        this.getAdCompanions = function () {
            console.log('getAdCompanions');
        };

        this.getAdIcons = function () {
            console.log('getAdIcons');
        };

        this.getAdLinear = function () {
            console.log('getAdLinear');
        };

        this.setAdLinear = function (val) {
            console.log('setAdLinear');
        };

        this.setAdWidth = function (val) {
            console.log('setAdWidth');
        };

        this.setAdHeight = function (val) {
            console.log('resizeAd');
        };

        this.setAdExpanded = function (val) {
            console.log('setAdExpanded');
        };

        this.setAdSkippableState = function (val) {
        };

        this.setAdRemainingTime = function (val) {
        };

        this.setAdDuration = function (val) {
        };

        this.setAdVolume = function (val) {
        };

        this.setAdCompanions = function (val) {
        };

        this.setAdIcons = function (val) {
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
        };

        this.onAdExpandedChange = function () {
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
             //   this._ad.subscribe(callbacks[eventName], eventName, this);
            }
        };

        this.getUrlTracking = function (event) {
            var urls = [];
            this._vastTree.trackingEvents = this._vastTree.trackingEvents || {};
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
                    urls = this._vastTree.errorUrl;
                    break;
            }
            return urls;
        }

        this.loadTracking = function (urls) {
            urls.map(function (url) {
                Dom.getImg(url).then(function (s) {}, function (e) {});
            });
        };

        this.isEmptyVast = function () {
            if (this._vastTree.mediaFile.isEmpty()) {
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

            console.log("getAdBackup VAST Ad Unit")
        }

        //HadarOne: init ad with vast-player
        this.initializeAd = function (width, height, viewMode, desiredBitrate, creativeData, environmentVars, adURL) {
            var _this = this;

            //clear out body for ad player
            var adContainer = environmentVars.slot;
            while (adContainer.firstChild) {
                adContainer.removeChild(adContainer.firstChild);
            }

            adContainer.innerHTML += `
                <style>
                .preroll-skip-button{
                    display: block;
                    position: absolute;
                    top: 12px;
                    right: 0;
                    width: auto;
                    background-color: rgba(0, 0, 0, .5);
                    color: #FFF;
                    font-size: 14px;
                    font-style: italic;
                    line-height: 12px;
                    padding: 15px;
                    z-index: 2;
                    border: 2px solid rgba(255, 255, 255, .35);
                    border-right: none;
                    cursor: pointer;
                 }
                .preroll-skip-button.enabled {
                    cursor: pointer;
                    color: #fff;
                }
                .preroll-skip-button.enabled:hover {
                    cursor: pointer;
                    background: #333;
                }
                </style>
            `;

            _this.loadScript('https://vast.hadarone.com/js/vast-player.js', function () {
                //TODO skip
                var skipAfter = 4;
                var skipButtonLabel = "Tắt quảng cáo";
                var skipButton = document.createElement("div");
                skipButton.className = "preroll-skip-button";

                function showSkipButton(adPlayer) {
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
                }

                function updateRemainingTime(counter) {
                    skipButton.innerHTML = " " + counter + "s";
                }

                var adPlayer = new VASTPlayer(adContainer);
                adPlayer.once('AdStopped', function () {
                    _this.onAdLoaded();
                });
                adPlayer.once('AdSkipped', function () {
                    _this.onSkipAd();
                });
                adPlayer.once('AdClickThru', function () {
                    _this.onAdClickThru();
                });

                adPlayer.load(
                    adURL
                ).then(function startAd() {
                    _this.onStartAd();

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
                        showSkipButton(adPlayer);
                    }, 1000 * skipAfter);

                    return adPlayer.startAd();
                }).catch(function (reason) {
                    _this.eventsCallbacks["AdLoaded"]();
                    console.log(reason)
                });
            });

            console.log("initializeAd VAST Ad Unit", this._videoSlot)
        }
    }

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
                    // console.log(element)
                    return element.getAttribute(name) || element[name] | "";
                } catch (error) {
                    console.log(error)
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
                var query = Dom.getFullUrl(dom).split("?");
                query.splice(0, 1);
                var queryString = "?" + query.join("?");
                return queryString;
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
                nEl.setAttribute('id', 'vpaidIframe_1');
                Dom.setFullSizeStyle(nEl);

                if (zIndex) {
                    nEl.style.zIndex = zIndex;
                }

                nEl.setAttribute("SCROLLING", "NO");
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
                iframeDoc.open('text/htmlreplace');
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

    window.getVPAIDAd = function () {
        return new VPAIDAdUnit();
    };
})();