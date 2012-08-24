/*------------- Config -------------*/
var threads = 1;

var fc = require('./fc.js');
var i999 = require('./i999.js');
//var i1001 = require('./i1001.js');
var i3002 = require('./i3002.js');
/*
var i3003 = require('./i3003.js');
var i3005 = require('./i3005.js');
var i3006 = require('./i3006.js');
var i3007 = require('./i3007.js');
var i3014 = require('./i3014.js');
var i3008 = require('./i3008.js');
var i3011 = require('./i3011.js');
var i7001 = require('./i7001.js');
var i7002 = require('./i7002.js');
var i7004 = require('./i7004.js');
var i7003 = require('./i7003.js');
var i7005 = require('./i7005.js');
var i5001 = require('./i5001.js');
var i5002 = require('./i5002.js');
var i5003 = require('./i5003.js');
*/

global.data = [];
var queuePool = [];

for (var i = 0; i < threads; ++i) {
    queuePool[i] = [];
    data[i] = {
        caseCount: 0,
        successCaseCount: 0,
        startTimestamp: Date.now(),
    };

    queuePool[i] = fc.lineUp(queuePool[i], i999.getQueue(data[i]));              // register
    //queuePool[i] = fc.lineUp(queuePool[i], i1001.getQueue(data[i]));             // login

    // tavern
    queuePool[i] = fc.lineUp(queuePool[i], i3002.getQueue(data[i]));             // refresh candidate card
    /*
    queuePool[i] = fc.lineUp(queuePool[i], i3003.getQueue(data[i]));             // hire card

    // barrack
    queuePool[i] = fc.lineUp(queuePool[i], i3005.getQueue(data[i]));             // submit formation

    // castle
    queuePool[i] = fc.lineUp(queuePool[i], i3006.getQueue(data[i]));             // harvest castle

    // prison
    queuePool[i] = fc.lineUp(queuePool[i], i3007.getQueue(data[i]));             // random slave list
    queuePool[i] = fc.lineUp(queuePool[i], i3014.getQueue(data[i]));             // unlock slave slot
    queuePool[i] = fc.lineUp(queuePool[i], i3008.getQueue(data[i]));             // enslave
    queuePool[i] = fc.lineUp(queuePool[i], i3011.getQueue(data[i]));             // giveup slave

    // item
    queuePool[i] = fc.lineUp(queuePool[i], i7001.getQueue(data[i]));             // get shop item list
    queuePool[i] = fc.lineUp(queuePool[i], i7002.getQueue(data[i]));             // buy item
    queuePool[i] = fc.lineUp(queuePool[i], i7004.getQueue(data[i]));             // use item
    queuePool[i] = fc.lineUp(queuePool[i], i7003.getQueue(data[i]));             // sell item
    queuePool[i] = fc.lineUp(queuePool[i], i7005.getQueue(data[i]));             // compound gem

    // card strengthen
    queuePool[i] = fc.lineUp(queuePool[i], i5001.getQueue(data[i]));             // strengthen card
    queuePool[i] = fc.lineUp(queuePool[i], i5002.getQueue(data[i]));             // insert gem
    queuePool[i] = fc.lineUp(queuePool[i], i5003.getQueue(data[i]));             // remove gem
    */
}

for (var i = 0; i < threads; ++i) {
    fc.run(i, queuePool[i], data[i]);
}
