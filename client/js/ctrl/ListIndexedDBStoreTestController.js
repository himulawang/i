!function() {
    var ListIndexedDBStoreTestController = {
        run: function run() {
            var deferred = Q.defer();
            this.prepareData()
            .then(this.get)
            .then(this.updateUpdate)
            .then(this.updateDel)
            .then(this.updateAdd)
            .then(this.del)
            .then(function() {
                return this.checkFromStore(false);
            }.bind(this))
            .then(this.prepareData)
            .then(this.updateSyncUpdate)
            .then(this.updateSyncDel)
            .then(this.updateSyncAdd)
            .then(this.syncDel)
            .then(function() {
                return this.checkFromStore(false);
            }.bind(this))
            .then(this.syncUpdate)
            .then(function() {
                return this.checkFromStore(true);
            }.bind(this))
            .then(this.clearData)
            .then(deferred.resolve);
            return deferred.promise;
        },
        prepareData: function prepareData() {
            var deferred = Q.defer();
            var connection1 = new I.Models.Connection();
            connection1.id = 1;
            connection1.name = 'test server1';
            connection1.host = '10.88.230.51';
            connection1.port = '6379';
            connection1.testAddFilter = 'testAdd';
            connection1.testUpdateFilter = 'testUpdateFilter';
            connection1.testAbbFilter = 'testAbbFilter';
            connection1.testArrayFilter = 'testArrayFilter';
            var connection2 = new I.Models.Connection();
            connection2.id = 2;
            connection2.name = 'test server2';
            connection2.host = '10.88.230.52';
            connection2.port = '6379';
            connection2.testAddFilter = 'testAdd';
            connection2.testUpdateFilter = 'testUpdateFilter';
            connection2.testAbbFilter = 'testAbbFilter';
            connection2.testArrayFilter = 'testArrayFilter';

            var list = new I.Models.ConnectionList(1);
            list.add(connection1);
            list.add(connection2);

            I.Models.ConnectionListStore.update(list).then(function(list) {
                deferred.resolve(list);
            });
            return deferred.promise;
        },
        clearData: function clearData(list) {
            var deferred = Q.defer();

            I.Models.ConnectionListStore.del(list).then(deferred.resolve);
            return deferred.promise;
        },
        checkFromStore: function checkFromStore(value) {
            var deferred = Q.defer();
            I.Models.ConnectionListStore.get(1, function(connection) {
                testResultView.renderAssert(connection.fromStore === value, 'check fromStore is ' + value.toString() + '.');
            }).then(deferred.resolve);
            return deferred.promise;
        },
        get: function get() {
            var deferred = Q.defer();
            testResultView.renderTitle('ListIndexedDBStore get');

            I.Models.ConnectionListStore.get(1, function(list) {
                testResultView.renderAssert(list.get(1).name === 'test server1', 'callback param list is right.');
                testResultView.renderAssert(true, 'invoke callback.');
            }).then(function(list) {
                testResultView.renderAssert(list.get(2).name === 'test server2', 'promise param list is right.');
                testResultView.renderAssert(true, 'promise done.');
                deferred.resolve(list);
            });
            return deferred.promise;
        },
        updateUpdate: function updateUpdate(list) {
            var deferred = Q.defer();
            testResultView.renderTitle('ListIndexedDBStore update');

            try {
                I.Models.ConnectionListStore.update([]);
            } catch (e) {
                testResultView.renderAssert(e.code === 20005, 'invalid input throw exception');
            }

            var connection1 = list.get(1);
            connection1.name = 'new server';
            connection1.port = '6380';

            list.update(connection1);
            I.Models.ConnectionListStore.update(list, function(list) {
                testResultView.renderAssert(list.get(1).name === 'new server', 'update callback param list is right.');
                testResultView.renderAssert(true, 'update invoke callback.');
            }).then(function(list) {
                testResultView.renderAssert(list.get(1).port === '6380', 'update promise param list is right.');
                testResultView.renderAssert(true, 'update promise done.');
                deferred.resolve(list);
            });
            return deferred.promise;
        },
        updateDel: function updateDel(list) {
            var deferred = Q.defer();

            var connection1 = list.get(1);
            list.del(connection1);

            I.Models.ConnectionListStore.update(list, function(list) {
                testResultView.renderAssert(list.get(1) === null, 'del callback param list is right.');
                testResultView.renderAssert(true, 'del invoke callback.');
            }).then(function(list) {
                testResultView.renderAssert(list.get(1) === null, 'del promise param list is right.');
                testResultView.renderAssert(true, 'del promise done.');
                deferred.resolve(list);
            });
            return deferred.promise;
        },
        updateAdd: function updateAdd(list) {
            var deferred = Q.defer();
            var connection1 = new I.Models.Connection();
            connection1.id = 1;
            connection1.name = 'test server3';
            connection1.host = '10.88.230.53';
            connection1.port = '6379';
            connection1.testAddFilter = 'testAdd';
            connection1.testUpdateFilter = 'testUpdateFilter';
            connection1.testAbbFilter = 'testAbbFilter';
            connection1.testArrayFilter = 'testArrayFilter';
            list.add(connection1);

            I.Models.ConnectionListStore.update(list, function(list) {
                testResultView.renderAssert(list.get(1) === connection1, 'add callback param list is right.');
                testResultView.renderAssert(true, 'add invoke callback.');
            }).then(function(list) {
                testResultView.renderAssert(list.get(1) === connection1, 'add promise param list is right.');
                testResultView.renderAssert(true, 'add promise done.');
                deferred.resolve(list);
            });
            return deferred.promise;
        },
        del: function del(list) {
            var deferred = Q.defer();
            testResultView.renderTitle('ListIndexedDBStore del');

            try {
                I.Models.ConnectionListStore.del([]);
            } catch (e) {
                testResultView.renderAssert(e.code === 20006, 'invalid input throw exception');
            }

            I.Models.ConnectionListStore.del(list, function() {
                testResultView.renderAssert(true, 'invoke callback.');
            }).then(function() {
                testResultView.renderAssert(true, 'promise done.');
                deferred.resolve();
            });
            return deferred.promise;
        },
        updateSyncUpdate: function updateSyncUpdate(list) {
            var deferred = Q.defer();
            testResultView.renderTitle('ListIndexedDBStore updateSync');

            try {
                I.Models.ConnectionListStore.updateSync([]);
            } catch (e) {
                testResultView.renderAssert(e.code === 20007, 'invalid input throw exception');
            }

            var connection1 = list.get(1);
            connection1.name = 'new server';
            connection1.port = '6380';

            list.updateSync(connection1);
            I.Models.ConnectionListStore.updateSync(list, function(list) {
                testResultView.renderAssert(list.get(1).name === 'new server', 'update callback param list is right.');
                testResultView.renderAssert(true, 'update invoke callback.');
            }).then(function(list) {
                testResultView.renderAssert(list.get(1).port === '6380', 'update promise param list is right.');
                testResultView.renderAssert(true, 'update promise done.');
                deferred.resolve(list);
            });
            return deferred.promise;
        },
        updateSyncDel: function updateSyncDel(list) {
            var deferred = Q.defer();

            var connection1 = list.get(1);
            list.delSync(connection1);

            I.Models.ConnectionListStore.updateSync(list, function(list) {
                testResultView.renderAssert(list.get(1) === null, 'del callback param list is right.');
                testResultView.renderAssert(true, 'del invoke callback.');
            }).then(function(list) {
                testResultView.renderAssert(list.get(1) === null, 'del promise param list is right.');
                testResultView.renderAssert(true, 'del promise done.');
                deferred.resolve(list);
            });
            return deferred.promise;
        },
        updateSyncAdd: function updateSyncAdd(list) {
            var deferred = Q.defer();
            var connection1 = new I.Models.Connection();
            connection1.id = 1;
            connection1.name = 'test server3';
            connection1.host = '10.88.230.53';
            connection1.port = '6379';
            connection1.testAddFilter = 'testAdd';
            connection1.testUpdateFilter = 'testUpdateFilter';
            connection1.testAbbFilter = 'testAbbFilter';
            connection1.testArrayFilter = 'testArrayFilter';
            list.addSync(connection1);

            I.Models.ConnectionListStore.updateSync(list, function(list) {
                testResultView.renderAssert(list.get(1) === connection1, 'add callback param list is right.');
                testResultView.renderAssert(true, 'add invoke callback.');
            }).then(function(list) {
                testResultView.renderAssert(list.get(1) === connection1, 'add promise param list is right.');
                testResultView.renderAssert(true, 'add promise done.');
                deferred.resolve(list);
            });
            return deferred.promise;
        },
        syncDel: function syncDel(list) {
            var deferred = Q.defer();
            testResultView.renderTitle('ListIndexedDBStore sync');

            list.markDelSync();

            I.Models.ConnectionListStore.sync(list, function() {
                testResultView.renderAssert(true, 'del invoke callback.');
                deferred.resolve();
            });
            return deferred.promise;
        },
        syncUpdate: function syncUpdate() {
            var deferred = Q.defer();
            var connection1 = new I.Models.Connection();
            connection1.id = 1;
            connection1.name = 'test server1';
            connection1.host = '10.88.230.51';
            connection1.port = '6379';
            connection1.testAddFilter = 'testAdd';
            connection1.testUpdateFilter = 'testUpdateFilter';
            connection1.testAbbFilter = 'testAbbFilter';
            connection1.testArrayFilter = 'testArrayFilter';
            var connection2 = new I.Models.Connection();
            connection2.id = 2;
            connection2.name = 'test server2';
            connection2.host = '10.88.230.52';
            connection2.port = '6379';
            connection2.testAddFilter = 'testAdd';
            connection2.testUpdateFilter = 'testUpdateFilter';
            connection2.testAbbFilter = 'testAbbFilter';
            connection2.testArrayFilter = 'testArrayFilter';

            var list = new I.Models.ConnectionList(1);
            list.addSync(connection1);
            list.addSync(connection2);

            I.Models.ConnectionListStore.sync(list, function(list) {
                testResultView.renderAssert(true, 'set invoke callback.');
                deferred.resolve(list);
            });
            return deferred.promise;
        },
    };

    I.Util.require('ListIndexedDBStoreTestController', 'Ctrl', ListIndexedDBStoreTestController);
}();
