$(function() {
    I.Loader.init(function() {
        $('#Status').html('<span class="label label-success">Online </span>');
        I.Ctrl.NetController.GetOnlineUserCount();
    }, function() {
        start();
    });

    I.ws.onclose = function() {
        $('#Status').html('<span class="label label-important">Offline </span>');
        $('#OnlineUser').html('<span class="badge badge-default"> ? </span>');
    };

    /* view */
    window.indexView = new I.View.IndexView();
    indexView.render();
    window.testResultView = new I.View.TestResultView();
});

function start() {
    I.Ctrl.PKTestController.run();
    I.Ctrl.ModelTestController.run();
    I.Ctrl.ListTestController.run();
    I.Ctrl.PKIndexedDBStoreTestController.run()
    .then(function() {
        return I.Ctrl.ModelIndexedDBStoreTestController.run();
    })
    .then(function() {
        return I.Ctrl.ListIndexedDBStoreTestController.run();
    });
};
