var WS_URL = 'ws://' + window.location.host + '/';
var WS_PROTOCOL = 'i';

/* websocket */
var iWebSocket;

$(function() {
    /* view */
    window.indexView = new IndexView();
    indexView.render();

    NetController.Connect(function() {
        NetController.init();
    });

    window.db = new I.Models.IndexedDB('i', 3, orms);
    db.onsuccess = function onsuccess() {
        var pk = new I.Models.ConnectionPK();
        pk.incr();

        /*
        I.Models.ConnectionPKStore.set(pk, function() {
            console.log(pk.className, pk.get(), 'pk set success');

            I.Models.ConnectionPKStore.unset(pk, function() {
                console.log(pk.className, pk.get(), 'pk unset success');
            });
        });

        I.Models.ConnectionPKStore.get(function(pk) {
            console.log('get key ConnectionPK', pk);
        });
        */

        var connection = new I.Models.Connection([
            1,
            '10.88.230.51:6379',
            '10.88.230.51',
            6379
        ]);

        I.Models.ConnectionStore.set(connection, function() {
            console.log('set connection done');
        });
    };

});
