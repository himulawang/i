!function() {
    var ModelIndexedDBStore = function() {};

    ModelIndexedDBStore.prototype.init = function init(db) {
        this.db = db;
    };

    ModelIndexedDBStore.prototype.get = function get(pk, cb) {
        cb = cb || function() {};
        var deferred = Q.defer();
        this.db.get(this.modelName, pk, function(data) {
            var modelClass = this.getModel();
            var model = new modelClass();

            if (data !== undefined) {
                model.fromArray(data, true);
                model.fromStore = true;
            }

            cb(model);
            deferred.resolve(model);
        }.bind(this));
        return deferred.promise;
    };

    ModelIndexedDBStore.prototype.set = function set(model, cb) {
        if (model instanceof this.getModel() === false) throw new I.Exception(20003);
        cb = cb || function() {};
        var deferred = Q.defer();

        if (!model.isUpdated()) {
            cb(model);
            deferred.resolve(model);
            return deferred.promise;
        }

        this.db.set(this.modelName, model.toArray(), function() {
            model.reset();
            cb(model);
            deferred.resolve(model);
        });
        return deferred.promise;
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
        var deferred = Q.defer();

        this.db.del(this.modelName, key, function() {
            cb();
            deferred.resolve();
        });
        return deferred.promise;
    };

    ModelIndexedDBStore.prototype.sync = function sync(model, cb) {
        if (model.tagDelSync) {
            this.del(model, cb);
        } else {
            this.set(model, cb);
        }
    };

    I.Util.require('ModelIndexedDBStore', 'Models', ModelIndexedDBStore);
}();
