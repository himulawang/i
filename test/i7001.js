exports.getQueue = function(data) { 
    var req = 'I7001';
    var queue = [
        // User1 Get Shop Item List
        {
            caseName: 'User1 Get Shop Item List',
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
                        s: function(result) {
                            return result.length != 0;
                        }
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    //data.itemShopList = result.d.s;
                };
            },
        },
    ];
    return queue;
};
