!function () {
    var LogicController = function LogicController() {
        this._cb = null;        // logic callback function
        this._pipe = [];        // function queue
        this._imports = [];
        this._exports = [];     // for function export data rename
        this._exported = [];    // check function export all values
        this._data = {};        // save export data
        this._now = -1;         // which function is running
    };

    LogicController.prototype.add = function add(params) {
        var fn = params.fn;
        var name = typeof fn.name === 'string' ? fn.name : /function\s+([^\{\(\s]+)/.test(fn.toString()) ? RegExp['$1'] : '[Unknown]';
        // reg func
        if (this[name]) {
            //console.warn(fn.name, 'exists when add function to runner.');
        } else {
            this[name] = fn;
        }
        this._pipe.push(name);

        params.imports = params.imports || {};
        params.exports = params.exports || {};
        this._imports.push(params.imports);
        this._exports.push(params.exports);

        var exported = {};
        for (var i in params.exports) {
            exported[i] = 0;
        }
        this._exported.push(exported);
        return this;
    };
    LogicController.prototype.cb = function cb(cb) {
        if (this._cb === null) {
            this._cb = cb;
        } else {
            this._cb(arguments);
        }
    };
    LogicController.prototype.next = function next() {
        // check previous function export all values
        if (!this._now === -1) {
            for (var i in this._exported[this._now]) {
                if (!this._exported[this._now][i]) throw new I.Exception(10401);
            }
        }

        ++this._now;
        var funcName = this._pipe[this._now];
        if (!funcName) {
            return;  // all logic function has done
        }

        // insert middle params
        var args = [];
        var exportsName;
        var imports = this._imports[this._now] ? this._imports[this._now] : {};
        for (var argName in imports) {
            if (argName[0] === '_') {   // internal param from _data
                args.push(this.get(argName.slice(1)));
            } else {                    // out param
                args.push(imports[argName]);
            }
        }
        this[funcName].apply(this, args);
    };
    LogicController.prototype.set = function set(name, val) {
        this._exported[this._now][name] = 1;
        var exports = this._exports[this._now];
        if (exports[name]) name = exports[name];    // rename mapping

        this._data[name] = val;
    };
    LogicController.prototype.get = function get(name) {
        return this._data[name];
    };

    I.Util.require('LogicController', '', LogicController);
}();
