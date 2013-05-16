!function() {
    var ModelIndexedDBStoreTestController = {
        run: function run() {
            var deferred = Q.defer();
            this.set()
            .then(this.get)
            .then(this.delInt)
            .then(function() {
                return this.checkFromStore(false);
            }.bind(this))
            .then(this.prepareData)
            .then(this.delModel)
            .then(function() {
                return this.checkFromStore(false);
            }.bind(this))
            .then(this.syncSet)
            .then(function() {
                return this.checkFromStore(true);
            }.bind(this))
            .then(this.syncDel)
            .then(function() {
                return this.checkFromStore(false);
            }.bind(this))
            .then(deferred.resolve);
            return deferred.promise;
        },
        prepareData: function prepareData() {
            var deferred = Q.defer();
            var connection = new I.Models.Connection();
            testResultView.renderAssert(true, 'prepare data.');
            connection.setPK(1);
            connection.name = 'server1';
            connection.host = '10.88.230.51';
            connection.port = '6379';
            I.Models.ConnectionStore.set(connection).then(deferred.resolve);
            return deferred.promise;
        },
        checkFromStore: function checkFromStore(value) {
            var deferred = Q.defer();
            I.Models.ConnectionStore.get(1, function(connection) {
                testResultView.renderAssert(connection.fromStore === value, 'check fromStore is ' + value.toString() + '.');
            }).then(deferred.resolve);
            return deferred.promise;
        },
        set: function set() {
            var deferred = Q.defer();
            testResultView.renderTitle('ModelIndexedDBStore set');
            var connection = new I.Models.Connection();
            connection.setPK(1);
            connection.name = 'server1';
            connection.host = '10.88.230.51';
            connection.port = '6379';

            try {
                I.Models.ConnectionStore.set([]);
            } catch (e) {
                testResultView.renderAssert(e.code === 20003, 'invalid input throw exception.');
            }

            I.Models.ConnectionStore.set(connection, function(model) {
                testResultView.renderAssert(connection === model, 'callback param model is right.');
                testResultView.renderAssert(true, 'invoke callback.');
            }).then(function(model) {
                testResultView.renderAssert(connection === model, 'promise param model is right.');
                testResultView.renderAssert(true, 'promise done.');
                deferred.resolve();
            });
            return deferred.promise;
        },
        get: function get() {
            var deferred = Q.defer();
            testResultView.renderTitle('ModelIndexedDBStore get');

            I.Models.ConnectionStore.get(1, function(model) {
                testResultView.renderAssert(model.name === 'server1', 'model is right.');
                testResultView.renderAssert(true, 'invoke callback.');
            }).then(function(model) {
                testResultView.renderAssert(model.host === '10.88.230.51', 'model is right.');
                testResultView.renderAssert(true, 'promise done.');
                deferred.resolve();
            });
            return deferred.promise;
        },
        delInt: function delInt() {
            var deferred = Q.defer();
            testResultView.renderTitle('ModelIndexedDBStore del by int');

            try {
                I.Models.ConnectionStore.del([]);
            } catch (e) {
                testResultView.renderAssert(e.code === 20004, 'invalid input throw exception.');
            }

            I.Models.ConnectionStore.del(1, function() {
                testResultView.renderAssert(true, 'invoke callback.');
            }).then(function() {
                testResultView.renderAssert(true, 'promise done.');
                deferred.resolve();
            });

            return deferred.promise;
        },
        delModel: function delModel() {
            var deferred = Q.defer();
            testResultView.renderTitle('ModelIndexedDBStore del by model');

            try {
                I.Models.ConnectionStore.del([]);
            } catch (e) {
                testResultView.renderAssert(e.code === 20004, 'invalid input throw exception.');
            }

            I.Models.ConnectionStore.get(1).then(function(model) {
                I.Models.ConnectionStore.del(model, function() {
                    testResultView.renderAssert(true, 'invoke callback.');
                }).then(function() {
                    testResultView.renderAssert(true, 'promise done.');
                    deferred.resolve();
                });
            });

            return deferred.promise;
        },
        syncSet: function syncSet() {
            var deferred = Q.defer();
            testResultView.renderTitle('ModelIndexedDBStore sync set');
            var connection = new I.Models.Connection();
            connection.setPK(1);
            connection.name = 'server1';
            connection.host = '10.88.230.51';
            connection.port = '6379';
            I.Models.ConnectionStore.sync(connection, function() {
                testResultView.renderAssert(true, 'invoke callback.');
                deferred.resolve();
            });
            return deferred.promise;
        },
        syncDel: function syncDel() {
            var deferred = Q.defer();
            testResultView.renderTitle('ModelIndexedDBStore sync del');
            I.Models.ConnectionStore.get(1).then(function(connection) {
                connection.markDelSync();
                I.Models.ConnectionStore.sync(connection, function() {
                    testResultView.renderAssert(true, 'invoke callback.');
                    deferred.resolve();
                });
            });
            return deferred.promise;
        },
    };

    I.Util.require('ModelIndexedDBStoreTestController', 'Ctrl', ModelIndexedDBStoreTestController);
}();
