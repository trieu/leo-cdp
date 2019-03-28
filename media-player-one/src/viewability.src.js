/**
 * ##########################################################
 * viewability check @see https://github.com/kahwee/viewability (1.93kb)
 */
!(function (e, t) {
    "object" == typeof exports && "object" == typeof module ?
        (module.exports = t()) :
        "function" == typeof define && define.amd ?
        define([], t) :
        "object" == typeof exports ?
        (exports.viewability = t()) :
        (e.viewability = t());
})("undefined" != typeof self ? self : this, function () {
    return (function (e) {
        function t(u) {
            if (n[u]) return n[u].exports;
            var o = (n[u] = {
                i: u,
                l: !1,
                exports: {}
            });
            return e[u].call(o.exports, o, o.exports, t), (o.l = !0), o.exports;
        }
        var n = {};
        return (
            (t.m = e),
            (t.c = n),
            (t.d = function (e, n, u) {
                t.o(e, n) ||
                    Object.defineProperty(e, n, {
                        configurable: !1,
                        enumerable: !0,
                        get: u
                    });
            }),
            (t.n = function (e) {
                var n =
                    e && e.__esModule ?
                    function () {
                        return e.default;
                    } :
                    function () {
                        return e;
                    };
                return t.d(n, "a", n), n;
            }),
            (t.o = function (e, t) {
                return Object.prototype.hasOwnProperty.call(e, t);
            }),
            (t.p = ""),
            t((t.s = 2))
        );
    })([
        function (e, t, n) {
            "use strict";
            e.exports = function (e) {
                var t = window.innerHeight,
                    n = e.getBoundingClientRect().top,
                    u = e.getBoundingClientRect().bottom,
                    o = u - n;
                return n > t ? {
                        value: 0,
                        state: "EL_IS_BELOW_VIEW"
                    } :
                    u <= 0 ? {
                        value: 0,
                        state: "EL_IS_ABOVE_VIEW"
                    } :
                    n >= 0 && u <= t ? {
                        value: 1,
                        state: "EL_IS_WITHIN_VERTICAL_VIEW"
                    } :
                    n < 0 && u > t ? {
                        value: t / o,
                        state: "EL_BOTTOM_AND_TOP_TRUNCATED"
                    } :
                    n < 0 && u <= t ? {
                        value: u / o,
                        state: "EL_TOP_TRUNCATED"
                    } :
                    n >= 0 && u > t ? {
                        value: (t - n) / o,
                        state: "EL_BOTTOM_TRUNCATED"
                    } : {
                        value: 0,
                        state: "EL_IS_NOT_WITHIN_VIEW"
                    };
            };
        },
        function (e, t, n) {
            "use strict";
            e.exports = function (e) {
                var t = window.innerWidth,
                    n = e.getBoundingClientRect().left,
                    u = e.getBoundingClientRect().right,
                    o = u - n;
                return n > t ? {
                        value: 0,
                        state: "EL_IS_TOO_RIGHT"
                    } :
                    u <= 0 ? {
                        value: 0,
                        state: "EL_IS_TOO_LEFT"
                    } :
                    n >= 0 && u <= t ? {
                        value: 1,
                        state: "EL_IS_WITHIN_HORIZONTAL_VIEW"
                    } :
                    n < 0 && u > t ? {
                        value: t / o,
                        state: "EL_LEFT_AND_RIGHT_TRUNCATED"
                    } :
                    n < 0 && u <= t ? {
                        value: u / o,
                        state: "EL_LEFT_TRUNCATED"
                    } :
                    n >= 0 && u > t ? {
                        value: (t - n) / o,
                        state: "EL_RIGHT_TRUNCATED"
                    } : {
                        value: 0,
                        state: "EL_IS_NOT_WITHIN_VIEW"
                    };
            };
        },
        function (e, t, n) {
            "use strict";
            e.exports = {
                vertical: n(0),
                horizontal: n(1),
                isElementOnScreen: n(3)
            };
        },
        function (e, t, n) {
            "use strict";
            var u = n(1),
                o = n(0);
            e.exports = function (e, t) {
                return t ? o(e).value * u(e).value == 1 : o(e).value * u(e).value > 0;
            };
        }
    ]);
});