!function () {
    var List = function List() {};

    var functions = {
        // Init API
        init: function init(pk, list)  {
            if (pk === undefined) throw new I.Exception(10118);

            var attrs = {
                pk: null,
                toAddList: [],
                toDelList: [],
                toUpdateList: [],
                toAddSyncList: [],
                toDelSyncList: [],
                toUpdateSyncList: [],
                tagDelSync: false,
                fromStore: false,
            };
            I.Util.define(this, attrs, true);

            this.setPK(pk);
            this.reset(list);
        },
        reset: function reset(list) {
            list = list || {};
            this.toAddList = [];
            this.toDelList = [];
            this.toUpdateList = [];

            this.toAddSyncList = []; // store index
            this.toDelSyncList = []; // store object
            this.toUpdateSyncList = []; // store index

            this.tagDelSync = false;

            for (var i in list) {
                this.set(list[i]);
            }
        },
        // Base API
        getPK: function getPK() {
            return this.pk; 
        },
        setPK: function setPK(pk) {
            if (!I.Util.isUInt(pk)) throw new I.Exception(10134);
            this.pk = pk; 
        },
        set: function set(child) {
            var pk = child.getPK();
            if (!I.Util.isUInt(pk)) throw new I.Exception(10132);
            this[pk] = child;
        },
        get: function get(index) {
            var child = this[index];
            if (!child) return null;

            return child;
        },
        unset: function unset(input) {
            var index;
            if (I.Util.isUInt(input)) {
                index = input;
            } else if (input instanceof this.getChildModel()) {
                index = input.getPK();
            } else {
                throw new I.Exception(10133);
            }
            delete this[index];
        },
        // Async API
        add: function add(child) {
            if (child instanceof this.getChildModel() === false) throw new I.Exception(10127);
            var pk = child.getPK();
            if (!I.Util.isUInt(pk)) throw new I.Exception(10143);
            var childExists = this.get(pk);
            if (childExists) throw new I.Exception(10140);
            this.toAddList.push(child);
        },
        del: function del(input) {
            var index;
            if (I.Util.isUInt(input)) {
                index = input;
            } else if (input instanceof this.getChildModel()) {
                index = input.getPK();
                if (!I.Util.isUInt(index)) throw new I.Exception(10144);
            } else {
                throw new I.Exception(10128);
            }
            var child = this.get(index);
            if (child === null) throw new I.Exception(10129);
            this.toDelList.push(child);
        },
        drop: function drop() {
            for (var i in this) {
                this.toDelList.push(this[i]);
            }
        },
        update: function update(child) {
            if (child instanceof this.getChildModel() === false) throw new I.Exception(10130);
            var index = child.getPK();
            if (!I.Util.isUInt(index)) throw new I.Exception(10145);
            var preChild = this.get(index);
            if (preChild === null) throw new I.Exception(10131);

            this.toUpdateList.push(child);
        },
        // Sync API
        addSync: function addSync(child) {
            if (child instanceof this.getChildModel() === false) throw new I.Exception(10135);
            // the child of addSync must contain pk
            var pk = child.getPK();
            if (!I.Util.isUInt(pk)) throw new I.Exception(10120);

            // child can't exists in list
            var childExists = this.get(pk);
            if (childExists) throw new I.Exception(10141);

            this.toAddSyncList.push(pk);
            this.set(child);
        },
        delSync: function delSync(input) {
            var index;
            if (I.Util.isUInt(input)) {
                index = input;
            } else if (input instanceof this.getChildModel()) {
                index = input.getPK();
                if (!I.Util.isUInt(index)) throw new I.Exception(10146);
            } else {
                throw new I.Exception(10136);
            }
            var child = this.get(index);
            if (child === null) throw new I.Exception(10137);

            var pos = this.toAddSyncList.indexOf(index);
            if (pos === -1) { // child in db, need delete
                var updatePos = this.toUpdateSyncList.indexOf(index);
                if (updatePos !== -1) this.toUpdateSyncList.splice(updatePos, 1);
                this.toDelSyncList.push(child);
            } else { // child not in db, delete direct in memory
                this.toAddSyncList.splice(pos, 1);
            }
            delete this[index];
        },
        dropSync: function dropSync() {
            for (var i in this) {
                var pos = this.toAddSyncList.indexOf(i);
                if (pos === -1) { // child in db, need delete
                    var updatePos = this.toUpdateSyncList.indexOf(i);
                    if (updatePos !== -1) this.toUpdateSyncList.splice(updatePos, 1);
                    this.toDelSyncList.push(this.get(i));
                } else { // child not in db, delete direct in memory
                    this.toAddSyncList.splice(pos, 1);
                }
                delete this[i];
            }
        },
        updateSync: function updateSync(child) {
            if (child instanceof this.getChildModel() === false) throw new I.Exception(10138);
            var index = child.getPK();
            if (!I.Util.isUInt(index)) throw new I.Exception(10147);

            if (this.get(index) === null) throw new I.Exception(10139);

            var pos = this.toAddSyncList.indexOf(index);
            if (pos === -1) { // child in redis
                this.toUpdateSyncList.push(index);
            }
            // child in toAddSyncList, update in memory directly
            this.set(child);
        },
        markDelSync: function markDelSync() {
            this.tagDelSync = true;
        },
        // Array API
        keys: function keys() {
            return Object.keys(this);
        },
        toAbbArray: function toAbbArray(filterOn) {
            var toAbbArray = {};
            for (var i in this) {
                toAbbArray[i] = this[i].toAbbArray(filterOn);
            }
            return toAbbArray;
        },
        toArray: function toArray(filterOn) {
            var toArray = {};
            for (var i in this) {
                toArray[i] = this[i].toArray(filterOn);
            }
            return toArray;
        },
        fromAbbArray: function fromAbbArray(dataList, reset) {
            var child;
            var childModelClass = this.getChildModel();
            for (var i in dataList) {
                child = new childModelClass();
                child.fromAbbArray(dataList[i], reset);
                this.set(child);
            }
        },
        fromArray: function fromArray(dataList, reset) {
            var child;
            var childModelClass = this.getChildModel();
            for (var i in dataList) {
                child = new childModelClass();
                child.fromArray(dataList[i], reset);
                this.set(child);
            }
        },
        last: function last() {
            return I.Util.last(this);
        },
        // Backup & Restore API
        backup: function backup() {
            return {
                type: 'List',
                className: this.className,
                pk: this.getPK(),
                data: this.toArray(),
            };
        },
        restore: function restore(bak) {
            var child;
            var childModelClass = this.getChildModel();
            for (var i in bak.data) {
                child = new childModelClass();
                child.fromArray(bak.data[i]);
                this.add(child);
            }
        },
        restoreSync: function restoreSync(bak) {
            var child;
            var childModelClass = this.getChildModel();
            for (var i in bak.data) {
                child = new childModelClass();
                child.fromArray(bak.data[i]);
                this.addSync(child);
            }
        },
    };

    I.Util.define(List.prototype, functions);
    I.Util.require('List', 'Models', List);
}();
