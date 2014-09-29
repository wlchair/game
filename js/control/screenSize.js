define(function (require, exports, module) {
    'use strict';

    function getScreenSize() {
        var screenSize = {
            width: 0,
            height: 0
        },
            win = window,
            doc = win.document;
        if (win.innerWidth !== null && win.innerHeight !== null) {
            screenSize.width = win.innerWidth;
            screenSize.height = win.innerHeight;
        } else {
            screenSize.width = doc.body.clientWidth;
            screenSize.height = doc.body.clientHeight;
        }
        return screenSize;
    }
    module.exports = getScreenSize;
});