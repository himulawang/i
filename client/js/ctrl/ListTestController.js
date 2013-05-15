!function() {
    var ListTestController = {
        run: function run() {
            this.init();
            this.reset();
            this.getPK();
            this.setPK();
            this.set();
            this.get();
            this.unset();
            this.add();
            this.del();
            this.drop();
            this.update();
            this.addSync();
            this.delSync();
            this.dropSync();
            this.updateSync();
            this.markDelSync();
            this.getKeys();
            this.toAbbArray();
            this.toArray();
            this.fromAbbArray();
            this.fromArray();
            this.last();
            this.backup();
            this.restore();
            this.restoreSync();
        },
        init: function init() {
            testResultView.renderTitle('List init');
            try {
                var list = new I.Models.ConnectionList();
            } catch (e) {
                testResultView.renderAssert(e.code === 10118, 'undefined pk throw exception.');
            }

            var list = new I.Models.ConnectionList(1);
            testResultView.renderAssert(I.Util.getLength(list) === 0, 'with list, list is right.');

            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var connection2 = new I.Models.Connection([2, 'test server2', '10.88.230.51', '6380', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var data = { 1: connection1, 2: connection2 };
            var list = new I.Models.ConnectionList(1, data);

            testResultView.renderAssert(list.get(1) === connection1, 'list data1 is right.');
            testResultView.renderAssert(list.get(2) === connection2, 'list data2 is right.');
        },
        reset: function reset() {
            testResultView.renderTitle('List reset');
            var list = new I.Models.ConnectionList(1);
            list.reset();

            testResultView.renderAssert(list.toAddList.length === 0, 'toAddList is right.');
            testResultView.renderAssert(list.toDelList.length === 0, 'toDelList is right.');
            testResultView.renderAssert(list.toUpdateList.length === 0, 'toUpdateList is right.');
            testResultView.renderAssert(list.toAddSyncList.length === 0, 'toAddSyncList is right.');
            testResultView.renderAssert(list.toDelSyncList.length === 0, 'toDelSyncList is right.');
            testResultView.renderAssert(list.toUpdateSyncList.length === 0, 'toUpdateSyncList is right.');
            testResultView.renderAssert(list.tagDelSync === false, 'tagDelSync is false.');
        },
        setPK: function setPK() {
            testResultView.renderTitle('List setPK');
            var list = new I.Models.ConnectionList(1);
            list.setPK(2);
            testResultView.renderAssert(list.getPK() === 2, 'pk is right.');
        },
        getPK: function getPK() {
            testResultView.renderTitle('List getPK');
            var list = new I.Models.ConnectionList(1);
            testResultView.renderAssert(list.getPK() === 1, 'pk is right.');
        },
        set: function set() {
            testResultView.renderTitle('List set');
            var list = new I.Models.ConnectionList(1);
            var connection1 = new I.Models.Connection();
            try {
                list.set(connection1);
            } catch (e) {
                testResultView.renderAssert(e.code === 10132, 'child has no pk throw exception.');
            }

            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            list.set(connection1);
            testResultView.renderAssert(list.get(1) === connection1, 'list is right.');
        },
        get: function get() {
            testResultView.renderTitle('List get');
            var list = new I.Models.ConnectionList(1);
            testResultView.renderAssert(list.get(1) === null, 'child not exist return null.');

            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1 });
            testResultView.renderAssert(list.get(1) === connection1, 'child is right.');
        },
        unset: function unset() {
            testResultView.renderTitle('List unset');
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1 });

            try {
                list.unset([]);
            } catch (e) {
                testResultView.renderAssert(e.code === 10133, 'input invalid throw exception.');
            }

            list.unset(connection1);
            testResultView.renderAssert(I.Util.getLength(list) === 0, 'input is child.');

            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1 });
            list.unset(1);
            testResultView.renderAssert(I.Util.getLength(list) === 0, 'input is index.');
        },
        add: function add() {
            testResultView.renderTitle('List add');
            var list = new I.Models.ConnectionList(1);
            var connection1 = new I.Models.Connection();
            try {
                list.add([]);
            } catch (e) {
                testResultView.renderAssert(e.code === 10127, 'input is not child throw exception.');
            }

            try {
                list.add(connection1);
            } catch (e) {
                testResultView.renderAssert(e.code === 10143, 'child has no pk throw exception.');
            }

            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1 });
            try {
                list.add(connection1);
            } catch (e) {
                testResultView.renderAssert(e.code === 10140, 'child exist cannot add again throw exception.');
            }

            var list = new I.Models.ConnectionList(1);
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            list.add(connection1);
            testResultView.renderAssert(list.toAddList[0] === connection1, 'toAddList is right.');
            testResultView.renderAssert(list.get(1) === null, 'list is right.');
        },
        del: function del() {
            testResultView.renderTitle('List del');
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1 });

            try {
                list.del([]);
            } catch (e) {
                testResultView.renderAssert(e.code === 10128, 'invalid input throw exception.');
            }

            var connection2 = new I.Models.Connection();
            try {
                list.del(connection2);
            } catch (e) {
                testResultView.renderAssert(e.code === 10144, 'child has no pk throw exception.');
            }

            connection2.setPK(2);
            try {
                list.del(connection2);
            } catch (e) {
                testResultView.renderAssert(e.code === 10129, 'child not exist throw exception.');
            }

            list.del(1);
            testResultView.renderAssert(list.get(1) === connection1, 'input is int list is right.');
            testResultView.renderAssert(list.toDelList[0] === connection1, 'input is int toDelList is right.');

            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1 });
            list.del(connection1);
            testResultView.renderAssert(list.get(1) === connection1, 'input is child list is right.');
            testResultView.renderAssert(list.toDelList[0] === connection1, 'input is child toDelList is right.');
        },
        drop: function drop() {
            testResultView.renderTitle('List drop');
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var connection2 = new I.Models.Connection([2, 'test server2', '10.88.230.52', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1, 2: connection2 });
            list.drop();
            testResultView.renderAssert(I.Util.getLength(list) === 2, 'list is right.');
            testResultView.renderAssert(I.Util.getLength(list.toDelList) === 2, 'toDelList is right.');
        },
        update: function update() {
            testResultView.renderTitle('List update');
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1 });

            try {
                list.update([]);
            } catch (e) {
                testResultView.renderAssert(e.code === 10130, 'input invalid throw exception.');
            }

            var connection2 = new I.Models.Connection();
            try {
                list.update(connection2);
            } catch (e) {
                testResultView.renderAssert(e.code === 10145, 'child has no pk throw exception.');
            }

            connection2.setPK(2);
            try {
                list.update(connection2);
            } catch (e) {
                testResultView.renderAssert(e.code === 10131, 'child not exist throw exception.');
            }

            connection1.name = 'new server';
            list.update(connection1);
            testResultView.renderAssert(list.toUpdateList[0] === connection1, 'toUpdateList is right.');
        },
        addSync: function addSync() {
            testResultView.renderTitle('List addSync');
            var list = new I.Models.ConnectionList(1);
            var connection1 = new I.Models.Connection();
            try {
                list.addSync([]);
            } catch (e) {
                testResultView.renderAssert(e.code === 10135, 'input is not child throw exception.');
            }

            try {
                list.addSync(connection1);
            } catch (e) {
                testResultView.renderAssert(e.code === 10120, 'child has no pk throw exception.');
            }

            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1 });
            try {
                list.addSync(connection1);
            } catch (e) {
                testResultView.renderAssert(e.code === 10141, 'child exist cannot add again throw exception.');
            }

            var list = new I.Models.ConnectionList(1);
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            list.addSync(connection1);
            testResultView.renderAssert(list.toAddSyncList[0] === 1, 'toAddSyncList is right.');
            testResultView.renderAssert(list.get(1) === connection1, 'list is right.');
        },
        delSync: function delSync() {
            testResultView.renderTitle('List delSync');
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1 });

            try {
                list.delSync([]);
            } catch (e) {
                testResultView.renderAssert(e.code === 10136, 'invalid input throw exception.');
            }

            var connection2 = new I.Models.Connection();
            try {
                list.delSync(connection2);
            } catch (e) {
                testResultView.renderAssert(e.code === 10146, 'child has no pk throw exception.');
            }

            connection2.setPK(2);
            try {
                list.delSync(connection2);
            } catch (e) {
                testResultView.renderAssert(e.code === 10137, 'child not exist throw exception.');
            }

            // input int, child not in toAddSyncList, not in toUpdateSyncList
            list.delSync(1);
            testResultView.renderAssert(list.get(1) === null, 'input is int, child not in toAddSyncList, child not in toUpdateSyncList, list is right.');
            testResultView.renderAssert(list.toDelSyncList[0] === connection1, 'input is int, child not in toAddList, child not in toUpdateSyncList, toDelSyncList is right.');

            // input int, child in toAddSyncList, not in toUpdateSyncList
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1);
            list.addSync(connection1);
            list.delSync(1);
            testResultView.renderAssert(list.get(1) === null, 'input is int, child in toAddSyncList, child not in toUpdateSyncList, list is right.');
            testResultView.renderAssert(list.toDelSyncList.length === 0, 'input is int, child in toAddList, child not in toUpdateSyncList, toDelSyncList is right.');
            testResultView.renderAssert(list.toAddSyncList.indexOf(connection1) === -1, 'input is int, child in toAddList, child not in toUpdateSyncList, toAddSyncList is right.');

            // input int, child not in toAddList, in toUpdateSyncList
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1 });
            connection1.name = 'new server';
            list.updateSync(connection1);
            list.delSync(1);
            testResultView.renderAssert(list.get(1) === null, 'input is int, child not in toAddSyncList, child in toUpdateSyncList, list is right.');
            testResultView.renderAssert(list.toDelSyncList[0] === connection1, 'input is int, child in toAddList, child in toUpdateSyncList, toDelSyncList is right.');
            testResultView.renderAssert(list.toUpdateSyncList.indexOf(connection1) === -1, 'input is int, child not in toAddList, child in toUpdateSyncList, toUpdateSyncList is right.');

            // input child, child not in toAddSyncList, not in toUpdateSyncList
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1 });
            list.delSync(connection1);
            testResultView.renderAssert(list.get(1) === null, 'input is child, child not in toAddSyncList, child not in toUpdateSyncList, list is right.');
            testResultView.renderAssert(list.toDelSyncList[0] === connection1, 'input is child, child not in toAddList, child not in toUpdateSyncList, toDelSyncList is right.');

            // input int, child in toAddSyncList, not in toUpdateSyncList
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1);
            list.addSync(connection1);
            list.delSync(connection1);
            testResultView.renderAssert(list.get(1) === null, 'input is child, child in toAddSyncList, child not in toUpdateSyncList, list is right.');
            testResultView.renderAssert(list.toDelSyncList.length === 0, 'input is child, child in toAddList, child not in toUpdateSyncList, toDelSyncList is right.');
            testResultView.renderAssert(list.toAddSyncList.indexOf(connection1) === -1, 'input is child, child in toAddList, child not in toUpdateSyncList, toAddSyncList is right.');

            // input child, child not in toAddList, in toUpdateSyncList
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1 });
            connection1.name = 'new server';
            list.updateSync(connection1);
            list.delSync(connection1);
            testResultView.renderAssert(list.get(1) === null, 'input is child, child not in toAddSyncList, child in toUpdateSyncList, list is right.');
            testResultView.renderAssert(list.toDelSyncList[0] === connection1, 'input is child, child in toAddList, child in toUpdateSyncList, toDelSyncList is right.');
            testResultView.renderAssert(list.toUpdateSyncList.indexOf(connection1) === -1, 'input is child, child not in toAddList, child in toUpdateSyncList, toUpdateSyncList is right.');
        },
        dropSync: function dropSync() {
            testResultView.renderTitle('List dropSync');
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var connection2 = new I.Models.Connection([2, 'test server2', '10.88.230.52', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1, 2: connection2 });
            
            list.dropSync();
            testResultView.renderAssert(I.Util.getLength(list.toDelSyncList) === 2, 'toDelSyncList is right.');
            testResultView.renderAssert(I.Util.getLength(list) === 0, 'list is right.');
        },
        updateSync: function updateSync() {
            testResultView.renderTitle('List updateSync');
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1 });

            try {
                list.updateSync([]);
            } catch (e) {
                testResultView.renderAssert(e.code === 10138, 'input invalid throw exception.');
            }

            var connection2 = new I.Models.Connection();
            try {
                list.updateSync(connection2);
            } catch (e) {
                testResultView.renderAssert(e.code === 10147, 'child has no pk throw exception.');
            }

            connection2.setPK(2);
            try {
                list.updateSync(connection2);
            } catch (e) {
                testResultView.renderAssert(e.code === 10139, 'child not exist throw exception.');
            }

            // not in toAddSyncList
            connection1.name = 'new server';
            list.updateSync(connection1);
            testResultView.renderAssert(list.get(1) === connection1, 'list is right.');
            testResultView.renderAssert(list.toUpdateSyncList[0] === 1, 'toUpdateSyncList is right.');

            // in toAddSyncList
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1);
            list.addSync(connection1);
            connection1.name = 'new server';
            list.updateSync(connection1);
            testResultView.renderAssert(list.get(1) === connection1, 'list is right.');
            testResultView.renderAssert(list.toAddSyncList[0] === 1, 'toAddSyncList is right.');
        },
        markDelSync: function markDelSync() {
            testResultView.renderTitle('List markDelSync');
            var list = new I.Models.ConnectionList(1);
            list.markDelSync();
            testResultView.renderAssert(list.tagDelSync === true, 'tagDelSync is true.');
        },
        getKeys: function getKeys() {
            testResultView.renderTitle('List updateSync');
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var connection2 = new I.Models.Connection([2, 'test server2', '10.88.230.52', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1, 2: connection2 });

            var keys = list.getKeys();
            testResultView.renderAssert(I.Util.isArray(keys), 'keys is Array.');
            testResultView.renderAssert(I.Util.deepAssert(keys, [1, 2]), 'keys are right.');
        },
        toAbbArray: function toAbbArray() {
            testResultView.renderTitle('List toAbbArray');
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var connection2 = new I.Models.Connection([2, 'test server2', '10.88.230.52', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1, 2: connection2 });

            var result = list.toAbbArray();
            testResultView.renderAssert(I.Util.isHash(result), 'filter off result is Object');
            testResultView.renderAssert(I.Util.deepAssert(result[1], {
                i: 1,
                n: 'test server1',
                h: '10.88.230.51',
                p: '6379',
                taf: 'testAdd',
                tuf: 'testUpdate',
                taf1: 'testAbbFilter',
                taf2: 'testArrayFilter',
            }), 'filter off result1 is right.');
            testResultView.renderAssert(I.Util.deepAssert(result[2], {
                i: 2,
                n: 'test server2',
                h: '10.88.230.52',
                p: '6379',
                taf: 'testAdd',
                tuf: 'testUpdate',
                taf1: 'testAbbFilter',
                taf2: 'testArrayFilter',
            }), 'filter off result2 is right.');

            var result = list.toAbbArray(true);
            testResultView.renderAssert(I.Util.isHash(result), 'filter on result is Object');
            testResultView.renderAssert(I.Util.deepAssert(result[1], {
                i: 1,
                n: 'test server1',
                h: '10.88.230.51',
                p: '6379',
                taf: 'testAdd',
                tuf: 'testUpdate',
                taf2: 'testArrayFilter',
            }), 'filter on result1 is right.');
            testResultView.renderAssert(I.Util.deepAssert(result[2], {
                i: 2,
                n: 'test server2',
                h: '10.88.230.52',
                p: '6379',
                taf: 'testAdd',
                tuf: 'testUpdate',
                taf2: 'testArrayFilter',
            }), 'filter on result2 is right.');
        },
        toArray: function toArray() {
            testResultView.renderTitle('List toArray');
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var connection2 = new I.Models.Connection([2, 'test server2', '10.88.230.52', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1, 2: connection2 });

            var result = list.toArray();
            testResultView.renderAssert(I.Util.isHash(result), 'filter off result is Object');
            testResultView.renderAssert(I.Util.deepAssert(result[1], {
                id: 1,
                name: 'test server1',
                host: '10.88.230.51',
                port: '6379',
                testAddFilter: 'testAdd',
                testUpdateFilter: 'testUpdate',
                testAbbFilter: 'testAbbFilter',
                testArrayFilter: 'testArrayFilter',
            }), 'filter off result1 is right.');
            testResultView.renderAssert(I.Util.deepAssert(result[2], {
                id: 2,
                name: 'test server2',
                host: '10.88.230.52',
                port: '6379',
                testAddFilter: 'testAdd',
                testUpdateFilter: 'testUpdate',
                testAbbFilter: 'testAbbFilter',
                testArrayFilter: 'testArrayFilter',
            }), 'filter off result2 is right.');

            var result = list.toArray(true);
            testResultView.renderAssert(I.Util.isHash(result), 'filter on result is Object');
            testResultView.renderAssert(I.Util.deepAssert(result[1], {
                id: 1,
                name: 'test server1',
                host: '10.88.230.51',
                port: '6379',
                testAddFilter: 'testAdd',
                testUpdateFilter: 'testUpdate',
                testAbbFilter: 'testAbbFilter',
            }), 'filter on result1 is right.');
            testResultView.renderAssert(I.Util.deepAssert(result[2], {
                id: 2,
                name: 'test server2',
                host: '10.88.230.52',
                port: '6379',
                testAddFilter: 'testAdd',
                testUpdateFilter: 'testUpdate',
                testAbbFilter: 'testAbbFilter',
            }), 'filter on result2 is right.');
        },
        fromAbbArray: function fromAbbArray() {
            testResultView.renderTitle('List fromAbbArray');
            var list = new I.Models.ConnectionList(1);

            var array = {
                1: {
                    i: 1,
                    n: 'test server1',
                    h: '10.88.230.51',
                    p: '6379',
                    taf: 'testAdd',
                    tuf: 'testUpdate',
                    taf1: 'testAbbFilter',
                    taf2: 'testArrayFilter',
                },
                2: {
                    i: 2,
                    n: 'test server2',
                    h: '10.88.230.52',
                    p: '6379',
                    taf: 'testAdd',
                    tuf: 'testUpdate',
                    taf1: 'testAbbFilter',
                    taf2: 'testArrayFilter',
                },
            };
            list.fromAbbArray(array);
            var connection1 = list.get(1);
            var connection2 = list.get(2);
            testResultView.renderAssert(connection1.id === 1, 'reset off child1 attribute1 is right.');
            testResultView.renderAssert(connection1.name === 'test server1', 'reset off child1 attribute2 is right.');
            testResultView.renderAssert(connection1.host === '10.88.230.51', 'reset off child1 attribute3 is right.');
            testResultView.renderAssert(connection1.port === '6379', 'reset off child1 attribute4 is right.');
            testResultView.renderAssert(connection1.testAddFilter === 'testAdd', 'reset off child1 attribute5 is right.');
            testResultView.renderAssert(connection1.testUpdateFilter === 'testUpdate', 'reset off child1 attribute6 is right.');
            testResultView.renderAssert(connection1.testAbbFilter === 'testAbbFilter', 'reset off child1 attribute7 is right.');
            testResultView.renderAssert(connection1.testArrayFilter === 'testArrayFilter', 'reset off child1 attribute8 is right.');
            testResultView.renderAssert(connection2.id === 2, 'reset off child2 attribute1 is right.');
            testResultView.renderAssert(connection2.name === 'test server2', 'reset off child2 attribute2 is right.');
            testResultView.renderAssert(connection2.host === '10.88.230.52', 'reset off child2 attribute3 is right.');
            testResultView.renderAssert(connection2.port === '6379', 'reset off child2 attribute4 is right.');
            testResultView.renderAssert(connection2.testAddFilter === 'testAdd', 'reset off child2 attribute5 is right.');
            testResultView.renderAssert(connection2.testUpdateFilter === 'testUpdate', 'reset off child2 attribute6 is right.');
            testResultView.renderAssert(connection2.testAbbFilter === 'testAbbFilter', 'reset off child2 attribute7 is right.');
            testResultView.renderAssert(connection2.testArrayFilter === 'testArrayFilter', 'reset off child2 attribute8 is right.');
            testResultView.renderAssert(I.Util.deepAssert(connection1.updateList, [1, 1, 1, 1, 1, 1, 1, 1]), 'reset off child1 toUpdateList is right.');
            testResultView.renderAssert(I.Util.deepAssert(connection2.updateList, [1, 1, 1, 1, 1, 1, 1, 1]), 'reset off child2 toUpdateList is right.');

            var list = new I.Models.ConnectionList(1);
            list.fromAbbArray(array, true);
            var connection1 = list.get(1);
            var connection2 = list.get(2);
            testResultView.renderAssert(connection1.id === 1, 'reset on child1 attribute1 is right.');
            testResultView.renderAssert(connection1.name === 'test server1', 'reset on child1 attribute2 is right.');
            testResultView.renderAssert(connection1.host === '10.88.230.51', 'reset on child1 attribute3 is right.');
            testResultView.renderAssert(connection1.port === '6379', 'reset on child1 attribute4 is right.');
            testResultView.renderAssert(connection1.testAddFilter === 'testAdd', 'reset on child1 attribute5 is right.');
            testResultView.renderAssert(connection1.testUpdateFilter === 'testUpdate', 'reset on child1 attribute6 is right.');
            testResultView.renderAssert(connection1.testAbbFilter === 'testAbbFilter', 'reset on child1 attribute7 is right.');
            testResultView.renderAssert(connection1.testArrayFilter === 'testArrayFilter', 'reset on child1 attribute8 is right.');
            testResultView.renderAssert(connection2.id === 2, 'reset on child2 attribute1 is right.');
            testResultView.renderAssert(connection2.name === 'test server2', 'reset on child2 attribute2 is right.');
            testResultView.renderAssert(connection2.host === '10.88.230.52', 'reset on child2 attribute3 is right.');
            testResultView.renderAssert(connection2.port === '6379', 'reset on child2 attribute4 is right.');
            testResultView.renderAssert(connection2.testAddFilter === 'testAdd', 'reset on child2 attribute5 is right.');
            testResultView.renderAssert(connection2.testUpdateFilter === 'testUpdate', 'reset on child2 attribute6 is right.');
            testResultView.renderAssert(connection2.testAbbFilter === 'testAbbFilter', 'reset on child2 attribute7 is right.');
            testResultView.renderAssert(connection2.testArrayFilter === 'testArrayFilter', 'reset on child2 attribute8 is right.');
            testResultView.renderAssert(I.Util.deepAssert([undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], connection1.updateList), 'reset on child1 toUpdateList is right.');
            testResultView.renderAssert(I.Util.deepAssert([undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], connection2.updateList), 'reset on child2 toUpdateList is right.');
        },
        fromArray: function fromArray() {
            testResultView.renderTitle('List fromArray');
            var list = new I.Models.ConnectionList(1);

            var array = {
                1: {
                    id: 1,
                    name: 'test server1',
                    host: '10.88.230.51',
                    port: '6379',
                    testAddFilter: 'testAdd',
                    testUpdateFilter: 'testUpdate',
                    testAbbFilter: 'testAbbFilter',
                    testArrayFilter: 'testArrayFilter',
                },
                2: {
                    id: 2,
                    name: 'test server2',
                    host: '10.88.230.52',
                    port: '6379',
                    testAddFilter: 'testAdd',
                    testUpdateFilter: 'testUpdate',
                    testAbbFilter: 'testAbbFilter',
                    testArrayFilter: 'testArrayFilter',
                },
            };
            list.fromArray(array);
            var connection1 = list.get(1);
            var connection2 = list.get(2);
            testResultView.renderAssert(connection1.id === 1, 'reset off child1 attribute1 is right.');
            testResultView.renderAssert(connection1.name === 'test server1', 'reset off child1 attribute2 is right.');
            testResultView.renderAssert(connection1.host === '10.88.230.51', 'reset off child1 attribute3 is right.');
            testResultView.renderAssert(connection1.port === '6379', 'reset off child1 attribute4 is right.');
            testResultView.renderAssert(connection1.testAddFilter === 'testAdd', 'reset off child1 attribute5 is right.');
            testResultView.renderAssert(connection1.testUpdateFilter === 'testUpdate', 'reset off child1 attribute6 is right.');
            testResultView.renderAssert(connection1.testAbbFilter === 'testAbbFilter', 'reset off child1 attribute7 is right.');
            testResultView.renderAssert(connection1.testArrayFilter === 'testArrayFilter', 'reset off child1 attribute8 is right.');
            testResultView.renderAssert(connection2.id === 2, 'reset off child2 attribute1 is right.');
            testResultView.renderAssert(connection2.name === 'test server2', 'reset off child2 attribute2 is right.');
            testResultView.renderAssert(connection2.host === '10.88.230.52', 'reset off child2 attribute3 is right.');
            testResultView.renderAssert(connection2.port === '6379', 'reset off child2 attribute4 is right.');
            testResultView.renderAssert(connection2.testAddFilter === 'testAdd', 'reset off child2 attribute5 is right.');
            testResultView.renderAssert(connection2.testUpdateFilter === 'testUpdate', 'reset off child2 attribute6 is right.');
            testResultView.renderAssert(connection2.testAbbFilter === 'testAbbFilter', 'reset off child2 attribute7 is right.');
            testResultView.renderAssert(connection2.testArrayFilter === 'testArrayFilter', 'reset off child2 attribute8 is right.');
            testResultView.renderAssert(I.Util.deepAssert(connection1.updateList, [1, 1, 1, 1, 1, 1, 1, 1]), 'reset off child1 toUpdateList is right.');
            testResultView.renderAssert(I.Util.deepAssert(connection2.updateList, [1, 1, 1, 1, 1, 1, 1, 1]), 'reset off child2 toUpdateList is right.');

            var list = new I.Models.ConnectionList(1);
            list.fromArray(array, true);
            var connection1 = list.get(1);
            var connection2 = list.get(2);
            testResultView.renderAssert(connection1.id === 1, 'reset on child1 attribute1 is right.');
            testResultView.renderAssert(connection1.name === 'test server1', 'reset on child1 attribute2 is right.');
            testResultView.renderAssert(connection1.host === '10.88.230.51', 'reset on child1 attribute3 is right.');
            testResultView.renderAssert(connection1.port === '6379', 'reset on child1 attribute4 is right.');
            testResultView.renderAssert(connection1.testAddFilter === 'testAdd', 'reset on child1 attribute5 is right.');
            testResultView.renderAssert(connection1.testUpdateFilter === 'testUpdate', 'reset on child1 attribute6 is right.');
            testResultView.renderAssert(connection1.testAbbFilter === 'testAbbFilter', 'reset on child1 attribute7 is right.');
            testResultView.renderAssert(connection1.testArrayFilter === 'testArrayFilter', 'reset on child1 attribute8 is right.');
            testResultView.renderAssert(connection2.id === 2, 'reset on child2 attribute1 is right.');
            testResultView.renderAssert(connection2.name === 'test server2', 'reset on child2 attribute2 is right.');
            testResultView.renderAssert(connection2.host === '10.88.230.52', 'reset on child2 attribute3 is right.');
            testResultView.renderAssert(connection2.port === '6379', 'reset on child2 attribute4 is right.');
            testResultView.renderAssert(connection2.testAddFilter === 'testAdd', 'reset on child2 attribute5 is right.');
            testResultView.renderAssert(connection2.testUpdateFilter === 'testUpdate', 'reset on child2 attribute6 is right.');
            testResultView.renderAssert(connection2.testAbbFilter === 'testAbbFilter', 'reset on child2 attribute7 is right.');
            testResultView.renderAssert(connection2.testArrayFilter === 'testArrayFilter', 'reset on child2 attribute8 is right.');
            testResultView.renderAssert(I.Util.deepAssert([undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], connection1.updateList), 'reset on child1 toUpdateList is right.');
            testResultView.renderAssert(I.Util.deepAssert([undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], connection2.updateList), 'reset on child2 toUpdateList is right.');
        },
        last: function last() {
            testResultView.renderTitle('List last');
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var connection2 = new I.Models.Connection([2, 'test server2', '10.88.230.52', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1, 2: connection2 });

            testResultView.renderAssert(list.last() === connection2, 'last is right.');
        },
        backup: function backup() {
            testResultView.renderTitle('List backup');
            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var list = new I.Models.ConnectionList(1, { 1: connection1 });

            var backup = list.backup();
            testResultView.renderAssert(backup.type === 'List', 'type is List.');
            testResultView.renderAssert(backup.className === 'ConnectionList', 'className is right.');
            testResultView.renderAssert(backup.pk === 1, 'pk is right.');
            testResultView.renderAssert(I.Util.deepAssert(backup.data[1], {
                id: 1,
                name: 'test server1',
                host: '10.88.230.51',
                port: '6379',
                testAddFilter: 'testAdd',
                testUpdateFilter: 'testUpdate',
                testAbbFilter: 'testAbbFilter',
                testArrayFilter: 'testArrayFilter',
            }), 'data1 is right.');
        },
        restore: function restore() {
            testResultView.renderTitle('List restore');
            var list = new I.Models.ConnectionList(1);

            var backup = {
                pk: 1,
                className: 'ConnectionList',
                type: 'List',
                data: {
                    1: {
                        id: 1,
                        name: 'test server1',
                        host: '10.88.230.51',
                        port: '6379',
                        testAddFilter: 'testAdd',
                        testUpdateFilter: 'testUpdate',
                        testAbbFilter: 'testAbbFilter',
                        testArrayFilter: 'testArrayFilter',
                    },
                },
            };
            list.restore(backup);
            var connection1 = list.toAddList[0];
            testResultView.renderAssert(connection1.id === 1, 'child1 attribute1 is right.');
            testResultView.renderAssert(connection1.name === 'test server1', 'child1 attribute2 is right.');
            testResultView.renderAssert(connection1.host === '10.88.230.51', 'child1 attribute3 is right.');
            testResultView.renderAssert(connection1.port === '6379', 'child1 attribute4 is right.');
            testResultView.renderAssert(connection1.testAddFilter === 'testAdd', 'child1 attribute5 is right.');
            testResultView.renderAssert(connection1.testUpdateFilter === 'testUpdate', 'child1 attribute6 is right.');
            testResultView.renderAssert(connection1.testAbbFilter === 'testAbbFilter', 'child1 attribute7 is right.');
            testResultView.renderAssert(connection1.testArrayFilter === 'testArrayFilter', 'child1 attribute8 is right.');
            testResultView.renderAssert(list.get(1) === null, 'list is right.');
        },
        restoreSync: function restoreSync() {
            testResultView.renderTitle('List restoreSync');
            var list = new I.Models.ConnectionList(1);

            var backup = {
                pk: 1,
                className: 'ConnectionList',
                type: 'List',
                data: {
                    1: {
                        id: 1,
                        name: 'test server1',
                        host: '10.88.230.51',
                        port: '6379',
                        testAddFilter: 'testAdd',
                        testUpdateFilter: 'testUpdate',
                        testAbbFilter: 'testAbbFilter',
                        testArrayFilter: 'testArrayFilter',
                    },
                },
            };
            list.restoreSync(backup);
            var connection1 = list.get(1);
            testResultView.renderAssert(connection1.id === 1, 'child1 attribute1 is right.');
            testResultView.renderAssert(connection1.name === 'test server1', 'child1 attribute2 is right.');
            testResultView.renderAssert(connection1.host === '10.88.230.51', 'child1 attribute3 is right.');
            testResultView.renderAssert(connection1.port === '6379', 'child1 attribute4 is right.');
            testResultView.renderAssert(connection1.testAddFilter === 'testAdd', 'child1 attribute5 is right.');
            testResultView.renderAssert(connection1.testUpdateFilter === 'testUpdate', 'child1 attribute6 is right.');
            testResultView.renderAssert(connection1.testAbbFilter === 'testAbbFilter', 'child1 attribute7 is right.');
            testResultView.renderAssert(connection1.testArrayFilter === 'testArrayFilter', 'child1 attribute8 is right.');
            testResultView.renderAssert(list.toAddSyncList[0] === 1, 'toAddSyncList is right.');
        },
    };

    I.Util.require('ListTestController', 'Ctrl', ListTestController);
}();
