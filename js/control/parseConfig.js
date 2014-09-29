define(function (require, exports, module) {
    'use strict';
    function parseConfig(cfg) {
        this.config = cfg || {};
        if (!this.config.items instanceof Array || this.config.items.length === 0) {
            return;
        }
        this.params = {
            currentIndex: 0,
            initStamp: Math.floor(new Date() / 1000),
            tempConfig: {},
            currentArray: this.config.items || [],
            starTime: 0,
            endTime: 0
        };
        this.tempConfig = {
            displayNum: 0,
            showTime: 0,
            interValTime: 0
        };
        this.init();
    }
    parseConfig.prototype = {
        constructor: parseConfig,
        init: function () {
            var self = this;
            self.setChange();
        },
        updateConfig: function () {
            var self = this,
                currentStamp = Math.floor(new Date() / 1000),
                timer = 0;
            timer = currentStamp - this.params.initStamp;
            if (self.params.endTime !== 'Infinity' && !(timer >= self.params.starTime && timer <= self.params.endTime)) {
                self.params.currentIndex = self.params.currentIndex + 1;
                self.setChange();
            }
        },
        setChange: function () {
            var self = this;
            self.params.starTime = self.params.currentArray[self.params.currentIndex][0];
            self.params.endTime = self.params.currentArray[self.params.currentIndex][1];
            self.tempConfig = {
                displayNum: self.params.currentArray[self.params.currentIndex][2],
                showTime: self.params.currentArray[self.params.currentIndex][3],
                interValTime: self.params.currentArray[self.params.currentIndex][4]
            };
        }
    };
    module.exports = parseConfig;
});