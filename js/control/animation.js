define(function (require, exports, module) {
    'use strict';
    var $ = require('jquery'),
        randomNum = require('./random'),
        renderHoleList = require('./renderHoleList'),
        Appoint = require('../classes/appoint'),
        Score = require('../classes/score'),
        ParseConfig = require('./parseConfig'),
        AnimalStatus = require('./animalStatus'),
        UA = require('./device'),
        win = window,
        document = win.document,
        TOUCH = UA.os === 'windows' ? 'click' : 'touchstart',
        isSupportCss = (UA.os === 'android' && UA.android < 2.4) ? false : true,
        templateExp = /\\?\{([^{}]+)\}/g;
    function Animation(cfg) {
        var self = this;
        self.params = {
            timeCountDown: 0,
            randomArraylen: 0,
            randomArray: [],
            holeObjCollect: [],
            scoreObj: {},
            appointObj: {},
            parseConfigObj: {},
            animalStatus: {}
        };
        //数组格式化之后获取
        self.parseTempConfig = {
            displayNum: 0,
            showTime: 0,
            intervalTime: 0
        };
        self.config = cfg || {};
        self.params.parseConfigObj = new ParseConfig(self.config);
        self.parseTempConfig = self.params.parseConfigObj.tempConfig;
        self.init();
    }
    Animation.attr = {
        //排除重复的数据
        isRepeat: function (currentArray, currentNum) {
            var currentArrayLen = currentArray.length,
                i = 0;
            for (i; i < currentArrayLen; i = i + 1) {
                if (currentArray[i] === currentNum) {
                    return true;
                }
            }
            return false;
        },
        filterRandomArray: function (randomArray, holeList, displayNum) {
            var randomValue = randomNum(0, 9),
                randomArraylen = 0;
            //洞口是否被占用
            //生成数字是否在数组中重复
            if (this.isRepeat(randomArray, randomValue)) {
                return this.filterRandomArray(randomArray, holeList, displayNum);
            }
            randomArray.push(randomValue);
            randomArraylen = randomArray.length;
            holeList[randomValue].status = true;
            //添加完成时是否已经大于当前需要出现个数，如果不足，重复执行
            if (randomArraylen < displayNum) {
                return this.filterRandomArray(randomArray, holeList, displayNum);
            }
            return randomArray;
        },
        /**
         * 简化的输出模板
         */
        substituteTemplate: function (template, map) {
            return template.replace(templateExp, function (match, name) {
                return (map[name] === undefined) ? '' : map[name];
            });
        },
        getLevelItem: function (items, num) {
            var i = 0,
                levelObj = {
                    title: '',
                    txt: '',
                    level: 0
                };
            for (i; i < items.length; i = i + 1) {
                if (num >= items[i][1] && (num <= items[i][2] || items[i][2] === 'Infinity')) {
                    levelObj = {
                        title: items[i][3],
                        txt: items[i][4],
                        level: items[i][0]
                    };
                }
            }
            return levelObj;
        },
        renderUIConclusion: function (msg, scoreConfig, levelConfig) {
            var currentLevelObj = {}, comboObj = {}, tempFraction = 0;
            currentLevelObj = this.getLevelItem(levelConfig, scoreConfig.num);
            tempFraction = Math.floor(scoreConfig.fraction * 0.012);
            tempFraction = tempFraction > 99 ? 99 : tempFraction;
            comboObj = {
                title: currentLevelObj.title,
                ratio: tempFraction,
                num:scoreConfig.num,
                score:scoreConfig.fraction
            };
            win.shareData.tTitle = this.substituteTemplate(msg, comboObj);
            $('.evaluation>.title').text(currentLevelObj.title);
            $('.evaluation>.level').css('background-position', '0 ' + (100 - currentLevelObj.level * 0.2 * 100) + '%');
            $('.evaluation>.msg').text(currentLevelObj.txt);
            $('.conclusion-msg .score').text(scoreConfig.fraction);
            $('.blue-mask').show();
            $('.conclusion-msg').show();
        }
    };
    Animation.prototype = {
        constructor: Animation,
        init: function () {
            var self = this;
            self.renderUI();
            self.bindEvents();
        },
        renderUI: function () {
            var self = this;
            self.params.holeObjCollect = renderHoleList();
            self.params.scoreObj = new Score(0, 0);
            self.params.appointObj = new Appoint(self.config.appoint);
            self.params.animalStatus = new AnimalStatus();
        },
        bindEvents: function () {
            var self = this;
            self.initAnimate();
            //开始单击事件
            $(document).on(TOUCH, self.config.holeClass, function () {
                var target = this,
                    currentself = $(target),
                    currentIndex = $(self.config.holeClass).index(target),
                    currentholeObj = self.params.holeObjCollect[currentIndex],
                    filterSupport;
                function supportAction() {
                    if (isSupportCss) {
                        filterSupport = function () {
                            if (currentholeObj.status && !currentself.hasClass(self.config.hitClass)) {
                                currentholeObj.status = true;
                                currentholeObj.beat = true;
                                self.params.scoreObj.addFration(self.config.addFrationValue);
                                currentself.removeClass(self.config.showClass);
                                currentself.addClass(self.config.hitClass);
                                setTimeout(function () {
                                    self.params.timeCountDown = self.params.timeCountDown + 1;
                                    currentholeObj.status = false;
                                    currentholeObj.beat = false;
                                    self.stopAnimate();
                                }, self.parseTempConfig.showTime);
                            }
                        };
                    } else {
                        filterSupport = function () {
                            if (currentholeObj.status && !currentholeObj.touchStatus) {
                                currentholeObj.touchStatus = true;
                                self.params.scoreObj.addFration(self.config.addFrationValue);
                                self.params.animalStatus.hitStatus(currentholeObj, currentIndex, function () {
                                    self.params.timeCountDown = self.params.timeCountDown + 1;
                                    currentholeObj.status = false;
                                    currentholeObj.beat = false;
                                    currentholeObj.touchStatus = false;
                                    self.stopAnimate();
                                }, self.parseTempConfig.showTime);
                            }
                        };
                    }
                }
                if (filterSupport === undefined) {
                    supportAction();
                }
                filterSupport();
            });
        },
        initAnimate: function () {
            var self = this,
                randomArray = [];
            self.params.parseConfigObj.updateConfig();
            self.parseTempConfig = this.params.parseConfigObj.tempConfig;
            //返回随机数组
            self.params.randomArray = randomArray = Animation.attr.filterRandomArray([], self.params.holeObjCollect, self.parseTempConfig.displayNum);
            self.starAnimate(randomArray, self.params.holeObjCollect);
        },
        destory: function () {
            var self = this;
            $(document).off(TOUCH, self.config.holeClass);
        },
        //把所有的对象进行复位
        resetPosition: function () {
            var self = this;
            if (isSupportCss) {
                $(self.config.holeClass).removeClass(self.config.showClass);
                $(self.config.holeClass).removeClass(self.config.hitClass);
            } else {
                $(self.config.holeClass).css('background-position', '0 0');
            }
        },
        starAnimate: function (randomArray) {
            var self = this,
                holeQueue = 0,
                randomArraylen = 0,
                j = 0,
                currentObj = {};

            //在移动完成时计时对象,需要等待css动画完成
            self.params.timeCountDown = 0;
            randomArraylen = self.params.randomArraylen = randomArray.length;
            for (j; j < randomArraylen; j = j + 1) {
                if (isSupportCss) {
                    $(self.config.holeClass).eq(randomArray[j]).addClass(self.config.showClass);
                    setTimeout(function () {
                        currentObj = self.params.holeObjCollect[randomArray[holeQueue]];
                        holeQueue = holeQueue + 1;
                        if (!currentObj.beat) {
                            self.params.timeCountDown = self.params.timeCountDown + 1;
                            currentObj.status = false;
                            self.params.appointObj.reduce();
                            self.stopAnimate();
                        }
                    }, self.parseTempConfig.showTime);
                } else {
                    currentObj = self.params.holeObjCollect[randomArray[j]];
                    self.params.animalStatus.normalStatus(currentObj, randomArray[j], function(){
                        holeQueue = holeQueue + 1;
                        if (!currentObj.beat) {
                            self.params.timeCountDown = self.params.timeCountDown + 1;
                            currentObj.status = false;
                            self.params.appointObj.reduce();
                            self.stopAnimate();
                        }
                    }, self.parseTempConfig.showTime);
                }
            }
        },
        stopAnimate: function () {
            var self = this;
            if (self.params.timeCountDown >= self.params.randomArraylen && self.params.appointObj.num > 0) {
                self.resetPosition();
                setTimeout(function () {
                    self.initAnimate();
                }, self.parseTempConfig.intervalTime);
            }
            if (self.params.appointObj.num === 0) {
                self.resetPosition();
                Animation.attr.renderUIConclusion(self.config.conclusion[0], self.params.scoreObj, self.config.levelItems);
            }
        }
    };
    module.exports = Animation;
});