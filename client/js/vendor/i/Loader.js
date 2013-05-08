!function() {
    var Loader = {
        initIndexedDB: function initIndexedDB() {
            var env = I.env;
            if (!env.IDB.ENABLED) return;

            var idb = new I.Models.IndexedDB(env.IDB.NAME, env.IDB.VERSION, I.orms);
            I.idb = idb;
        },
        initWebsocket: function initWebSocket() {
            var env = I.env;
            if (!env.WS.ENABLED) return;

            var ws = new I.WebSocket().start(env.WS.URL, env.WS.PROTOCOL);
            I.ws = ws;
        },
    };

    Loader.initIndexedDB();
    Loader.initWebsocket();
}();
