/* This file is generated by IFramework - Maker.js for user to rewrite PKStore file */
I.Maker.indexedDBCallbacks.push(function (db) {
    var ConnectionPKStore = function ConnectionPKStore(db) {
        this.db = db;
    };

    ConnectionPKStore.prototype = new I.Models.ConnectionPKStoreBase();
    ConnectionPKStore.prototype.constructor = ConnectionPKStore;

    I.Util.require('ConnectionPKStore', 'Models', new ConnectionPKStore(db));
});