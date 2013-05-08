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

    if (I.Util.isBrowser()) {
        I.Util.require('orms', '', orms);
    } else {
        // for server to create model files
        exports.orms = orms;
    }
}();
