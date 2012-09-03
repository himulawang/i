var EventEmitter = require('events').EventEmitter;

var Syn = function() {
    EventEmitter.call(this);
    var self = this;
    this.jobs = [];
    this.running = 0;
    this.on('one', function() {
        ++this.running;
        self.done();
    });
};

Syn.prototype = new EventEmitter();
Syn.prototype.constructor = Syn;

Syn.prototype.add = function(func) {
    this.jobs.push(func);
};

Syn.prototype.run = function() {
    this.jobs[this.running]();
};

Syn.prototype.done = function() {
    if (this.jobs.length !== this.running) {
        this.run();
        return;
    }
    this.emit('final');
};

global.Syn = Syn;
