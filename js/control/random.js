define(function (require, exports, module) {
    'use strict';

    function randomNum(argMin, argMax) {
        return Math.floor(Math.random() * argMax + argMin);
    }
    module.exports = randomNum;
});