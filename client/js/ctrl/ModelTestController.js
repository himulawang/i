!function() {
    /*
    {
        name: 'Connection',
        abb: 'c',
        column: [
            'id',
            'name',
            'host',
            'port',
            'testAddFilter',
            'testUpdateFilter',
            'testAbbFilter',
            'testArrayFilter',
        ],
        toAddFilter: [4],
        toUpdateFilter: [5],
        toAbbFilter: [6],
        toArrayFilter: [7],
        pk: 'id',
        pkAutoIncrement: true,
        list: 'ConnectionList',
        storeType: 'IndexedDB',
    },
    */
    var ModelTestController = {
        run: function run() {
            this.init();
            this.reset();
            this.setPK();
            this.getPK();
            this.clone();
            this.toAdd();
            this.toUpdate();
            this.toAbbArray();
            this.toArray();
            this.toAbbDiff();
            this.toArrayDiff();
            this.fromAbbArray();
            this.fromArray();
            this.markAddSync();
            this.markDelSync();
            this.backup();
            this.restore();
            this.restoreSync();
        },
        init: function init() {
            testResultView.renderTitle('Model init');
            var connection = new I.Models.Connection();
            testResultView.renderAssert(connection.args.length === 8, 'undefined args this.args.length is right.');
            testResultView.renderAssert(connection.updateList.length === 8, 'updateList.length is right.');
            testResultView.renderAssert(connection.tagAddSync === false, 'tagAddSync is false.');
            testResultView.renderAssert(connection.tagDelSync === false, 'tagDelSync is false.');

            var connection = new I.Models.Connection([1, 'test server', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            testResultView.renderAssert(connection.args.length === 8, 'defined args this.args.length is right.');
            testResultView.renderAssert(connection.updateList.length === 8, 'updateList.length is right.');
            testResultView.renderAssert(connection.tagAddSync === false, 'tagAddSync is false.');
            testResultView.renderAssert(connection.tagDelSync === false, 'tagDelSync is false.');
            testResultView.renderAssert(connection.id === 1, 'attribute1 is right.');
            testResultView.renderAssert(connection.name === 'test server', 'attribute2 is right.');
            testResultView.renderAssert(connection.host === '10.88.230.51', 'attribute3 is right.');
            testResultView.renderAssert(connection.port === '6379', 'attribute4 is right.');
            testResultView.renderAssert(connection.testAddFilter === 'testAdd', 'attribute5 is right.');
            testResultView.renderAssert(connection.testUpdateFilter === 'testUpdate', 'attribute6 is right.');
            testResultView.renderAssert(connection.testAbbFilter === 'testAbbFilter', 'attribute7 is right.');
            testResultView.renderAssert(connection.testArrayFilter === 'testArrayFilter', 'attribute8 is right.');
        },
        reset: function reset() {
            testResultView.renderTitle('Model reset');
            var connection = new I.Models.Connection([1, 'test server', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            connection.reset();
            testResultView.renderAssert(connection.updateList.length === 8, 'updateList.length is right.');
            testResultView.renderAssert(connection.tagAddSync === false, 'tagAddSync is false.');
            testResultView.renderAssert(connection.tagDelSync === false, 'tagDelSync is false.');
            testResultView.renderAssert(I.Util.deepAssert([undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], connection.updateList), 'updateList values are right.');
        },
        setPK: function setPK() {
            testResultView.renderTitle('Model setPK');
            var connection = new I.Models.Connection([1, 'test server', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            connection.setPK(22);
            testResultView.renderAssert(connection.getPK() === 22, 'pk is right.');
            testResultView.renderAssert(I.Util.deepAssert([1, undefined, undefined, undefined, undefined, undefined, undefined, undefined], connection.updateList), 'updateList values are right.');
        },
        getPK: function getPK() {
            testResultView.renderTitle('Model getPK');
            var connection = new I.Models.Connection([1, 'test server', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            connection.setPK(22);
            testResultView.renderAssert(connection.getPK() === 22, 'pk is right.');
        },
        clone: function clone() {
            testResultView.renderTitle('Model clone');
            var connection = new I.Models.Connection([1, 'test server', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var cloned = connection.clone();
            testResultView.renderAssert(connection.id === cloned.id, 'attribute1 is equal.');
            testResultView.renderAssert(connection.name === cloned.name, 'attribute2 is equal.');
            testResultView.renderAssert(connection.host === cloned.host, 'attribute3 is equal.');
            testResultView.renderAssert(connection.port === cloned.port, 'attribute4 is equal.');
            testResultView.renderAssert(connection.testAddFilter === cloned.testAddFilter, 'attribute5 is equal.');
            testResultView.renderAssert(connection.testUpdateFilter === cloned.testUpdateFilter, 'attribute6 is equal.');
            testResultView.renderAssert(connection.testAbbFilter === cloned.testAbbFilter, 'attribute7 is equal.');
            testResultView.renderAssert(connection.testArrayFilter === cloned.testArrayFilter, 'attribute8 is equal.');
        },
        toAdd: function toAdd() {
            testResultView.renderTitle('Model toAdd');
            var connection = new I.Models.Connection([1, 'test server', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var result = connection.toAdd();
            testResultView.renderAssert(I.Util.isArray(result), 'result is Array.');
            testResultView.renderAssert(I.Util.deepAssert(result, ['1', 'test server', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']), 'filter off is right.');
            testResultView.renderAssert(I.Util.deepAssert(connection.toAdd(true), ['1', 'test server', '10.88.230.51', '6379', undefined, 'testUpdate', 'testAbbFilter', 'testArrayFilter']), 'filter on is right.');
        },
        toUpdate: function toUpdateFilter() {
            testResultView.renderTitle('Model toAdd');
            var connection = new I.Models.Connection();
            connection.id = 1;
            connection.name = 'test server';
            connection.host = '10.88.230.51';
            connection.testAddFilter = 'testAdd';
            connection.testUpdateFilter = 'testUpdate';
            connection.testAbbFilter = 'testAbbFilter';
            connection.testArrayFilter = 'testArrayFilter';
            var result = connection.toUpdate();
            testResultView.renderAssert(I.Util.isHash(result), 'result is Object.');
            testResultView.renderAssert(I.Util.deepAssert(result,
                {
                    0: '1',
                    1: 'test server',
                    2: '10.88.230.51',
                    4: 'testAdd',
                    5: 'testUpdate',
                    6: 'testAbbFilter',
                    7: 'testArrayFilter',
                }),
            'filter off is right.');
            testResultView.renderAssert(I.Util.deepAssert(connection.toUpdate(true),
                {
                    0: '1',
                    1: 'test server',
                    2: '10.88.230.51',
                    4: 'testAdd',
                    6: 'testAbbFilter',
                    7: 'testArrayFilter',
                }),
            'filter on is right.');
        },
        toAbbArray: function toAbbArray() {
            testResultView.renderTitle('Model toAbbArray');
            var connection = new I.Models.Connection([1, 'test server', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var result = connection.toAbbArray();
            testResultView.renderAssert(I.Util.isHash(result), 'result is Object.');
            testResultView.renderAssert(I.Util.deepAssert(result,
                {
                    i: 1,
                    n: 'test server',
                    h: '10.88.230.51',
                    p: '6379',
                    taf: 'testAdd',
                    tuf: 'testUpdate',
                    taf1: 'testAbbFilter',
                    taf2: 'testArrayFilter',
                }),
            'filter off is right.');
            testResultView.renderAssert(I.Util.deepAssert(connection.toAbbArray(true),
                {
                    i: 1,
                    n: 'test server',
                    h: '10.88.230.51',
                    p: '6379',
                    taf: 'testAdd',
                    tuf: 'testUpdate',
                    taf2: 'testArrayFilter',
                }),
            'filter on is right.');
        },
        toArray: function toArray() {
            testResultView.renderTitle('Model toArray');
            var connection = new I.Models.Connection([1, 'test server', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var result = connection.toArray();
            testResultView.renderAssert(I.Util.isHash(result), 'result is Object.');
            testResultView.renderAssert(I.Util.deepAssert(result,
                {
                    id: 1,
                    name: 'test server',
                    host: '10.88.230.51',
                    port: '6379',
                    testAddFilter: 'testAdd',
                    testUpdateFilter: 'testUpdate',
                    testAbbFilter: 'testAbbFilter',
                    testArrayFilter: 'testArrayFilter',
                }),
            'filter off is right.');
            testResultView.renderAssert(I.Util.deepAssert(connection.toArray(true),
                {
                    id: 1,
                    name: 'test server',
                    host: '10.88.230.51',
                    port: '6379',
                    testAddFilter: 'testAdd',
                    testUpdateFilter: 'testUpdate',
                    testAbbFilter: 'testAbbFilter',
                }),
            'filter on is right.');
        },
        toAbbDiff: function toAbbDiff() {
            testResultView.renderTitle('Model toAbbDiff');
            var connection = new I.Models.Connection();
            connection.id = 1;
            connection.name = 'test server';
            connection.host = '10.88.230.51';
            connection.testAddFilter = 'testAdd';
            connection.testUpdateFilter = 'testUpdate';
            connection.testAbbFilter = 'testAbbFilter';
            connection.testArrayFilter = 'testArrayFilter';
            var result = connection.toAbbDiff();
            testResultView.renderAssert(I.Util.isHash(result), 'result is Object.');
            testResultView.renderAssert(I.Util.deepAssert(result,
                {
                    i: 1,
                    n: 'test server',
                    h: '10.88.230.51',
                    taf: 'testAdd',
                    tuf: 'testUpdate',
                    taf1: 'testAbbFilter',
                    taf2: 'testArrayFilter',
                }),
            'filter off is right.');
            testResultView.renderAssert(I.Util.deepAssert(connection.toAbbDiff(true),
                {
                    i: 1,
                    n: 'test server',
                    h: '10.88.230.51',
                    taf: 'testAdd',
                    tuf: 'testUpdate',
                    taf2: 'testArrayFilter',
                }),
            'filter on is right.');
        },
        toArrayDiff: function toArrayDiff() {
            testResultView.renderTitle('Model toArrayDiff');
            var connection = new I.Models.Connection();
            connection.id = 1;
            connection.name = 'test server';
            connection.host = '10.88.230.51';
            connection.testAddFilter = 'testAdd';
            connection.testUpdateFilter = 'testUpdate';
            connection.testAbbFilter = 'testAbbFilter';
            connection.testArrayFilter = 'testArrayFilter';
            var result = connection.toArrayDiff();
            testResultView.renderAssert(I.Util.isHash(result), 'result is Object.');
            testResultView.renderAssert(I.Util.deepAssert(result,
                {
                    id: 1,
                    name: 'test server',
                    host: '10.88.230.51',
                    testAddFilter: 'testAdd',
                    testUpdateFilter: 'testUpdate',
                    testAbbFilter: 'testAbbFilter',
                    testArrayFilter: 'testArrayFilter',
                }),
            'filter off is right.');
            testResultView.renderAssert(I.Util.deepAssert(connection.toArrayDiff(true),
                {
                    id: 1,
                    name: 'test server',
                    host: '10.88.230.51',
                    testAddFilter: 'testAdd',
                    testUpdateFilter: 'testUpdate',
                    testAbbFilter: 'testAbbFilter',
                }),
            'filter on is right.');
        },
        fromAbbArray: function fromAbbArray() {
            testResultView.renderTitle('Model fromAbbArray');
            var connection = new I.Models.Connection();
            var array = {
                i: 1,
                n: 'test server',
                h: '10.88.230.51',
                p: '6379',
                taf: 'testAdd',
                tuf: 'testUpdate',
                taf1: 'testAbbFilter',
                taf2: 'testArrayFilter',
            };
            connection.fromAbbArray(array);
            testResultView.renderAssert(connection.id === 1, 'attribute1 is right.');
            testResultView.renderAssert(connection.name === 'test server', 'attribute2 is right.');
            testResultView.renderAssert(connection.host === '10.88.230.51', 'attribute3 is right.');
            testResultView.renderAssert(connection.port === '6379', 'attribute4 is right.');
            testResultView.renderAssert(connection.testAddFilter === 'testAdd', 'attribute5 is right.');
            testResultView.renderAssert(connection.testUpdateFilter === 'testUpdate', 'attribute6 is right.');
            testResultView.renderAssert(connection.testAbbFilter === 'testAbbFilter', 'attribute7 is right.');
            testResultView.renderAssert(connection.testArrayFilter === 'testArrayFilter', 'attribute8 is right.');
            testResultView.renderAssert(I.Util.deepAssert(connection.updateList, [1, 1, 1, 1, 1, 1, 1, 1]), 'reset off is right');

            var connection = new I.Models.Connection();
            connection.fromAbbArray(array, true);
            testResultView.renderAssert(connection.id === 1, 'attribute1 is right.');
            testResultView.renderAssert(connection.name === 'test server', 'attribute2 is right.');
            testResultView.renderAssert(connection.host === '10.88.230.51', 'attribute3 is right.');
            testResultView.renderAssert(connection.port === '6379', 'attribute4 is right.');
            testResultView.renderAssert(connection.testAddFilter === 'testAdd', 'attribute5 is right.');
            testResultView.renderAssert(connection.testUpdateFilter === 'testUpdate', 'attribute6 is right.');
            testResultView.renderAssert(connection.testAbbFilter === 'testAbbFilter', 'attribute7 is right.');
            testResultView.renderAssert(connection.testArrayFilter === 'testArrayFilter', 'attribute8 is right.');
            testResultView.renderAssert(I.Util.deepAssert([undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], connection.updateList), 'reset on is right.');
        },
        fromArray: function fromArray() {
            testResultView.renderTitle('Model fromArray');
            var connection = new I.Models.Connection();
            var array = {
                id: 1,
                name: 'test server',
                host: '10.88.230.51',
                port: '6379',
                testAddFilter: 'testAdd',
                testUpdateFilter: 'testUpdate',
                testAbbFilter: 'testAbbFilter',
                testArrayFilter: 'testArrayFilter',
            };
            connection.fromArray(array);
            testResultView.renderAssert(connection.id === 1, 'attribute1 is right.');
            testResultView.renderAssert(connection.name === 'test server', 'attribute2 is right.');
            testResultView.renderAssert(connection.host === '10.88.230.51', 'attribute3 is right.');
            testResultView.renderAssert(connection.port === '6379', 'attribute4 is right.');
            testResultView.renderAssert(connection.testAddFilter === 'testAdd', 'attribute5 is right.');
            testResultView.renderAssert(connection.testUpdateFilter === 'testUpdate', 'attribute6 is right.');
            testResultView.renderAssert(connection.testAbbFilter === 'testAbbFilter', 'attribute7 is right.');
            testResultView.renderAssert(connection.testArrayFilter === 'testArrayFilter', 'attribute8 is right.');
            testResultView.renderAssert(I.Util.deepAssert(connection.updateList, [1, 1, 1, 1, 1, 1, 1, 1]), 'reset off is right');

            var connection = new I.Models.Connection();
            connection.fromArray(array, true);
            testResultView.renderAssert(connection.id === 1, 'attribute1 is right.');
            testResultView.renderAssert(connection.name === 'test server', 'attribute2 is right.');
            testResultView.renderAssert(connection.host === '10.88.230.51', 'attribute3 is right.');
            testResultView.renderAssert(connection.port === '6379', 'attribute4 is right.');
            testResultView.renderAssert(connection.testAddFilter === 'testAdd', 'attribute5 is right.');
            testResultView.renderAssert(connection.testUpdateFilter === 'testUpdate', 'attribute6 is right.');
            testResultView.renderAssert(connection.testAbbFilter === 'testAbbFilter', 'attribute7 is right.');
            testResultView.renderAssert(connection.testArrayFilter === 'testArrayFilter', 'attribute8 is right.');
            testResultView.renderAssert(I.Util.deepAssert([undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], connection.updateList), 'reset on is right.');
        },
        markAddSync: function markAddSync() {
            testResultView.renderTitle('Model markAddSync');
            var connection = new I.Models.Connection();
            connection.markAddSync();
            testResultView.renderAssert(connection.tagAddSync === true, 'tagAddSync is true.');
        },
        markDelSync: function markDelSync() {
            testResultView.renderTitle('Model markDelSync');
            var connection = new I.Models.Connection();
            connection.markDelSync();
            testResultView.renderAssert(connection.tagDelSync === true, 'tagDelSync is true.');
        },
        backup: function backup() {
            testResultView.renderTitle('Model backup');
            var connection = new I.Models.Connection([1, 'test server', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var backup = connection.backup();
            testResultView.renderAssert(backup.type === 'Model', 'type is Model.');
            testResultView.renderAssert(backup.className === 'Connection', 'className is right.');
            testResultView.renderAssert(I.Util.deepAssert(backup.data, {
                    id: 1,
                    name: 'test server',
                    host: '10.88.230.51',
                    port: '6379',
                    testAddFilter: 'testAdd',
                    testUpdateFilter: 'testUpdate',
                    testAbbFilter: 'testAbbFilter',
                    testArrayFilter: 'testArrayFilter',
                }),
            'data is right.');
        },
        restore: function restore() {
            testResultView.renderTitle('Model restore');
            var connection = new I.Models.Connection();
            var backup = {
                type: 'Models',
                className: 'Connection',
                data: {
                    id: 1,
                    name: 'test server',
                    host: '10.88.230.51',
                    port: '6379',
                    testAddFilter: 'testAdd',
                    testUpdateFilter: 'testUpdate',
                    testAbbFilter: 'testAbbFilter',
                    testArrayFilter: 'testArrayFilter',
                },
            };
            connection.restore(backup);
            testResultView.renderAssert(connection.id === 1, 'attribute1 is right.');
            testResultView.renderAssert(connection.name === 'test server', 'attribute2 is right.');
            testResultView.renderAssert(connection.host === '10.88.230.51', 'attribute3 is right.');
            testResultView.renderAssert(connection.port === '6379', 'attribute4 is right.');
            testResultView.renderAssert(connection.testAddFilter === 'testAdd', 'attribute5 is right.');
            testResultView.renderAssert(connection.testUpdateFilter === 'testUpdate', 'attribute6 is right.');
            testResultView.renderAssert(connection.testAbbFilter === 'testAbbFilter', 'attribute7 is right.');
            testResultView.renderAssert(connection.testArrayFilter === 'testArrayFilter', 'attribute8 is right.');
            testResultView.renderAssert(I.Util.deepAssert(connection.updateList, [1, 1, 1, 1, 1, 1, 1, 1]), 'updateList are right.');
        },
        restoreSync: function restoreSync() {
            testResultView.renderTitle('Model restoreSync');
            var connection = new I.Models.Connection();
            var backup = {
                type: 'Models',
                className: 'Connection',
                data: {
                    id: 1,
                    name: 'test server',
                    host: '10.88.230.51',
                    port: '6379',
                    testAddFilter: 'testAdd',
                    testUpdateFilter: 'testUpdate',
                    testAbbFilter: 'testAbbFilter',
                    testArrayFilter: 'testArrayFilter',
                },
            };
            connection.restoreSync(backup);
            testResultView.renderAssert(connection.id === 1, 'attribute1 is right.');
            testResultView.renderAssert(connection.name === 'test server', 'attribute2 is right.');
            testResultView.renderAssert(connection.host === '10.88.230.51', 'attribute3 is right.');
            testResultView.renderAssert(connection.port === '6379', 'attribute4 is right.');
            testResultView.renderAssert(connection.testAddFilter === 'testAdd', 'attribute5 is right.');
            testResultView.renderAssert(connection.testUpdateFilter === 'testUpdate', 'attribute6 is right.');
            testResultView.renderAssert(connection.testAbbFilter === 'testAbbFilter', 'attribute7 is right.');
            testResultView.renderAssert(connection.testArrayFilter === 'testArrayFilter', 'attribute8 is right.');
            testResultView.renderAssert(I.Util.deepAssert(connection.updateList, [1, 1, 1, 1, 1, 1, 1, 1]), 'updateList are right.');
            testResultView.renderAssert(connection.tagAddSync === true, 'tagAddSync is right.');
        },
    };

    I.Util.require('ModelTestController', 'Ctrl', ModelTestController);
}();
