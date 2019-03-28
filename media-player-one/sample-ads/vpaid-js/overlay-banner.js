//Inlude AdludioLib: contains cross adunit functionality

var AdludioLib = (function () {

    "use strict";

    return function (window) {

        var adludiocss = "https://wat.adludio.com/template-css/adludio.css";

        /**
         * Reference to global window.
         * @name LIB-window
         */
        var
            /**
             * Local reference to {@link LIB}
             * @name LIB-LIB
             */
            LIB = {},
            document = window.document;
        /**
         * library version
         * @name LIB.version
         * @type Float
         */
        LIB.version = "0.1.0";

        /**
         * Reference to lib window.
         * @name LIB.win
         */
        LIB.win = window;

        /**
         * Reference to document of lib window.
         * @name LIB.doc
         */
        LIB.doc = document;

        // LIB.clickEvent = (('ontouchstart' in LIB.win) || (LIB.win.DocumentTouch && LIB.doc instanceof DocumentTouch)) ? 'touchstart' : 'click',

        /*
         * Is property a string?
         */
        LIB.isString = function (property) {
            return typeof property === 'string' || property instanceof String;
        };
        LIB.isArray = function (arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };


        LIB.whichTransitionEvent = function () {
            var t;
            var el = document.createElement('fakeelement');
            var transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            }

            for (t in transitions) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        };
        /**
         * Returns unique identifier.
         * @name LIB.str.unique
         * @requires -
         * @function
         * @param {Function(id):{Boolean}} callback must return true, iff given id is unique
         * @return {String} unique identifier
         */
        LIB.unique = (function () {
            var
                nextId = 0;

            return function (callback) {
                var
                    id;

                do {
                    id = 'ADLUDIO_' + nextId;
                    nextId += 1;
                } while (!callback(id));

                return id;
            };
        }());
        /* jsonp.js, (c) Przemek Sobstel 2012, License: MIT */
        LIB.jsonp = (function () {
            var that = {};

            that.send = function (src, options) {
                var options = options || {},
                    callback_name = options.callbackName || 'callback',
                    on_success = options.onSuccess || function () {},
                    on_timeout = options.onTimeout || function () {},
                    timeout = options.timeout || 10;

                var timeout_trigger = window.setTimeout(function () {
                    window[callback_name] = function () {};
                    on_timeout();
                }, timeout * 1000);

                window[callback_name] = function (data) {
                    window.clearTimeout(timeout_trigger);
                    on_success(data);
                };

                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = true;
                script.src = src;

                document.getElementsByTagName('head')[0].appendChild(script);
            };

            return that;
        })();

        LIB.handleEmptyImpression = function (adUnitInfo, requestParams) {
            LIB.console("EMPTY REQUEST!");
            LIB.console("PRIVATE STATE", requestParams);
            requestParams.onBackfill();
        };
        LIB.renderExternalAdunit = function (adUnitInfo, requestParams) {
            LIB.console("RENDER EXTERNAL", adUnitInfo);
            LIB.console("PRIVATE STATE", requestParams);
            var wrapper,
                id = 'w' + Math.floor(1E10 * Math.random());

            wrapper = LIB.createElem('div', {
                id: id
            });
            wrapper.innerHTML = adUnitInfo.code;
            if (requestParams.isRecaptcha) {
                //When a known recaptcha element is in page
                requestParams.anchorElem.parentNode.insertBefore(wrapper, requestParams.anchorElem);
            } else if (requestParams.anchorElem) {
                requestParams.anchorElem.appendChild(wrapper);
            } else {
                document.body.appendChild(wrapper);
            }
            //Pass info to the real adunit ...
            requestParams.parentContainerId = id;
            window.realPublisherInfo = adUnitInfo;
            window.adludioParams = requestParams;
        };
        LIB.renderPlayUnlock = function (adUnitInfo, requestParams) {
            LIB.console("RENDERING UNLOCK", adUnitInfo);
            LIB.console("PRIVATE STATE", requestParams);
            var
                wrapper, style, defaultStyle,
                id = 'w' + Math.floor(1E10 * Math.random());
            defaultStyle = {
                css: "#[$id]>iframe{width:100%;height:100%;border:0;position:fixed;top:0;left:0;z-index:2147483647;}"
            };
            wrapper = LIB.createElem('div', {
                id: id
            });
            style = LIB.createElem('style', {
                type: 'text/css'
            });
            LIB.updateStyle(defaultStyle, id, style);
            wrapper.appendChild(style);
            document.body.appendChild(wrapper);

            var frameSrc = "https://wat.adludio.com/frame/playunlock/" + adUnitInfo.language + "/v1/frame.png";
            LIB.renderSafeFrame(wrapper, {
                adunitCss: adludiocss,
                adunitTpl: '<div class="interstitial" id="adunit-container">' +
                    '<div class="frameTC">' +
                    '<div class="content" id="game-container">' +
                    '<img id="count-down-text" src="https://wat.adludio.com/frame/skip-countdown/skip-ad-count-text.png" />' +
                    '<img id="count-down" />' +
                    '<img id="topframe" src="' + frameSrc + '" alt="Unlock Interstitial Ad">' +
                    '<div id="skipbutton"></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                onload: function (iframeWindow, iframeDocument, iframe) {
                    var adunitJs = document.createElement('script');
                    adunitJs.type = 'text/javascript';
                    adunitJs.src = 'https://wat.adludio.com/games/' + adUnitInfo.key + '/' + adUnitInfo.latestVersion + '/game.js';

                    LIB.onload(adunitJs, function () {
                        /**
                         * StopWatch instance
                         */
                        var dwellTimer = new LIB.Stopwatch();
                        var interactionTimer = new LIB.Stopwatch();

                        var adunitContainer = iframeDocument.getElementById("adunit-container");
                        var topframe = iframeDocument.getElementById("topframe");
                        var skipButton = iframeDocument.getElementById("skipbutton");
                        var countDownText = iframeDocument.getElementById("count-down-text");
                        var countDown = iframeDocument.getElementById("count-down");
                        var canvasContainer = iframeDocument.getElementById("game-container");

                        var maxWidth = window.innerWidth > 1024 ? 1024 : window.innerWidth;
                        var maxHeight = window.innerHeight;
                        var topframeHeight = 0;

                        if (adUnitInfo.deviceType === "mobile") {
                            skipButton.className = "mobile";
                        } else {
                            // tablet and desktop
                            skipButton.className = "desktop";
                            topframeHeight = 38 * maxWidth / 591;
                            maxHeight = maxHeight - topframeHeight;
                        }

                        function closeAdunit(reason) {
                            adunitContainer.style.opacity = 0;
                            var transitionEnd = LIB.whichTransitionEvent();
                            adunitContainer.addEventListener(transitionEnd, function () {
                                wrapper.parentNode.removeChild(wrapper);
                                if (reason === "timeout") {
                                    requestParams.onClose();
                                } else if (reason === "skipad") {
                                    requestParams.onClose();
                                } else {
                                    requestParams.onComplete();
                                }
                            }, false);
                        }

                        var timers = LIB.initTimers(adUnitInfo, topframe, skipButton, {
                            closeAdunit: closeAdunit
                        });

                        var geneticString = (adUnitInfo && adUnitInfo.configuration && adUnitInfo.configuration.genetic_string) ? adUnitInfo.configuration.genetic_string : "";

                        if (iframeWindow.PlayUnlock.configure) {
                            /**
                              autoengage = !!opts.autoengage || false;
                              autoengageAfter = !!opts.autoengageAfter || 8000;
                              fullscreencta = !!opts.fullscreencta || false;
                            */
                            iframeWindow.PlayUnlock.configure(adUnitInfo.configuration);
                        }

                        iframeWindow.PlayUnlock.create(canvasContainer, maxWidth, maxHeight, function (physicalTarget) {
                            // LIB.console(physicalTarget);
                            physicalTarget.height = physicalTarget.height || physicalTarget.y;
                            physicalTarget.width = physicalTarget.width || physicalTarget.x;
                            // RESET WIDTH AND HEIGHT!
                            canvasContainer.style.height = (physicalTarget.height + topframeHeight) + "px";
                            canvasContainer.style.width = physicalTarget.width + "px";

                            if (adUnitInfo.deviceType !== "mobile") {
                                // tablet and desktop
                                topframe.style.display = "block";
                            }

                            // ADUNIT EFFECT!!!
                            adunitContainer.style.opacity = 1;

                            // HANDLE COMMON ACTIONS
                            LIB.onCreatePlayunlock(adUnitInfo, requestParams.onImpression, timers, iframeDocument, topframeHeight);
                            // start dwell timer
                            dwellTimer.start();
                        }, geneticString);

                        var started = false;
                        iframeWindow.PlayUnlock.attach('onDrop', function (data) {
                            if (!started) {
                                //Only on first drop report a started event
                                adUnitInfo.type = "started";
                                LIB.track(adUnitInfo, data);
                                started = true;
                                interactionTimer.start();
                            }
                            //Every time report a dropped event
                            adUnitInfo.type = "dropped";
                            LIB.track(adUnitInfo, data);

                            //Delete AUTO close timeout
                            timers.timeOut.stop();
                        });

                        iframeWindow.PlayUnlock.attach('onComplete', function () {
                            // track event completed
                            adUnitInfo.type = "completed";
                            LIB.track(adUnitInfo);
                            // track interaction time
                            adUnitInfo.type = "interaction_time";
                            LIB.track(adUnitInfo, {
                                duration: interactionTimer.getElapsed()
                            });
                            // track dwell time
                            adUnitInfo.type = "dwell_time";
                            LIB.track(adUnitInfo, {
                                duration: dwellTimer.getElapsed()
                            });

                            //stop skip timer if running
                            // timers.skipAdTimer.stop();
                            //stop timeout
                            timers.timeOut.stop();
                            //CLOSE!
                            //Wait TIMEOUT_ON_COMPLETE before closing the adunit
                            var TIMEOUT_ON_COMPLETE = adUnitInfo.configuration.timeout_on_complete || 8;
                            setTimeout(closeAdunit, TIMEOUT_ON_COMPLETE * 1000);
                        });

                        iframeWindow.PlayUnlock.attach('onClickThrough', function (overrideUrl) {
                            adUnitInfo.type = "click-through";
                            // Hacky hack hack - thank the G for multiline editing though. Honestly.
                            if (!window.skipped) {
                                window.open(LIB.clickTrack(adUnitInfo, overrideUrl));
                                delete window.skipped;
                            }
                        });

                        iframeWindow.PlayUnlock.attach('onGenericEvent', function (type) {
                            if (LIB.isString(type)) {
                                adUnitInfo.type = type;
                            } else {
                                adUnitInfo.type = type.type;
                            }
                            LIB.track(adUnitInfo);
                        });

                        //WHEN VIDEO AT THE END!
                        LIB.trackVideo(iframeWindow.PlayUnlock, adUnitInfo, {
                            onVideoStart: function () {
                                timers.timeOut.stop();
                                //SHOW SKIP!
                                skipButton.style.display = "block";
                            }
                        });
                    });
                    iframeDocument.body.appendChild(adunitJs);
                }
            });
        };
        LIB.renderPlayInview = function (adUnitInfo, requestParams) {
            LIB.console("RENDERING INVIEW", adUnitInfo);
            LIB.console("PRIVATE STATE", requestParams);
            //FIRST OF ALL LOOK FOR THE SWEET SPOT IN THE PUBLISHER!
            var addRubberBanding = requestParams.hasOwnProperty('addRubberBanding') ? requestParams.addRubberBanding : true;
            var rubberBanding = null;
            var anchorClassName = requestParams.className || false;
            var anchorIdElement = requestParams.idElement || false;
            var placement = null,
                mainColumn, textLength = 0;
            var allParagraphs = [],
                rects, i, l;
            var DISPLAY_AFTER = 600;

            if (anchorClassName) {
                mainColumn = document.getElementsByClassName(anchorClassName);
                mainColumn = mainColumn[mainColumn.length - 1] || false;
            } else if (anchorIdElement) {
                mainColumn = document.getElementById(anchorIdElement);
            }

            if (mainColumn) {
                allParagraphs = mainColumn.getElementsByTagName('p');
                for (i = 0, l = allParagraphs.length; i < l; i++) {
                    textLength += allParagraphs[i].innerHTML.length;
                    LIB.console("Looking for inview spot, textLength: " + textLength, allParagraphs[i]);
                    if (textLength > DISPLAY_AFTER) {
                        placement = allParagraphs[i];
                        break;
                    }
                }
                //if the page doesn't contain enough text show intext
                //after first paragraph into main column!
                if (!placement && allParagraphs.length) {
                    placement = allParagraphs[0];
                }
            } else {
                LIB.console("The className or idElement specified was not found in the page");
                return false;
            }

            var wrapper, style, defaultStyle,
                id = 'w' + Math.floor(1E10 * Math.random());
            defaultStyle = {
                css: "#[$id] {margin:0px; padding: 0px;width:100%;height: 0px; overflow: hidden; " +
                    "-webkit-transition: height 0.8s;-moz-transition: height 0.8s;transition: height 0.8s;}" +
                    "#[$id] > iframe {width:100%;height:100%; border:0; position:relative; }" +
                    "#[$id].rubberBand ~ * { color: transparent; text-shadow: 0 0 5px rgba(0,0,0,0.5); }"
            };
            wrapper = LIB.createElem('div', {
                id: id
            });
            style = LIB.createElem('style', {
                type: 'text/css'
            });
            LIB.updateStyle(defaultStyle, id, style);
            wrapper.appendChild(style);

            if (placement) {
                LIB.console("FOUND A PLACEMENT: " + id, placement);
                placement.insertAdjacentHTML('afterend', wrapper.outerHTML);
            } else {
                //if placement not found cause there are no p inside the mainColumn or not enough text
                //place the adunit right inside the maincolumn
                LIB.console("FOUND A MAIN COLUMN: " + id, mainColumn);
                mainColumn.appendChild(wrapper);
            }
            wrapper = document.getElementById(id);

            var frameSrc = "https://wat.adludio.com/frame/inview/" + adUnitInfo.language + "/v1/frame.png";

            LIB.renderSafeFrame(wrapper, {
                adunitCss: adludiocss,
                adunitTpl: '<div class="inview" id="adunit-container">' +
                    '<div class="content" id="game-container">' +
                    '<img id="count-down-text" src="https://wat.adludio.com/frame/skip-countdown/skip-ad-count-text.png" />' +
                    '<img id="count-down" />' +
                    '<img id="topframe" src="' + frameSrc + '" alt="Inview Ad">' +
                    '<div id="skipbutton"></div>' +
                    '</div>' +
                    '</div>',
                onload: function (iframeWindow, iframeDocument, iframe) {
                    var adunitJs = document.createElement('script');
                    adunitJs.type = 'text/javascript';
                    adunitJs.src = 'https://wat.adludio.com/games/' + adUnitInfo.key + '/' + adUnitInfo.latestVersion + '/game.js';
                    LIB.onload(adunitJs, function () {
                        /**
                         * StopWatch instance
                         */
                        var dwellTimer = new LIB.Stopwatch();
                        var interactionTimer = new LIB.Stopwatch();

                        var adunitContainer = iframeDocument.getElementById("adunit-container");
                        var topframe = iframeDocument.getElementById("topframe");
                        var skipButton = iframeDocument.getElementById("skipbutton");
                        var countDownText = iframeDocument.getElementById("count-down-text");
                        var countDown = iframeDocument.getElementById("count-down");
                        var canvasContainer = iframeDocument.getElementById("game-container");
                        var maxWidth = iframeWindow.innerWidth;
                        var maxHeight = 700;
                        var topframeHeight = 38 * maxWidth / 591;

                        function closeAdunit(reason) {
                            wrapper.style.height = 0;
                            var transitionEnd = LIB.whichTransitionEvent();
                            wrapper.addEventListener(transitionEnd, function () {
                                if (addRubberBanding) {
                                    wrapper.className = "";
                                    window.removeEventListener("scroll", rubberBanding, false);
                                    window.removeEventListener("touchmove", rubberBanding, false);
                                    window.removeEventListener("resize", rubberBanding, false);
                                }
                                wrapper.parentNode.removeChild(wrapper);
                                if (reason === "timeout") {
                                    requestParams.onClose();
                                } else if (reason === "skipad") {
                                    requestParams.onClose();
                                } else {
                                    requestParams.onComplete();
                                }
                            }, false);
                        }

                        var timers = LIB.initTimers(adUnitInfo, topframe, skipButton, {
                            closeAdunit: closeAdunit
                        });

                        var geneticString = (adUnitInfo && adUnitInfo.configuration && adUnitInfo.configuration.genetic_string) ? adUnitInfo.configuration.genetic_string : "";

                        if (iframeWindow.PlayUnlock.configure) {
                            /**
                              autoengage = !!opts.autoengage || false;
                              autoengageAfter = !!opts.autoengageAfter || 8000;
                              fullscreencta = !!opts.fullscreencta || false;
                            */
                            iframeWindow.PlayUnlock.configure(adUnitInfo.configuration);
                        }

                        iframeWindow.PlayUnlock.create(canvasContainer, maxWidth, maxHeight, function (physicalTarget) {
                            // LIB.console(physicalTarget);
                            physicalTarget.height = physicalTarget.height || physicalTarget.y;
                            physicalTarget.width = physicalTarget.width || physicalTarget.x;
                            // RESET WIDTH AND HEIGHT!
                            canvasContainer.style.height = (physicalTarget.height + topframeHeight) + "px";
                            canvasContainer.style.width = physicalTarget.width + "px";

                            // ADUNIT EFFECT!!!
                            topframe.style.display = "block";
                            wrapper.style.height = (physicalTarget.height + topframeHeight) + "px";

                            // HANDLE COMMON ACTIONS
                            LIB.onCreatePlayunlock(adUnitInfo, requestParams.onImpression, timers, iframeDocument, topframeHeight);
                            // start dwell timer
                            dwellTimer.start();

                            //Delete AUTO close timeout: THIS ADUNIT DOES NOT TIMEOUT!
                            timers.timeOut.stop();

                            if (addRubberBanding) {
                                rubberBanding = LIB.initRubberBanding(wrapper, window);
                                wrapper.className = "rubberBand";
                            }
                        }, geneticString);

                        var started = false;
                        iframeWindow.PlayUnlock.attach('onDrop', function (data) {
                            if (!started) {
                                //Only on first drop report a started event
                                adUnitInfo.type = "started";
                                LIB.track(adUnitInfo, data);
                                started = true;
                                interactionTimer.start();
                            }
                            //Every time report a dropped event
                            adUnitInfo.type = "dropped";
                            LIB.track(adUnitInfo, data);

                            //Delete AUTO close timeout
                            timers.timeOut.stop();
                        });

                        iframeWindow.PlayUnlock.attach('onComplete', function () {
                            //track event completed
                            adUnitInfo.type = "completed";
                            LIB.track(adUnitInfo);
                            // track interaction time
                            adUnitInfo.type = "interaction_time";
                            LIB.track(adUnitInfo, {
                                duration: interactionTimer.getElapsed()
                            });
                            // track dwell time
                            adUnitInfo.type = "dwell_time";
                            LIB.track(adUnitInfo, {
                                duration: dwellTimer.getElapsed()
                            });
                            if (addRubberBanding) {
                                wrapper.className = "";
                                window.removeEventListener("scroll", rubberBanding, false);
                                window.removeEventListener("touchmove", rubberBanding, false);
                                window.removeEventListener("resize", rubberBanding, false);
                            }
                            //stop skip timer if running
                            // timers.skipAdTimer.stop();
                            //stop timeout
                            // timers.timeOut.stop();
                            //CLOSE!
                            // Wait TIMEOUT_ON_COMPLETE before closing the adunit
                            // var TIMEOUT_ON_COMPLETE = adUnitInfo.configuration.timeout_on_complete || 8;
                            // setTimeout(closeAdunit, TIMEOUT_ON_COMPLETE * 1000);
                        });

                        iframeWindow.PlayUnlock.attach('onClickThrough', function (overrideUrl) {
                            adUnitInfo.type = "click-through";
                            // Hacky hack hack - thank the G for multiline editing though. Honestly.
                            if (!window.skipped) {
                                window.open(LIB.clickTrack(adUnitInfo, overrideUrl));
                                delete window.skipped;
                            }
                        });

                        iframeWindow.PlayUnlock.attach('onGenericEvent', function (type) {
                            if (LIB.isString(type)) {
                                adUnitInfo.type = type;
                            } else {
                                adUnitInfo.type = type.type;
                            }
                            LIB.track(adUnitInfo);
                        });

                        //WHEN VIDEO AT THE END!
                        LIB.trackVideo(iframeWindow.PlayUnlock, adUnitInfo, {
                            onVideoStart: function () {
                                timers.timeOut.stop();
                                //SHOW SKIP!
                                skipButton.style.display = "block";
                            }
                        });
                    });
                    iframeDocument.body.appendChild(adunitJs);
                }
            });
        };
        LIB.renderPlayRoll = function (adUnitInfo, requestParams) {
            LIB.console("RENDER PLAY ROLL", adUnitInfo);
            LIB.console("PRIVATE STATE", requestParams);
            var wrapper, style, defaultStyle,
                anchorElem = requestParams.anchorElem,
                isVideoPlayer = false,
                id = 'w' + Math.floor(1E10 * Math.random());
            defaultStyle = {
                css: [
                    "#[$id] {position:absolute;width:" + anchorElem.clientWidth + "px;height:" + anchorElem.clientHeight + "px;top:0;left:0;z-index:9999;}",
                    "#[$id] > iframe {width:100%;height:100%; border:0; position:relative; }"
                ].join("")
            };

            if (anchorElem && anchorElem.load && anchorElem.play) {
                isVideoPlayer = true;
            }

            wrapper = LIB.createElem('div', {
                id: id
            });
            style = LIB.createElem('style', {
                type: 'text/css'
            });
            LIB.updateStyle(defaultStyle, id, style);
            wrapper.appendChild(style);

            var firstClick = true;
            if (requestParams.autoplay) {
                anchorElem.parentNode.insertBefore(wrapper, anchorElem.nextSibling);
            } else {
                anchorElem.addEventListener("click", function (e) {
                    if (firstClick) {
                        anchorElem.parentNode.insertBefore(wrapper, anchorElem.nextSibling);
                        if (isVideoPlayer && (navigator.userAgent.match(/iPhone/i)) ||
                            (navigator.userAgent.match(/iPad/i)) ||
                            (navigator.userAgent.match(/iPod/i)) ||
                            (navigator.userAgent.match(/Android/i))) {
                            anchorElem.load();
                        }
                        firstClick = false;
                    }
                }, false);
            }

            // if (anchorElem && isVideoPlayer) {
            //   //ASYNC WHEN videoPlayer is passed

            //   //wrapper = document.getElementById(id);
            // } else {
            //   //IF videoPlayer parent is passed!
            //   anchorElem.appendChild(wrapper);
            //   //wrapper = document.getElementById(id);
            // }

            var frameSrc = "https://wat.adludio.com/frame/playroll/" + adUnitInfo.language + "/v1/frame.png";

            LIB.renderSafeFrame(wrapper, {
                adunitCss: adludiocss,
                adunitTpl: '<div class="playroll" id="adunit-container">' +
                    '<div class="content" id="game-container">' +
                    '<img id="count-down-text" src="https://wat.adludio.com/frame/skip-countdown/skip-ad-count-text.png" />' +
                    '<img id="count-down" />' +
                    '<img id="topframe" src="' + frameSrc + '" alt="Inview Ad">' +
                    '<div id="skipbutton"></div>' +
                    '</div>' +
                    '</div>',
                onload: function (iframeWindow, iframeDocument, iframe) {
                    var adunitJs = document.createElement('script');
                    adunitJs.type = 'text/javascript';
                    adunitJs.src = 'https://wat.adludio.com/games/' + adUnitInfo.key + '/' + adUnitInfo.latestVersion + '/game.js';

                    LIB.onload(adunitJs, function () {
                        /**
                         * StopWatch instance
                         */
                        var dwellTimer = new LIB.Stopwatch();
                        var interactionTimer = new LIB.Stopwatch();

                        var adunitContainer = iframeDocument.getElementById("adunit-container");
                        var topframe = iframeDocument.getElementById("topframe");
                        var skipButton = iframeDocument.getElementById("skipbutton");
                        var countDownText = iframeDocument.getElementById("count-down-text");
                        var countDown = iframeDocument.getElementById("count-down");
                        var canvasContainer = iframeDocument.getElementById("game-container");
                        var maxWidth = iframeWindow.innerWidth;
                        var maxHeight = iframeWindow.innerHeight;
                        var topframeHeight = 48 * maxWidth / 741;
                        maxHeight = maxHeight - topframeHeight;

                        function closeAdunit(reason) {
                            adunitContainer.style.opacity = 0;
                            var transitionEnd = LIB.whichTransitionEvent();
                            adunitContainer.addEventListener(transitionEnd, function () {
                                wrapper.parentNode.removeChild(wrapper);
                                if (isVideoPlayer) {
                                    anchorElem.play();
                                }
                                if (reason === "timeout") {
                                    requestParams.onClose();
                                } else if (reason === "skipad") {
                                    requestParams.onClose();
                                } else {
                                    requestParams.onComplete();
                                }
                            }, false);
                        }

                        //FOR MUZU!
                        window.playRoll = {};
                        window.playRoll.destroy = function () {
                            closeAdunit();
                        };

                        var timers = LIB.initTimers(adUnitInfo, topframe, skipButton, {
                            closeAdunit: closeAdunit
                        });

                        var geneticString = (adUnitInfo && adUnitInfo.configuration && adUnitInfo.configuration.genetic_string) ? adUnitInfo.configuration.genetic_string : "";

                        if (iframeWindow.PlayUnlock.configure) {
                            /**
                              autoengage = !!opts.autoengage || false;
                              autoengageAfter = !!opts.autoengageAfter || 8000;
                              fullscreencta = !!opts.fullscreencta || false;
                            */
                            iframeWindow.PlayUnlock.configure(adUnitInfo.configuration);
                        }

                        iframeWindow.PlayUnlock.create(canvasContainer, maxWidth, maxHeight, function (physicalTarget) {
                            // LIB.console(physicalTarget);
                            physicalTarget.height = physicalTarget.height || physicalTarget.y;
                            physicalTarget.width = physicalTarget.width || physicalTarget.x;
                            topframeHeight = 48 * physicalTarget.width / 741;
                            // RESET WIDTH AND HEIGHT!
                            canvasContainer.style.height = (physicalTarget.height + topframeHeight) + "px";
                            canvasContainer.style.width = physicalTarget.width + "px";

                            // ADUNIT EFFECT!!!
                            topframe.style.display = "block";
                            adunitContainer.style.opacity = 1;
                            // HANDLE COMMON ACTIONS
                            LIB.onCreatePlayunlock(adUnitInfo, requestParams.onImpression, timers, iframeDocument, topframeHeight);
                            // start dwell timer
                            dwellTimer.start();
                        }, geneticString);

                        var started = false;
                        iframeWindow.PlayUnlock.attach('onDrop', function (data) {
                            if (!started) {
                                //Only on first drop report a started event
                                adUnitInfo.type = "started";
                                LIB.track(adUnitInfo, data);
                                started = true;
                                interactionTimer.start();
                            }
                            //Every time report a dropped event
                            adUnitInfo.type = "dropped";
                            LIB.track(adUnitInfo, data);

                            //Delete AUTO close timeout
                            timers.timeOut.stop();
                        });

                        iframeWindow.PlayUnlock.attach('onComplete', function () {
                            //track event completed
                            adUnitInfo.type = "completed";
                            LIB.track(adUnitInfo);
                            // track interaction time
                            adUnitInfo.type = "interaction_time";
                            LIB.track(adUnitInfo, {
                                duration: interactionTimer.getElapsed()
                            });
                            // track dwell time
                            adUnitInfo.type = "dwell_time";
                            LIB.track(adUnitInfo, {
                                duration: dwellTimer.getElapsed()
                            });

                            //stop skip timer if running
                            // timers.skipAdTimer.stop();
                            //stop timeout
                            timers.timeOut.stop();
                            //CLOSE!
                            //Wait TIMEOUT_ON_COMPLETE before closing the adunit
                            var TIMEOUT_ON_COMPLETE = adUnitInfo.configuration.timeout_on_complete || 8;
                            setTimeout(closeAdunit, TIMEOUT_ON_COMPLETE * 1000);
                        });

                        iframeWindow.PlayUnlock.attach('onClickThrough', function (overrideUrl) {
                            adUnitInfo.type = "click-through";
                            // Hacky hack hack - thank the G for multiline editing though. Honestly.
                            if (!window.skipped) {
                                window.open(LIB.clickTrack(adUnitInfo, overrideUrl));
                                delete window.skipped;
                            }
                        });

                        iframeWindow.PlayUnlock.attach('onGenericEvent', function (type) {
                            if (LIB.isString(type)) {
                                adUnitInfo.type = type;
                            } else {
                                adUnitInfo.type = type.type;
                            }
                            LIB.track(adUnitInfo);
                        });

                        //WHEN VIDEO AT THE END!
                        LIB.trackVideo(iframeWindow.PlayUnlock, adUnitInfo, {
                            onVideoStart: function () {
                                timers.timeOut.stop();
                                //SHOW SKIP!
                                skipButton.style.display = "block";
                            }
                        });
                    });
                    iframeDocument.body.appendChild(adunitJs);
                }
            });
        };
        LIB.renderInRiddle = function (adUnitInfo, requestParams) {
            LIB.console("RENDER IN RIDDLE", adUnitInfo);
            LIB.console("PRIVATE STATE", requestParams);
            var wrapper, style, defaultStyle,
                anchorElem = requestParams.anchorElem,
                id = 'w' + Math.floor(1E10 * Math.random());
            defaultStyle = {
                css: [
                    "#[$id] {position:absolute;width:" + anchorElem.clientWidth + "px;height:" + anchorElem.clientHeight + "px;top:0;left:0;z-index:9999;}",
                    "#[$id] > iframe {width:100%;height:100%; border:0; position:relative; }"
                ].join("")
            };

            wrapper = LIB.createElem('div', {
                id: id
            });
            style = LIB.createElem('style', {
                type: 'text/css'
            });
            LIB.updateStyle(defaultStyle, id, style);
            wrapper.appendChild(style);
            anchorElem.appendChild(wrapper);

            var frameSrc = "https://wat.adludio.com/frame/riddle/" + adUnitInfo.language + "/v1/frame.png";

            LIB.renderSafeFrame(wrapper, {
                adunitCss: adludiocss,
                adunitTpl: '<div class="riddle" id="adunit-container">' +
                    '<div class="content" id="game-container">' +
                    '<img id="count-down-text" src="https://wat.adludio.com/frame/skip-countdown/skip-ad-count-text.png" />' +
                    '<img id="count-down" />' +
                    '<img id="topframe" src="' + frameSrc + '" alt="Inview Ad">' +
                    '<div id="skipbutton"></div>' +
                    '</div>' +
                    '</div>',
                onload: function (iframeWindow, iframeDocument, iframe) {
                    var adunitJs = document.createElement('script');
                    adunitJs.type = 'text/javascript';
                    adunitJs.src = 'https://wat.adludio.com/games/' + adUnitInfo.key + '/' + adUnitInfo.latestVersion + '/game.js';
                    LIB.onload(adunitJs, function () {
                        /**
                         * StopWatch instance
                         */
                        var dwellTimer = new LIB.Stopwatch();
                        var interactionTimer = new LIB.Stopwatch();

                        var adunitContainer = iframeDocument.getElementById("adunit-container");
                        var topframe = iframeDocument.getElementById("topframe");
                        var skipButton = iframeDocument.getElementById("skipbutton");
                        var countDownText = iframeDocument.getElementById("count-down-text");
                        var countDown = iframeDocument.getElementById("count-down");

                        var canvasContainer = iframeDocument.getElementById("game-container");
                        var maxWidth = iframeWindow.innerWidth;
                        var maxHeight = iframeWindow.innerHeight;
                        var topframeHeight = 38 * maxWidth / 589;
                        maxHeight = maxHeight - topframeHeight;

                        function closeAdunit(reason) {
                            adunitContainer.style.opacity = 0;
                            var transitionEnd = LIB.whichTransitionEvent();
                            adunitContainer.addEventListener(transitionEnd, function () {
                                wrapper.parentNode.removeChild(wrapper);
                                if (reason === "timeout") {
                                    requestParams.onClose();
                                } else if (reason === "skipad") {
                                    requestParams.onClose();
                                } else {
                                    requestParams.onComplete();
                                }
                            }, false);
                        }

                        var timers = LIB.initTimers(adUnitInfo, topframe, skipButton, {
                            closeAdunit: closeAdunit
                        });

                        var geneticString = (adUnitInfo && adUnitInfo.configuration && adUnitInfo.configuration.genetic_string) ? adUnitInfo.configuration.genetic_string : "";

                        if (iframeWindow.PlayUnlock.configure) {
                            /**
                              autoengage = !!opts.autoengage || false;
                              autoengageAfter = !!opts.autoengageAfter || 8000;
                              fullscreencta = !!opts.fullscreencta || false;
                            */
                            iframeWindow.PlayUnlock.configure(adUnitInfo.configuration);
                        }

                        iframeWindow.PlayUnlock.create(canvasContainer, maxWidth, maxHeight, function (physicalTarget) {
                            // LIB.console(physicalTarget);
                            physicalTarget.height = physicalTarget.height || physicalTarget.y;
                            physicalTarget.width = physicalTarget.width || physicalTarget.x;
                            // RESET WIDTH AND HEIGHT!
                            canvasContainer.style.height = (physicalTarget.height + topframeHeight) + "px";
                            canvasContainer.style.width = physicalTarget.width + "px";
                            topframeHeight = 38 * physicalTarget.width / 589;
                            physicalTarget.width
                            // ADUNIT EFFECT!!!
                            topframe.style.display = "block";
                            adunitContainer.style.opacity = 1;
                            // HANDLE COMMON ACTIONS
                            LIB.onCreatePlayunlock(adUnitInfo, requestParams.onImpression, timers, iframeDocument, topframeHeight);
                            // start dwell timer
                            dwellTimer.start();
                        }, geneticString);

                        var started = false;
                        iframeWindow.PlayUnlock.attach('onDrop', function (data) {
                            if (!started) {
                                //Only on first drop report a started event
                                adUnitInfo.type = "started";
                                LIB.track(adUnitInfo, data);
                                started = true;
                                interactionTimer.start();
                            }
                            //Every time report a dropped event
                            adUnitInfo.type = "dropped";
                            LIB.track(adUnitInfo, data);

                            //Delete AUTO close timeout
                            timers.timeOut.stop();
                        });

                        iframeWindow.PlayUnlock.attach('onComplete', function () {
                            //track event completed
                            adUnitInfo.type = "completed";
                            LIB.track(adUnitInfo);
                            // track interaction time
                            adUnitInfo.type = "interaction_time";
                            LIB.track(adUnitInfo, {
                                duration: interactionTimer.getElapsed()
                            });
                            // track dwell time
                            adUnitInfo.type = "dwell_time";
                            LIB.track(adUnitInfo, {
                                duration: dwellTimer.getElapsed()
                            });

                            //stop skip timer if running
                            // timers.skipAdTimer.stop();
                            //stop timeout
                            timers.timeOut.stop();
                            //CLOSE!
                            //Wait TIMEOUT_ON_COMPLETE before closing the adunit
                            var TIMEOUT_ON_COMPLETE = adUnitInfo.configuration.timeout_on_complete || 8;
                            setTimeout(closeAdunit, TIMEOUT_ON_COMPLETE * 1000);
                        });

                        iframeWindow.PlayUnlock.attach('onClickThrough', function (overrideUrl) {
                            adUnitInfo.type = "click-through";
                            // Hacky hack hack - thank the G for multiline editing though. Honestly.
                            if (!window.skipped) {
                                window.open(LIB.clickTrack(adUnitInfo, overrideUrl));
                                delete window.skipped;
                            }
                        });

                        iframeWindow.PlayUnlock.attach('onGenericEvent', function (type) {
                            if (LIB.isString(type)) {
                                adUnitInfo.type = type;
                            } else {
                                adUnitInfo.type = type.type;
                            }
                            LIB.track(adUnitInfo);
                        });

                        //WHEN VIDEO AT THE END!
                        LIB.trackVideo(iframeWindow.PlayUnlock, adUnitInfo, {
                            onVideoStart: function () {
                                timers.timeOut.stop();
                                //SHOW SKIP!
                                skipButton.style.display = "block";
                            }
                        });
                    });
                    iframeDocument.body.appendChild(adunitJs);
                }
            });
        };
        LIB.renderInGallery = function (adUnitInfo, requestParams) {
            LIB.console("RENDER IN GALLERY", adUnitInfo);
            LIB.console("PRIVATE STATE", requestParams);
            var wrapper, style, defaultStyle,
                anchorElem = requestParams.anchorElem,
                id = 'w' + Math.floor(1E10 * Math.random());
            defaultStyle = {
                css: [
                    "#[$id] {position:absolute;top:0;left:0;bottom:0;right:0;z-index:9999;}",
                    "#[$id] > iframe {width:100%;height:100%; border:0; position:relative; }"
                ].join("")
            };

            wrapper = LIB.createElem('div', {
                id: id
            });
            style = LIB.createElem('style', {
                type: 'text/css'
            });
            LIB.updateStyle(defaultStyle, id, style);
            wrapper.appendChild(style);
            anchorElem.appendChild(wrapper);

            var frameSrc = "https://wat.adludio.com/frame/playgallery/" + adUnitInfo.language + "/v1/frame.png";

            LIB.renderSafeFrame(wrapper, {
                adunitCss: adludiocss,
                adunitTpl: '<div class="riddle" id="adunit-container">' +
                    '<div class="content" id="game-container">' +
                    '<img id="count-down-text" src="https://wat.adludio.com/frame/skip-countdown/skip-ad-count-text.png" />' +
                    '<img id="count-down" />' +
                    '<img id="topframe" src="' + frameSrc + '" alt="Inview Ad">' +
                    '<div id="skipbutton"></div>' +
                    '</div>' +
                    '</div>',
                onload: function (iframeWindow, iframeDocument, iframe) {
                    var adunitJs = document.createElement('script');
                    adunitJs.type = 'text/javascript';
                    adunitJs.src = 'https://wat.adludio.com/games/' + adUnitInfo.key + '/' + adUnitInfo.latestVersion + '/game.js';
                    LIB.onload(adunitJs, function () {
                        /**
                         * StopWatch instance
                         */
                        var dwellTimer = new LIB.Stopwatch();
                        var interactionTimer = new LIB.Stopwatch();

                        var adunitContainer = iframeDocument.getElementById("adunit-container");
                        var topframe = iframeDocument.getElementById("topframe");
                        var skipButton = iframeDocument.getElementById("skipbutton");
                        var countDownText = iframeDocument.getElementById("count-down-text");
                        var countDown = iframeDocument.getElementById("count-down");

                        var canvasContainer = iframeDocument.getElementById("game-container");
                        var maxWidth = iframeWindow.innerWidth;
                        var maxHeight = iframeWindow.innerHeight;
                        var topframeHeight = 48 * maxWidth / 741;
                        maxHeight = maxHeight - topframeHeight;

                        function closeAdunit(reason) {
                            adunitContainer.style.opacity = 0;
                            var transitionEnd = LIB.whichTransitionEvent();
                            adunitContainer.addEventListener(transitionEnd, function () {
                                wrapper.parentNode.removeChild(wrapper);
                                if (reason === "timeout") {
                                    requestParams.onClose();
                                } else if (reason === "skipad") {
                                    requestParams.onClose();
                                } else {
                                    requestParams.onComplete();
                                }
                            }, false);
                        }

                        var timers = LIB.initTimers(adUnitInfo, topframe, skipButton, {
                            closeAdunit: closeAdunit
                        });

                        var geneticString = (adUnitInfo && adUnitInfo.configuration && adUnitInfo.configuration.genetic_string) ? adUnitInfo.configuration.genetic_string : "";

                        if (iframeWindow.PlayUnlock.configure) {
                            /**
                              autoengage = !!opts.autoengage || false;
                              autoengageAfter = !!opts.autoengageAfter || 8000;
                              fullscreencta = !!opts.fullscreencta || false;
                            */
                            iframeWindow.PlayUnlock.configure(adUnitInfo.configuration);
                        }

                        iframeWindow.PlayUnlock.create(canvasContainer, maxWidth, maxHeight, function (physicalTarget) {
                            // LIB.console(physicalTarget);
                            physicalTarget.height = physicalTarget.height || physicalTarget.y;
                            physicalTarget.width = physicalTarget.width || physicalTarget.x;
                            // RESET WIDTH AND HEIGHT!
                            canvasContainer.style.height = (physicalTarget.height + topframeHeight) + "px";
                            canvasContainer.style.width = physicalTarget.width + "px";

                            // ADUNIT EFFECT!!!
                            topframe.style.display = "block";
                            adunitContainer.style.opacity = 1;
                            // HANDLE COMMON ACTIONS
                            LIB.onCreatePlayunlock(adUnitInfo, requestParams.onImpression, timers, iframeDocument, topframeHeight);
                            // start dwell timer
                            dwellTimer.start();
                        }, geneticString);

                        var started = false;
                        iframeWindow.PlayUnlock.attach('onDrop', function (data) {
                            if (!started) {
                                //Only on first drop report a started event
                                adUnitInfo.type = "started";
                                LIB.track(adUnitInfo, data);
                                started = true;
                                interactionTimer.start();
                            }
                            //Every time report a dropped event
                            adUnitInfo.type = "dropped";
                            LIB.track(adUnitInfo, data);

                            //Delete AUTO close timeout
                            timers.timeOut.stop();
                        });

                        iframeWindow.PlayUnlock.attach('onComplete', function () {
                            //track event completed
                            adUnitInfo.type = "completed";
                            LIB.track(adUnitInfo);
                            // track interaction time
                            adUnitInfo.type = "interaction_time";
                            LIB.track(adUnitInfo, {
                                duration: interactionTimer.getElapsed()
                            });
                            // track dwell time
                            adUnitInfo.type = "dwell_time";
                            LIB.track(adUnitInfo, {
                                duration: dwellTimer.getElapsed()
                            });

                            //stop skip timer if running
                            // timers.skipAdTimer.stop();
                            //stop timeout
                            timers.timeOut.stop();
                            //CLOSE!
                            //Wait TIMEOUT_ON_COMPLETE before closing the adunit
                            var TIMEOUT_ON_COMPLETE = adUnitInfo.configuration.timeout_on_complete || 8;
                            setTimeout(closeAdunit, TIMEOUT_ON_COMPLETE * 1000);
                        });

                        iframeWindow.PlayUnlock.attach('onClickThrough', function (overrideUrl) {
                            adUnitInfo.type = "click-through";
                            // Hacky hack hack - thank the G for multiline editing though. Honestly.
                            if (!window.skipped) {
                                window.open(LIB.clickTrack(adUnitInfo, overrideUrl));
                                delete window.skipped;
                            }
                        });

                        iframeWindow.PlayUnlock.attach('onGenericEvent', function (type) {
                            if (LIB.isString(type)) {
                                adUnitInfo.type = type;
                            } else {
                                adUnitInfo.type = type.type;
                            }
                            LIB.track(adUnitInfo);
                        });

                        //WHEN VIDEO AT THE END!
                        LIB.trackVideo(iframeWindow.PlayUnlock, adUnitInfo, {
                            onVideoStart: function () {
                                timers.timeOut.stop();
                                //SHOW SKIP!
                                skipButton.style.display = "block";
                            }
                        });
                    });
                    iframeDocument.body.appendChild(adunitJs);
                }
            });
        };

        LIB.renderPlayCaptcha = function (adUnitInfo, requestParams) {
            LIB.console("RENDER PLAYCAPTCHA", adUnitInfo);
            LIB.console("PRIVATE STATE", requestParams);
            var wrapper, style, defaultStyle,
                anchorElem = requestParams.anchorElem,
                id = 'w' + Math.floor(1E10 * Math.random());

            var errorMsg, form, completed = false;

            defaultStyle = {
                css: [
                    "#[$id] {position:relative;width:100%;height:100%;}",
                    "#[$id] > iframe {width:0px;height:0px; border:0;}",
                    "#[$id]-error{display:none;color:#EE0000;font-family:Tahoma,Geneva,Arial,sans-serif;font-size:11px;font-weight:bold;text-align: left;}"
                ].join("")
            };

            //Completed, errorMsg and Token are in the parent scope of this function!
            function catchFormSubmission(e) {
                if (!completed) {
                    errorMsg.style.display = "block";
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    return false;
                } else {
                    //remove reCAPTCHA from page and generate the input hidden validation
                    if (requestParams.isRecaptcha && requestParams.anchorElem && requestParams.anchorElem.parentNode) {
                        requestParams.anchorElem.parentNode.removeChild(requestParams.anchorElem);
                    }
                    errorMsg.style.display = "none";
                    return true;
                }
            };

            wrapper = LIB.createElem('div', {
                id: id
            });
            style = LIB.createElem('style', {
                type: 'text/css'
            });
            LIB.updateStyle(defaultStyle, id, style);
            wrapper.appendChild(style);
            if (requestParams.isRecaptcha) {
                //When a known recaptcha element is in page
                anchorElem.parentNode.insertBefore(wrapper, anchorElem);
            } else {
                anchorElem.appendChild(wrapper);
            }

            var frameSrc = "https://wat.adludio.com/frame/playcaptcha/" + adUnitInfo.language + "/v1/frame-top.png";
            var frameBottom = "https://wat.adludio.com/frame/playcaptcha/common/v1/frame-bottom.png";
            var frameBottomCongrats = "https://wat.adludio.com/frame/playcaptcha/" + adUnitInfo.language + "/v1/congratulations.png";

            LIB.renderSafeFrame(wrapper, {
                adunitCss: adludiocss,
                adunitTpl: '<div class="playcaptcha" id="adunit-container">' +
                    '<div class="header">' +
                    '<img id="topframe" src="' + frameSrc + '" alt="Playcaptcha">' +
                    '</div>' +
                    '<div class="content" id="game-container">' +
                    '</div>' +
                    '<div id="footer">' +
                    '<img id="bottom" src="' + frameBottom + '" alt="PlayCaptcha Ad Footer" />' +
                    '<img id="congrats" src="' + frameBottomCongrats + '" alt="PlayCaptcha Congratulations Ad" />' +
                    '<div onclick="removePlayCaptcha();" id="wheel-button" ></div>' +
                    '</div>' +
                    '</div>',
                onload: function (iframeWindow, iframeDocument, iframe) {
                    var adunitJs = document.createElement('script');
                    adunitJs.type = 'text/javascript';
                    adunitJs.src = 'https://wat.adludio.com/games/' + adUnitInfo.key + '/' + adUnitInfo.latestVersion + '/game.js';
                    LIB.onload(adunitJs, function () {
                        /**
                         * StopWatch instance
                         */
                        var dwellTimer = new LIB.Stopwatch();
                        var interactionTimer = new LIB.Stopwatch();

                        var adunitContainer = iframeDocument.getElementById("adunit-container");
                        var topframe = iframeDocument.getElementById("topframe");
                        var footer = iframeDocument.getElementById("footer");
                        var wheelButton = iframeDocument.getElementById("wheel-button");
                        var congrats = iframeDocument.getElementById("congrats");
                        var bottom = iframeDocument.getElementById("bottom");

                        var canvasContainer = iframeDocument.getElementById("game-container");
                        var maxWidth = requestParams.anchorElem.clientWidth;
                        var topframeHeight = 47 * maxWidth / 591;
                        var maxHeight = 388;

                        var footerDefaultWidth = 591;
                        var footerDefaultHeight = 51;
                        //Height of adunit when expanded!
                        var footerHeight = footerDefaultHeight * maxWidth / footerDefaultWidth | 0;
                        footerHeight = footerHeight > 51 ? 51 : footerHeight;
                        //Height of adunit when expanded!
                        var wheelDefaultWidth = 32;
                        var wheelDefaultHeight = 51;
                        //Height of adunit when expanded!
                        var wheelHeight = wheelDefaultHeight * footerHeight / wheelDefaultWidth | 0;
                        wheelButton.style.height = wheelHeight + "px";
                        wheelButton.addEventListener("mouseover", function () {
                            bottom.src = "https://wat.adludio.com/frame/playcaptcha/common/v1/frame-bottom-hover.png";
                        }, false);
                        wheelButton.addEventListener("mouseout", function () {
                            bottom.src = "https://wat.adludio.com/frame/playcaptcha/common/v1/frame-bottom.png";
                        }, false);
                        /**
                         * Wheel button on click send message to parent frame to hide playcaptcha
                         **/
                        iframeWindow.removePlayCaptcha = function () {
                            //TRACK remove playcaptcha
                            adUnitInfo.type = "audiobutton-clicked";
                            LIB.track(adUnitInfo);
                            closeAdunit();
                        };

                        function closeAdunit() {
                            adunitContainer.style.opacity = 0;
                            var transitionEnd = LIB.whichTransitionEvent();
                            adunitContainer.addEventListener(transitionEnd, function () {
                                requestParams.form.removeEventListener("submit", catchFormSubmission, false);
                                wrapper.parentNode.removeChild(wrapper);
                                if (requestParams.isRecaptcha) {
                                    //Restore recaptcha if it was there!
                                    anchorElem.style.display = "block";
                                }
                                requestParams.onClose();
                            }, false);
                        }

                        var geneticString = (adUnitInfo && adUnitInfo.configuration && adUnitInfo.configuration.genetic_string) ? adUnitInfo.configuration.genetic_string : "";

                        if (iframeWindow.PlayUnlock.configure) {
                            /**
                              autoengage = !!opts.autoengage || false;
                              autoengageAfter = !!opts.autoengageAfter || 8000;
                              fullscreencta = !!opts.fullscreencta || false;
                            */
                            iframeWindow.PlayUnlock.configure(adUnitInfo.configuration);
                        }

                        iframeWindow.PlayUnlock.create(canvasContainer, maxWidth, maxHeight, function (physicalTarget) {
                            physicalTarget.height = physicalTarget.height || physicalTarget.y;
                            physicalTarget.width = physicalTarget.width || physicalTarget.x;
                            topframeHeight = 47 * physicalTarget.width / 591;
                            // RESET WIDTH AND HEIGHT!
                            adunitContainer.style.height = (physicalTarget.height + topframeHeight + footerHeight) + "px";
                            adunitContainer.style.width = physicalTarget.width + "px";
                            iframe.style.width = physicalTarget.width + "px";
                            iframe.style.height = (physicalTarget.height + topframeHeight + footerHeight) + "px";

                            // ADUNIT EFFECT!!!
                            if (requestParams.isRecaptcha) {
                                anchorElem.style.display = "none";
                            }
                            topframe.style.display = "block";
                            adunitContainer.style.opacity = 1;
                            // HANDLE COMMON ACTIONS
                            LIB.onCreatePlayunlock(adUnitInfo, requestParams.onImpression, false, iframeDocument, topframeHeight);
                            // start dwell timer
                            dwellTimer.start();
                        }, geneticString);

                        var started = false;
                        iframeWindow.PlayUnlock.attach('onDrop', function (data) {
                            if (!started) {
                                //Only on first drop report a started event
                                adUnitInfo.type = "started";
                                LIB.track(adUnitInfo, data);
                                started = true;
                                interactionTimer.start();
                            }
                            //Every time report a dropped event
                            adUnitInfo.type = "dropped";
                            LIB.track(adUnitInfo, data);
                        });

                        iframeWindow.PlayUnlock.attach('onComplete', function () {
                            //track event completed
                            adUnitInfo.type = "completed";
                            LIB.track(adUnitInfo);
                            // track interaction time
                            adUnitInfo.type = "interaction_time";
                            LIB.track(adUnitInfo, {
                                duration: interactionTimer.getElapsed()
                            });
                            // track dwell time
                            adUnitInfo.type = "dwell_time";
                            LIB.track(adUnitInfo, {
                                duration: dwellTimer.getElapsed()
                            });
                            //allow form submission!
                            allowFormSubmition();

                            requestParams.onComplete();
                        });

                        iframeWindow.PlayUnlock.attach('onClickThrough', function (overrideUrl) {
                            adUnitInfo.type = "click-through";
                            // Hacky hack hack - thank the G for multiline editing though. Honestly.
                            if (!window.skipped) {
                                window.open(LIB.clickTrack(adUnitInfo, overrideUrl));
                                delete window.skipped;
                            }
                        });

                        iframeWindow.PlayUnlock.attach('onGenericEvent', function (type) {
                            if (LIB.isString(type)) {
                                adUnitInfo.type = type;
                            } else {
                                adUnitInfo.type = type.type;
                            }
                            LIB.track(adUnitInfo);
                        });

                        function allowFormSubmition() {
                            //allow form submission!
                            if (!completed) {
                                wheelButton.parentNode.removeChild(wheelButton);
                                completed = true;
                                errorMsg.style.display = "none";
                                bottom.style.display = "none";
                                congrats.style.display = "block";
                            }
                        }

                        //WHEN VIDEO AT THE END!
                        LIB.trackVideo(iframeWindow.PlayUnlock, adUnitInfo, {
                            onVideoStart: allowFormSubmition
                        });
                    });
                    iframeDocument.body.appendChild(adunitJs);
                }
            });

            // prevent form submission untill playcaptcha is completed
            requestParams.form.addEventListener("submit", catchFormSubmission, false);

            //create hidden error message
            errorMsg = LIB.createElem('div', {
                id: id + "-error"
            });
            errorMsg.innerHTML = "PlayCaptcha was not completed correctly, please try again.";
            wrapper.appendChild(errorMsg);
        };
        LIB.renderPushDown = function (adUnitInfo, requestParams) {
            LIB.console("RENDERING PUSH DOWN", adUnitInfo);
            LIB.console("PRIVATE STATE", requestParams);

            //FIRST OF ALL LOOK FOR THE SWEET SPOT IN THE PUBLISHER!
            var addRubberBanding = requestParams.hasOwnProperty('addRubberBanding') ? requestParams.addRubberBanding : true;
            var rubberBanding = null;
            var anchorClassName = requestParams.className || false;
            var anchorIdElement = requestParams.idElement || false;
            var placement = null,
                mainColumn, textLength = 0;
            var allParagraphs = [],
                rects, i, l;
            var DISPLAY_AFTER = 256;

            if (anchorClassName) {
                mainColumn = document.getElementsByClassName(anchorClassName);
                mainColumn = mainColumn[mainColumn.length - 1] || false;
            } else if (anchorIdElement) {
                mainColumn = document.getElementById(anchorIdElement);
            }

            if (mainColumn) {
                allParagraphs = mainColumn.getElementsByTagName('p');
                for (i = 0, l = allParagraphs.length; i < l; i++) {
                    textLength += allParagraphs[i].innerHTML.length;
                    if (textLength > DISPLAY_AFTER) {
                        placement = allParagraphs[i];
                        break;
                    }
                }
                //if the page doesn't contain enough text show intext
                //after first paragraph into main column!
                if (!placement && allParagraphs.length) {
                    placement = allParagraphs[0];
                }
            } else {
                LIB.console("The className or idElement specified was not found in the page");
                return false;
            }

            var wrapper, style, defaultStyle,
                id = 'w' + Math.floor(1E10 * Math.random());
            defaultStyle = {
                css: "#[$id] {margin:0px; padding: 0px;width:100%;height: 0px; overflow: hidden; " +
                    "-webkit-transition: height 0.8s;-moz-transition: height 0.8s;transition: height 0.8s;}" +
                    "#[$id] > iframe {width:100%;height:100%; border:0; position:relative; }" +
                    "#[$id].rubberBand ~ * { color: transparent; text-shadow: 0 0 5px rgba(0,0,0,0.5); }"
            };
            wrapper = LIB.createElem('div', {
                id: id
            });
            style = LIB.createElem('style', {
                type: 'text/css'
            });
            LIB.updateStyle(defaultStyle, id, style);
            wrapper.appendChild(style);

            if (placement) {
                placement.insertAdjacentHTML('afterend', wrapper.outerHTML);
            } else {
                //if placement not found cause there are no p inside the mainColumn or not enough text
                //place the adunit right inside the maincolumn
                mainColumn.appendChild(wrapper);
            }
            wrapper = document.getElementById(id);

            LIB.renderSafeFrame(wrapper, {
                adunitCss: adludiocss,
                adunitTpl: '<div class="pushdown" id="adunit-container">' +
                    '<div class="content" id="game-container">' +
                    // '<img id="count-down-text" src="https://wat.adludio.com/frame/skip-countdown/skip-ad-count-text.png" />'+
                    // '<img id="count-down" />'+
                    // '<img id="topframe" src="'+frameSrc+'" alt="Inview Ad">'+
                    // '<div id="skipbutton"></div>'+
                    '</div>' +
                    '</div>',
                onload: function (iframeWindow, iframeDocument, iframe) {
                    var adunitJs = document.createElement('script');
                    adunitJs.type = 'text/javascript';
                    adunitJs.src = 'https://wat.adludio.com/games/' + adUnitInfo.key + '/' + adUnitInfo.latestVersion + '/game.js';
                    LIB.onload(adunitJs, function () {
                        /**
                         * StopWatch instance
                         */
                        var dwellTimer = new LIB.Stopwatch();
                        var interactionTimer = new LIB.Stopwatch();

                        var adunitContainer = iframeDocument.getElementById("adunit-container");
                        // var topframe = iframeDocument.getElementById("topframe");
                        // var skipButton = iframeDocument.getElementById("skipbutton");
                        // var countDownText = iframeDocument.getElementById("count-down-text");
                        // var countDown = iframeDocument.getElementById("count-down");
                        var canvasContainer = iframeDocument.getElementById("game-container");
                        var maxWidth = iframeWindow.innerWidth;
                        var maxHeight = 700;
                        var videoContainer, videoPlayer;

                        // var timers = LIB.initTimers(adUnitInfo, topframe, skipButton, {
                        //   closeAdunit: closeAdunit
                        // });

                        var geneticString = (adUnitInfo && adUnitInfo.configuration && adUnitInfo.configuration.genetic_string) ? adUnitInfo.configuration.genetic_string : "";

                        if (iframeWindow.PlayUnlock.configure) {
                            /**
                              autoengage = !!opts.autoengage || false;
                              autoengageAfter = !!opts.autoengageAfter || 8000;
                              fullscreencta = !!opts.fullscreencta || false;
                            */
                            iframeWindow.PlayUnlock.configure(adUnitInfo.configuration);
                        }

                        iframeWindow.PlayUnlock.create(canvasContainer, maxWidth, maxHeight, function (physicalTarget) {
                            // LIB.console(physicalTarget);
                            physicalTarget.height = physicalTarget.height || physicalTarget.y;
                            physicalTarget.width = physicalTarget.width || physicalTarget.x;
                            // RESET WIDTH AND HEIGHT!
                            canvasContainer.style.height = physicalTarget.height + "px";
                            canvasContainer.style.width = physicalTarget.width + "px";

                            // ADUNIT EFFECT!!!
                            // topframe.style.display = "block";
                            wrapper.style.height = physicalTarget.height + "px";

                            //TRACK IMPRESSION
                            adUnitInfo.type = "impression";
                            LIB.track(adUnitInfo);
                            requestParams.onImpression();

                            if (addRubberBanding) {
                                rubberBanding = LIB.initRubberBanding(wrapper, window);
                                wrapper.className = "rubberBand";
                            }

                            //IF THIS ADUNIT HAS A VIDEO!!!
                            var gameCanvas = canvasContainer.getElementsByTagName('canvas')[0];
                            videoContainer = iframeDocument.createElement('div');
                            videoContainer.id = "video-container";
                            var videoFile = "https://s3-eu-west-1.amazonaws.com/a.futureadlabs.com/games/" + adUnitInfo.key + "/video-assets/video";
                            videoContainer.innerHTML = [
                                '<video id="video-player" style="width: 100% !important;height: auto !important;">',
                                '<source type="video/mp4" src="' + videoFile + '.mp4" />',
                                '</video>'
                            ].join('');
                            canvasContainer.appendChild(videoContainer);
                            videoPlayer = videoContainer.firstChild;
                            LIB.initVideoTracking(videoPlayer, adUnitInfo);
                            videoPlayer.addEventListener('ended', function () {
                                canvasContainer.style.height = physicalTarget.height + "px";
                                wrapper.style.height = physicalTarget.height + "px";
                                var transitionEnd = LIB.whichTransitionEvent();
                                wrapper.addEventListener(transitionEnd, function () {
                                    // videoContainer.parentNode.display = "none";
                                    videoContainer.parentNode.removeChild(videoContainer);
                                }, false);
                                if (addRubberBanding) {
                                    wrapper.className = "";
                                    window.removeEventListener("scroll", rubberBanding, false);
                                    window.removeEventListener("touchmove", rubberBanding, false);
                                    window.removeEventListener("resize", rubberBanding, false);
                                }
                                requestParams.onClose();
                            });
                            videoContainer.addEventListener("contextmenu", function (e) {
                                e.preventDefault();
                                return false;
                            }, false);

                            if ((navigator.userAgent.match(/iPhone/i)) ||
                                (navigator.userAgent.match(/iPad/i)) ||
                                (navigator.userAgent.match(/iPod/i)) ||
                                (navigator.userAgent.match(/Android/i))) {
                                //AUTOPLAY MOBILE!
                                var initLoad = false;
                                Lib.addEvent("touchstart", wrapper, function () {
                                    if (!initLoad) {
                                        videoPlayer.load();
                                        initLoad = true;
                                    }
                                });
                            }
                        }, geneticString);

                        var started = false;
                        iframeWindow.PlayUnlock.attach('onDrop', function (data) {
                            if (!started) {
                                //Only on first drop report a started event
                                adUnitInfo.type = "started";
                                LIB.track(adUnitInfo, data);
                                started = true;
                                interactionTimer.start();
                            }
                            //Every time report a dropped event
                            adUnitInfo.type = "dropped";
                            LIB.track(adUnitInfo, data);
                        });

                        iframeWindow.PlayUnlock.attach('onComplete', function () {
                            //track event completed
                            adUnitInfo.type = "completed";
                            LIB.track(adUnitInfo);
                            // track interaction time
                            adUnitInfo.type = "interaction_time";
                            LIB.track(adUnitInfo, {
                                duration: interactionTimer.getElapsed()
                            });
                            // track dwell time
                            adUnitInfo.type = "dwell_time";
                            LIB.track(adUnitInfo, {
                                duration: dwellTimer.getElapsed()
                            });

                            requestParams.onComplete();
                            //CLOSE!
                            var expandedHeight = wrapper.clientHeight + videoPlayer.clientHeight;
                            canvasContainer.style.height = expandedHeight + "px";
                            wrapper.style.height = expandedHeight + "px";
                            var transitionEnd = LIB.whichTransitionEvent();
                            wrapper.addEventListener(transitionEnd, function () {
                                videoPlayer.play();
                            }, false);
                        });

                        iframeWindow.PlayUnlock.attach('onClickThrough', function (overrideUrl) {
                            adUnitInfo.type = "click-through";
                            // Hacky hack hack - thank the G for multiline editing though. Honestly.
                            if (!window.skipped) {
                                window.open(LIB.clickTrack(adUnitInfo, overrideUrl));
                                delete window.skipped;
                            }
                        });

                        iframeWindow.PlayUnlock.attach('onGenericEvent', function (type) {
                            if (LIB.isString(type)) {
                                adUnitInfo.type = type;
                            } else {
                                adUnitInfo.type = type.type;
                            }
                            LIB.track(adUnitInfo);
                        });

                        //WHEN VIDEO AT THE END!
                        LIB.trackVideo(iframeWindow.PlayUnlock, adUnitInfo);
                    });
                    iframeDocument.body.appendChild(adunitJs);
                }
            });
        };


        LIB.renderVideoHeader = function (adUnitInfo, requestParams) {
            LIB.console("RENDERING VIDEOHEADER", adUnitInfo);
            LIB.console("PRIVATE STATE", requestParams);

            //FIRST OF ALL LOOK FOR THE SWEET SPOT IN THE PUBLISHER!
            LIB.domReady(function () {

                var wrapper, style, defaultStyle,
                    id = 'w' + Math.floor(1E10 * Math.random());
                defaultStyle = {
                    css: "#[$id] {margin:0px; padding: 0px;width:100%;height: 0px; overflow: hidden; " +
                        "-webkit-transition: height 0.8s;-moz-transition: height 0.8s;transition: height 0.8s;}" +
                        "#[$id] > iframe {width:100%;height:100%; border:0; position:relative; }"
                };
                wrapper = LIB.createElem('div', {
                    id: id
                });
                style = LIB.createElem('style', {
                    type: 'text/css'
                });
                LIB.updateStyle(defaultStyle, id, style);
                wrapper.appendChild(style);

                LIB.doc.body.insertBefore(wrapper, LIB.doc.body.firstChild);
                wrapper = document.getElementById(id);

                LIB.renderSafeFrame(wrapper, {
                    adunitCss: adludiocss,
                    adunitTpl: '<div class="pushdown" id="adunit-container">' +
                        '<div class="content" id="game-container">' +
                        '<div id="skipbutton" class="mobile"></div>' +
                        '</div>' +
                        '</div>',
                    onload: function (iframeWindow, iframeDocument, iframe) {
                        var adunitJs = document.createElement('script');
                        adunitJs.type = 'text/javascript';
                        adunitJs.src = 'https://wat.adludio.com/games/' + adUnitInfo.key + '/' + adUnitInfo.latestVersion + '/game.js';
                        LIB.onload(adunitJs, function () {
                            /**
                             * StopWatch instance
                             */
                            var dwellTimer = new LIB.Stopwatch();
                            var interactionTimer = new LIB.Stopwatch();

                            var adunitContainer = iframeDocument.getElementById("adunit-container");
                            // var topframe = iframeDocument.getElementById("topframe");
                            var skipButton = iframeDocument.getElementById("skipbutton");
                            skipButton.style.cssText = 'background: url("//wat.adludio.com/frame/cross-close.png") no-repeat; background-position: center;' +
                                'display:none; position:absolute; top: 5px; right: 5px; width:50px; height:50px; cursor:pointer; z-index: 9999;';
                            // var countDownText = iframeDocument.getElementById("count-down-text");
                            // var countDown = iframeDocument.getElementById("count-down");
                            var canvasContainer = iframeDocument.getElementById("game-container");
                            var maxWidth = 970;
                            var maxHeight = 728;

                            function closeAdunit(reason) {
                                wrapper.style.height = "0px";
                                var transitionEnd = LIB.whichTransitionEvent();
                                wrapper.addEventListener(transitionEnd, function () {
                                    wrapper.parentNode.removeChild(wrapper);
                                    if (reason === "timeout") {
                                        requestParams.onClose();
                                    } else if (reason === "skipad") {
                                        requestParams.onClose();
                                    } else {
                                        requestParams.onComplete();
                                    }
                                }, false);
                            }

                            var timers = LIB.initTimers(adUnitInfo, null, skipButton, {
                                closeAdunit: closeAdunit
                            });

                            var geneticString = (adUnitInfo && adUnitInfo.configuration && adUnitInfo.configuration.genetic_string) ? adUnitInfo.configuration.genetic_string : "";

                            if (iframeWindow.PlayUnlock.configure) {
                                /**
                                  autoengage = !!opts.autoengage || false;
                                  autoengageAfter = !!opts.autoengageAfter || 8000;
                                  fullscreencta = !!opts.fullscreencta || false;
                                */
                                iframeWindow.PlayUnlock.configure(adUnitInfo.configuration);
                            }

                            iframeWindow.PlayUnlock.create(canvasContainer, maxWidth, maxHeight, function (physicalTarget) {
                                // LIB.console(physicalTarget);
                                physicalTarget.height = physicalTarget.height || physicalTarget.y;
                                physicalTarget.width = physicalTarget.width || physicalTarget.x;
                                // RESET WIDTH AND HEIGHT!
                                canvasContainer.style.height = physicalTarget.height + "px";
                                canvasContainer.style.width = physicalTarget.width + "px";
                                canvasContainer.style.margin = "auto";
                                // ADUNIT EFFECT!!!
                                // topframe.style.display = "block";
                                wrapper.style.height = physicalTarget.height + "px";

                                // HANDLE COMMON ACTIONS
                                LIB.onCreatePlayunlock(adUnitInfo, requestParams.onImpression, timers, iframeDocument, 0);
                                // start dwell timer
                                dwellTimer.start();
                            }, geneticString);

                            var started = false;
                            iframeWindow.PlayUnlock.attach('onDrop', function (data) {
                                if (!started) {
                                    //Only on first drop report a started event
                                    adUnitInfo.type = "started";
                                    LIB.track(adUnitInfo, data);
                                    started = true;
                                    interactionTimer.start();
                                }
                                //Every time report a dropped event
                                adUnitInfo.type = "dropped";
                                LIB.track(adUnitInfo, data);

                                //Delete AUTO close timeout
                                timers.timeOut.stop();
                            });

                            iframeWindow.PlayUnlock.attach('onComplete', function () {
                                // track event completed
                                adUnitInfo.type = "completed";
                                LIB.track(adUnitInfo);
                                // track interaction time
                                adUnitInfo.type = "interaction_time";
                                LIB.track(adUnitInfo, {
                                    duration: interactionTimer.getElapsed()
                                });
                                // track dwell time
                                adUnitInfo.type = "dwell_time";
                                LIB.track(adUnitInfo, {
                                    duration: dwellTimer.getElapsed()
                                });

                                //stop skip timer if running
                                // timers.skipAdTimer.stop();
                                //stop timeout
                                timers.timeOut.stop();
                                //CLOSE!
                                //Wait TIMEOUT_ON_COMPLETE before closing the adunit
                            });

                            iframeWindow.PlayUnlock.attach('onClickThrough', function (overrideUrl) {
                                adUnitInfo.type = "click-through";
                                // Hacky hack hack - thank the G for multiline editing though. Honestly.
                                if (!window.skipped) {
                                    window.open(LIB.clickTrack(adUnitInfo, overrideUrl));
                                    delete window.skipped;
                                }
                            });

                            iframeWindow.PlayUnlock.attach('onGenericEvent', function (type) {
                                if (LIB.isString(type)) {
                                    adUnitInfo.type = type;
                                } else {
                                    adUnitInfo.type = type.type;
                                }
                                LIB.track(adUnitInfo);
                            });

                            //WHEN VIDEO AT THE END!
                            LIB.trackVideo(iframeWindow.PlayUnlock, adUnitInfo, {
                                onVideoEnd: function () {
                                    //SHOW SKIP!
                                    closeAdunit();
                                }
                            });
                        });
                        iframeDocument.body.appendChild(adunitJs);
                    }
                });
            });
        };

        // Examine the known reCAPTCHA elements and wait until the
        // recaptcha has been rendered
        LIB.waitForRecaptcha = function (callback) {

            var foundRecaptchaElement = false;
            // Try each known selector
            var KNOWN_RECAPCTHA_SELECTORS = ['#recaptcha_widget_div', '#recaptchadiv', '#form-captcha'];
            //interval: wait for recaptcha area
            var waitForRecaptchaArea;
            var i = 0;
            for (i = 0; i < KNOWN_RECAPCTHA_SELECTORS.length; ++i) {
                if (document.querySelectorAll(KNOWN_RECAPCTHA_SELECTORS[i]).length) {
                    foundRecaptchaElement = true;
                    waitForRecaptchaArea = setInterval(function () {
                        if (document.querySelectorAll('#recaptcha_response_field').length && document.querySelectorAll('#recaptcha_challenge_field').length) {
                            clearInterval(waitForRecaptchaArea);
                            callback(document.querySelectorAll(KNOWN_RECAPCTHA_SELECTORS[i])[0]);
                        }
                    }, 10);
                    break;
                }
            }

            //probably need to do mollom-specific selectors and poll like above instead of this
            var KNOWN_STANDARD_SELECTORS = ['.form-item-mollom-captcha'];
            if (!foundRecaptchaElement) {
                for (i = 0; i < KNOWN_STANDARD_SELECTORS.length; ++i) {
                    if (document.querySelectorAll(KNOWN_STANDARD_SELECTORS[i]).length) {
                        foundRecaptchaElement = true;
                        callback(document.querySelectorAll(KNOWN_STANDARD_SELECTORS[i])[0]);
                        break;
                    }
                }
            }

            if (!foundRecaptchaElement) {
                callback(false);
            }
        }

        LIB.onCreatePlayunlock = function (adUnitInfo, onImpression, timers, iframeDocument, topframeHeight) {

            if (timers) {
                //start skip button time
                timers.skipAdTimer.start();
                //start timeout timer
                timers.timeOut.start();
            }

            var videoContainer = false;
            var videoPlayer = iframeDocument.getElementById("video-player") || false;
            var videoPrevSibling = videoPlayer.previousElementSibling || false;
            if (videoPlayer && (videoPrevSibling && videoPrevSibling.tagName === "CANVAS")) {
                videoContainer = videoPlayer;
            } else if (videoPlayer) {
                videoContainer = iframeDocument.getElementById("video-player").parentNode;
            } else {
                videoContainer = false;
            }
            if (videoContainer && topframeHeight) {
                if (!videoContainer.getAttribute("donotchange")) {
                    videoContainer.style.top = topframeHeight + "px";
                }
            }

            //TRACK IMPRESSION
            adUnitInfo.type = "impression";
            LIB.track(adUnitInfo);
            onImpression();
        }

        LIB.initTimers = function (adUnitInfo, topframe, skipButton, callbacks) {

            //Show text before skip ad button
            var SHOW_SKIPAD_TEXT_BEFO = false;
            // ASK DESIGN TO REFACTOR THIS!
            // if(adUnitInfo.configuration.hasOwnProperty("show_skipad_countdown")){
            //   SHOW_SKIPAD_TEXT_BEFO = adUnitInfo.configuration.show_skipad_countdown === "true";
            // }
            //Skip button appear after skipeAfter elapse.
            var TIMEOUT_BEFORE_SKIP = adUnitInfo.configuration.timout_before_skipad || 3;
            //Autoclose after suicideTimer sec
            var TIMEOUT_BEFORE_AUTOCLOSE = adUnitInfo.configuration.timeout_auto_close || 30;

            var timeOut = new LIB.Countdown({
                seconds: TIMEOUT_BEFORE_AUTOCLOSE, // number of seconds to count down
                // final action
                onCounterEnd: function () {
                    //Track timeout
                    adUnitInfo.type = "timeout";
                    LIB.track(adUnitInfo);
                    //close ad
                    callbacks.closeAdunit("timeout");
                }
            });

            function skipAdunit(e) {
                e.stopPropagation();
                window.skipped = true
                //Delete AUTO close timeout -- closure
                timeOut.stop();
                //Track skipad
                adUnitInfo.type = "skipad";
                LIB.track(adUnitInfo);
                //close ad
                callbacks.closeAdunit("skipad");
            }

            var skipAdTimer = new LIB.Countdown({
                seconds: TIMEOUT_BEFORE_SKIP,
                // callback for each second
                onUpdateStatus: function (sec) {
                    if (SHOW_SKIPAD_TEXT_BEFO && sec <= 5 && sec >= 1) {
                        countDownText.style.display = "block";
                        countDown.style.display = "block";
                        countDown.src = "https://wat.adludio.com/frame/skip-countdown/skip-ad-count-" + sec + ".png";
                    }
                },
                // final action
                onCounterEnd: function () {
                    if (topframe) {
                        topframe.src = "https://wat.adludio.com/frame/" + adUnitInfo.adunitType + "/" + adUnitInfo.language + "/v1/frame-skip.png";
                        // ADD HOVER EFFECTS
                        skipButton.addEventListener("mouseover", function () {
                            topframe.src = "https://wat.adludio.com/frame/" + adUnitInfo.adunitType + "/" + adUnitInfo.language + "/v1/frame-skiphover.png";
                        }, false);
                        skipButton.addEventListener("mouseout", function () {
                            topframe.src = "https://wat.adludio.com/frame/" + adUnitInfo.adunitType + "/" + adUnitInfo.language + "/v1/frame-skip.png";
                        }, false);
                    }

                    skipButton.addEventListener('mousedown', skipAdunit, true);
                    skipButton.addEventListener('touchstart', skipAdunit, true);
                    skipButton.style.display = "block";

                    if (SHOW_SKIPAD_TEXT_BEFO) {
                        countDownText.style.display = "none";
                        countDown.style.display = "none";
                    }
                },
                onCounterStop: function () {
                    //If skip button timer is stopped!?s
                    /*
                    if (SHOW_SKIPAD_TEXT_BEFO) {
                      countDownText.style.display = "none";
                      countDown.style.display = "none";
                    }
                    skipButton.style.display = "none";
                    if (adUnitInfo.deviceType !== "mobile") {
                      topframe.src = "https://wat.adludio.com/frame/" + adUnitInfo.adunitType + "/" + adUnitInfo.language + "/v1/frame.png";
                    }
                    */
                }
            });

            return {
                timeOut: timeOut,
                skipAdTimer: skipAdTimer
            }
        }

        LIB.initVideoTracking = function (videoPlayer, adUnitInfo) {
            var views_tracker, cur_view_seconds = 0;

            function start_view_tracker() {
                if (views_tracker === undefined || !views_tracker) {
                    if (views_tracker === undefined) {
                        cur_view_seconds = 0;
                    }
                    views_tracker = setInterval(function () {
                        cur_view_seconds += 5;
                        adUnitInfo.type = "video-elapsed-" + cur_view_seconds + "s";
                        LIB.track(adUnitInfo);
                    }, 5000);
                }
            }

            function stop_view_tracker() {
                if (views_tracker) {
                    clearInterval(views_tracker);
                    views_tracker = null;
                } else {
                    return;
                }
            }

            var autoplay = true;
            videoPlayer.addEventListener("playing", function () {
                start_view_tracker();
                if (!autoplay) {
                    adUnitInfo.type = "video-play";
                    LIB.track(adUnitInfo);
                }
                //SKIP VIDEO PLAY TRACK ON VIDEO START AUTO!
                autoplay = false;
            });

            videoPlayer.addEventListener("pause", function () {
                stop_view_tracker();
                adUnitInfo.type = "video-pause";
                LIB.track(adUnitInfo);
            });

            videoPlayer.addEventListener("stop", function () {
                stop_view_tracker();
                adUnitInfo.type = "video-stop";
                LIB.track(adUnitInfo);
            });

            videoPlayer.addEventListener('ended', function () {
                adUnitInfo.type = "video-end";
                LIB.track(adUnitInfo);
                stop_view_tracker();
            }, false);
        }

        LIB.trackVideo = function (playunlock, adUnitInfo, callbacks) {
            callbacks = callbacks || {};
            //WHEN VIDEO AT THE END!
            playunlock.attach('onVideoStart', function () {
                adUnitInfo.type = "video-start";
                LIB.track(adUnitInfo);
                if (callbacks.onVideoStart) {
                    callbacks.onVideoStart();
                }
            });
            playunlock.attach('onVideoEnd', function () {
                adUnitInfo.type = "video-end";
                LIB.track(adUnitInfo);
                if (callbacks.onVideoStart) {
                    callbacks.onVideoStart();
                }
            });
            playunlock.attach('onVideoPlay', function () {
                adUnitInfo.type = "video-play";
                LIB.track(adUnitInfo);
                if (callbacks.onVideoPlay) {
                    callbacks.onVideoPlay();
                }
            });
            playunlock.attach('onVideoPause', function () {
                adUnitInfo.type = "video-pause";
                LIB.track(adUnitInfo);
                if (callbacks.onVideoPause) {
                    callbacks.onVideoPause();
                }
            });
            playunlock.attach('onVideoTimer', function (timer) {
                adUnitInfo.type = "video-elapsed-" + timer + "s";
                LIB.track(adUnitInfo);
                if (callbacks.onVideoTimer) {
                    callbacks.onVideoTimer("video-elapsed-" + timer + "s");
                }
            });
            playunlock.attach('onVideoUnmute', function (timer) {
                adUnitInfo.type = "video-unmute";
                LIB.track(adUnitInfo);
                if (callbacks.onVideoUnmute) {
                    callbacks.onVideoUnmute();
                }
            });
            playunlock.attach('onVideoMute', function (timer) {
                adUnitInfo.type = "video-mute";
                LIB.track(adUnitInfo);
                if (callbacks.onVideoMute) {
                    callbacks.onVideoMute();
                }
            });
        };

        LIB.initRubberBanding = function (adunit, context) {
            //10% of the screen!
            var distance = context.innerHeight * 10 / 100;

            function rubber(e) {
                var rect = adunit.getBoundingClientRect();
                //bring it back if window height minus top left cornet plus adunit height
                // is greater than defined distance!
                var bringItBack = false;
                if (context.innerHeight <= rect.height) {
                    distance = 0;
                }
                bringItBack = context.innerHeight - (rect.top + rect.height) >= distance;
                if (bringItBack && rect.top < distance) {
                    context.scrollBy(0, -10);
                }
            }

            context.addEventListener("scroll", rubber, false);
            context.addEventListener("resize", rubber, false);
            context.addEventListener("touchmove", rubber, false);
            rubber();
            return rubber;
        };

        LIB.console = function (message, dump) {
            try {
                if ((/debug-adludio-console/).test(window.top.location) && console) {
                    if (dump) {
                        console.log("Adludio debug message: " + message, dump);
                    } else {
                        console.log("Adludio debug message: " + message);
                    }
                }
            } catch (e) {}
        }

        // Attaches cross browser onload handler to given node.
        // This function will be rendered as string into the output. So don't use any closure var!
        LIB.onload = function (node, callback) {
            function load() {
                node.onload = null;
                node.onreadystatechange = null;
                callback();
            }

            node.onload = load;
            node.onreadystatechange = function () {
                if (node.readyState === 'loaded' || node.readyState === 'complete') {
                    load();
                }
            };

            return node;
        };

        // encoder
        // [https://gist.github.com/999166] by [https://github.com/nignag]
        LIB.btoa = function (input) {
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var str = String(input);
            for (
                // initialize result and counter
                var block, charCode, idx = 0, map = chars, output = '';
                // if the next str index does not exist:
                //   change the mapping table to "="
                //   check if d has no fractional digits
                str.charAt(idx | 0) || (map = '=', idx % 1);
                // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
                output += map.charAt(63 & block >> 8 - idx % 1 * 8)
            ) {
                charCode = str.charCodeAt(idx += 3 / 4);
                if (charCode > 0xFF) {
                    throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
                }
                block = block << 8 | charCode;
            }
            return output;
        };

        // decoder
        // [https://gist.github.com/1020396] by [https://github.com/atk]
        LIB.atob = function (input) {
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var str = String(input).replace(/=+$/, '');
            if (str.length % 4 == 1) {
                throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
            }
            for (
                // initialize result and counters
                var bc = 0, bs, buffer, idx = 0, output = '';
                // get next character
                buffer = str.charAt(idx++);
                // character found in table? initialize bit storage and add its ascii value;
                ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                    // and if not first of each 4 characters,
                    // convert the first 8 bits to one ascii character
                    bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
            ) {
                // try to find character in table (0-63, not found => -1)
                buffer = chars.indexOf(buffer);
            }
            return output;
        };
        /**
         * Find closes selector to elem
         */
        LIB.closestSibling = function (elem, selector) {
            while (elem) {
                if (elem.tagName === selector.toUpperCase()) {
                    return elem;
                }
                elem = elem.previousSibling;
            }
            return false;
        }
        /**
         * Find closes selector to elem
         **/
        LIB.closest = function (elem, selector) {
            var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
            while (elem) {
                if (matchesSelector.bind(elem)(selector)) {
                    return elem;
                }
                elem = elem.parentElement;
            }
            return false;
        }
        /**
         * Returns true iff has given classname.
         * @name LIB.dom.Elem#hasClass
         * @requires dom.Elem.isElem
         * @function
         * @param {String} [className]
         * @return {Boolean}
         */
        LIB.hasClass = function (className, elem) {
            return !!className && /^[\w\-]+$/.test(className) && new RegExp('(?:^| )' + className + '(?:$| )').test(elem.className);
        };
        /**
         * Removes given classname.
         * @name LIB.dom.Elem#delClass
         * @requires dom.Elem.isElem
         * @function
         * @param {String} [className]
         * @return {LIB.dom.Elem} this
         */
        LIB.delClass = function (className, elem) {
            if (className) {
                //this.node.className = this.node.className.replace(new RegExp('^(?:(.+)\\s)?' + className + '(?:\\s(.+))?$'), '$1$2');
                elem.className = elem.className
                    .replace(new RegExp('(?:^| )' + className + '(?:$| )'), ' ')
                    .replace(/\s{2,}/g, ' ')
                    .replace(/^\s+|\s+$/g, '');
            }
        };
        /**
         * Adds given classname.
         * @name LIB.dom.Elem#addClass
         * @requires dom.Elem.isElem, dom.Elem.hasClass
         * @function
         * @param {String} [className]
         * @return {LIB.dom.Elem} this
         */
        LIB.addClass = function (className, elem) {
            if (className) {
                if (!LIB.hasClass(className, elem)) {
                    elem.className = (elem.className + ' ' + className).replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/g, '');
                }
            }
        };
        /**
         * Toggles given classname.
         * @name LIB.dom.Elem#toggleClass
         * @requires dom.Elem.hasClass, dom.Elem.delClass, dom.Elem.addClass
         * @function
         * @param {String} [className]
         * @return {LIB.dom.Elem} this
         */
        LIB.toggleClass = function (className, elem) {
            return LIB[LIB.hasClass(className, elem) ? 'delClass' : 'addClass'](className, elem);
        };

        LIB.makeQueryString = function (obj) {
            var qs = [],
                key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    qs.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
                }
            }
            return qs.join("&");
        };
        // Each event tracked could potentially activate or expire the audience!
        LIB.handleAudience = function (trackEvent, audiences) {
            var ord = 0;
            if (audiences.adludio && LIB.isArray(audiences.adludio)) {
                for (var i = 0; i < audiences.adludio.length; i++) {
                    var aud = audiences.adludio[i];
                    ord = Number(ord) || Math.floor(Math.random() * 10e12);
                    //AUDIENCE SEGMENT! INTERNAL ADLUDIO AUDIENCE!
                    //IF AUDIENCE.EVENT VALUE IS TRUE SET THIS AUDIENCE TO ACTIVE OTHERWISE SET IT TO EXPIRED
                    if (aud.id_campaign.indexOf(trackEvent.idCampaign) !== -1) {
                        LIB.console("HANDLE AUDIENCE (" + aud.id + ") CAMPAIGN SERVED " + trackEvent.idCampaign + " Event Type: " + trackEvent.type, aud);
                        //if this event type is true assign audience
                        if (aud.value.hasOwnProperty(trackEvent.type) &&
                            aud.value[trackEvent.type] === "true") {
                            LIB.console("ACTIVATE AUDIENCE:", aud.id);
                            (new Image()).src = "https://playwat.futureadlabs.com/a.gif?active=" + aud.id + "&ts=" + ord;
                        }

                        //if this event type is false remove audience
                        if (aud.value.hasOwnProperty(trackEvent.type) &&
                            aud.value[trackEvent.type] === "false") {
                            LIB.console("EXPIRE AUDIENCE:", aud.id);
                            (new Image()).src = "https://playwat.futureadlabs.com/a.gif?expire=" + aud.id + "&ts=" + ord;
                        }
                    } else {
                        LIB.console("NO AUDIENCE SET FOR CAMPAIGN: " + trackEvent.idCampaign, aud);
                    }
                }
            }
        };
        //TRACK FUNCTION
        LIB.track = function (adunitInfo, data) {
            if (adunitInfo.idChannel === "adludio-demo") {
                return;
            }
            //1x1 PIXEL image tag
            var i = 0,
                ord = Number(ord) || Math.floor(Math.random() * 10e12);

            var thisEventTrack = {};
            var eventProps = ["type", "adunitType", "token", "publisherUrl", "idInsertionOrder", "idCampaign", "idAdunit", "idChannel", "language",
                "country", "platform", "deviceType", "browser", "browserVersion", "isUnique"
            ];

            for (i = 0; i < eventProps.length; i++) {
                thisEventTrack[eventProps[i]] = adunitInfo[eventProps[i]];
            }

            if (adunitInfo.type === "dropped" || adunitInfo.type === "started") {
                thisEventTrack.node = data.node || "n/a";
                thisEventTrack.dropX = data.dropX || "n/a";
                thisEventTrack.dropY = data.dropY || "n/a";
            }

            if (adunitInfo.type === "interaction_time" || adunitInfo.type === "dwell_time") {
                thisEventTrack.duration = data.duration;
            }

            if (adunitInfo.posLatitude) {
                thisEventTrack.posLatitude = adunitInfo.posLatitude;
            }
            if (adunitInfo.posLongitude) {
                thisEventTrack.posLongitude = adunitInfo.posLongitude;
            }
            if (adunitInfo.userLatitude) {
                thisEventTrack.userLatitude = adunitInfo.userLatitude;
            }
            if (adunitInfo.userLongitude) {
                thisEventTrack.userLongitude = adunitInfo.userLongitude;
            }

            var frequencyCap = {
                enabled: !!adunitInfo.canUseCookie || true,
                count: adunitInfo.frequencyCap || 0,
                event: adunitInfo.dropCookieOn || ""
            };

            //IF THERE IS A COOKIE DROP CONFIGURATION
            //SET THE PARAMS setc=1 TO CREATE A FIRST PARTY COOKIE
            //WHEN THE SPECIFIC EVENT HAPPEN!
            if (frequencyCap.count > 0 && frequencyCap.enabled && thisEventTrack.type === frequencyCap.event) {
                thisEventTrack.setc = 1;
            }
            //eventTime
            thisEventTrack.fe_time = new Date().getTime();

            //Fire Track Event!
            LIB.console("TRACKING EVENT (" + thisEventTrack.type + ") CAMPAIGN SERVED " + thisEventTrack.idCampaign + " ADUNIT : " + thisEventTrack.idAdunit);
            (new Image()).src = "https://playwat.futureadlabs.com/track?e=" + encodeURIComponent(LIB.btoa(JSON.stringify(thisEventTrack))) + "&ts=" + ord;

            thisEventTrack.setc = 0;
            LIB.handleAudience(thisEventTrack, adunitInfo.audience);

            //THIR PARTY PIXEL: ADVERTISER
            var pixels = [],
                thirdPartyUrl,
                i = 0,
                thirdJS;

            if (adunitInfo.trackingTags[thisEventTrack.type]) {
                pixels = adunitInfo.trackingTags[thisEventTrack.type];

                for (i = 0; i < pixels.length; i++) {
                    thirdPartyUrl = pixels[i].url.replace("[RANDOM]", ord).replace("[timestamp]", ord);
                    switch (pixels[i].type) {
                        case "image":
                            (new Image()).src = thirdPartyUrl;
                            break;
                        case "script":
                            thirdJS = LIB.doc.createElement("script");
                            thirdJS.src = thirdPartyUrl;
                            LIB.doc.body.appendChild(thirdJS);
                            break;
                    }
                }
            }

            // THIRD PARTY TRACKERS!
            if (thisEventTrack.type === "impression" && adunitInfo.imprTrackUrl !== false) {
                (new Image()).src = adunitInfo.imprTrackUrl.replace("[RANDOM]", ord).replace("[timestamp]", ord);
            }
            if (thisEventTrack.type === "completed" && adunitInfo.complTrackUrl !== false) {
                (new Image()).src = adunitInfo.complTrackUrl.replace("[RANDOM]", ord).replace("[timestamp]", ord);
            }
            if (thisEventTrack.type === "started" && adunitInfo.engsTrackUrl !== false) {
                (new Image()).src = adunitInfo.engsTrackUrl.replace("[RANDOM]", ord).replace("[timestamp]", ord);
            }

            // IF THE EVENT IS CONFIGURED AS PAYPOINT EVENT TRACK IT AS AN ENGAGEMENT
            // config.firePaypointTrackurl
            if (thisEventTrack.type === adunitInfo.firePaypointTrackurl) {
                thisEventTrack.type = "engagement";
                LIB.console("TRACKING EVENT (" + thisEventTrack.type + ") CAMPAIGN SERVED " + thisEventTrack.idCampaign + " ADUNIT : " + thisEventTrack.idAdunit);
                (new Image()).src = "https://playwat.futureadlabs.com/track?e=" + encodeURIComponent(LIB.btoa(JSON.stringify(thisEventTrack))) + "&ts=" + ord;

                //IF THE PUBLISHER HAS PASSED A PIXEL TRACKING URL THEN FIRE BACK ON PAYPOINT EVENT.
                if (adunitInfo.payPointTrackUrl !== false) {
                    (new Image()).src = adunitInfo.payPointTrackUrl.replace("[RANDOM]", ord).replace("[timestamp]", ord);
                }
            }

        };


        LIB.clickTrack = function (adunitInfo, clickData) {
            var i = 0,
                ord = Number(ord) || Math.floor(Math.random() * 10e12);
            var clickTrackEndpoint = "https://playwat.futureadlabs.com/r";

            var thisClickEventTrack = {
                "rurl": "http://www.adludio.com",
                "node": "cta"
            };

            if (adunitInfo.trackingTags && adunitInfo.trackingTags["click-through"] &&
                adunitInfo.trackingTags["click-through"][0]) {
                thisClickEventTrack.rurl = adunitInfo.trackingTags["click-through"][0].url;
            }

            if (adunitInfo.map_through_url) {
                thisClickEventTrack.rurl = adunitInfo.map_through_url;
            }

            if (clickData) {
                if (lib.isString(clickData)) {
                    thisClickEventTrack.rurl = clickData;
                } else {
                    thisClickEventTrack.node = clickData.node || "cta";
                    if (clickData.url) {
                        thisClickEventTrack.rurl = clickData.url;
                    }
                }
            }

            var clickEventProps = ["type", "adunitType", "token", "publisherUrl", "idInsertionOrder", "idCampaign", "idAdunit", "idChannel", "language",
                "country", "platform", "deviceType", "browser", "browserVersion", "isUnique"
            ];

            for (i = 0; i < clickEventProps.length; i++) {
                thisClickEventTrack[clickEventProps[i]] = adunitInfo[clickEventProps[i]];
            }

            if (adunitInfo.posLatitude) {
                thisClickEventTrack.posLatitude = adunitInfo.posLatitude;
            }
            if (adunitInfo.posLongitude) {
                thisClickEventTrack.posLongitude = adunitInfo.posLongitude;
            }
            if (adunitInfo.userLatitude) {
                thisClickEventTrack.userLatitude = adunitInfo.userLatitude;
            }
            if (adunitInfo.userLongitude) {
                thisClickEventTrack.userLongitude = adunitInfo.userLongitude;
            }

            //eventTime
            thisClickEventTrack.fe_time = new Date().getTime();
            //Fire Track Event!
            LIB.console("TRACKING EVENT (" + thisClickEventTrack.type + ") CAMPAIGN SERVED " + thisClickEventTrack.idCampaign + " ADUNIT : " + thisClickEventTrack.idAdunit, thisClickEventTrack);


            //AUDIENCE SEGMENT!
            LIB.handleAudience(thisClickEventTrack, adunitInfo.audience);

            var redirectThroughAdludio = clickTrackEndpoint + "?r=" + encodeURIComponent(LIB.btoa(JSON.stringify(thisClickEventTrack))) + "&ts=" + ord;
            //Third party click-tracker from the publisher!
            //IF THE PUBLISHER HAS PASSED A PIXEL TRACKING URL THEN FIRE BACK ON CLICK EVENT.
            if (adunitInfo.clickTrackUrl !== false) {
                return adunitInfo.clickTrackUrl.replace("[RANDOM]", ord).replace("[timestamp]", ord) + encodeURIComponent(redirectThroughAdludio);
            }

            if (adunitInfo.beeswaxClickUrl !== false) {
                if (adunitInfo.beeswaxClickUrl.indexOf('http://') === 0 || adunitInfo.beeswaxClickUrl.indexOf('https://') === 0) {
                    // when the creative is delivered by beeswax the click url starts with http or https and is not encoded so double encode our url at the end of the redirect chain!
                    return adunitInfo.beeswaxClickUrl.replace("[RANDOM]", ord).replace("[timestamp]", ord) + encodeURIComponent(encodeURIComponent(redirectThroughAdludio));
                } else {
                    // when the creative is on the preview of adx the click url is encoded and doesn't start with http:// or https:// and so escape it and do not double encode our url at the end of the redirect chain!
                    return decodeURIComponent(adunitInfo.beeswaxClickUrl).replace("[RANDOM]", ord).replace("[timestamp]", ord) + encodeURIComponent(redirectThroughAdludio);
                }


            }

            //return click url
            return redirectThroughAdludio;
        };

        // Returns a function that will be executed at most one time, no matter how
        // often you call it. Useful for lazy initialization.
        // @implementation: _.once
        LIB.once = function (func) {
            var ran = false,
                memo;
            return function () {
                if (ran) return memo;
                ran = true;
                memo = func.apply(this, arguments);
                func = null;
                return memo;
            };
        };

        //CountDown
        LIB.Countdown = function (options) {
            var timer,
                instance = this,
                seconds = options.seconds || 10,
                updateStatus = options.onUpdateStatus || function () {},
                counterEnd = options.onCounterEnd || function () {},
                counterStop = options.onCounterStop || function () {},
                onCounterStart = options.onCounterStart || function () {};

            function decrementCounter() {
                updateStatus(seconds);
                if (seconds === 0) {
                    counterEnd();
                    //avoiding instance.stop cause i don t want
                    //fire the counterStop callback
                    clearInterval(timer);
                }
                seconds--;
            }

            this.start = function () {
                clearInterval(timer);
                timer = 0;
                seconds = options.seconds;
                timer = setInterval(decrementCounter, 1000);
                onCounterStart();
            };

            this.stop = function () {
                clearInterval(timer);
                counterStop();
            };
        };

        // * Stopwatch class {{{
        LIB.Stopwatch = function () {
            this.startTime = 0;
            this.stopTime = 0;
            this.totalElapsed = 0; // * elapsed number of ms in total
            this.started = false;

            // * pretty static vars
            this.onehour = 1000 * 60 * 60;
            this.onemin = 1000 * 60;
            this.onesec = 1000;
        }
        LIB.Stopwatch.prototype.start = function () {
            if (!this.started) {
                this.startTime = new Date().getTime();
                this.stopTime = 0;
                this.started = true;
            }
        }
        LIB.Stopwatch.prototype.stop = function () {
            if (this.started) {
                this.stopTime = new Date().getTime();
                this.started = false;
                var elapsed = this.stopTime - this.startTime;
                this.totalElapsed += elapsed;
            }
            return this.getElapsed();
        }
        LIB.Stopwatch.prototype.reset = function () {
            this.totalElapsed = 0;
            // * if watch is running, reset it to current time
            this.startTime = new Date().getTime();
            this.stopTime = this.startTime;
        }
        LIB.Stopwatch.prototype.restart = function () {
            this.stop();
            this.reset();
            this.start();
        }
        LIB.Stopwatch.prototype.getElapsed = function () {
            // * if watch is stopped, use that date, else use now
            var elapsed = 0;
            if (this.started)
                elapsed = new Date().getTime() - this.startTime;
            elapsed += this.totalElapsed;

            // var hours = parseInt(elapsed / this.onehour);
            // elapsed %= this.onehour;
            // var mins = parseInt(elapsed / this.onemin);
            // elapsed %= this.onemin;
            // var secs = parseInt(elapsed / this.onesec);
            // var ms = elapsed % this.onesec;

            return elapsed;
        }
        LIB.Stopwatch.prototype.setElapsed = function (hours, mins, secs) {
            this.reset();
            this.totalElapsed = 0;
            this.totalElapsed += hours * this.onehour;
            this.totalElapsed += mins * this.onemin;
            this.totalElapsed += secs * this.onesec;
            this.totalElapsed = Math.max(this.totalElapsed, 0); // * No negative numbers
        }
        // }}}


        LIB.domReady = function (fn) {
            if (LIB.doc.readyState != 'loading') {
                fn();
            } else {
                LIB.doc.addEventListener('DOMContentLoaded', fn);
            }
        }

        LIB.createElem = function (tagName, attributes) {
            var
                elem = LIB.doc.createElement(tagName),
                property;

            for (property in attributes) {
                if (attributes.hasOwnProperty(property)) {
                    elem[property] = attributes[property];
                }
            }

            return elem;
        };

        LIB.renderTpl = function (template, hash) {
            return template.replace(/\[\$([^\]]+)\]/g, function (a, b) {
                return (hash.hasOwnProperty(b)) ? hash[b] : a;
            });
        };

        LIB.updateStyle = function (data, id, style) {
            var cssText = LIB.renderTpl(data.css, {
                id: id
            });
            if (style.hasOwnProperty("styleSheet")) {
                style.styleSheet.cssText = cssText;
            } else {
                style.appendChild(LIB.doc.createTextNode(cssText));
            }
        };

        LIB.lockScreenOrientation = function (orientation) {
            var prefix = 'orientation' in screen ? '' :
                'mozOrientation' in screen ? 'moz' :
                'msOrientation' in screen ? 'ms' :
                false;
            // Determine what version of the API is implemented
            if (prefix !== false) {
                if ('orientation' in screen && 'angle' in screen.orientation) {
                    // The browser supports the new version of the API
                    screen.orientation.lock(orientation).catch(function () {
                        // whatever
                    });
                } else {
                    setTimeout(function () {
                        screen[prefix + (prefix === '' ? 'l' : 'L') + 'ockOrientation'](orientation);
                    }, 1);
                }
            }
        };

        // replaces given anchor by new iframe node & writes given content into
        LIB.renderSafeFrame = function (anchorNode, options) {
            var iframe = null;

            if (anchorNode) {
                iframe = LIB.doc.createElement('iframe');
                iframe.frameBorder = '0';
                if (options.hasOwnProperty("sandbox")) {
                    iframe.sandbox = options.sandbox || "";
                }

                if (options.init) {
                    options.init(iframe, anchorNode);
                }
                if (options.onload) {
                    LIB.onload(iframe, function () {
                        var
                            iframeWindow = iframe.contentWindow || iframe.contentDocument.defaultView,
                            iframeDocument = iframeWindow.document;

                        // init document
                        iframeDocument.open();
                        iframeDocument.write(
                            '<!DOCTYPE html>\n' +
                            '<html>' +
                            '<head>' +
                            '<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">' +
                            '<meta http-equiv="content-type" content="text/html;charset=utf-8" />' +
                            (options.adunitCss ? '<link rel="stylesheet" type="text/css" href="' + options.adunitCss + '" charset="utf-8"/>' : '') +
                            '<title>' + (options.adunitTitle || "") + '</title>' +
                            '</head>' +
                            '<body>' +
                            options.adunitTpl +
                            '</body>' +
                            '</html>'
                        );
                        iframeDocument.close();

                        // IE needs time
                        window.setTimeout(function () {
                            options.onload(iframeWindow, iframeDocument, iframe);
                        }, 0);
                    });
                }
                anchorNode.appendChild(iframe);
            }
            return iframe;
        }

        return LIB;
    }

}());

