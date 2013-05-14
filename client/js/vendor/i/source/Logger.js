!function() {
    var LOG_TYPE = {
        3: 'ERR',
        4: 'WARNING',
        5: 'NOTICE',
        6: 'INFO',
        7: 'DEBUG',
    };
    var LOG_COLOR = {
        3: 'red',
        4: 'orange',
        5: 'blue',
        6: 'green',
        7: 'grey',
    };
    for (var i = 3; i <= 7; ++i) {
        !function(i) {
            I.Util.require('l' + i, '', function() {
                if (I.env.APP.LOG_LEVEL < i) return;
                var args = Array.prototype.slice.call(arguments);
                args.unshift('color: ' + LOG_COLOR[i] + '; font-weight: bold;');
                args.unshift('%c' + LOG_TYPE[i] + ':');
                console.log.apply(console, args);
            });
        }(i);
    }
}();
