!function() {
    var Loader = {
        initIndexedDB: function initIndexedDB(cb) {
            var env = I.env.IDB;
            if (!env.ENABLED) return;
            cb = cb || function() {};

            var idb = new I.Models.IndexedDB(env.NAME, env.VERSION);
            idb.regSuccessEvent(function() {
                // make ModelBaseStore
                I.Maker.classes = {};
                I.orms.forEach(function(orm) {
                    I.Maker.makePKStoreClass(orm);
                    I.Maker.makeModelStoreClass(orm);
                    I.Maker.makeListStoreClass(orm);
                });

                for (var i in I.Maker.classes) {
                    I.Models[i] = I.Maker.classes[i];
                }

                // make ModelStore
                this.IndexedDBQueue.forEach(function(fn) {
                    fn(idb);
                });
            }.bind(this));
            idb.regSuccessEvent(cb);

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
        IndexedDBQueue: [],
    };

    Loader.mergeExceptionCodes();

    I.Util.require('Loader', '', Loader);
}();
