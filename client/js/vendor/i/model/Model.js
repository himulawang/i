!function () {
    var Model = function Model() {};

    Model.prototype.init = function init(args) {
        var self = this;
        this.args = [];

        this.resetUpdateList();
        if (Array.isArray(args)) {
            args.forEach(function(val, i) {
                self.args[i] = val;
            });
        } else {
            for (var i = 0; i < this.column.length; ++i) {
                this.args[i] = '';
            }
        }
    };

    Model.prototype.setPK = function setPK(val) { 
        this[this.pk] = val; 
    };
    Model.prototype.getPK = function getPK() { 
        return this[this.pk]; 
    };

    Model.prototype.clone = function clone() { 
        return new this.constructor(this.args); 
    };
    Model.prototype.resetUpdateList = function resetUpdateList() { 
        this.updateList = new Array(this.column.length); 
        this.tagAddSync = false;
        this.tagDelSync = false;
    };

    Model.prototype.toAdd = function toAdd(filterOn) { 
        var self = this;
        var toAdd = [];
        this.args.forEach(function(v, i) {
            if (filterOn && self.column[i].toAdd) return;
            toAdd[i] = v.toString();
        });
        return toAdd; 
    };
    Model.prototype.toUpdate = function toUpdate(filterOn) {
        var self = this;
        var toDB = {};
        this.updateList.forEach(function(v, i) {
            if (filterOn && self.column[i].toUpdate) return;
            if (v === 1) toDB[i] = self.args[i].toString();
        });
        return toDB;
    };
    Model.prototype.toAbbArray = function toAbbArray(filterOn) {
        var self = this;
        var toAbbArray = {};
        this.args.forEach(function(v, i) {
            if (filterOn && self.column[i].toAbb) return;
            toAbbArray[self.column[i].abb] = v;
        });
        return toAbbArray;
    };
    Model.prototype.toArray = function toArray(filterOn) {
        var self = this;
        var toArray = {};
        this.args.forEach(function(v, i) {
            if (filterOn && self.column[i].toArray) return;
            toArray[self.column[i].full] = v;
        });
        return toArray;
    };
    Model.prototype.toAbbDiff = function toAbbDiff(filterOn) {
        var self = this;
        var toAbbDiff = {};
        this.updateList.forEach(function(v, i) {
            if (filterOn && self.column[i].toAbb) return;
            if (v === 1) toAbbDiff[self.column[i].abb] = self.args[i];
        });
        return toAbbDiff;
    };
    Model.prototype.toArrayDiff = function toArrayDiff(filterOn) {
        var self = this;
        var toArrayDiff = {};
        this.updateList.forEach(function(v, i) {
            if (filterOn && self.column[i].toArray) return;
            if (v === 1) toArrayDiff[self.column[i].full] = self.args[i];
        });
        return toArrayDiff;
    };
    Model.prototype.fromAbbArray = function fromAbbArray(data, resetUpdateList) { 
        var full;
        for (var abb in data) {
            full = this.abbMap[abb].full;
            this[full] = data[abb];
        }
        if (resetUpdateList) this.resetUpdateList();
    };
    Model.prototype.fromArray = function fromArray(data, resetUpdateList) { 
        for (var full in data) {
            this[full] = data[full];
        }
        if (resetUpdateList) this.resetUpdateList();
    };
    Model.prototype.markAddSync = function markAddSync() {
        this.tagAddSync = true;
    };
    Model.prototype.markDelSync = function markDelSync() {
        this.tagDelSync = true;
    };

    Model.prototype.backup = function backup() {
        return {
            type: 'Model',
            className: this.className,
            data: this.toArray(),
        };
    };

    Model.prototype.restore = function restore(bak) {
        this.fromArray(bak.data);
    };

    Model.prototype.restoreSync = function restore(bak) {
        this.fromArray(bak.data);
        this.markAddSync();
    };

    I.Util.require('Model', 'Models', Model);
}();