var lib = new AdludioLib(window);

LinearAd = function () {
    this._slot = null;
    this._listeners = [];

    var id = 'w' + Math.floor(1E10 * Math.random());
    this._gameContainer = lib.createElem('div', {
        id: id
    });
    /*document.createElement('iframe');
    this._gameContainer.frameBorder = '0';
    this._gameContainer.id = 'adunit-flight-7fee5871-0103-4c93-acfa-a1fb779a1c5c';
    this._gameContainer.style.top = '0px';
    this._gameContainer.style.left = '0px';
    this._gameContainer.style.position = "absolute";
    this._gameContainer.style.zIndex = "9999";
    this._gameContainer.sandbox="allow-scripts allow-same-origin allow-popups";*/
};

LinearAd.prototype.handshakeVersion = function (playerVPAIDVersion) {
    return playerVPAIDVersion;
};

LinearAd.prototype.initAd = function (width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    var vpaid = this;
    // slot and videoSlot are passed as part of the environmentVars
    var slot = environmentVars.slot[0] || environmentVars.slot;

    //Parse Json Object containing all info from campaignService
    var adUnitInfo = JSON.parse('{"adunitType":"vpaid","idChannel":"adludio-demo","publisherUrl":"","visitorID":"1e86bd90-ebf0-454f-b9d7-f329cf08e35b","token":"7fee5871-0103-4c93-acfa-a1fb779a1c5c","cap":"{}","aud":{},"country":"vn","language":"en","ip":"210.245.121.234","referer":"https://imasdk.googleapis.com/js/core/bridge3.210.1_en.html","screenWidth":-1,"screenHeigth":-1,"user_agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36","deviceType":"desktop","platform":"linux","browser":"Chrome","browserVersion":"66.0.3359.181","isUnique":0,"payPointTrackUrl":false,"clickTrackUrl":false,"beeswaxClickUrl":false,"imprTrackUrl":false,"engsTrackUrl":false,"complTrackUrl":false,"enhancedVpaidResponse":false,"adunit":"adunit-flight","idPublisher":-1,"idSitePage":-1,"canUseCookie":0,"audience":{},"idCampaign":-1,"idInsertionOrder":-1,"idAdunit":-1,"type":"vpaid","key":"adunit-flight","trackingTags":{},"configuration":{},"firePaypointTrackurl":"started","latestVersion":"9709e023e3b9ea1bba89"}');

    var style, defaultStyle = {
        css: [
            "#[$id] {position:absolute;width:" + width + "px;height:" + height + "px;top:0;left:0;}",
            "#[$id] > iframe {width:100%;height:100%; border:0; position:relative; }"
        ].join("")
    };
    var wrapper = this._gameContainer;

    style = lib.createElem('style', {
        type: 'text/css'
    });
    lib.updateStyle(defaultStyle, wrapper.id, style);
    wrapper.appendChild(style);

    var frameSrc = "https://wat.adludio.com/frame/playroll/" + adUnitInfo.language + "/v1/frame.png";
    var adunitScriptTag = '<script id="adunit" src="https://wat.adludio.com/games/' + adUnitInfo.key + '/' + adUnitInfo.latestVersion + '/game.js" async></script>';

    lib.renderSafeFrame(wrapper, {
        adunitCss: "https://wat.adludio.com/template-css/adludio.css",
        adunitTpl: '<div class="playroll" id="adunit-container">' +
            '<div class="content" id="game-container">' +
            adunitScriptTag +
            '<img id="count-down-text" src="https://wat.adludio.com/frame/skip-countdown/skip-ad-count-text.png" />' +
            '<img id="count-down" />' +
            '<img id="topframe" src="' + frameSrc + '" alt="Inview Ad">' +
            '<div id="skipbutton"></div>' +
            '</div>' +
            '</div>',
        onload: function (iframeWindow, iframeDocument, iframe) {
            var adunitJs = iframeDocument.getElementById('adunit');
            lib.onload(adunitJs, function () {
                /**
                 * StopWatch instance
                 */
                var dwellTimer = new lib.Stopwatch();
                var interactionTimer = new lib.Stopwatch();

                var adunitContainer = iframeDocument.getElementById("adunit-container");
                var topframe = iframeDocument.getElementById("topframe");
                var skipButton = iframeDocument.getElementById("skipbutton");
                var countDownText = iframeDocument.getElementById("count-down-text");
                var countDown = iframeDocument.getElementById("count-down");
                var canvasContainer = iframeDocument.getElementById("game-container");
                var maxWidth = iframeWindow.innerWidth;
                var maxHeight = iframeWindow.innerHeight;
                var topframeHeight = 48 * maxWidth / 741;
                maxHeight = maxHeight - topframeHeight;

                function closeAdunit(reason) {
                    adunitContainer.style.opacity = 0;
                    var transitionEnd = lib.whichTransitionEvent();
                    adunitContainer.addEventListener(transitionEnd, function () {
                        vpaid.fire("AdSkipped");
                        vpaid.fire("AdStopped");
                        slot.removeChild(wrapper);
                    }, false);
                }

                var timers = lib.initTimers(adUnitInfo, topframe, skipButton, {
                    closeAdunit: closeAdunit
                });

                var geneticString = (adUnitInfo && adUnitInfo.configuration && adUnitInfo.configuration.genetic_string) ? adUnitInfo.configuration.genetic_string : "";

                if (iframeWindow.PlayUnlock.configure) {
                    /**
                      autoengage = opts.autoengage || false;
                      autoengageAfter = opts.autoengageAfter || 8000;
                      fullscreencta = opts.fullscreencta || false;
                    */
                    iframeWindow.PlayUnlock.configure(adUnitInfo.configuration);
                }

                iframeWindow.PlayUnlock.create(canvasContainer, maxWidth, maxHeight, function (physicalTarget) {
                    // console.log(physicalTarget);
                    physicalTarget.height = physicalTarget.height || physicalTarget.y;
                    physicalTarget.width = physicalTarget.width || physicalTarget.x;
                    // RESET WIDTH AND HEIGHT!
                    canvasContainer.style.height = (physicalTarget.height + topframeHeight) + "px";
                    canvasContainer.style.width = physicalTarget.width + "px";

                    // ADUNIT EFFECT!!!
                    topframe.style.display = "block";
                    adunitContainer.style.opacity = 1;
                    // HANDLE COMMON ACTIONS
                    lib.onCreatePlayunlock(adUnitInfo, function () {
                        vpaid.fire("AdLoaded");
                    }, timers, iframeDocument, topframeHeight);
                    // start dwell timer
                    dwellTimer.start();
                }, geneticString);

                var started = false;
                iframeWindow.PlayUnlock.attach('onDrop', function (data) {
                    if (!started) {
                        //Only on first drop report a started event
                        adUnitInfo.type = "started";
                        lib.track(adUnitInfo, data);
                        started = true;
                        // start interaction timer
                        interactionTimer.start();
                    }
                    //Every time report a dropped event
                    adUnitInfo.type = "dropped";
                    lib.track(adUnitInfo, data);

                    //Delete AUTO close timeout
                    timers.timeOut.stop();
                });

                iframeWindow.PlayUnlock.attach('onComplete', function () {
                    //track event completed
                    adUnitInfo.type = "completed";
                    lib.track(adUnitInfo);
                    // track interaction time
                    adUnitInfo.type = "interaction_time";
                    lib.track(adUnitInfo, {
                        duration: interactionTimer.getElapsed()
                    });
                    // track dwell time
                    adUnitInfo.type = "dwell_time";
                    lib.track(adUnitInfo, {
                        duration: dwellTimer.getElapsed()
                    });
                    //stop skip timer if running
                    timers.skipAdTimer.stop();
                    //stop timeout
                    timers.timeOut.stop();
                    //CLOSE!
                    //Wait TIMEOUT_ON_COMPLETE before closing the adunit
                    var TIMEOUT_ON_COMPLETE = adUnitInfo.configuration.timeout_on_complete || 3;
                    setTimeout(closeAdunit, TIMEOUT_ON_COMPLETE * 1000);
                });

                iframeWindow.PlayUnlock.attach('onClickThrough', function (overrideUrl) {
                    vpaid.fire("AdClickThru");
                    adUnitInfo.type = "click-through";
                    window.open(lib.clickTrack(adUnitInfo, overrideUrl));
                });

                iframeWindow.PlayUnlock.attach('onGenericEvent', function (type) {
                    if (lib.isString(type)) {
                        adUnitInfo.type = type;
                    } else {
                        adUnitInfo.type = type.type;
                    }
                    lib.track(adUnitInfo);
                });


                //WHEN VIDEO AT THE END!
                lib.trackVideo(iframeWindow.PlayUnlock, adUnitInfo, {
                    onVideoStart: function () {
                        timers.timeOut.stop();
                        //SHOW SKIP!
                        skipButton.style.display = "block";
                    }
                });
            });
        }
    });
    slot.appendChild(wrapper);
};

