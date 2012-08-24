exports.getQueue = function(data) { 
    var req = 'I5002';
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
        // User1 Login Success To Get Card List
        {
            caseName: 'User1 Login Success To Get Card List',
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
        // User1 Insert Gem Success
        {
            caseName: 'User1 Insert Gem Success',
            param: function(data) {
                return {
                    req: req,
                    session_key: 'a',
                    user_id: data.userId1,
                    card_id: data.user1.myCardList[0].ci,
                    insert_item_ids: '[' + parseInt(getItemIdByItemDefId(1, data.user1.itemList)) + ',0,0,0,0,0]',
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        c: {
                            ci: data.user1.myCardList[0].ci,
                            ui: data.userId1,
                            gs: [1,0,0,-1,-1,-1],
                        },
                        uil: {
                            0: {
                                ii: getItemIdByItemDefId(1, data.user1.itemList),
                                c: 0,
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
        // User1 Insert Gem Fail Slot Occupied
        {
            caseName: 'User1 Insert Gem Fail Slot Occupied',
            param: function(data) {
                return {
                    req: req,
                    session_key: 'a',
                    user_id: data.userId1,
                    card_id: data.user1.myCardList[0].ci,
                    insert_item_ids: '[' + parseInt(getItemIdByItemDefId(2, data.user1.itemList)) + ',0,0,0,0,0]',
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 20610,
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User2 Insert Gem Success For Second Slot
        {
            caseName: 'User1 Insert Gem Success For Second Slot',
            param: function(data) {
                return {
                    req: req,
                    session_key: 'a',
                    user_id: data.userId1,
                    card_id: data.user1.myCardList[0].ci,
                    insert_item_ids: '[0,' + parseInt(getItemIdByItemDefId(2, data.user1.itemList)) + ',0,0,0,0]',
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        c: {
                            ci: data.user1.myCardList[0].ci,
                            ui: data.userId1,
                            gs: [1,2,0,-1,-1,-1],
                        },
                        uil: {
                            0: {
                                ii: getItemIdByItemDefId(2, data.user1.itemList),
                                c: 0,
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
