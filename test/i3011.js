exports.getQueue = function(data) { 
    var req = 'I3011';
    var queue = [
        // User1 GiveUpSlave User2
        {
            caseName: 'User1 GiveUpSlave User2',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    slave_slot: 1,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        u: {
                            ui: data.userId1,
                        },
                        p: {
                            ui: data.userId1,
                            si: 0,
                            st: function(result) {
                                return result != null;
                            }
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user1.prison = result.d.p;
                };
            },
        },
    ];
    return queue;
};
