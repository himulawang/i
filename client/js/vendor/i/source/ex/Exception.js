!function () {
    var Exception = function Exception(code) {
        this.code = code;
        this.message = I.ExceptionCodes[code];
    };

    I.Util.require('Exception', '', Exception);
}();
