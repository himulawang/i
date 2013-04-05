!function () {
    var List = function List() {};

    List.prototype.init = function init(pk, list)  {
        if (pk === undefined) throw new I.Exception(10118);
        this.setPK(pk);
        this.reset(list);
    };

    List.prototype.reset = function reset(list) {
        this.list = list || {};

        this.toAddList = [];
        this.toDelList = [];
        this.toUpdateList = [];

        this.toAddSyncList = []; // store index
        this.toDelSyncList = []; // store object
        this.toUpdateSyncList = []; // store index

        this.tagDelSync = false;
    };

    List.prototype.add = function add(child) {
        if (child instanceof this.getChildModel() === false) throw new I.Exception(10127);
        var childExists = this.get(child.getPK());
        if (childExists) throw new I.Exception(10140)
        this.toAddList.push(child);
    };

    // input can be index or object
    List.prototype.del = function del(input) {
        var index;
        if (I.Util.isUInt(input)) {
            index = input;
        } else if (input instanceof this.getChildModel()) {
            index = input.getPK();
        } else {
            throw new I.Exception(10128);
        }
        var child = this.get(index);
        if (child === null) throw new I.Exception(10129);
        this.toDelList.push(child);
    };

    List.prototype.drop = function drop() {
        for (var i in this.list) {
            this.toDelList.push(this.list[i]);
        }
        this.list = {};
    };

    List.prototype.update = function update(child) {
        if (child instanceof this.getChildModel() === false) throw new I.Exception(10130);
        var index = child.getPK();
        var preChild = this.get(index);
        if (preChild === null) throw new I.Exception(10131);

        this.toUpdateList.push(child);
    };

    List.prototype.get = function get(index) {
        var child = this.list[index];
        if (!child) return null;

        return child;
    };

    List.prototype.set = function set(child) {
        var pk = child.getPK();
        if (!I.Util.isUInt(pk)) throw new I.Exception(10132);
        this.list[pk] = child;
    };

    List.prototype.unset = function unset(input) {
        var index;
        if (I.Util.isUInt(input)) {
            index = input;
        } else if (input instanceof this.getChildModel()) {
            index = input.getPK();
        } else {
            throw new I.Exception(10133);
        }
        delete this.list[index];
    };

    List.prototype.getKeys = function getKeys() {
        var keys = [];
        var util = I.Util;
        for (var i in this.list) {
            i = util.isUInt(i) ? parseInt(i) : i;
            keys.push(i);
        }
        return keys;
    };

    List.prototype.getPK = function getPK() { 
        return this.pk; 
    };
    List.prototype.setPK = function setPK(pk) { 
        if (!I.Util.isUInt(pk)) throw new I.Exception(10134);
        this.pk = pk; 
    };

    List.prototype.toAbbArray = function toAbbArray(filterOn) {
        var toAbbArray = {};
        for (var i in this.list) {
            toAbbArray[i] = this.list[i].toAbbArray(filterOn);
        }
        return toAbbArray;
    };

    List.prototype.toArray = function toArray(filterOn) {
        var toArray = {};
        for (var i in this.list) {
            toArray[i] = this.list[i].toArray(filterOn);
        }
        return toArray;
    };

    List.prototype.fromAbbArray = function fromAbbArray(dataList, resetUpdateList) {
        var child;
        var childModelClass = this.getChildModel();
        for (var i in dataList) {
            child = new childModelClass();
            child.fromAbbArray(dataList[i], resetUpdateList);
            this.set(child);
        }
    };
    List.prototype.fromArray = function fromArray(dataList, resetUpdateList) {
        var child;
        var childModelClass = this.getChildModel();
        for (var i in dataList) {
            child = new childModelClass();
            child.fromArray(dataList[i], resetUpdateList);
            this.set(child);
        }
    };                                                             

    List.prototype.getList = function getList() {
        return this.list;
    };

    List.prototype.last = function last() {
        return I.Util.last(this.list);
    };

    /* Sync Model: For high real time app
     * These functions prepared for saving dataPool data to redis interval, like 5 seconds or sth.
     * */
    List.prototype.addSync = function addSync(child) {
        if (child instanceof this.getChildModel() === false) throw new I.Exception(10135);
        // the child of addSync must contain pk
        var pk = child.getPK();
        if (pk === undefined) throw new I.Exception(10120);

        // child can't exists in list
        var childExists = this.get(pk);
        if (childExists) throw new I.Exception(10141);

        this.toAddSyncList.push(pk);
        this.set(child);
    };
    List.prototype.delSync = function delSync(input) {
        var index;
        if (I.Util.isUInt(input)) {
            index = input;
        } else if (input instanceof this.getChildModel()) {
            index = input.getPK();
        } else {
            throw new I.Exception(10136);
        }
        var child = this.get(index);
        if (child === null) throw new I.Exception(10137);

        var pos = this.toAddSyncList.indexOf(index);
        if (pos === -1) { // child in redis, need delete
            var updatePos = this.toUpdateSyncList.indexOf(index);
            if (updatePos !== -1) this.toUpdateSyncList.splice(updatePos, 1);
            this.toDelSyncList.push(child);
        } else { // child not in redis, delete direct in memory
            this.toAddSyncList.splice(pos, 1);
        }
        this.unset(index);
    };
    List.prototype.dropSync = function dropSync() {
        for (var i in this.list) {
            var pos = this.toAddSyncList.indexOf(i);
            if (pos === -1) { // child in redis, need delete
                var updatePos = this.toUpdateSyncList.indexOf(i);
                if (updatePos !== -1) this.toUpdateSyncList.splice(updatePos, 1);
                this.toDelSyncList.push(this.get(i));
            } else { // child not in redis, delete direct in memory
                this.toAddSyncList.splice(pos, 1);
            }
        }
        this.list = {};
    };
    List.prototype.updateSync = function updateSync(child) {
        if (child instanceof this.getChildModel() === false) throw new I.Exception(10138);
        var index = child.getPK();

        if (this.get(index) === null) throw new I.Exception(10139);

        var pos = this.toAddSyncList.indexOf(index);
        if (pos === -1) { // child in redis
            this.toUpdateSyncList.push(index);
        }
        // child in toAddSyncList, update in memory directly
        this.set(child);
    };
    List.prototype.markDelSync = function markDelSync() {
        this.tagDelSync = true;
    };

    List.prototype.backup = function backup() {
        return {
            type: 'List',
            className: this.className,
            pk: this.getPK(),
            data: this.toArray(),
        };
    };

    List.prototype.restore = function restore(bak) {
        var child;
        var childModelClass = this.getChildModel();
        for (var i in bak.data) {
            child = new childModelClass();
            child.fromArray(bak.data[i]);
            this.add(child);
        }
    };

    List.prototype.restoreSync = function restoreSync(bak) {
        var child;
        var childModelClass = this.getChildModel();
        for (var i in bak.data) {
            child = new childModelClass();
            child.fromArray(bak.data[i]);
            this.addSync(child);
        }
    };

    I.Util.require('List', 'Models', List);
}();
