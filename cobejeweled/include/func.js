var Func = function() {};
Func.prototype.inArray = function(value, array) {
    for (var i = 0; i < array.length; ++i) {
        if (array[i] === value) return true;
    }
    return false;
};
