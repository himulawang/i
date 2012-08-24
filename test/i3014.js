exports.getQueue = function(data) { 
    var req = 'I3014';
    var queue = [
        // Unlock User1 Prison Slot1
        {
            caseName: 'Unlock User1 Prsion Slot1',
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
                        p: {
                            ui: data.userId1,
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
        // Unlock User1 Prison Slot2
        {
            caseName: 'Unlock User1 Prsion Slot2',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    slave_slot: 2,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        p: {
                            ui: data.userId1,
                            slt: function(result) {
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
