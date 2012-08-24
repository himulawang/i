exports.getQueue = function(data) { 
    var req = 'I5003';
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
        // User1 Remove Gem Success
        {
            caseName: 'User1 Remove Gem Success',
            param: function(data) {
                return {
                    req: req,
                    session_key: 'a',
                    user_id: data.userId1,
                    card_id: data.user1.myCardList[0].ci,
                    remove_slot_ids: '[1,1,0,0,0,0]',
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
                            gs: [0,0,0,-1,-1,-1],
                        },
                        ril: {
                            0: {
                                idi: 1,
                                c: 1,
                            },
                            1: {
                                idi: 2,
                                c: 1,
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
        // User1 Remove Gem Fail
        {
            caseName: 'User1 Remove Gem Fail',
            param: function(data) {
                return {
                    req: req,
                    session_key: 'a',
                    user_id: data.userId1,
                    card_id: data.user1.myCardList[0].ci,
                    remove_slot_ids: '[1,1,0,0,0,0]',
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 20614,
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
