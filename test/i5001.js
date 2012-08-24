exports.getQueue = function(data) { 
    var req = 'I5001';
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
        // User1  Strengthen Card Success
        {
            caseName: 'User1 Strengthen Card Success',
            param: function(data) {
                return {
                    req: req,
                    session_key: 'a',
                    user_id: data.userId1,
                    card_id: data.user1.myCardList[0].ci,
                    sacrifice_card_ids: JSON.stringify([parseInt(data.user1.myCardList[1].ci), parseInt(data.user1.myCardList[2].ci)]),
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
                            se: function(result) {
                                return result > data.user1.myCardList[0].se;
                            },
                        },
                        b: {
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
        // User1 Strengthen Card Fail with empty sacrifice card ids
        {
            caseName: 'User1 Strengthen Card Fail with empty sacrifice card ids',
            param: function(data) {
                return {
                    req: req,
                    session_key: 'a',
                    user_id: data.userId1,
                    card_id: data.user1.myCardList[0].ci,
                    sacrifice_card_ids: JSON.stringify([]),
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 20603,
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1  Strengthen Card Fail with invalid cardId
        {
            caseName: 'User1 Strengthen Card Fail with invalid cardId',
            param: function(data) {
                return {
                    req: req,
                    session_key: 'a',
                    user_id: data.userId1,
                    card_id: data.user1.myCardList[0].ci,
                    sacrifice_card_ids: JSON.stringify([1111111111]),
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 20604,
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
