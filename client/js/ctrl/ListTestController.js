!function() {
    var ListTestController = {
        run: function run() {
            this.init();
            this.reset();
            this.getPK();
            this.setPK();
        },
        init: function init() {
            testResultView.renderTitle('List init');
            try {
                var list = new I.Models.ConnectionList();
            } catch (e) {
                testResultView.renderAssert(e.code === 10118, 'undefined pk throw exception.');
            }

            var list = new I.Models.ConnectionList(1);
            testResultView.renderAssert(I.Util.getLength(list) === 0, 'with list, list is right.');

            var connection1 = new I.Models.Connection([1, 'test server1', '10.88.230.51', '6379', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var connection2 = new I.Models.Connection([2, 'test server2', '10.88.230.51', '6380', 'testAdd', 'testUpdate', 'testAbbFilter', 'testArrayFilter']);
            var data = { 1: connection1, 2: connection2 };
            var list = new I.Models.ConnectionList(1, data);

            testResultView.renderAssert(list.get(1) === connection1, 'list data1 is right.');
            testResultView.renderAssert(list.get(2) === connection2, 'list data2 is right.');
        },
        reset: function reset() {
            testResultView.renderTitle('List reset');
            var list = new I.Models.ConnectionList(1);
            list.reset();

            testResultView.renderAssert(list.toAddList.length === 0, 'toAddList is right.');
            testResultView.renderAssert(list.toDelList.length === 0, 'toDelList is right.');
            testResultView.renderAssert(list.toUpdateList.length === 0, 'toUpdateList is right.');
            testResultView.renderAssert(list.toAddSyncList.length === 0, 'toAddSyncList is right.');
            testResultView.renderAssert(list.toDelSyncList.length === 0, 'toDelSyncList is right.');
            testResultView.renderAssert(list.toUpdateSyncList.length === 0, 'toUpdateSyncList is right.');
            testResultView.renderAssert(list.tagDelSync === false, 'tagDelSync is false.');
        },
        setPK: function setPK() {
            testResultView.renderTitle('List setPK');
            var list = new I.Models.ConnectionList(1);
            list.setPK(2);
            testResultView.renderAssert(list.getPK() === 2, 'pk is right.');
        },
        getPK: function getPK() {
            testResultView.renderTitle('List getPK');
            var list = new I.Models.ConnectionList(1);
            testResultView.renderAssert(list.getPK() === 1, 'pk is right.');
        },
    };

    I.Util.require('ListTestController', 'Ctrl', ListTestController);
}();

