/* This file is generated by IFramework - Maker.js for user to rewrite ListStore file */
I.Loader.IndexedDBQueue.push(function (db) {
    var ConnectionListStore = function ConnectionListStore(db) {
        this.db = db;
    };

    ConnectionListStore.prototype = new I.Models.ConnectionListStoreBase();
    ConnectionListStore.prototype.constructor = ConnectionListStore;

    I.Util.require('ConnectionListStore', 'Models', new ConnectionListStore(db));
});