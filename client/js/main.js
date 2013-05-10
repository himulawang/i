$(function() {
    I.Loader.init(function() {
        $('#Status').html('<span class="label label-success">Online </span>');
        I.Ctrl.NetController.GetOnlineUserCount();
    }, function() {
    });

    I.ws.onclose = function() {
        $('#Status').html('<span class="label label-important">Offline </span>');
        $('#OnlineUser').html('<span class="badge badge-default"> ? </span>');
    };

    /* view */
    window.indexView = new I.View.IndexView();
    indexView.render();

var c1 = new I.Models.Connection();
c1.setPK(1);
var c2 = new I.Models.Connection();
c2.setPK(2);

window.cl = new I.Models.ConnectionList(1, {1: c1, 2: c2});
console.dir(cl);

window.pk = new I.Models.ConnectionPK(1);
console.dir(pk);

});
