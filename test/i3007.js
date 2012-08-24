exports.getQueue = function(data) { 
    var req = 'I3007';
    var queue = [
        // Set User1 Level & Money
        {
            caseName: 'Set User1 Level & Money',
            param: function(data) {
                return {
                    req: 'I50001',
                    user_id: data.userId1,
                    level: 10,
                    money: 200000,
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
        // Set User2 Level
        {
            caseName: 'Set User2 Level',
            param: function(data) {
                return {
                    req: 'I50001',
                    user_id: data.userId2,
                    level: 10,
                };
            },
            expect: function(data) {
                return {
                    i: 'I50001',
                    r: 0,
                    d: {
                        u: {
                            ui: data.userId2,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user2.user = result.d.u;
                };
            },
        },
        // Set User3 Level
        {
            caseName: 'Set User3 Level',
            param: function(data) {
                return {
                    req: 'I50001',
                    user_id: data.userId3,
                    level: 10,
                };
            },
            expect: function(data) {
                return {
                    i: 'I50001',
                    r: 0,
                    d: {
                        u: {
                            ui: data.userId3,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user3.user = result.d.u;
                };
            },
        },
        // Random Slave List
        {
            caseName: 'Random Slave List',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        pcl: function(result) {
                            return result.length > 0;
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user1.prisonCandidateList = result.d.pcl;
                };
            },
        },
    ];
    return queue;
};

