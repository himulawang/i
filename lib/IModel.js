var IModel = function IModel() {};

/* retrieve stuff start */
IModel.prototype.retrieve = function(key, cb) {
    switch (this.type) {
        case IConst.OBJECT_TYPE_HASH:
            this.retrieveHash(key, cb);
            break;
        case IConst.OBJECT_TYPE_LIST:
            this.retrieveList(key, cb);
            break;
        default:
            throw new IException(10101);
    }
};

IModel.prototype.retrieveHash = function(key, cb) {
    var self = this;
    db.hvals(this.abb + key, function(err, data) {
        if (err) throw new IException(10103, err);

        // convert '1' to 1
        var util = IUtil;
        data.forEach(function(v, i) {
            if (util.isUInt(v)) data[i] = parseInt(v);
        });

        var object = new global[self.objectName](data);
        cb(object);
    });
};

IModel.prototype.retrieveList = function(key, cb) {
    var self = this;
    db.hkeys(this.abb + key, function(err, data) {
        if (err) throw new IException(10107, err);
        // empty list
        if (data.length === 0) {
            var list = new global[self.objectName](key);
            cb(list);
            return;
        }

        var objectList = {};
        var retrievedCount = 0;
        // fill elements
        data.forEach(function(v) {
            self.childModel.retrieve(v, function(object) {
                objectList[v] = object;
                ++retrievedCount;
                if (data.length === retrievedCount) {
                    var list = new global[self.objectName](key, objectList);
                    cb(list);
                }
            });
        });
    });
};
/* retrieve stuff end */

/* add stuff start */
IModel.prototype.add = function(object, cb) {
    if (this.type === IConst.OBJECT_TYPE_LIST) throw new IException(10108);
    var self = this;
    if (this.pkAutoIncrement) {
        db.incr(IConst.GLOBAL_KEY_PREFIX + this.abb, function(err, id) {
            if (err) throw new IException(10104, err);
            self.addHash(object, cb, id);
        });
    } else {
        this.addHash(object, cb);
    }
};

IModel.prototype.addHash = function(object, cb, id) {
    if (id !== undefined) {
        object.setPK(id);
        var key = id;
    } else {
        var key = object.getPK();
    }
    var toDB = object.toAdd();
    if (IUtil.getLength(toDB) != 0) {
        db.hmset(this.abb + key, toDB, function(err, result) {
            object.resetUpdateList();
            cb(object);
        });
    } else {
        throw new IException(10105);
    }
};
/* add stuff end */

/* del stuff start */
IModel.prototype.del = function(object, cb) {
    switch (this.type) {
        case IConst.OBJECT_TYPE_HASH:
            this.delHash(object, cb);
            break;
        case IConst.OBJECT_TYPE_LIST:
            this.delList(object, cb);
            break;
        default:
            throw new IException(10109);
    }
};

IModel.prototype.delHash = function(object, cb) {
    db.del(this.abb + object.getPK(), function(err, result) {
        if (err) throw new IException(10110, err);
        cb(object);
    });
};

IModel.prototype.delList = function(list, cb) {
    var self = this;
    var toDelListLength = list.list.length;
    var deledCount = 0;

    if (toDelListLength = 0) {
        cb(list);
        return
    }

    var dbMulti = db.multi();
    // del list index
    dbMulti.del(this.abb + list.getPK());
    
    // del hash
    list.getKeys().forEach(function(v) {
        dbMulti.del(self.childModel.abb + v);
    });

    dbMulti.exec(function(err, results) {
        if (err) throw new IException(10116, err);
        list.reset();
        cb(list);
    });
};
/* del stuff end */

/* update stuff start */
IModel.prototype.update = function(object, cb) {
    switch (this.type) {
        case IConst.OBJECT_TYPE_HASH:
            this.updateHash(object, cb);
            break;
        case IConst.OBJECT_TYPE_LIST:
            this.updateList(object, cb);
            break;
        default:
            throw new IException(10106);
    }
};

IModel.prototype.updateHash = function(object, cb) {
    var toDB = object.toUpdate();
    // filter columns are not allowed to update
    this.updateFilter.forEach(function(v) {
        delete toDB[v];
    });
    // nothing to update
    if (IUtil.getLength(toDB) === 0) {
        cb(object);
        return;
    }
    db.hmset(this.abb + object.getPK(), toDB, function(err, result) {
        object.resetUpdateList();
        cb(object);
    });
};

IModel.prototype.updateList = function(list, cb) {
    var self = this;
    var util = IUtil;
    var dbMulti = db.multi();

    var exec = function exec() {
        dbMulti.exec(function(err, results) {
            if (err) throw new IException(10117, err);
            cb(list);
        });
    };

    // del
    list.toDelList.forEach(function(child) {
        var pk = child.getPK();
        dbMulti.del(self.childModel.abb + pk);
        dbMulti.hdel(self.abb + list.getPK(), pk);
        list.remove(pk);
    });
    list.toDelList = [];

    // update
    list.toUpdateList.forEach(function(child) {
        var toDB = child.toUpdate();
        self.childModel.updateFilter.forEach(function(v) {
            delete toDB[v];
        });
        if (util.getLength(toDB) === 0) return;
        dbMulti.hmset(self.childModel.abb + child.getPK(), toDB);
    });
    list.toUpdateList = [];

    // add
    if (list.toAddList.length === 0) {
        exec();
        return;
    }

    var toAddListLength = list.toAddList.length;
    var addedCount = 0;

    list.toAddList.forEach(function(v) {
        self.childModel.add(v, function(child) {
            list.insert(child);
            ++addedCount;
            dbMulti.hset(self.abb + list.getPK(), child.getPK(), 1);
            if (toAddListLength === addedCount) {
                list.toAddList = [];
                exec();
            }
        });
    });
};
/* update stuff end */

global.IModel = IModel;
