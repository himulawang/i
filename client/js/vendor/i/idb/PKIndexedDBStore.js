!function() {
    var PKIndexedDBStore = function() {};

    PKIndexedDBStore.prototype.init = function init(db) {
        this.db = db;
    };

    PKIndexedDBStore.prototype.get = function get(cb) {
        this.db.get(I.Const.IDB.PK_TABLE, this.modelName + 'PK', function(obj) {
            var pkClass = this.getModel();

            if (obj === undefined) {
                var pk = new pkClass();
            } else {
                var pk = new pkClass(obj.pk);
            }
            cb(pk);
        }.bind(this));
    };

    PKIndexedDBStore.prototype.set = function set(pk, cb) {
        cb = cb || function() {};
        if (pk instanceof this.getModel() === false) throw new I.Exception(20001);
        if (pk.updated === false) return cb();
        this.db.set(I.Const.IDB.PK_TABLE, { name: pk.className, pk: pk.get() }, function() {
            pk.updated = false;
            cb();
        });
    };

    PKIndexedDBStore.prototype.unset = function unset(pk, cb) {
        cb = cb || function() {};
        if (pk instanceof this.getModel() === false) throw new I.Exception(20002);
        this.db.del(I.Const.IDB.PK_TABLE, this.modelName + 'PK', cb);
    };

    I.Util.require('PKIndexedDBStore', 'Models', PKIndexedDBStore);
}();
