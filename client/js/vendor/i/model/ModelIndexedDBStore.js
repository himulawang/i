!function() {
    var ModelIndexedDBStore = function() {
        this.db = null;
    };

    ModelIndexedDBStore.prototype.init = function init(db) {
        this.db = db;
    };

    ModelIndexedDBStore.prototype.get = function get(pk, cb) {
        this.db.get(this.modelName, pk, function(obj) {
            var modelClass = this.getModel();
            var model = new modelClass();
            model.fromArray(obj);

            cb(model);
        }.bind(this));
    };

    ModelIndexedDBStore.prototype.set = function set(model, cb) {
        if (model instanceof this.getModel() === false) throw new I.Exception(20003);
        cb = cb || function() {};

        this.db.set(this.modelName, model.toArray(), function() {
            model.resetUpdateList();
            cb();
        });
    };

    /*
    ModelIndexedDBStore.prototype.unset = function unset(pk, cb) {
        cb = cb || function() {};
        if (pk instanceof this.getModel() === false) return cb(new I.Exception(20002));
        this.db.del(I.Const.Frame.INDEXED_DB_PK_TABLE, this.modelName + 'PK', cb);
    };
    */

    I.Util.require('ModelIndexedDBStore', 'Models', ModelIndexedDBStore);
}();


