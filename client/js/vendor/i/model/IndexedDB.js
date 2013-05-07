!function() {
    var IndexedDB = function(name, version, orms) {
        this.db = null;
        this.name = name;
        this.version = version;

        this.onsuccess = function() {};
        this.onerror = function() {};
        this.onupgradeneeded = function() {};

        var req = indexedDB.open(name, version);

        req.onupgradeneeded = function(e) {
            console.log('IndexedDB upgraded.');

            var db = e.target.result;
            // create PK table
            this.resetTable(db, I.Const.Frame.INDEXED_DB_PK_TABLE, 'name');

            orms.forEach(function(orm) {
                if (orm.storeType !== 'IndexedDB') return;
                this.resetTable(db, orm.name, orm.pk);
            }.bind(this));

            e.target.transaction.onerror = this.onerror;

            this.onupgradeneeded(db);
        }.bind(this);

        req.onsuccess = function(e) {
            console.log('IndexedDB opened.');
            this.db = e.target.result;

            // make ModelBaseStore
            I.Maker.classes = {};
            orms.forEach(function(orm) {
                I.Maker.makePKStoreClass(orm);
                I.Maker.makeModelStoreClass(orm);
            }.bind(this));

            for (var i in I.Maker.classes) {
                I.Models[i] = I.Maker.classes[i];
            }

            // make ModelStore
            for (var i in I.Maker.indexedDBCallbacks) {
                I.Maker.indexedDBCallbacks[i](this);
            }

            this.onsuccess();
        }.bind(this);
    };

    IndexedDB.prototype.get = function get(table, key, cb) {
        var trans = this.db.transaction([table], "readonly");
        trans.onerror = this.onerror;

        var req = trans.objectStore(table).get(key);
        req.onsuccess = function () {
            cb(req.result);
        }
        req.onerror = this.onerror;
    };

    IndexedDB.prototype.set = function set(table, obj, cb) {
        var trans = this.db.transaction([table], "readwrite");
        trans.onerror = this.onerror;

        var req = trans.objectStore(table).put(obj);
        req.onsuccess = cb;
        req.onerror = this.onerror;
    };

    IndexedDB.prototype.del = function del(table, key, cb) {
        var trans = this.db.transaction([table], "readwrite");
        trans.onerror = this.onerror;

        var req = trans.objectStore(table).delete(key);
        req.onsuccess = cb;
        req.onerror = this.onerror;
    };

    IndexedDB.prototype.resetTable = function resetTable(db, table, keyPath) {
        if (db.objectStoreNames.contains(table)) {
            db.deleteObjectStore(table);
        }

        db.createObjectStore(table, { keyPath: keyPath });
    };

    I.Util.require('IndexedDB', 'Models', IndexedDB);
}();
