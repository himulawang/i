var IUtil = function IUtil() {};

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

IUtil.prototype.isUInt = function isUInt(val) {
    return parseInt(val) == val;
};

var util = new IUtil();

global.IUtil = util;
