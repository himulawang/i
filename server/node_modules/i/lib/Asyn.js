var EventEmitter = require('events').EventEmitter;

var Asyn = function() {
    EventEmitter.call(this);
    this.jobs = [];
    this.doneCount = 0;
};

Asyn.prototype = new EventEmitter();
Asyn.prototype.constructor = Asyn;

/* func = function() {
 *    normal logic
 *    Asyn.emit('one');
 * }
 * */
Asyn.prototype.add = function(func) {
    this.jobs.push(func);
};

Asyn.prototype.run = function() {
    for (var i in this.jobs) {
        this.jobs[i]();
    }
};

Asyn.prototype.done = function() {
    if (this.jobs.length !== this.doneCount) return;
    this.emit('final');
};

global.Asyn = function() {
    var asyn = new Asyn();
    asyn.on('one', function() {
        ++asyn.doneCount;
        asyn.done();
    });
    return asyn;
};
