define(function (require, exports, module) {
    'use strict';
    var $ = require('jquery');

    function Appoint(num) {
        this.num = num;
        this.init();
    }
    Appoint.prototype = {
        constructor: Appoint,
        init: function () {
            var i = 0,
                liList = '',
                len = this.num;
            for (i; i < len; i = i + 1) {
                liList += '<li></li>';
            }
            this.renderUI(liList);
        },
        reduce: function () {
            this.num = this.num - 1;
            $('.life-wrap>li:first').remove();
        },
        renderUI: function (liList) {
            $('.life-wrap').html(liList);
        }
    };
    module.exports = Appoint;
});