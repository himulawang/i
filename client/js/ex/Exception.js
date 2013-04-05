I.Exception = function Exception(code) {
    this.code = code;
    this.message = I.ExceptionCodes[code];
};
