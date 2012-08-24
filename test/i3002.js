exports.getQueue = function(data) { 
    var req = 'i3002';
    var queue = [
        // User1 Refresh Card - Normal Refresh
        {
            caseName: 'User1 Refresh Card - Normal Refresh',
            param: function(data) {
                return {
                    req: req,
                    userId: data.userId1,
                    sessionKey: 'a',
                    recruitTypeId: 1,
                    useItemId: 0,
                };
            },
            expect: function(data) {
                return {
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    console.log(result);
                    //data.userId1 = result[0].ui;
                };
            },
        },
    ];
    return queue;
};
