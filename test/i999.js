var uuid = require('./uuid.js');

exports.getQueue = function(data) { 
    var req = 'i999';
    var queue = [
        // Register User1
        {
            caseName: 'register User1',
            param: function(data) {
                return {
                    req: req,
                    user_name: uuid(),
                };
            },
            expect: function(data) {
                return {
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.userId1 = result[0].ui;
                };
            },
        },
        // Register User2
        {
            caseName: 'register User2',
            param: function(data) {
                return {
                    req: req,
                    user_name: uuid(),
                };
            },
            expect: function(data) {
                return {
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.userId2 = result[0].ui;
                };
            },
        },
        // Register User3
        {
            caseName: 'register User3',
            param: function(data) {
                return {
                    req: req,
                    user_name: uuid(),
                };
            },
            expect: function(data) {
                return {
                };
            },
            dataHandler: function(data) {
                return function(result) {
                    data.userId3 = result[0].ui;
                };
            },
        },
    ];
    return queue;
};
