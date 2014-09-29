define(function (require, exports, module) {
    'use strict';
    var $ = require('jquery');

    function Score(num, fraction) {
        this.fraction = fraction;
        this.num = num;
        this.init();
    }
    Score.prototype = {
        constructor: Score,
        init: function () {
            this.fraction = 0;
            this.num = 0;
            this.renderUI();
        },
        addFration: function (addValue) {
            var self = this;
            self.fraction += addValue;
            self.num += 1;
            self.renderUI();
        },
        renderUI: function () {
            $('.score-wrap>b').text(this.fraction);
        }
    };
    module.exports = Score;
});