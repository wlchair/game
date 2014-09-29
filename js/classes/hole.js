define(function (require, exports, module) {
    'use strict';

    function Hole(status, beat, normalAnimation, hitAnimation, touchStatus) {
        this.status = status;
        this.beat = beat;
        this.normalAnimation = normalAnimation;
        this.hitAnimation = hitAnimation;
        this.touchStatus = touchStatus;
    }
    module.exports = Hole;
});
