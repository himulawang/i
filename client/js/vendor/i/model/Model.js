!function () {
    var Model = function Model() {};

    var functions = {
        init: function init(args) {
            var attrs = {
                args: [],
                updateList: [],
                tagAddSync: false,
                tagDelSync: false,
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
        toAdd: function toAdd(filterOn) { 
            var self = this;
            var toAdd = [];
            this.args.forEach(function(v, i) {
                if (filterOn && self.column[i].toAdd) return;
                toAdd[i] = v.toString();
            });
            return toAdd; 
        },
        toUpdate: function toUpdate(filterOn) {
            var self = this;
            var toDB = {};
            this.updateList.forEach(function(v, i) {
                if (filterOn && self.column[i].toUpdate) return;
                if (v === 1) toDB[i] = self.args[i].toString();
            });
            return toDB;
        },
        toAbbArray: function toAbbArray(filterOn) {
            var self = this;
            var toAbbArray = {};
            this.args.forEach(function(v, i) {
                if (filterOn && self.column[i].toAbb) return;
                toAbbArray[self.column[i].abb] = v;
            });
            return toAbbArray;
        },
        toArray: function toArray(filterOn) {
            var self = this;
            var toArray = {};
            this.args.forEach(function(v, i) {
                if (filterOn && self.column[i].toArray) return;
                toArray[self.column[i].full] = v;
            });
            return toArray;
        },
        toAbbDiff: function toAbbDiff(filterOn) {
            var self = this;
            var toAbbDiff = {};
            this.updateList.forEach(function(v, i) {
                if (filterOn && self.column[i].toAbb) return;
                if (v === 1) toAbbDiff[self.column[i].abb] = self.args[i];
            });
            return toAbbDiff;
        },
        toArrayDiff: function toArrayDiff(filterOn) {
            var self = this;
            var toArrayDiff = {};
            this.updateList.forEach(function(v, i) {
                if (filterOn && self.column[i].toArray) return;
                if (v === 1) toArrayDiff[self.column[i].full] = self.args[i];
            });
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
