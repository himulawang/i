require('./lib/IConst.js');
var fs = require('fs');

var orms = require('./config/IORM.js').orms;
var IException = require('./lib/IException.js').IException;

var create = function(orm) {
    switch (orm.type) {
        case IConst.OBJECT_TYPE_HASH:
            createBOFile(orm);
            createModelBOFile(orm);
            break;
        case IConst.OBJECT_TYPE_LIST:
            createListFile(orm);
            createModelListFile(orm);
            break;
        default:
            throw new IException(10001);
    }
};

var createBOFile = function(orm) {
    // comments
    var content = "/* This file is generated by deploy.js automatically */\n";

    // make constructor
    content += 'var ' + orm.name + ' = function ' + orm.name + "(args) {\n";
    content += "    this.pk = '" + orm.pk + "';\n";
    content += "    this.column = ['" + orm.column.join("', '") + "'];\n";
    content += "    this.init.call(this, args);\n";
    content += "};\n";
    content += "\n";

    // extends
    content += orm.name + ".prototype = new IObject();\n";
    content += orm.name + ".prototype.constructor = " + orm.name + ";\n";
    content += "\n";

    // make getter
    content += "/* Getter */\n";
    orm.column.forEach(function(v, i) {
        content += orm.name + ".prototype.__defineGetter__('" + v + "', function() { return this.args[" + i + "]; });\n";
    });
    content += "\n";

    // make setter
    content += "/* Setter */\n";
    orm.column.forEach(function(v, i) {
        content += orm.name + ".prototype.__defineSetter__('" + v + "', function(val) { this.args[" + i + "] = val; this.updateList[" + i + "] = 1; });\n";
    });
    content += "\n";

    // make exports
    content += 'global.' + orm.name + ' = ' + orm.name + ';';

    // write
    write(orm.name, content);
};

var createListFile = function(orm) {
    // comments
    var content = "/* This file is generated by deploy.js automatically */\n";

    // make constructor
    content += "var " + orm.name + " = function " + orm.name + "(pk, index, list) {\n";
    content += "    IList.call(this, pk, index, list);\n";
    content += "};\n";
    content += "\n";

    // extends
    content += orm.name + ".prototype = new IList();\n";
    content += orm.name + ".prototype.constructor = " + orm.name + ";\n";
    content += "\n";

    // make exports
    content += 'global.' + orm.name + ' = ' + orm.name + ';';

    // write
    write(orm.name, content);
};

var createModelBOFile = function(orm) {
    var modelName = orm.name + 'Model';
    // comments
    var content = "/* This file is generated by deploy.js automatically */\n";

    content += "var " + modelName + " = function " + modelName + "() {\n";
    content += "    this.type = '" + orm.type + "';\n";
    content += "    this.objectName = '" + orm.name + "';\n";
    content += "    this.abb = '" + orm.abb + "';\n";
    content += "    this.pk = '" + orm.pk + "';\n";
    content += "    this.updateFilter = [" + orm.updateFilter.join(',') + "];\n";
    content += "};\n";
    content += "\n";

    content += modelName + ".prototype = new IModel();\n";
    content += modelName + ".prototype.constructor = " + modelName + ";\n";
    content += "\n";

    content += "global." + modelName + " = new " + modelName + "();\n";
    write(modelName, content);
};

var createModelListFile = function(orm) {
    var modelName = orm.name + 'Model';
    // comments
    var content = "/* This file is generated by deploy.js automatically */\n";

    content += "var " + modelName + " = function " + modelName + "() {\n";
    content += "    this.type = '" + orm.type + "';\n";
    content += "    this.objectName = '" + orm.name + "';\n";
    content += "    this.abb = '" + orm.abb + "';\n";
    content += "    this.child = '" + orm.child + "';\n";
    content += "    this.childModel = " + orm.child + "Model;\n";
    content += "};\n";
    content += "\n";

    content += modelName + ".prototype = new IModel();\n";
    content += modelName + ".prototype.constructor = " + modelName + ";\n";
    content += "\n";

    content += "global." + modelName + " = new " + modelName + "();\n";
    write(modelName, content);
};

var write = function(name, content) {
    var filename = name + '.js';
    var path = './model/';
    var fullPath = path + filename;

    fs.writeFile(fullPath, content, function(e) {
        if (e) throw new IException(10002);
        console.log(fullPath, 'Done!');
    });
};

orms.forEach(function(v) {
    create(v);
});
