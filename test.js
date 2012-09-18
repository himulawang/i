/*
var test = function test(a) {
    return Math.random() * a;
};
*/

var test = new Function('a', 'return Math.random() * a');

console.time('test');
for (var i = 0; i < 100000000; ++i) {
    test(i);
}
console.timeEnd('test');


