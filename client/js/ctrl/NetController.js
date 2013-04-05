var NetController = {
    Connect: function Connect(onready) {
        iWebSocket = new I.WebSocket().start(WS_URL, WS_PROTOCOL);
        iWebSocket.onopen = function onopen() {
            $('#Status').html('<span class="label label-success">Online </span>');
            NetController.GetOnlineUserCount();
            onready();
        };
        iWebSocket.onclose = function onclose() {
            $('#Status').html('<span class="label label-important">Offline </span>');
            $('#OnlineUser').html('<span class="badge badge-default"> ? </span>');
        };
    },
    GetOnlineUserCount: function GetOnlineUserCount() {
        iWebSocket.send('C0002');
    },
    onGetOnlineUserCount: function onGetOnlineUserCount(data) {
        $('#OnlineUser').html('<span class="badge badge-info">' + data.onlineUserCount + '</span>');
    },
    init: function init() {
        iWebSocket.send('C0003');
    },
    onInit: function onInit(data) {
        dataPool.reset();

        // table
        var tableList = new I.Models.TableList(0);
        tableList.fromAbbArray(data.tableList, true);
        dataPool.set('tableList', 0, tableList);
        tableListView.renderAll();

        for (var id in data.columnLists) {
            var columnList = new I.Models.ColumnList(id);
            columnList.fromAbbArray(data.columnLists[id], true);
            dataPool.set('columnList', id, columnList);
            dynamicMaker.make(id);
        }

        for (var id in data.dataLists) {
            var DataListClass = dynamicMaker.getListClass(id);
            var dataList = new DataListClass(id);
            dataList.fromAbbArray(data.dataLists[id], true);
            dataPool.set('dataList', id, dataList);
        }

        // exporter
        var exporterList = new I.Models.ExporterList(0);
        exporterList.fromAbbArray(data.exporterList, true);
        dataPool.set('exporterList', 0, exporterList);
        exporterListView.renderAll();

        indexView.clearContent();
    },
};
