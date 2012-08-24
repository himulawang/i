var cp = require('child_process');

var works = [];
for (var i = 0; i < 5; ++i) {
    works[i] = cp.fork('./run.js');
}
