var HIRE_CARD_COST_MONEY = 100;

exports.getQueue = function(data) { 
    var req = 'I3003';
    var queue = [
        // User1 Hire Card Success
        {
            caseName: 'User1 Hire Card Success',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    card_id: data.user1.candidateCardList[0].ci,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        u: {
                            ui: data.userId1,
                            m: data.user1.user.m - HIRE_CARD_COST_MONEY,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user1.user = result.d.u;
                    data.user1.candidateCardList.shift();
                };
            },
        },
        // User1 Hired Card Check
        {
            caseName: 'User1 Hired Card Check',
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
                        u: {
                            ui: data.userId1,
                        },
                        ccl: function(result) {
                            return result.length === 2;
                        },
                        mcl: function(result) {
                            return result.length === 1;
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user1.user = result.d.u;
                    data.user1.candidateCardList = result.d.ccl;
                    data.user1.myCardList = result.d.mcl;
                };
            },
        },
        // User1 Hire Second Card
        {
            caseName: 'User1 Hire Second Card',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    card_id: data.user1.candidateCardList[0].ci,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        u: {
                            ui: data.userId1,
                            m: data.user1.user.m - HIRE_CARD_COST_MONEY,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user1.user = result.d.u;
                    data.user1.candidateCardList.shift();
                };
            },
        },
        // User1 Hire Third Card
        {
            caseName: 'User1 Hire Third Card',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    card_id: data.user1.candidateCardList[0].ci,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        u: {
                            ui: data.userId1,
                            m: data.user1.user.m - HIRE_CARD_COST_MONEY,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user1.user = result.d.u;
                    data.user1.candidateCardList.shift();
                };
            },
        },
        // User1 Hired Card Final Check
        {
            caseName: 'User1 Hired Card Final Check',
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
                        u: {
                            ui: data.userId1,
                        },
                        ccl: function(result) {
                            return result.length === 0;
                        },
                        mcl: function(result) {
                            return result.length === 3;
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user1.user = result.d.u;
                    data.user1.candidateCardList = result.d.ccl;
                    data.user1.myCardList = result.d.mcl;
                };
            },
        },
        // User2 Hire Card Success
        {
            caseName: 'User2 Hire Card Success',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId2,
                    session_key: 'a',
                    card_id: data.user2.candidateCardList[0].ci,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        u: {
                            ui: data.userId2,
                            m: data.user2.user.m - HIRE_CARD_COST_MONEY,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user2.user = result.d.u;
                    data.user2.candidateCardList.shift();
                };
            },
        },
        // User2 Hired Card Check
        {
            caseName: 'User1 Hired Card Check',
            param: function(data) {
                return {
                    req: 'I1001',
                    token_key: 'a',
                    token_secret: 'b',
                    user_id: data.userId2,
                };
            },
            expect: function(data) {
                return {
                    i: 'I1001',
                    r: 0,
                    d: {
                        u: {
                            ui: data.userId2,
                        },
                        ccl: function(result) {
                            return result.length === 2;
                        },
                        mcl: function(result) {
                            return result.length === 1;
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user2.user = result.d.u;
                    data.user2.candidateCardList = result.d.ccl;
                    data.user2.myCardList = result.d.mcl;
                };
            },
        },
    ];
    return queue;
};
