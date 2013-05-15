!function() {
    var PKIndexedDBStore = function() {};

    PKIndexedDBStore.prototype.init = function init(db) {
        this.db = db;
    };

    PKIndexedDBStore.prototype.get = function get(cb) {
        cb = cb || function() {};
        var deferred = Q.defer();
        this.db.get(I.Const.IDB.PK_TABLE, this.modelName + 'PK', function(obj) {
            var pkClass = this.getModel();

            if (obj === undefined) {
                var pk = new pkClass();
            } else {
                var pk = new pkClass(obj.pk);
            }
            cb(pk);
            deferred.resolve(pk);
        }.bind(this));
        return deferred.promise;
    };

    PKIndexedDBStore.prototype.set = function set(pk, cb) {
        cb = cb || function() {};
        if (pk instanceof this.getModel() === false) throw new I.Exception(20001);
        var deferred = Q.defer();
        if (pk.updated === false) {
            cb();
            deferred.resolve();
            return deferred.promise;
        }
        this.db.set(I.Const.IDB.PK_TABLE, { name: pk.className, pk: pk.get() }, function() {
            pk.updated = false;
            cb();
            deferred.resolve();
        });
        return deferred.promise;
    };

    PKIndexedDBStore.prototype.unset = function unset(pk, cb) {
        cb = cb || function() {};
        if (pk instanceof this.getModel() === false) throw new I.Exception(20002);
        var deferred = Q.defer();
        this.db.del(I.Const.IDB.PK_TABLE, this.modelName + 'PK', function() {
            cb();
            deferred.resolve();
        });
        return deferred.promise;
    };
    
    PKIndexedDBStore.prototype.sync = function sync(pk, cb) {
        if (pk.tagDelSync) {
            this.unset(pk, cb);
        } else {
            this.set(pk, cb);
        }
    };

    I.Util.require('PKIndexedDBStore', 'Models', PKIndexedDBStore);
}();
