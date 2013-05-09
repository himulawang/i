!function() {
    var Loader = {
        initIndexedDB: function initIndexedDB(cb) {
            var env = I.env.IDB;
            if (!env.ENABLED) return;
            cb = cb || function() {};

            var idb = new I.Models.IndexedDB(env.NAME, env.VERSION, I.orms);
            idb.onsuccess = cb;
            I.idb = idb;
        },
        initWebsocket: function initWebSocket(cb) {
            var env = I.env.WS;
            if (!env.ENABLED) return;
            cb = cb || function() {};

            var ws = new I.WebSocket().start(env.URL, env.PROTOCOL, env.AUTO_RECONNECT_INTERVAL);
            ws.onopen = cb;
            I.ws = ws;
        },
        mergeExceptionCodes: function mergeExceptionCodes() {
            var ExceptionCodes = I.Util.merge(I.ex, I.ExceptionCodes);
            I.ExceptionCodes = ExceptionCodes;
        },
        init: function init(wsCallback, idbCallback) {
            Loader.initWebsocket(wsCallback);
            Loader.initIndexedDB(idbCallback);
        },
    };

    Loader.mergeExceptionCodes();

    I.Util.require('Loader', '', Loader);
}();
