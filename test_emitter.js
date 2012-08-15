require('./lib/Asyn.js');
require('./lib/Syn.js');
var redis = require('redis');
var db = redis.createClient();

// test
var evt = Syn();

evt.add(function(count) {
    db.incrby('testasyn', count ,function(err, data) {
        evt.emit('one', data);
    });
}, 2);

evt.add(function(count) {
    db.incrby('testasyn', count ,function(err, data) {
        evt.emit('one', data);
    });
}, 3);

evt.add(function(count) {
    db.incrby('testasyn', count ,function(err, data) {
        evt.emit('one', data);
    });
}, 2);

evt.add(function(count) {
    db.incrby('testasyn', count ,function(err, data) {
        evt.emit('one', data);
    });
}, 3);

evt.on('final', function(data) {
    console.log('final emitted');
    console.log(data);
});

evt.run();
