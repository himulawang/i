var orms = [
{
    name: 'User',
    abb: 'u',               // abbreviation for redis hash name
    type: 'hash',
    child: null,
    column: [               // column to create bo file, column index is hash field in redis
        'id',
        'level',
        'exp',
        'money',
        'token',
        'lastLoginTime',
    ],
    updateFilter: [0],
    clientFilter: [5],
    pk: 'id',               // primary key
},
{
    name: 'Item',
    abb: 'i',
    type: 'hash',
    child: null,
    column: [
        'itemId',
        'itemTypeId',
        'count',
        'updateTime',
    ],
    updateFilter: [0],
    clientFilter: [],
    pk: 'itemId',
},
{
    name: 'ItemList',
    abb: 'il',
    type: 'list',
    child: 'Item',
},
];

exports.orms = orms;
