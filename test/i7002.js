exports.getQueue = function(data) { 
    var req = 'I7002';
    var queue = [
        // User1 Buy Item ItemDefId 1 (Gem) Count1
        {
            caseName: 'User1 Buy Item ItemDefId 1 Count1',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_def_id: 1,
                    count: 1,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        i: {
                            idi: 1,
                            c: 1,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1 Buy Item ItemDefId 1 (Gem) Count4
        {
            caseName: 'User1 Buy Item ItemDefId 1 Count4',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_def_id: 1,
                    count: 4,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        i: {
                            idi: 1,
                            c: 5,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1 Buy Item ItemDefId 1001 (CardPackage) Count2
        {
            caseName: 'User1 Buy Item ItemDefId 1001 Count2',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_def_id: 1001,
                    count: 2,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        i: {
                            idi: 1001,
                            c: 2,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1 Buy Item ItemDefId 2000 (ItemPackage) Count2
        {
            caseName: 'User1 Buy Item ItemDefId 2000 Count2',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_def_id: 2000,
                    count: 2,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        i: {
                            idi: 2000,
                            c: 2,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1 Buy Item ItemDefId 3000 (ExpItem) Count2
        {
            caseName: 'User1 Buy Item ItemDefId 3000 Count2',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_def_id: 3000,
                    count: 2,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        i: {
                            idi: 3000,
                            c: 2,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1 Buy Item ItemDefId 3004 (EnergyItem) Count2
        {
            caseName: 'User1 Buy Item ItemDefId 3004 Count2',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_def_id: 3004,
                    count: 2,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        i: {
                            idi: 3004,
                            c: 2,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1 Buy Item ItemDefId 3006 (HonorItem) Count2
        {
            caseName: 'User1 Buy Item ItemDefId 3006 Count2',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_def_id: 3006,
                    count: 2,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        i: {
                            idi: 3006,
                            c: 2,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1 Buy Item ItemDefId 3008 (GoldItem) Count2
        {
            caseName: 'User1 Buy Item ItemDefId 3008 Count2',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_def_id: 3008,
                    count: 2,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 0,
                    d: {
                        i: {
                            idi: 3008,
                            c: 2,
                        },
                    },
                };
            },
            dataHandler: function(data) {
                return function(result) {
                };
            },
        },
        // User1 Buy Item ItemDefId 3011 (ExpensiveTrash) Count2
        {
            caseName: 'User1 Buy Item ItemDefId 3011 Count2',
            param: function(data) {
                return {
                    req: req,
                    user_id: data.userId1,
                    session_key: 'a',
                    item_def_id: 3011,
                    count: 2,
                };
            },
            expect: function(data) {
                return {
                    i: req,
                    r: 21402,
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
