var EventEmitter = require('events').EventEmitter;

var Asyn = function() {
    EventEmitter.call(this);
    this.jobs = [];
    this.args = [];
    this.data = [];
    this.doneCount = 0;
};

Asyn.prototype = new EventEmitter();
Asyn.prototype.constructor = Asyn;

/* func = function() {
 *    normal logic
 *    Asyn.emit('one', data);
 * }
 * */
Asyn.prototype.add = function(func, args) {
    this.jobs.push(func);
    this.args.push(args);
};

Asyn.prototype.run = function() {
    for (var i in this.jobs) {
        this.jobs[i](this.args[i]);
    }
};

Asyn.prototype.done = function() {
    if (this.jobs.length !== this.doneCount) return;
    this.emit('final', this.data);
};

global.Asyn = function() {
    var asyn = new Asyn();
    asyn.on('one', function(data) {
        asyn.data.push(data);
        console.log('one emitted');
        ++asyn.doneCount;
        asyn.done();
    });
    return asyn;
};
