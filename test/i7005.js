exports.getQueue = function(data) { 
    var req = 'I7005';
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
        // User1 Compound Gem Success
        {
            caseName: 'User1 Compound Gem Success',
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
                    r: 0,
                    d: {
                        ci: {
                            idi: 2,
                            c: 1,
                        },
                        ui: {
                            ii: getItemIdByItemDefId(1, data.user1.itemList),
                            idi: 1,
                            c: 1,
                        },
                        u: {
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
        // User1 Compound Gem Not Enough Gem
        {
            caseName: 'User1 Compound Gem Not Enough Gem',
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
                    r: 21408,
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
