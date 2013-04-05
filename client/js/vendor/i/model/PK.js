!function () {
    var PK = function PK() {};

    PK.prototype.init = function init(pk) {
        this.updated = false;
        this.tagDelSync = false;
        this.pk = parseInt(pk) || 0;
    };

    PK.prototype.set = function set(pk) {
        this.pk = parseInt(pk);
        this.updated = true;
    };

    PK.prototype.get = function get() {
        return this.pk;
    };

    PK.prototype.incr = function incr(val) {
        val = val || 1;
        var newVal = this.get() + val;
        this.set(newVal);
        return newVal;
    };

    PK.prototype.reset = function reset() {
        this.set(0);
    };

    PK.prototype.markDelSync = function markDelSync() {
        this.tagDelSync = true;
    };

    PK.prototype.backup = function backup() {
        return {
            type: 'PK',
            className: this.className,
            pk: this.get(),
        };
    };

    PK.prototype.restore = function restore(bak) {
        this.set(bak.pk);
    };

    PK.prototype.restoreSync = function restoreSync(bak) {
        this.set(bak.pk);
    };

    I.Util.require('PK', 'Models', PK);
}();
