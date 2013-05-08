$(function() {
    I.idb.onsuccess = function() {
        console.log('idb opened');
    };

    I.ws.onopen = function() {
        console.log('ws opened');
    };
    /* view */
    /*
    window.indexView = new IndexView();
    indexView.render();

    I.Ctrl.NetController.Connect(function() {
        NetController.init();
    });
    */


});
