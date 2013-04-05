exports.NetController = {
    GetOnlineUserCount: function GetOnlineUserCount(connection, api, params) {
        var data = {
            onlineUserCount: connectionPool.length(),
        };
        connectionPool.broadcast(api, data);
    },
    /*
    Init: function Init(connection, api, params) {
        var data = {
            tableList: tableList.toAbbArray(),
            columnLists: columnLists,
            dataLists: dataLists,
            exporterList: exporterList.toAbbArray(),
        };
        connectionPool.single(connection, api, I.Const.PCSConst.REQUEST_RESULT_CODE_SUCCESS, data);
    },
    */
};
