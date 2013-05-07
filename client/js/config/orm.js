!function() {
var orms = [
{
    name: 'Connection',
    abb: 'c',
    column: [
        'id',
        'name',
        'host',
        'port',
    ],
    toAddFilter: [],
    toUpdateFilter: [0],
    toAbbFilter: [],
    toArrayFilter: [],
    pk: 'id',
    pkAutoIncrement: true,
    list: 'ConnectionList',
    storeType: 'IndexedDB',
},
];

if (global) {
    exports.orms = orms;
} else {
    window.orms = orms;
}

}();
