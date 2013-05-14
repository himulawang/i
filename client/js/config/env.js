!function() {
    var env = {
        APP: {
            NAME: 'i',
            // 3: 'ERR', 4: 'WARNING', 5: 'NOTICE', 6: 'INFO', 7: 'DEBUG',
            LOG_LEVEL: 7,
        },
        JADE: {
            URI: '../../tpl/',
        },
        IDB: {
            ENABLED: true,
            NAME: 'i',
            VERSION: 4,
        },
        WS: {
            ENABLED: true,
            URL: 'ws://' + window.location.host + '/',
            PROTOCOL: 'i',
            AUTO_RECONNECT_INTERVAL: 800, // 0 is off
        },
    };

    I.Util.require('env', '', env);
}();

