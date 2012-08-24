exports.getQueue = function(data) { 
    var req = 'I3005';
    var queue = [
        // User1 Submit Formation Success
        {
            caseName: 'User1 Submit Formation Success',
            param: function(data) {
                var barrack_formation1 = [
                    0,
                    parseInt(data.user1.myCardList[0].ci),
                    0,
                    parseInt(data.user1.myCardList[1].ci),
                    0,
                    parseInt(data.user1.myCardList[2].ci),
                    0,
                    0,
                    0,
                ];
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    barrack_formation1: JSON.stringify(barrack_formation1),
                    barrack_formation2: '[0,0,0,0,0,0,0,0,0]',
                    barrack_formation3: '[0,0,0,0,0,0,0,0,0]',
                    barrack_active_formation_id: 1,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // Submitted Formation Check
        {
            caseName: 'Submitted Formation Check',
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
                        b: {
                            bf: [
                                0,
                                data.user1.myCardList[0].ci,
                                0,
                                data.user1.myCardList[1].ci,
                                0,
                                data.user1.myCardList[2].ci,
                                0,
                                0,
                                0,
                            ],
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user1.building = result.d.b;
                };
            },
        },
        // User2 Submit Formation Success
        {
            caseName: 'User2 Submit Formation Success',
            param: function(data) {
                var barrack_formation1 = [
                    0,
                    parseInt(data.user2.myCardList[0].ci),
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                ];
                return {
                    req: req,
                    user_id: data.userId2,
                    session_key: 'a',
                    barrack_formation1: JSON.stringify(barrack_formation1),
                    barrack_formation2: '[0,0,0,0,0,0,0,0,0]',
                    barrack_formation3: '[0,0,0,0,0,0,0,0,0]',
                    barrack_active_formation_id: 1,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
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
