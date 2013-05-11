!function() {
    var ListIndexedDBStore = function() {};

    ListIndexedDBStore.prototype.init = function init(db) {
        this.db = db;
    };

    ListIndexedDBStore.prototype.get = function get(id, cb) {
        this.db.getList(this.childModelName, id, function(data) {
            var listClass = this.getListModel();
            var modelClass = this.getChildModel();
            var list = new listClass(id);

            data.forEach(function(n) {
                var child = new modelClass();
                child.fromArray(n, true);

                list.set(child);
            });

            cb(list);
        }.bind(this));
    };

    ListIndexedDBStore.prototype.update = function update(list, cb) {
        if (list instanceof this.getListModel() === false) throw new I.Exception(20005);
        cb = cb || function() {};

        var listColumnName = I.Const.IDB.LIST_COLUMN_NAME;
        var results = {
            toDel: list.toDelList.length,
            toUpdate: list.toUpdateList.length,
            toAdd: list.toAddList.length,
            delDone: 0,
            updateDone: 0,
            addDone: 0,
        };

        var allDone = function allDone() {
            if (
                results.delDone === results.toDel &&
                results.updateDone === results.toUpdate &&
                results.addDone === results.toAdd
            ) cb();
        };

        // del
        list.toDelList.forEach(function(child) {
            var pk = child.getPK();
            this.db.del(this.childModelName, pk, function() {
                results.delDone = results.delDone + 1;
                allDone();
            });
            list.unset(pk);
        }.bind(this));
        list.toDelList = [];

        // update
        list.toUpdateList.forEach(function(child) {
            var obj = child.toArray();
            obj[listColumnName] = list.getPK();

            this.db.set(this.childModelName, obj, function() {
                results.updateDone = results.updateDone + 1;
                child.reset();
                allDone();
            });
        }.bind(this));
        list.toUpdateList = [];

        // add
        list.toAddList.forEach(function(child) {
            var obj = child.toArray();
            obj[listColumnName] = list.getPK();

            this.db.set(this.childModelName, obj, function() {
                results.addDone = results.addDone + 1;
                allDone();
                child.reset();
                list.set(child);
            });
        }.bind(this));
        list.toAddList = [];
    };

    ListIndexedDBStore.prototype.del = function del(list, cb) {
        if (list instanceof this.getListModel() === false) throw new I.Exception(20006);
        cb = cb || function() {};

        this.db.delList(this.childModelName, list.getPK(), cb);
    };

    I.Util.require('ListIndexedDBStore', 'Models', ListIndexedDBStore);
}();
