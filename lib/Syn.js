var EventEmitter = require('events').EventEmitter;

var Syn = function() {
    EventEmitter.call(this);
    this.jobs = [];
    this.args = [];
    this.data = [];
    this.running = 0;
};

Syn.prototype = new EventEmitter();
Syn.prototype.constructor = Syn;

Syn.prototype.add = function(func, args) {
    this.jobs.push(func);
    this.args.push(args);
};

Syn.prototype.run = function() {
    this.jobs[this.running](this.args[this.running]);
};

Syn.prototype.done = function() {
    if (this.jobs.length !== this.running) {
        this.run();
        return;
    }
    this.emit('final', this.data);
};

global.Syn = function() {
    var syn = new Syn();
    syn.on('one', function(data) {
        syn.data[syn.running] = data;
        console.log('one emmited');
        ++this.running;
        syn.done();
    });
    return syn;
};
