!function() {
    var PKIndexedDBStoreTestController = {
        run: function run() {
            var deferred = Q.defer();
            this.set()
            .then(this.get)
            .then(this.unset)
            .then(this.sync)
            //.then(deferred.resolve);
            .then(function() {
                deferred.resolve();
            });
            return deferred.promise;
        },
        set: function set() {
            var deferred = Q.defer();
            testResultView.renderTitle('PKIndexedDBStore set');
            var pk = new I.Models.ConnectionPK();
            pk.set(9);
            try {
                I.Models.ConnectionPKStore.set([]);
            } catch (e) {
                testResultView.renderAssert(e.code === 20001, 'invalid input throw exception.');
            }

            I.Models.ConnectionPKStore.set(pk, function() {
                testResultView.renderAssert(true, 'invoke callback.');
            }).then(function() {
                testResultView.renderAssert(true, 'promise done.');
                deferred.resolve();
            });
            return deferred.promise;
        },
        get: function get() {
            var deferred = Q.defer();
            testResultView.renderTitle('PKIndexedDBStore get');
            I.Models.ConnectionPKStore.get(function(pk) {
                testResultView.renderAssert(pk.get() === 9, 'callback param pk is right.');
                testResultView.renderAssert(true, 'invoke callback.');
            }).then(function(pk) {
                testResultView.renderAssert(pk.get() === 9, 'get pk is right.');
                testResultView.renderAssert(true, 'promise done.');
                deferred.resolve(pk);
            });
            return deferred.promise;
        },
        unset: function unset(pk) {
            var deferred = Q.defer();
            testResultView.renderTitle('PKIndexedDBStore unset');
            try {
                I.Models.ConnectionPKStore.unset([]);
            } catch (e) {
                testResultView.renderAssert(e.code === 20002, 'invalid input throw exception.');
            }
            I.Models.ConnectionPKStore.unset(pk, function() {
                testResultView.renderAssert(true, 'invoke callback.');
            }).then(function() {
                I.Models.ConnectionPKStore.get().then(function(pk) {
                    testResultView.renderAssert(pk.get() === 0, 'pk unset is right.');
                    deferred.resolve();
                });
            });
            return deferred.promise;
        },
        sync: function sync() {
            var deferred = Q.defer();
            testResultView.renderTitle('PKIndexedDBStore sync');
            var pk = new I.Models.ConnectionPK(10);
            I.Models.ConnectionPKStore.sync(pk, function() {
                testResultView.renderAssert(pk.updated === false, 'sync set is right.');
                pk.markDelSync();
                I.Models.ConnectionPKStore.sync(pk, function() {
                    testResultView.renderAssert(true, 'sync del is right.');
                    deferred.resolve();
                });
            });
            return deferred.promise;
        },
    };

    I.Util.require('PKIndexedDBStoreTestController', 'Ctrl', PKIndexedDBStoreTestController);
}();
