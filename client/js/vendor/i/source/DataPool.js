!function () {
    var DataPool = function DataPool() {
        this.pool = {};
        this.toDelPool = {};
    };

    DataPool.prototype.makeKey = function makeKey(name, index) {
        return name + '-' + index;
    };

    DataPool.prototype.set = function set(name, index, model) {
        this.pool[this.makeKey(name, index)] = model;
    };

    DataPool.prototype.get = function get(name, index) {
        return this.pool[this.makeKey(name, index)];
    };

    DataPool.prototype.unset = function unset(name, index) {
        delete this.pool[this.makeKey(name, index)];
    };

    DataPool.prototype.reset = function reset() {
        this.pool = {};
    };

    DataPool.prototype.sync = function sync() {
        var StoreClass;
        // add & update
        for (var i in this.pool) {
            var data = this.pool[i];

            if (data.getPK) {
                I.l7('Update', data.className + ' ' + data.getPK());
            }
            StoreClass = data.getStore();
            StoreClass.sync(data);
        }
        // del
        for (var j in this.toDelPool) {
            var toDelData = this.toDelPool[j];
            StoreClass = toDelData.getStore();
            if (toDelData.getPK) {
                I.l7('Delete', toDelData.className + ' ' + toDelData.getPK());
            }
            StoreClass.sync(toDelData);
            delete this.toDelPool[j];
        }
    };

    DataPool.prototype.del = function del(name, index) {
        var data = this.get(name, index);
        data.markDelSync();
        this.toDelPool[this.makeKey(name, index)] = data;
        this.unset(name, index);
    };

    DataPool.prototype.drop = function drop() {
        for (var key in this.pool) {
            var data = this.pool[key];
            data.markDelSync();
            this.toDelPool[key] = data;
            delete this.pool[key];
        }
        this.sync();
    };

    I.Util.require('DataPool', '', DataPool);
}();
