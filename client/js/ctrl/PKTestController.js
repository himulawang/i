!function() {
    var PKTestController = {
        run: function run() {
            this.init();
            this.set();
            this.get();
            this.incr();
            this.reset();
            this.markDelSync();
            this.backup();
            this.restore();
            this.restoreSync();
        },
        init: function init() {
            testResultView.renderTitle('PK init');
            var pk = new I.Models.ConnectionPK();
            testResultView.renderAssert(I.Util.isInt(pk.get()), 'pk is int.');
            testResultView.renderAssert(pk.get() === 0, 'undefined pk is 0.');
            testResultView.renderAssert(pk.updated === false, 'updated is false.');
            testResultView.renderAssert(pk.tagDelSync === false, 'tagDelSync is false.');

            var pk = new I.Models.ConnectionPK(777);
            testResultView.renderAssert(pk.get() === 777, 'defined pk.');
        },
        set: function set() {
            testResultView.renderTitle('PK set');
            var pk = new I.Models.ConnectionPK();
            pk.set(166);
            testResultView.renderAssert(pk.get() === 166, 'pk is right.');
            testResultView.renderAssert(I.Util.isInt(pk.get()), 'pk is int.');
            testResultView.renderAssert(pk.updated === true, 'updated is true.');
        },
        get: function get() {
            testResultView.renderTitle('PK get');
            var pk = new I.Models.ConnectionPK(192);
            testResultView.renderAssert(pk.get() === 192, 'pk is right.');
            testResultView.renderAssert(I.Util.isInt(pk.get()), 'pk is int.');
        },
        incr: function incr() {
            testResultView.renderTitle('PK incr');
            var pk = new I.Models.ConnectionPK(192);
            pk.incr();
            testResultView.renderAssert(pk.get() === 193, 'undefined val incr 1.');
            testResultView.renderAssert(pk.updated === true, 'updated is true.');

            var pk = new I.Models.ConnectionPK(150);
            pk.incr(50);
            testResultView.renderAssert(pk.get() === 200, 'defined val add 50.');
            testResultView.renderAssert(pk.updated === true, 'updated is true.');
        },
        reset: function reset() {
            testResultView.renderTitle('PK reset');
            var pk = new I.Models.ConnectionPK(192);
            pk.reset();
            testResultView.renderAssert(pk.get() === 0, 'pk is 0.');
            testResultView.renderAssert(pk.updated === true, 'updated is true.');
        },
        markDelSync: function markDelSync() {
            testResultView.renderTitle('PK markDelSync');
            var pk = new I.Models.ConnectionPK(192);
            pk.markDelSync();
            testResultView.renderAssert(pk.tagDelSync === true, 'tagDelSync is true.');
        },
        backup: function backup() {
            testResultView.renderTitle('PK backup');
            var pk = new I.Models.ConnectionPK(92);
            var backup = pk.backup();
            testResultView.renderAssert(backup.type === 'PK', 'type is PK.');
            testResultView.renderAssert(backup.className === 'ConnectionPK', 'className is right.');
            testResultView.renderAssert(backup.pk === 92, 'pk is right.');
        },
        restore: function restore() {
            testResultView.renderTitle('PK restore');
            var backup = {
                type: 'PK',
                className: 'ConnectionPK',
                pk: 107
            };
            var pk = new I.Models.ConnectionPK();
            pk.restore(backup);
            testResultView.renderAssert(pk.get() === 107, 'pk is right.');
            testResultView.renderAssert(pk.updated === true, 'updated is true.');
        },
        restoreSync: function restoreSync() {
            testResultView.renderTitle('PK restore');
            var backup = {
                type: 'PK',
                className: 'ConnectionPK',
                pk: 107
            };
            var pk = new I.Models.ConnectionPK();
            pk.restore(backup);
            testResultView.renderAssert(pk.get() === 107, 'pk is right.');
            testResultView.renderAssert(pk.updated === true, 'updated is true.');
        },
    };

    I.Util.require('PKTestController', 'Ctrl', PKTestController);
}();
