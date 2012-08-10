var ctrl = require('../config/ICTRL.js');
var IController = function IController() {};

IController.prototype.process = function(params) {
    var util = IUtil;
    var startMicroTimestamp = util.getMicroTimestamp();

    if (ctrl[params.req]) {
    }

    this.validate(params);
};

IController.prototype.validate = function(params) {
    for (var name in ctrl) {
    }
};

IController.prototype.validateEach = function(value, type) {
};
