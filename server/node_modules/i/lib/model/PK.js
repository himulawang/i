!function () {
    var PK = function PK() {};

    var functions = {
        init: function init(pk) {
            var attrs = {
                updated: false,
                tagDelSync: false,
                pk: 0,
                fromStore: false,
            };

            I.Util.define(this, attrs, true);
            this.pk = parseInt(pk) || 0;
        },
        set: function set(pk) {
            this.pk = parseInt(pk);
            this.updated = true;
        },
        get: function get() {
            return this.pk;
        },
        incr: function incr(val) {
            val = val || 1;
            var newVal = this.get() + val;
            this.set(newVal);
            return newVal;
        },
        reset: function reset() {
            this.set(0);
        },
        markDelSync: function markDelSync() {
            this.tagDelSync = true;
        },
        backup: function backup() {
            return {
                type: 'PK',
                className: this.className,
                pk: this.get(),
            };
        },
        restore: function restore(bak) {
            this.set(bak.pk);
        },
        restoreSync: function restoreSync(bak) {
            this.set(bak.pk);
        },
    };

    I.Util.define(PK.prototype, functions);
    I.Util.require('PK', 'Models', PK);
}();
