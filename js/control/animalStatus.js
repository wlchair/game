define(function (require, exports, module) {
    'use strict';
    var $ = require('jquery');

    function AnimalStatus() {
        this.currentClass = '.hole-wrap>li';
        this.backgroundPosition = 'background-position';
    }
    AnimalStatus.prototype = {
        constructor: AnimalStatus,
        normalStatus: function (cobj, currentIndex, complateFn, intervalTime) {
            var self = this,
                i = 0,
                currentDOMObj = $(self.currentClass).eq(currentIndex);
            cobj.normalAnimation = setInterval(function () {
                i = i + 1;
                if (i === 6) {
                    clearInterval(cobj.normalAnimation);
                    complateFn();
                    return;
                }
                if (i === 1 || i === 2 || i === 3) {
                    currentDOMObj.css(self.backgroundPosition, '0 ' + i * 25 + '%');
                }
                if (i === 5) {
                    currentDOMObj.css(self.backgroundPosition, '0 0');
                }
            }, intervalTime / 5);
        },
        hitStatus: function (cobj, currentIndex, complateFn, intervalTime) {
            var self = this,
                i = 4,
                currentDOMObj = $(self.currentClass).eq(currentIndex);
            if (cobj.normalAnimation !== '') {
                clearInterval(cobj.normalAnimation);
            }
            currentDOMObj.css(self.backgroundPosition, '0 ' + i * 25 + '%');
            cobj.hitAnimation = setInterval(function () {
                i = i + 1;
                if (i === 6) {
                    clearInterval(cobj.hitAnimation);
                    complateFn();
                    return;
                }
                if (i === 5) {
                    currentDOMObj.css(self.backgroundPosition, '0 0');
                }
            }, intervalTime / 2);
        }
    };

    module.exports = AnimalStatus;
});