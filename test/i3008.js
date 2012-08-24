exports.getQueue = function(data) { 
    var req = 'I3008';
    var queue = [
        // User1 Enslave User2
        {
            caseName: 'User1 Enslave User2',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    slave_slot: 1,
                    slave_id: data.userId2,
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
                            si: data.userId2,
                            st: function(result) {
                                return result != null;
                            }
                        },
                        r: 1,
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.user1.prison = result.d.p;
                };
            },
        },
        // User1 Enslave User2 But SlaveSlot1 occupied
        {
            caseName: 'User1 Enslave User2 But SlaveSlot1 occupied',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    slave_slot: 1,
                    slave_id: data.userId2,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 21002,
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
