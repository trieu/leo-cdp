var VMAP = function () {
    "use strict";
    var t = function (t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        },
        e = function () {
            function t(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var a = e[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(t, a.key, a)
                }
            }
            return function (e, n, a) {
                return n && t(e.prototype, n), a && t(e, a), e
            }
        }(),
        n = function (t) {
            if (Array.isArray(t)) {
                for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
                return n
            }
            return Array.from(t)
        },
        a = function e(n) {
            for (var a in t(this, e), this.id = n.getAttribute("id"), this.allowMultipleAds = n.getAttribute("allowMultipleAds"), this.followRedirects = n.getAttribute("followRedirects"), this.vastAdData = null, this.adTagURI = null, this.customData = null, n.childNodes) {
                var r = n.childNodes[a];
                switch (r.localName) {
                    case "AdTagURI":
                        this.adTagURI = {
                            templateType: r.getAttribute("templateType"),
                            uri: (r.textContent || r.text || "").trim()
                        };
                        break;
                    case "VASTAdData":
                        for (this.vastAdData = r.firstChild; this.vastAdData && 1 !== this.vastAdData.nodeType;) this.vastAdData = this.vastAdData.nextSibling;
                        break;
                    case "CustomAdData":
                        this.customData = r
                }
            }
        };

    function r(t, e) {
        return [].concat(n(t.childNodes)).filter(function (t) {
            return t.nodeName === e || e === "vmap:" + t.nodeName || t.nodeName === "vmap:" + e
        })
    }

    function i(t) {
        var e = {
            attributes: {},
            children: {},
            value: {}
        };
        return e.value = function (t) {
            var e = t && t.childNodes && [].concat(n(t.childNodes));
            if (!e) return {};
            var a = e.filter(function (t) {
                return "#cdata-section" === t.nodeName
            });
            if (a && a.length > 0) try {
                return JSON.parse(a[0].data)
            } catch (t) {}
            return e.reduce(function (t, e) {
                var n = "";
                switch (e.nodeName) {
                    case "#text":
                        n = e.textContent.trim();
                        break;
                    case "#cdata-section":
                        n = e.data
                }
                return t + n
            }, "")
        }(t), t.attributes && [].concat(n(t.attributes)).forEach(function (t) {
            t.nodeName && void 0 !== t.nodeValue && null !== t.nodeValue && (e.attributes[t.nodeName] = t.nodeValue)
        }), t.childNodes && [].concat(n(t.childNodes)).filter(function (t) {
            return "#" !== t.nodeName.substring(0, 1)
        }).forEach(function (t) {
            e.children[t.nodeName] = i(t)
        }), e
    }
    var o = function () {
        function n(e) {
            for (var o in t(this, n), this.timeOffset = e.getAttribute("timeOffset"), this.breakType = e.getAttribute("breakType"), this.breakId = e.getAttribute("breakId"), this.repeatAfter = e.getAttribute("repeatAfter"), this.adSource = null, this.trackingEvents = [], this.extensions = [], e.childNodes) {
                var s = e.childNodes[o];
                switch (s.localName) {
                    case "AdSource":
                        this.adSource = new a(s);
                        break;
                    case "TrackingEvents":
                        for (var c in s.childNodes) {
                            var u = s.childNodes[c];
                            "Tracking" === u.localName && this.trackingEvents.push({
                                event: u.getAttribute("event"),
                                uri: (u.textContent || u.text || "").trim()
                            })
                        }
                        break;
                    case "Extensions":
                        this.extensions = r(s, "Extension").map(function (t) {
                            return i(t)
                        })
                }
            }
        }
        return e(n, [{
            key: "track",
            value: function (t, e) {
                for (var n in this.trackingEvents) {
                    var a = this.trackingEvents[n];
                    if (a.event === t) {
                        var r = a.uri;
                        "error" === a.event && (r = r.replace("[ERRORCODE]", e)), this.tracker(r)
                    }
                }
            }
        }, {
            key: "tracker",
            value: function (t) {
                "undefined" != typeof window && null !== window && ((new Image).src = t)
            }
        }]), n
    }();
    return function e(n) {
        if (t(this, e), null == (null != n ? n.documentElement : void 0) || "VMAP" !== n.documentElement.localName) throw new Error("Not a VMAP document");
        for (var a in this.version = n.documentElement.getAttribute("version"), this.adBreaks = [], this.extensions = [], n.documentElement.childNodes) {
            var s = n.documentElement.childNodes[a];
            switch (s.localName) {
                case "AdBreak":
                    this.adBreaks.push(new o(s));
                    break;
                case "Extensions":
                    this.extensions = r(s, "Extension").map(function (t) {
                        return i(t)
                    })
            }
        }
    }
}();