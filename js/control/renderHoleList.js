define(function (require, exports, module) {
    'use strict';
    var Hole = require('../classes/hole');

    function renderHoleList() {
        var holeList = [],
            i = 0,
            myhole;
        for (i; i < 9; i = i + 1) {
            myhole = new Hole(false, false, '', '', false);
            holeList.push(myhole);
        }
        return holeList;
    }
    module.exports = renderHoleList;
});