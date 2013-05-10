!function() {
    var IndexedDB = function(name, version) {
        this.db = null;
        this.name = name;
        this.version = version;

        this.successEvents = [];
        this.onerror = function() {};
        this.onupgradeneeded = function() {};

        var req = indexedDB.open(name, version);

        req.onupgradeneeded = function(e) {
            I.l6('IndexedDB Upgraded');
            var db = e.target.result;

            // create PK table
            this.resetTable(db, I.Const.IDB.PK_TABLE, 'name');

            // create orm tables
            orms.forEach(function(orm) {
                if (orm.storeType !== 'IndexedDB') return;
                this.resetTable(db, orm.name, orm.pk, I.Const.IDB.LIST_COLUMN_NAME, false);
            }.bind(this));

            e.target.transaction.onerror = this.onerror;

            this.onupgradeneeded(db);
        }.bind(this);

        req.onsuccess = function(e) {
            I.l6('IndexedDB Opened');
            this.db = e.target.result;

            this.onsuccess();
        }.bind(this);
    };

    IndexedDB.prototype.regSuccessEvent = function regSuccessEvent(fn) {
        this.successEvents.push(fn);
    };

    IndexedDB.prototype.onsuccess = function onsuccess() {
        for (var i = 0; i < this.successEvents.length; ++i) {
            this.successEvents[i]();
        }
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

    IndexedDB.prototype.getList = function getList(table, listId, cb) {
        var trans = this.db.transaction([table], "readonly");
        trans.onerror = this.onerror;

        var store = trans.objectStore(table);
        var index = store.index(I.Const.IDB.LIST_COLUMN_NAME);

        var results = [];
        var cursorReq = index.openCursor(listId);
        cursorReq.onsuccess = function(e) {
            var cursor = cursorReq.result;
            if (cursor) {
                var req = store.get(cursor.primaryKey);
                req.onsuccess = function() {
                    results.push(req.result);
                };
                cursor.continue();
            }
        };

        trans.oncomplete = function () {
            cb(results);
        }
    };

    IndexedDB.prototype.set = function set(table, obj, cb) {
        cb = cb || function() {};
        var trans = this.db.transaction([table], "readwrite");
        trans.onerror = this.onerror;

        var req = trans.objectStore(table).put(obj);
        req.onsuccess = cb;
        req.onerror = this.onerror;
    };

    IndexedDB.prototype.del = function del(table, key, cb) {
        cb = cb || function() {};
        var trans = this.db.transaction([table], "readwrite");
        trans.onerror = this.onerror;

        var req = trans.objectStore(table).delete(key);
        req.onsuccess = cb;
        req.onerror = this.onerror;
    };

    IndexedDB.prototype.delList = function delList(table, listId, cb) {
        var trans = this.db.transaction([table], "readwrite");
        trans.onerror = this.onerror;

        var store = trans.objectStore(table);
        var index = store.index(I.Const.IDB.LIST_COLUMN_NAME);

        var cursorReq = index.openCursor(listId);
        cursorReq.onsuccess = function(e) {
            var cursor = cursorReq.result;
            if (cursor) {
                var req = store.delete(cursor.primaryKey);
                cursor.continue();
            }
        };

        trans.oncomplete = function () {
            cb();
        }
    };
    
    IndexedDB.prototype.resetTable = function resetTable(db, table, keyPath, index, indexUnique) {
        if (db.objectStoreNames.contains(table)) {
            db.deleteObjectStore(table);
        }

        var objectStore = db.createObjectStore(table, { keyPath: keyPath });
        if (index !== undefined) {
            objectStore.createIndex(index, index, { unique: indexUnique });
        }
    };

    I.Util.require('IndexedDB', 'Models', IndexedDB);
}();
