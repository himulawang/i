var ctrl = require('../config/ICTRL.js').ctrl;
var IController = function IController() {};

IController.prototype.process = function(params, cb) {
    var ctrlConfig = ctrl[params.req];
    if (!ctrlConfig) {
        throw new IException(10301);
    }

    this.validate(params, ctrlConfig.param);

    // add logic
    var syn = new Syn();
    global[ctrlConfig.action][params.req](syn, params, cb);

    // run
    syn.run();
};

IController.prototype.validate = function(params, paramConfig) {
    for (var name in paramConfig) {
        this.validateEach(params[name], paramConfig[name]);
    }
};

IController.prototype.validateEach = function(value, type) {
    if (type.length !== 2) throw new IException(10302); // TODO put this to server init

    var iConst = IConst;
    var util = IUtil;
    var passDataTypeValidation = false;

    switch (type[0]) {
        case iConst.PARAM_TYPE_ALLOW_MISS:
            if (value === undefined) passDataTypeValidation = true;
            break;
        case iConst.PARAM_TYPE_ALLOW_EMPTY:
            if (util.isEmpty(value)) passDataTypeValidation = true;
            break;
        case iConst.PARAM_TYPE_FORBID_EMPTY:
            if (util.isEmpty(value)) throw new IException(10303);
            break;
        default:
            throw new IException(10304);
    }

    if (passDataTypeValidation) return;
    switch (type[1]) {
        case iConst.PARAM_TYPE_INT:
            if (!util.isInt(value)) throw new IException(10305);
            break;
        case iConst.PARAM_TYPE_STRING:
            if (!util.isString(value)) throw new IException(10306);
            break;
        case iConst.PARAM_TYPE_ARRAY:
            if (!util.isArray(value)) throw new IException(10307);
            break;
        case iConst.PARAM_TYPE_HASH:
            if (!util.isHash(value)) throw new IException(10308);
            break;
        default:
            throw new IException(10309);
    }
};

var iController = new IController();

global.IController = iController;
