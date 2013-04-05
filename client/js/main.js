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
});
