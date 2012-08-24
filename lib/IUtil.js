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
    var mid = parseInt(val);
    return mid == val && mid >= 0;
};
IUtil.prototype.isInt = function isInt(val) {
    return parseInt(val) == val;
};
IUtil.prototype.isArray = function isArray(array) {
    return Array.isArray(array);
};
IUtil.prototype.isHash = function isHash(hash) {
    return typeof hash === 'object';
};
IUtil.prototype.isString = function isString(string) {
    return typeof string === 'string';
};
IUtil.prototype.isEmpty = function isEmpty(value) {
    return value === '';
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

/* Error */
IUtil.prototype.printError = function printError(error) {
    console.log(error.message + ':', IExceptionCodes[error.message]);
};

/* Probability */
IUtil.prototype.random = function random(start, end) {
    var n = end - start;
    return start + Math.floor(Math.random() * n);
};
IUtil.prototype.getElementByProbability = function getElementByProbability(probabilityList) {
    // verify probabilityList is hash
    if (!this.isHash(probabilityList)) throw new IException(10203);

    // delete probability = 0 element & sum probabilities
    var all = 0;
    for (var i in probabilityList) {
        if (probabilityList[i] == 0) {
            delete probabilityList[i];
        } else {
            all += probabilityList[i];
        }
    }

    // no element in list
    if (all === 0) throw new IException(10204);

    // get id by probability
    var seed = this.random(1, all);
    var sum = 0;
    for (var i in probabilityList) {
        sum += probabilityList[i];
        if (seed <= sum) {
            return i;
        }
    }

    throw new IException(10205);
};

var util = new IUtil();

global.IUtil = util;
