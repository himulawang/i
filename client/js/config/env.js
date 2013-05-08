!function() {
    var env = {
        APP: {
            NAME: 'i',
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
            AUTO_RECONNECT_INTERVAL: 800,
        },
    };

    I.Util.require('env', '', env);
}();

