!function() {
    var ModelIndexedDBStoreTestController = {
        run: function run() {
            var deferred = Q.defer();
            this.set()
            .then(this.get)
            .then(deferred.resolve);
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
    };

    I.Util.require('ModelIndexedDBStoreTestController', 'Ctrl', ModelIndexedDBStoreTestController);
}();

