var orms = [
{
    name: 'User',
    abb: 'u',               // abbreviation for redis hash name
    type: 'hash',
    child: null,
    column: [               // column to create bo file, column index is hash field in redis
        'userId',
        'level',
        'exp',
        'money',
        'energy',
        'energyLimit',
        'lastEnergyChargedTime',
        'lastLoginTime',
        'honor',
        'dailyVisitedFriends',
        'lastResetDailyVisitedFriendsTime',
        'side',
        'kingHeartLevel',
        'kingHeartAppearance',
        'loginCount',
    ],
    updateFilter: [0],
    clientFilter: [6, 7, 10, 14],
    pk: 'userId',               // primary key
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
