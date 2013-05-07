exports.orms = [
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
    storeType: 'Redis',
},
];
