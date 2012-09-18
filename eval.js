
/*
var a = function () {
    return Math.random() * 100;
};
*/

var t = '';
t += 'var a = function () {';
t += 'return Math.random() * 100;';
t += '};';

eval(t);

exports.test = a;
