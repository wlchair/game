/**
 * 难点总结：
 * 1. html，css所有元素都要做成按比例缩放，即：所有js方法也要按照比例进行动画效果
 * 2. 同时多点出发animate事件，点击一个元素时，不影响其他元素进行动画效果(已经用css代替，如果用js交互设计为难点)
 */
define(function (require, exports, module) {
    'use strict';
    var $ = require('jquery'),
        Animation = require('./control/animation'),
        screenSize = require('./control/screenSize'),
        UA = require('./control/device'),
        config = {
            //命
            appoint: 3,
            //打中加分
            addFrationValue: 99,
            //开始时间，结束时间，同时出现个数，出现时间,出现间隔时间
            items: [
                [0, 10, 1, 1200, 500],
                [11, 30, 2, 1200, 500],
                [31, 60, 3, 1200, 500],
                [61, 150, 4, 1200, 500],
                [151, 'Infinity', 5, 1200, 500],
            ],
            //所有窗户
            holeClass: '.hole-wrap>li',
            showClass: 'show',
            hitClass: 'halo',
            //结束语句
            conclusion: [
                '我打掉了{num}个小三，得分{score}你能超过我吗？'
            ],
            levelItems: [
                [0, 0, 3, '备胎都没有你的份', '大妹子，你就是蜡烛，点燃自己，照亮小三的幸福，你就是春蚕，吐丝到死，给小三做衣裳。神马？！你不服，那还不赶快再挑战一次，打走你爱情中的小三。'],
                [1, 4, 10, '忍者神龟', '能走到这一步大妹子你也够弱的了，你看他俩那么幸福，你还在蹲墙角画圈圈诅咒他们，不想做万年忍者神龟？快点再来挑战一次吧！'],
                [2, 11, 30, '甄嬛传的皇后', '这么称呼你，你可千万别高兴。皇后就是一个摆设，任何一个人，都能分分钟上位。要想打退小三，你且想想后宫佳丽三千，真是要活到老打到老，这是一场持久战。快来分享到朋友圈，让姐妹给你支支招。'],
                [3, 31, 50, '且行且珍惜', '小三和生活一样，都是个碧池。不同的是：生活让你想爱她，小三让你想揍她。能看到这里，证明你已经具备了打败小三的基本能力，但是爱情路途漫长，你能走几步呢？快来分享到朋友圈，让你朋友猜一猜！'],
                [4, 51, 80, '全自动恋人', '上得了厅堂，下得了厨房，hold的住小三，打得过流氓。你眼光六路，耳听八方。任何风吹草动都瞒不过你的眼睛，你的嗅觉超人，时刻在远处用B46准备好把一切不请自来的小三爆头，你这么屌你朋友知道吗？还不分享给他们看看！'],
                [5, 81, 'Infinity', '24K纯钛合金女神', '十步杀一人， 千里不留行。事了拂衣去，深藏身与名。你总能第一时间找到任何苗头，把一切不应该出现的人清除干净。在你全方位360度的保护下，你的爱情必定茁壮成长，开出最美丽的花朵！你这么牛X不分享给其他朋友看一看吗！'],
            ]
        },
        initObj,
        document = window.document,
        doc = $(document),
        TOUCHE = UA.os === 'windows' ? 'click' : 'touchstart';
    function initGame(config) {
        setTimeout(function () {
            if (initObj !== undefined && initObj !== null) {
                initObj.destory();
                initObj = null;
            }
            initObj = new Animation(config);
        }, 200);
    }
    function setHeight(currentObj, widthRatio, heightRatio) {
        var currentHeight = screenSize().width * widthRatio * heightRatio + 'px';
        $(currentObj).css('height', currentHeight);
    }
    $(function () {
        setHeight('.init-btn', 0.58, 0.306);
        setHeight('.hole-wrap', 0.9, 1.222);
        setHeight('.life-wrap', 0.34, 0.44);
        setHeight('.again-btn', 0.43, 0.280);
        setHeight('.share-btn', 0.53, 0.230);
        setHeight('.down-btn', 1, 0.119);
        setHeight('.evaluation>.level', 1, 0.07);
        doc.on(TOUCHE, '.again-btn', function () {
            $('.conclusion-msg').hide();
            $('.blue-mask').hide();
            initGame(config);
        });
        doc.on(TOUCHE, '.init-btn', function () {
            initGame(config);
            $('.game-cover').hide();
        });
        doc.on(TOUCHE, '.share-btn', function () {
            $('.black-mask').show();
        });
        doc.on(TOUCHE, '.black-mask', function () {
            if ($(this).css('display') !== 'none') {
                $(this).hide();
            }
        });
    });
});