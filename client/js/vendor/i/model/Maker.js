!function () {
    if (!I.Util.isBrowser()) {
        var fs = require('fs');
    }
    var Maker = function() {};

    /* Loader */
    Maker.prototype.makeModelBaseClasses = function makeModelBaseClasses(orms) {
        this.checkModelAbbs(orms);

        var self = this;
        this.classes = {};
        this.indexedDBCallbacks = [];

        orms.forEach(function(orm) {
            self.makeModelBaseClass(orm);
        });
    };

    Maker.prototype.makeModelBaseClass = function makeModelBaseClass(orm) {
        // pk
        this.makePKClass(orm);
        if (orm.storeType) this.makePKStoreClass(orm);
        // model
        this.makeModelClass(orm);
        if (orm.storeType) this.makeModelStoreClass(orm);
        // list
        if (orm.list) {
            this.makeListClass(orm);
            if (orm.storeType) this.makeListStoreClass(orm);
        }
    };

    Maker.prototype.checkModelAbbs = function checkModelAbbs(orms) {
        var repeats = {};
        var list;
        orms.forEach(function(orm) {
            if (repeats[orm.abb]) throw new I.Exception(10002);
            repeats[orm.abb] = true;

            if (orm.list) {
                list = orm.abb + 'l';
                if (repeats[list]) throw new I.Exception(10002);
                repeats[list] = true;
            }
        });
    };

    Maker.prototype.getClasses = function getClasses() {
        return this.classes;
    };

    /* Maker */
    Maker.prototype.makePKClass = function makePKClass(orm) {
        var Class = I.Util.createFn(orm.name + 'PKBase', ['pk']);
        Class.prototype = new I.Models.PK();

        var functions = {
            constructor: Class,
            className: orm.name + 'PK',
            getStore: function getStore() { return I.Models[orm.name + 'PKStore']; },
        };
        I.Util.define(Class.prototype, functions);

        this.classes[orm.name + 'PKBase'] = Class;
    };

    Maker.prototype.makePKStoreClass = function makePKStoreClass(orm) {
        var Class = I.Util.createFn(orm.name + 'PKStoreBase');
        Class.prototype = new I.Models['PK' + orm.storeType + 'Store']();

        var functions = {
            constructor: Class,
            className: orm.name + 'PKStore',
            key: I.Const.Frame.GLOBAL_KEY_PREFIX + orm.abb,
            modelName: orm.name,
            getModel: function getModel() { return I.Models[orm.name + 'PK']; },
        };

        I.Util.define(Class.prototype, functions);
        this.classes[orm.name + 'PKStoreBase'] = Class;
    };

    Maker.prototype.makeModelClass = function makeModelClass(orm) {
        var abbs = this.makeAbbs(orm.column, []);
        var Class = I.Util.createFn(orm.name + 'Base', ['args']);
        Class.prototype = new I.Models.Model();

        // column
        var columns = [];
        var abbMap = {};
        var fullMap = {};
        orm.column.forEach(function(n, i) {
            columns[i] = {
                i: i,
                full: n,
                abb: abbs[n],
                toAdd: orm.toAddFilter.indexOf(i) !== -1,
                toUpdate: orm.toUpdateFilter.indexOf(i) !== -1,
                toAbb: orm.toAbbFilter.indexOf(i) !== -1,
                toArray: orm.toArrayFilter.indexOf(i) !== -1,
            };
            abbMap[abbs[n]] = columns[i];
            fullMap[n] = columns[i];
        });

        var functions = {
            constructor: Class,
            className: orm.name,
            pk: orm.pk,
            getStore: function getStore() {
                return I.Models[orm.name + 'Store'];
            },
            column: columns,
            abbMap: abbMap,
            fullMap: fullMap,
        };

        I.Util.define(Class.prototype, functions);
        
        // getter & setter
        orm.column.forEach(function(v, i) {
            Object.defineProperty(
                Class.prototype,
                v,
                {
                    get: function() { return this.args[i]; },
                    set: function(v) { 
                        if (this.args[i] === v) return;
                        this.args[i] = v;
                        this.updateList[i] = 1;
                    },
                }
            );
        });

        this.classes[orm.name + 'Base'] = Class;
    };

    Maker.prototype.makeModelStoreClass = function makeModelStoreClass(orm) {
        var Class = I.Util.createFn(orm.name + 'StoreBase');
        Class.prototype = new I.Models['Model' + orm.storeType + 'Store']();

        var functions = {
            constructor: Class,
            className: orm.name + 'Store',
            modelName: orm.name,
            pk: orm.pk,
            abb: orm.abb,
            pkAutoIncrement: orm.pkAutoIncrement,
            getModel: function getModel() { return I.Models[orm.name]; },
        };

        I.Util.define(Class.prototype, functions);
        this.classes[orm.name + 'StoreBase'] = Class;
    };

    Maker.prototype.makeListClass = function makeListClass(orm) {
        var className = orm.name + 'ListBase';
        var Class = I.Util.createFn(className, ['pk', 'list']);
        Class.prototype = new I.Models.List();
        var functions = {
            constructor: Class,
            className: orm.list,
            childModelName: orm.name,
            getStore: function getStore() { return I.Models[this.className + 'Store']; },
            getChildModel: function getChildModel() { return I.Models[this.childModelName]; },
        };

        I.Util.define(Class.prototype, functions);

        this.classes[className] = Class;
    };

    Maker.prototype.makeListStoreClass = function makeListStoreClass(orm) {
        var Class = I.Util.createFn(orm.list + 'StoreBase');
        Class.prototype = new I.Models['List' + orm.storeType + 'Store']();

        var functions = {
            constructor: Class,
            className: orm.list + 'Store',
            abb: orm.abb + 'l',
            childModelName: orm.name,
            listModelName: orm.list,
            childStoreName: orm.name + 'Store',
            getChildModel: function getChildModel() { return I.Models[orm.name]; },
            getListModel: function getListModel() { return I.Models[orm.list]; },
            getChildStore: function getChildStore() { return I.Models[orm.name + 'Store']; },
        };

        I.Util.define(Class.prototype, functions);
        this.classes[orm.list + 'StoreBase'] = Class;
    };

    /* Abb */
    Maker.prototype.makeAbbs = function makeAbbs(columns, filter) {
        var self = this;
        var abbs = {};
        var i = 0;
        columns.forEach(function(column) {
            // filter
            if (filter.indexOf(i) !== -1) {
                ++i;
                return;
            }

            var candidateAbb = self.makeAbb(column);
            while (self.abbExist(candidateAbb, abbs)) {
                candidateAbb = self.renameAbb(candidateAbb);
            }
            abbs[column] = candidateAbb;
            ++i;
        });

        return abbs;
    };

    Maker.prototype.makeAbb = function makeAbb(full) {
        return (full[0] + full.replace(/[a-z]/g, '')).toLowerCase();
    };

    Maker.prototype.abbExist = function abbExist(abb, abbs) {
        return I.Util.valueExist(abb, abbs);
    };

    Maker.prototype.renameAbb = function renameAbb(abb) {
        return /^([a-zA-Z0-9]+?)(\d+)$/.test(abb) ? RegExp.$1 + (parseInt(RegExp.$2) + 1) : abb + 1;
    };

    /* Creator */
    /* Server */
    Maker.prototype.createServerFiles = function createServerFiles(orms, dir) {
        var self = this;

        // check dir exist
        if (!fs.existsSync(dir)) {
            fs.mkdir(dir);
        }

        orms.forEach(function(orm) {
            // pk
            self.createServerPKFile(orm, dir);
            self.createServerPKStoreFile(orm, dir);
            // model
            self.createServerModelFile(orm, dir);
            self.createServerModelStoreFile(orm, dir);
            // list
            if (orm.list) {
                self.createServerListFile(orm, dir);
                self.createServerListStoreFile(orm, dir);
            }
        });
    };

    Maker.prototype.createServerPKFile = function createServerPKFile(orm, dir) {
        var pkName = orm.name + 'PK';
        var content = "/* This file is generated by IFramework - Maker.js for user to rewrite PK file */\n";
        content += "!function () {\n";
        content += "    var " + pkName + " = function " + pkName + "(pk) {\n";
        content += "        this.init.call(this, pk);\n";
        content += "    };\n";
        content += "\n";

        // extends
        content += "    " + pkName + ".prototype = new I.Models." + pkName + "Base();\n";
        content += "    " + pkName + ".prototype.constructor = " + pkName + ";\n";
        content += "\n";

        // exports
        content += "    I.Util.require('" + pkName + "', 'Models', " + pkName + ");\n";
        content += "}();";

        this.writeFile(pkName + '.js', content, dir, false);
    };

    Maker.prototype.createServerPKStoreFile = function createServerPKStoreFile(orm, dir) {
        var pkStoreName = orm.name + 'PKStore';
        var content = "/* This file is generated by IFramework - Maker.js for user to rewrite PKStore file */\n";
        content += "!function () {\n";
        content += "    var " + pkStoreName + " = function " + pkStoreName + "(db) {\n";
        content += "        this.db = db;\n";
        content += "    };\n";
        content += "\n";

        // extends
        content += "    " + pkStoreName + ".prototype = new I.Models." + pkStoreName + "Base();\n";
        content += "    " + pkStoreName + ".prototype.constructor = " + pkStoreName + ";\n";
        content += "\n";

        // exports
        content += "    I.Util.require('" + pkStoreName + "', 'Models', new " + pkStoreName + "(db));\n";
        content += "}();";

        this.writeFile(pkStoreName + '.js', content, dir, false);
    };

    Maker.prototype.createServerModelFile = function createServerModelFile(orm, dir) {
        var content = "/* This file is generated by IFramework - Maker.js for user to rewrite Model file */\n";
        content += "!function () {\n";
        content += "    var " + orm.name + " = function " + orm.name + "(args) {\n";
        content += "        this.init.call(this, args);\n";
        content += "    };\n";
        content += "\n";

        // extends
        content += "    " + orm.name + ".prototype = new I.Models." + orm.name + "Base();\n";
        content += "    " + orm.name + ".prototype.constructor = " + orm.name + ";\n";
        content += "\n";

        // exports
        content += "    I.Util.require('" + orm.name + "', 'Models', " + orm.name + ");\n";
        content += "}();";

        this.writeFile(orm.name + '.js', content, dir, false);
    };

    Maker.prototype.createServerModelStoreFile = function createServerModelStoreFile(orm, dir) {
        var storeName = orm.name + 'Store';
        var content = "/* This file is generated by IFramework - Maker.js for user to rewrite ModelStore file */\n";
        content += "!function () {\n";
        content += "    var " + storeName + " = function " + storeName + "(db) {\n";
        content += "        this.db = db;\n";
        content += "    };\n";
        content += "\n";

        // extends
        content += "    " + storeName + ".prototype = new I.Models." + storeName + "Base();\n";
        content += "    " + storeName + ".prototype.constructor = " + storeName + ";\n";
        content += "\n";

        // exports
        content += "    I.Util.require('" + storeName + "', 'Models', new " + storeName + "(db));\n";
        content += "}();";

        this.writeFile(storeName + '.js', content, dir, false);
    };

    Maker.prototype.createServerListFile = function createServerListFile(orm, dir) {
        var content = "/* This file is generated by IFramework - Maker.js for user to rewrite List file */\n";
        content += "!function () {\n";
        content += "    var " + orm.list + " = function " + orm.list + "(pk, list) {\n";
        content += "        this.init.call(this, pk, list);\n";
        content += "    };\n";
        content += "\n";

        // extends
        content += "    " + orm.list + ".prototype = new I.Models." + orm.list + "Base();\n";
        content += "    " + orm.list + ".prototype.constructor = " + orm.list + ";\n";
        content += "\n";

        // exports
        content += "    I.Util.require('" + orm.list + "', 'Models', " + orm.list + ");\n";
        content += "}();";

        this.writeFile(orm.list + '.js', content, dir, false);
    };

    Maker.prototype.createServerListStoreFile = function createServerListStoreFile(orm, dir) {
        var listStoreName = orm.list + 'Store';
        var content = "/* This file is generated by IFramework - Maker.js for user to rewrite ListStore file */\n";
        content += "!function () {\n";
        content += "    var " + listStoreName + " = function " + listStoreName + "(db) {\n";
        content += "        this.db = db;\n";
        content += "    };\n";
        content += "\n";

        // extends
        content += "    " + listStoreName + ".prototype = new I.Models." + listStoreName + "Base();\n";
        content += "    " + listStoreName + ".prototype.constructor = " + listStoreName + ";\n";
        content += "\n";

        // exports
        content += "    I.Util.require('" + listStoreName + "', 'Models', new " + listStoreName + "(db));\n";
        content += "}();";

        this.writeFile(listStoreName + '.js', content, dir, false);
    };

    /* Client */
    Maker.prototype.createClientFiles = function createClientFiles(orms, dir) {
        var self = this;

        // check dir exist
        if (!fs.existsSync(dir)) {
            fs.mkdir(dir);
        }

        orms.forEach(function(orm) {
            // pk
            self.createClientPKFile(orm, dir);
            self.createClientPKStoreFile(orm, dir);
            // model
            self.createClientModelFile(orm, dir);
            self.createClientModelStoreFile(orm, dir);
            // list
            if (orm.list) {
                self.createClientListFile(orm, dir);
                self.createClientListStoreFile(orm, dir);
            }
        });
    };

    Maker.prototype.createClientPKFile = function createClientPKFile(orm, dir) {
        var pkName = orm.name + 'PK';
        var content = "/* This file is generated by IFramework - Maker.js for user to rewrite PK file */\n";
        content += "!function () {\n";
        content += "    var " + pkName + " = function " + pkName + "(pk) {\n";
        content += "        this.init.call(this, pk);\n";
        content += "    };\n";
        content += "\n";

        // extends
        content += "    " + pkName + ".prototype = new I.Models." + pkName + "Base();\n";
        content += "    " + pkName + ".prototype.constructor = " + pkName + ";\n";
        content += "\n";

        // exports
        content += "    I.Util.require('" + pkName + "', 'Models', " + pkName + ");\n";
        content += "}();";

        this.writeFile(pkName + '.js', content, dir, false);
    };

    Maker.prototype.createClientPKStoreFile = function createClientPKStoreFile(orm, dir) {
        var pkStoreName = orm.name + 'PKStore';
        var content = "/* This file is generated by IFramework - Maker.js for user to rewrite PKStore file */\n";
        content += "I.Loader." + orm.storeType + "Queue.push(function (db) {\n";
        content += "    var " + pkStoreName + " = function " + pkStoreName + "(db) {\n";
        content += "        this.db = db;\n";
        content += "    };\n";
        content += "\n";

        // extends
        content += "    " + pkStoreName + ".prototype = new I.Models." + pkStoreName + "Base();\n";
        content += "    " + pkStoreName + ".prototype.constructor = " + pkStoreName + ";\n";
        content += "\n";

        // exports
        content += "    I.Util.require('" + pkStoreName + "', 'Models', new " + pkStoreName + "(db));\n";
        content += "});";

        this.writeFile(pkStoreName + '.js', content, dir, false);
    };

    Maker.prototype.createClientModelFile = function createClientModelFile(orm, dir) {
        var content = "/* This file is generated by IFramework - Maker.js for user to rewrite Model file */\n";
        content += "!function () {\n";
        content += "    var " + orm.name + " = function " + orm.name + "(args) {\n";
        content += "        this.init.call(this, args);\n";
        content += "    };\n";
        content += "\n";

        // extends
        content += "    " + orm.name + ".prototype = new I.Models." + orm.name + "Base();\n";
        content += "    " + orm.name + ".prototype.constructor = " + orm.name + ";\n";
        content += "\n";

        // exports
        content += "    I.Util.require('" + orm.name + "', 'Models', " + orm.name + ");\n";
        content += "}();";

        this.writeFile(orm.name + '.js', content, dir, false);
    };

    Maker.prototype.createClientModelStoreFile = function createClientModelStoreFile(orm, dir) {
        var storeName = orm.name + 'Store';
        var content = "/* This file is generated by IFramework - Maker.js for user to rewrite ModelStore file */\n";
        content += "I.Loader." + orm.storeType + "Queue.push(function (db) {\n";
        content += "    var " + storeName + " = function " + storeName + "(db) {\n";
        content += "        this.db = db;\n";
        content += "    };\n";
        content += "\n";

        // extends
        content += "    " + storeName + ".prototype = new I.Models." + storeName + "Base();\n";
        content += "    " + storeName + ".prototype.constructor = " + storeName + ";\n";
        content += "\n";

        // exports
        content += "    I.Util.require('" + storeName + "', 'Models', new " + storeName + "(db));\n";
        content += "});";

        this.writeFile(storeName + '.js', content, dir, false);
    };

    Maker.prototype.createClientListFile = function createClientListFile(orm, dir) {
        var content = "/* This file is generated by IFramework - Maker.js for user to rewrite List file */\n";
        content += "!function () {\n";
        content += "    var " + orm.list + " = function " + orm.list + "(pk, list) {\n";
        content += "        this.init.call(this, pk, list);\n";
        content += "    };\n";
        content += "\n";

        // extends
        content += "    " + orm.list + ".prototype = new I.Models." + orm.list + "Base();\n";
        content += "    " + orm.list + ".prototype.constructor = " + orm.list + ";\n";
        content += "\n";

        // exports
        content += "    I.Util.require('" + orm.list + "', 'Models', " + orm.list + ");\n";
        content += "}();";

        this.writeFile(orm.list + '.js', content, dir, false);
    };

    Maker.prototype.createClientListStoreFile = function createClientListStoreFile(orm, dir) {
        var listStoreName = orm.list + 'Store';
        var content = "/* This file is generated by IFramework - Maker.js for user to rewrite ListStore file */\n";
        content += "I.Loader." + orm.storeType + "Queue.push(function (db) {\n";
        content += "    var " + listStoreName + " = function " + listStoreName + "(db) {\n";
        content += "        this.db = db;\n";
        content += "    };\n";
        content += "\n";

        // extends
        content += "    " + listStoreName + ".prototype = new I.Models." + listStoreName + "Base();\n";
        content += "    " + listStoreName + ".prototype.constructor = " + listStoreName + ";\n";
        content += "\n";

        // exports
        content += "    I.Util.require('" + listStoreName + "', 'Models', new " + listStoreName + "(db));\n";
        content += "});";

        this.writeFile(listStoreName + '.js', content, dir, false);
    };

    /* File System*/
    Maker.prototype.writeFile = function writeFile(name, content, path, overwrite) {
        var fullPath = path + '/' + name;

        if (!overwrite && fs.existsSync(fullPath)) {
            console.log(fullPath, 'exists, skip!');
            return;
        }

        fs.writeFileSync(fullPath, content);
        console.log(fullPath, 'Done!');
    };

    I.Util.require('Maker', '', new Maker());

    if (I.Util.isBrowser()) {
        I.Maker.makeModelBaseClasses(I.orms);
        for (var i in I.Maker.classes) {
            I.Models[i] = I.Maker.classes[i];
        }
    }
}();
