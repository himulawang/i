exports.NetController = {
    GetOnlineUserCount: function GetOnlineUserCount(connection, api, params) {
        var data = {
            onlineUserCount: connectionPool.length(),
        };
        connectionPool.broadcast(api, data);
    },
};
