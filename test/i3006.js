exports.getQueue = function(data) { 
    var req = 'I3006';
    var queue = [
        // Harvest Castle Normal
        {
            caseName: 'Harvest Castle Normal',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    use_item_id: 0,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        u: {
                            ui: data.userId1,
                            m: function(result) {
                                return result > data.user1.user.m;
                            },
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
        // Harvest Castle Normal But CDing
        {
            caseName: 'Harvest Castle Normal But CDing',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    use_item_id: 0,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 20100,
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // Harvest Castle Use Token
        {
            caseName: 'Harvest Castle Use Token',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    use_item_id: 100,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        u: {
                            ui: data.userId1,
                            m: function(result) {
                                return result > data.user1.user.m;
                            },
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
    ];
    return queue;
};
