exports.getQueue = function(data) { 
    var req = 'I1001';
    var queue = [
        // Invalid user_id
        {
            caseName: 'Invalid Login user_id',
            param: function(data) {
                return {
                    req: req,
                    token_key: 'a',
                    token_secret: 'b',
                    user_id: 'invalid_user_id',
                };
            },
            expect: function(data) {
                return {
                    r: 0,
                    c: 10800,
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1 Login Success
        {
            caseName: 'User1 Login Success',
            param: function(data) {
                return {
                    req: req,
                    token_key: 'a',
                    token_secret: 'b',
                    user_id: data.userId1,
                };
            },
            expect: function(data) {
                return {
                    i: req,
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
        // User2 Login Success
        {
            caseName: 'User2 Login Success',
            param: function(data) {
                return {
                    req: req,
                    token_key: 'a',
                    token_secret: 'b',
                    user_id: data.userId2,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        ui: data.userId2,
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user2 = {
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
        // User3 Login Success
        {
            caseName: 'User3 Login Success',
            param: function(data) {
                return {
                    req: req,
                    token_key: 'a',
                    token_secret: 'b',
                    user_id: data.userId3,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        ui: data.userId3,
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user3 = {
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
    ];
    return queue;
};