LinearAd.prototype.getAdIcons = function () {

};
LinearAd.prototype.getAdHeight = function () {

};
LinearAd.prototype.getAdWidth = function () {

};
LinearAd.prototype.startAd = function () {
    this.fire("AdImpression");
    this.fire("AdStarted");
};
LinearAd.prototype.stopAd = function (e, p) {
    this._slot.removeChild(this._gameContainer);
    this.fire("AdSkipped");
    this.fire("AdStopped");
};

LinearAd.prototype.skipAd = function () {
    this._slot.removeChild(this._gameContainer);
    this.fire("AdSkipped");
};

LinearAd.prototype.setAdVolume = function (val) {};
LinearAd.prototype.getAdVolume = function () {};
LinearAd.prototype.getAdDuration = function () {
    return 30;
};
LinearAd.prototype.getAdRemainingTime = function () {};
LinearAd.prototype.resizeAd = function (width, height, viewMode) {};
LinearAd.prototype.pauseAd = function () {};
LinearAd.prototype.resumeAd = function () {};
LinearAd.prototype.expandAd = function () {
    cd
};
LinearAd.prototype.getAdExpanded = function (val) {
    return false;
};
LinearAd.prototype.getAdLinear = function (val) {
    return true;
};
LinearAd.prototype.getAdSkippableState = function (val) {
    return false;
};
LinearAd.prototype.collapseAd = function () {};

// Callbacks for events are registered here
LinearAd.prototype.subscribe = function (aCallback, eventName, aContext) {
    this._listeners.push({
        "name": eventName,
        "callback": aCallback,
        "context": aContext
    });
};
// Callbacks are removed based on the eventName
LinearAd.prototype.unsubscribe = function (eventName) {}

LinearAd.prototype.fire = function (name) {
    var temp = [];
    if (this._listeners.length > 0) {
        for (var x = 0; x < this._listeners.length; x++) {
            if (this._listeners[x].name == name)
                temp.push({
                    "fn": this._listeners[x].callback,
                    "context": (this._listeners[x].context) ? this._listeners[x].context : false
                });
        }
        for (x = 0; x < temp.length; x++) {
            if (temp[x].context !== false) {
                temp[x].fn.apply(temp[x].context);
            } else {
                temp[x].fn.apply(this);
            }
        }
    }
};

getVPAIDAd = function () {
    return new LinearAd();
};