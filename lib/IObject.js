var IObject = function IObject() {};

IObject.prototype.init = function init(args) {
    var self = this;
    this.args = [];

    this.updateList = new Array(this.column.length);
    if (Array.isArray(args)) {
        args.forEach(function(val, index) {
            self.args[index] = val;
        });
    } else {
        for (var i = 0; i < this.column.length; ++i) {
            this.args[i] = null;
        }
    }
};

IObject.prototype.setPK = function setPK(val) { this[this.pk] = val; };
IObject.prototype.getPK = function getPK() { return this[this.pk]; }

IObject.prototype.clone = function clone() { return new this.constructor(this.args); }; 

IObject.prototype.toAdd = function toAdd() { return this.args; };
IObject.prototype.toUpdate = function toUpdate() {
    var self = this;
    var toDB = {};
    this.updateList.forEach(function(v, i) {
        if (v === 1) toDB[i] = self.args[i];
    });
    return toDB;
};

global.IObject = IObject;