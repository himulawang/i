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
            'testAddFilter',
            'testUpdateFilter',
            'testAbbFilter',
            'testArrayFilter',
        ],
        toAddFilter: [4],
        toUpdateFilter: [5],
        toAbbFilter: [6],
        toArrayFilter: [7],
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
