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
});

function start() {
    var c1 = new I.Models.Connection();
    c1.setPK(1);
    var c2 = new I.Models.Connection();
    c2.setPK(2);

    window.cl = new I.Models.ConnectionList(1);
    cl.add(c1);
    cl.add(c2);


    I.Models.ConnectionListStore.update(cl, function() {
        I.l7('set list done');
    });

    var pk = new I.Models.ConnectionPK();
    pk.set(10);
    I.Models.ConnectionPKStore.set(pk).then(function() {
        return I.Models.ConnectionPKStore.get();
    })
    .then(function(pk) {
        console.dir(pk);
    });

    I.Models.ConnectionStore.get(1).then(function(model) {
        console.dir(model);
    });
};
