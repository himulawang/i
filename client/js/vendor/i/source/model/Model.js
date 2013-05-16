!function () {
    var Model = function Model() {};

    var functions = {
        init: function init(args) {
            var attrs = {
                args: [],
                updateList: [],
                tagAddSync: false,
                tagDelSync: false,
                fromStore: false,
            };

            I.Util.define(this, attrs, true);

            this.reset();
            if (Array.isArray(args)) {
                args.forEach(function(val, i) {
                    this.args[i] = val;
                }.bind(this));
            } else {
                for (var i = 0; i < this.column.length; ++i) {
                    this.args[i] = '';
                }
            }
        },
        reset: function reset() { 
            this.updateList = new Array(this.column.length); 
            this.tagAddSync = false;
            this.tagDelSync = false;
        },
        setPK: function setPK(val) { 
            this[this.pk] = val; 
        },
        getPK: function getPK() { 
            return this[this.pk]; 
        },
        clone: function clone() { 
            return new this.constructor(this.args); 
        },
        isUpdated: function isUpdated() {
            var length = this.updateList.length;
            for (var i = 0; i < length; ++i) {
                if (this.updateList[i]) return true;
            }
            return false;
        },
        toAdd: function toAdd(filterOn) { 
            var toAdd = [];
            this.args.forEach(function(v, i) {
                if (filterOn && this.column[i].toAdd) return;
                toAdd[i] = v.toString();
            }.bind(this));
            return toAdd; 
        },
        toUpdate: function toUpdate(filterOn) {
            var toDB = {};
            this.updateList.forEach(function(v, i) {
                if (filterOn && this.column[i].toUpdate) return;
                if (v === 1) toDB[i] = this.args[i].toString();
            }.bind(this));
            return toDB;
        },
        toAbbArray: function toAbbArray(filterOn) {
            var toAbbArray = {};
            this.args.forEach(function(v, i) {
                if (filterOn && this.column[i].toAbb) return;
                toAbbArray[this.column[i].abb] = v;
            }.bind(this));
            return toAbbArray;
        },
        toArray: function toArray(filterOn) {
            var toArray = {};
            this.args.forEach(function(v, i) {
                if (filterOn && this.column[i].toArray) return;
                toArray[this.column[i].full] = v;
            }.bind(this));
            return toArray;
        },
        toAbbDiff: function toAbbDiff(filterOn) {
            var toAbbDiff = {};
            this.updateList.forEach(function(v, i) {
                if (filterOn && this.column[i].toAbb) return;
                if (v === 1) toAbbDiff[this.column[i].abb] = this.args[i];
            }.bind(this));
            return toAbbDiff;
        },
        toArrayDiff: function toArrayDiff(filterOn) {
            var toArrayDiff = {};
            this.updateList.forEach(function(v, i) {
                if (filterOn && this.column[i].toArray) return;
                if (v === 1) toArrayDiff[this.column[i].full] = this.args[i];
            }.bind(this));
            return toArrayDiff;
        },
        fromAbbArray: function fromAbbArray(data, reset) { 
            var full;
            for (var abb in data) {
                full = this.abbMap[abb].full;
                this[full] = data[abb];
            }
            if (reset) this.reset();
        },
        fromArray: function fromArray(data, reset) { 
            for (var full in data) {
                this[full] = data[full];
            }
            if (reset) this.reset();
        },
        markAddSync: function markAddSync() {
            this.tagAddSync = true;
        },
        markDelSync: function markDelSync() {
            this.tagDelSync = true;
        },
        backup: function backup() {
            return {
                type: 'Model',
                className: this.className,
                data: this.toArray(),
            };
        },
        restore: function restore(bak) {
            this.fromArray(bak.data);
        },
        restoreSync: function restore(bak) {
            this.fromArray(bak.data);
            this.markAddSync();
        },
    };

    I.Util.define(Model.prototype, functions);
    I.Util.require('Model', 'Models', Model);
}();
