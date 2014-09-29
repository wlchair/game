define(function (require, exports, module) {
    'use strict';
    var win = typeof window !== 'undefined' ? window : {},
        ua = win.navigator && win.navigator.userAgent || '',
        UA = {
            os: '',
            android: ''
        };

    function numberify(s) {
        // convert '1.2.3.4' to 1.2
        return parseFloat(s);
    }

    function init() {
        var m;
        if (/ Android/i.test(ua)) {
            if (/Mobile/.test(ua)) {
                UA.os = 'android';
            }
            m = ua.match(/Android ([^\s]*);/);
            if (m && m[1]) {
                UA.android = numberify(m[1]);
            }
        }
    }
    init();
    module.exports = UA;
});