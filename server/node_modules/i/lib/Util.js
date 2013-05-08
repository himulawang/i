!function () {
    var Util = {
        /* String */
        upperCaseFirst: function upperCaseFirst(string) {
            return string[0].toUpperCase() + string.substr(1);
        },
        /* Array & Object */
        max: function max(object) {
            if (Array.isArray(object)) {
                var array = object;
            } else if (typeof object === 'object') {
                var array = this.getKeys(object);
            } else {
                throw new I.Exception(10209);
            }
            return Math.max.apply(Math, array);
        },
        min: function min(object) {
            if (Array.isArray(object)) {
                var array = object;
            } else if (typeof object === 'object') {
                var array = this.getKeys(object);
            } else {
                throw new I.Exception(10210);
            }
            return Math.min.apply(Math, array);     
        },
        getKeys: function getKeys(object) {
            var keys = [];
            for (var i in object) {
                keys.push(i);
            }
            return keys;
        },
        getLength: function getLength(object) {
            if (Array.isArray(object)) {
                return object.length;
            } else if (typeof object === 'object') {
                var i = 0;
                for (var h in object) {
                    ++i;
                }
                return i;
            } else {
                throw new I.Exception(10201);
            }
        },
        last: function last(object) {
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
                throw new I.Exception(10202);
            }
        },
        valueExist: function valueExist(value, object) {
            if (Array.isArray(object)) {
                return object.indexOf(value) !== -1;
            } else if (typeof object === 'object') {
                for (var h in object) {
                    if (object[h] === value) {
                        return true;
                    }
                }
                return false;
            } else {
                throw new I.Exception(10206);
            }
        },
        uniqueValue: function uniqueValue(object) {
            var exists = [];
            var value;
            if (Array.isArray(object)) {
                var result = [];
                for (var i = 0; i < object.length; ++i) {
                    value = object[i];
                    if (exists.indexOf(value) != -1) continue;
                    exists.push(value);
                    result.push(value);
                }
            } else if (typeof object === 'object') {
                var result = {};
                for (var i in object) {
                    value = object[i];
                    if (exists.indexOf(value) != -1) continue;
                    exists.push(value);
                    result[i] = value;
                }
            } else {
                throw new I.Exception(10208);
            }
            return result;
        },
        merge: function (a, b) {
            var m = {};
            for (var i in a) {
                m[i] = a[i];
            }
            for (var j in b) {
                if (m[j] !== undefined) throw new I.Exception(10211);
                m[j] = b[j];
            }
            return m;
        },
        /* Data Validation */
        isUInt: function isUInt(val) {
            var mid = parseInt(val);
            return mid == val && mid >= 0;
        },
        isInt: function isInt(val) {
            return parseInt(val) == val;
        },
        isNumber: function isNumber(val) {
            return !isNaN(parseFloat(val)) && isFinite(val);
        },
        isArray: function isArray(array) {
            return Array.isArray(array);
        },
        isHash: function isHash(hash) {
            return typeof hash === 'object';
        },
        isString: function isString(string) {
            return typeof string === 'string';
        },
        isEmpty: function isEmpty(val) {
            return val === '';
        },
        isJSON: function isJSON(json) {
            try {
                JSON.parse(json);
            } catch (e) {
                return false;
            }
            return true;
        },
        /* Date & Time */
        getTimestamp: function getTimestamp(time) {
            var stamp = this.getMicroTimestamp(time);
            return parseInt(stamp / 1000);
        },
        getMicroTimestamp: function getMicroTimestamp(time) {
            if (time) {
                var stamp = Date.parse(time);
                if (!stamp) throw new I.Exception(10251);
                return stamp;
            }

            return Date.now();
        },
        getTime: function getTime(time) {
            if (time === undefined) { //nothing input
                var d = new Date();
            } else if (this.isUInt(time)) { // timestamp
                var d = new Date(parseInt(time) * 1000);
            } else { //date object
                var d = time;
            }
            var hour = this.fill0(d.getHours());
            var minute = this.fill0(d.getMinutes());
            var second = this.fill0(d.getSeconds());
            var month = this.fill0(d.getMonth() + 1);
            var date = this.fill0(d.getDate());
            var year = d.getFullYear();
            return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        },
        fill0 : function(s) {
            return s.toString().length === 1 ? "0" + s : s;
        },
        /* Error */
        printError: function printError(error) {
            console.log(error.message + ':', I.ExceptionCodes[error.message]);
        },
        /* Probability */
        random: function random(start, end) {
            var n = end - start;
            return start + Math.floor(Math.random() * n);
        },
        getElementByProbability: function getElementByProbability(probabilityList) {
            // verify probabilityList is hash
            if (!this.isHash(probabilityList)) throw new I.Exception(10203);

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
            if (all === 0) throw new I.Exception(10204);

            // get id by probability
            var seed = this.random(1, all);
            var sum = 0;
            for (var i in probabilityList) {
                sum += probabilityList[i];
                if (seed <= sum) {
                    return i;
                }
            }

            throw new I.Exception(10205);
        },
        /* Loader */
        require: function require(name, path, object) {
            var field;
            if (this.isBrowser()) {
                field = window;
            } else {
                field = global;
            }

            if (!field.I) field.I = {};
            if (path) {
                if (!field.I[path]) {
                    field.I[path] = {};
                }
                field.I[path][name] = object;
            } else {
                field.I[name] = object;
            }
        },
        isBrowser: function() {
            var field;
            try {
                field = global;
                return false;
            } catch (e) {
                return true;
            }
        },
        /* Client */
        isChecked: function isChecked(el) {
            return $(el).attr('checked') ? 1 : 0;
        },
    };

    Util.require('Util', '', Util);
}();
