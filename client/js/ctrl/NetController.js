!function() {
    var NetController = {
        GetOnlineUserCount: function GetOnlineUserCount() {
            I.ws.send('C0002');
        },
        onGetOnlineUserCount: function onGetOnlineUserCount(data) {
            $('#OnlineUser').html('<span class="badge badge-info">' + data.onlineUserCount + '</span>');
        },
    };

    I.Util.require('NetController', 'Ctrl', NetController);
}();
