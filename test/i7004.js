exports.getQueue = function(data) { 
    var req = 'I7004';
    var getItemIdByItemDefId = function(itemDefId, itemList) {
        for (var i in itemList) {
            if (itemList[i].idi == itemDefId) {
                return itemList[i].ii;
            }
        }
    };
    var getItemCountByItemDefId = function(itemDefId, itemList) {
        for (var i in itemList) {
            if (itemList[i].idi == itemDefId) {
                return itemList[i].c;
            }
        }
    };
    var queue = [
        // User1 Login Success To Get Item List
        {
            caseName: 'User1 Login Success To Get Item List',
            param: function(data) {
                return {
                    req: 'I1001',
                    token_key: 'a',
                    token_secret: 'b',
                    user_id: data.userId1,
                };
            },
            expect: function(data) {
                return {
                    i: 'I1001',
                    r: 0,
                    d: {
                        ui: data.userId1,
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user1 = {
                        user: result.d.u,
                        building: result.d.b,
                        story: result.d.s,
                        prison: result.d.p,
                        itemList: result.d.il,
                        myCardList: result.d.mcl,
                        candidateCardList: result.d.ccl,
                        sessionKey: result.d.sk,
                    };
                };
            },
        },
        // User1 Use Gem
        {
            caseName: 'User1 Use Gem',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_id: getItemIdByItemDefId(1, data.user1.itemList),
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 21405,
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1 Use Card Package
        {
            caseName: 'User1 Use Card Package',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_id: getItemIdByItemDefId(1001, data.user1.itemList),
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        ai: 1,
                        ui: {
                            ii: getItemIdByItemDefId(1001, data.user1.itemList),
                            idi: 1001,
                            c: getItemCountByItemDefId(1001, data.user1.itemList) - 1,
                        },
                        c: {
                            ui: data.userId1,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1 Use Item Package
        {
            caseName: 'User1 Use Item Package',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_id: getItemIdByItemDefId(2000, data.user1.itemList),
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        ai: 2,
                        ui: {
                            ii: getItemIdByItemDefId(2000, data.user1.itemList),
                            idi: 2000,
                            c: getItemCountByItemDefId(2000, data.user1.itemList) - 1,
                        },
                        i: {
                            ui: data.userId1,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1 Use Exp Item
        {
            caseName: 'User1 Use Exp Item',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_id: getItemIdByItemDefId(3000, data.user1.itemList),
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        ai: 3,
                        ui: {
                            ii: getItemIdByItemDefId(3000, data.user1.itemList),
                            idi: 3000,
                            c: getItemCountByItemDefId(3000, data.user1.itemList) - 1,
                        },
                        u: {
                            ui: data.userId1,
                            e: function(result) {
                                return result > data.user1.user.e;
                            },
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1 Modify Energy To 0
        {
            caseName: 'User1 Modify Energy To 0',
            param: function(data) {
                return {
                    req: 'I50001',
                    user_id: data.userId1,
                    energy: 1,
                };
            },
            expect: function(data) {
                return {
                    i: 'I50001',
                    r: 0,
                    d: {
                        u: {
                            ui: data.userId1,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user1.user = result.d.u;
                };
            },
        },
        // User1 Use Energy Item
        {
            caseName: 'User1 Use Energy Item',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_id: getItemIdByItemDefId(3004, data.user1.itemList),
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        ai: 4,
                        ui: {
                            ii: getItemIdByItemDefId(3004, data.user1.itemList),
                            idi: 3004,
                            c: getItemCountByItemDefId(3004, data.user1.itemList) - 1,
                        },
                        u: {
                            ui: data.userId1,
                            en: function(result) {
                                return result > data.user1.user.en;
                            },
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1 Use Honor Item
        {
            caseName: 'User1 Use Honor Item',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_id: getItemIdByItemDefId(3006, data.user1.itemList),
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        ai: 5,
                        ui: {
                            ii: getItemIdByItemDefId(3006, data.user1.itemList),
                            idi: 3006,
                            c: getItemCountByItemDefId(3006, data.user1.itemList) - 1,
                        },
                        u: {
                            ui: data.userId1,
                            h: function(result) {
                                return result > data.user1.user.h;
                            },
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1 Use Gold Item
        {
            caseName: 'User1 Use Gold Item',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_id: getItemIdByItemDefId(3008, data.user1.itemList),
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        ai: 6,
                        ui: {
                            ii: getItemIdByItemDefId(3008, data.user1.itemList),
                            idi: 3008,
                            c: getItemCountByItemDefId(3008, data.user1.itemList) - 1,
                        },
                        u: {
                            ui: data.userId1,
                            m: function(result) {
                                return result > data.user1.user.m;
                            },
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
    ];
    return queue;
};
