var IList = function(listPK, list) {
    this.pk = listPK;
    this.reset(list);
};

IList.prototype.reset = function(list) {
    this.list = list || {};

    this.toAddList = [];
    this.toDelList = [];
    this.toUpdateList = [];
};

IList.prototype.add = function(child) {
    this.toAddList.push(child);
};

// input can be index or object
IList.prototype.del = function(input) {
    var index = IUtil.isUInt(input) ? input : input.getPK();
    var child = this.get(index);
    this.toDelList.push(child);
};

IList.prototype.update = function(child) {
    var index = child.getPK();
    // verify child exists
    this.get(index);

    this.toUpdateList.push(child);
};


IList.prototype.get = function(pk) {
    var child = this.list[pk];
    if (!child) throw new IException(10111);

    return child;
};

IList.prototype.insert = function(child) {
    this.list[child.getPK()] = child;
};

IList.prototype.remove = function(index) {
    delete this.list[index];
};

IList.prototype.getKeys = function() {
    var keys = [];
    for (var i in this.list) {
        keys.push(i);
    }
    return keys;
};

IList.prototype.getPK = function() { return this.pk; };

IList.prototype.toClient = function() {
    var toClient = {};
    for (var i in this.list) {
        toClient[i] = this.list[i].toClient();
    }
    return toClient;
};

global.IList = IList;
