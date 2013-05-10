!function() {
    var ModelIndexedDBStore = function() {};

    ModelIndexedDBStore.prototype.init = function init(db) {
        this.db = db;
    };

    ModelIndexedDBStore.prototype.get = function get(pk, cb) {
        this.db.get(this.modelName, pk, function(data) {
            var modelClass = this.getModel();
            var model = new modelClass();

            if (data !== undefined) {
                model.fromArray(data, true);
            }

            cb(model);
        }.bind(this));
    };

    ModelIndexedDBStore.prototype.add = function add(model, cb) {
        if (model instanceof this.getModel() === false) throw new I.Exception(20003);
        cb = cb || function() {};

        this.db.set(this.modelName, model.toArray(), function() {
            model.resetUpdateList();
            cb();
        });
    };

    ModelIndexedDBStore.prototype.del = function del(input, cb) {
        var key;
        if (I.Util.isString(input) || I.Util.isInt(input)) {
            key = input;
        } else if (input instanceof this.getModel()){
            key = input.getPK();
        } else {
            throw new I.Exception(20004);
        }
        cb = cb || function() {};

        this.db.del(this.modelName, key, cb);
    };

    I.Util.require('ModelIndexedDBStore', 'Models', ModelIndexedDBStore);
}();
