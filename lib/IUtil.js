var IUtil = function IUtil() {};

/* Array & Object */
IUtil.prototype.getLength = function getLength(object) {
    if (Array.isArray(object)) {
        return object.length;
    } else if (typeof object === 'object') {
        var i = 0;
        for (var h in object) {
            ++i;
        }
        return i;
    } else {
        throw new IException(10201);
    }
};

IUtil.prototype.getLastElement = function getLastElement(object) {
    if (Array.isArray(object)) {
        return object[object.length - 1];
    } else if (typeof object === 'object') {
        var length = this.getLength(object);
        var i = 0;
        for (var h in object) {
            if (i === length - 1) {
                return object[h];
            }
            ++i;
        }
    } else {
        throw new IException(10202);
    }
};

/* Data Validation */
IUtil.prototype.isUInt = function isUInt(val) {
    return parseInt(val) == val;
};

/* Date & Time */
IUtil.prototype.getTimestamp = function getTimestamp(time) {
    var stamp = this.getMicroTimestamp(time);
    return parseInt(stamp / 1000);
};

IUtil.prototype.getMicroTimestamp = function getMicroTimestamp(time) {
    if (time) {
        var stamp = Date.parse(time);
        if (!stamp) throw new IException(10251);
        return stamp;
    }

    return Date.now();
};

var util = new IUtil();

global.IUtil = util;
