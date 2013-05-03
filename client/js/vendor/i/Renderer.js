!function () {
    var Renderer = {
        cachedTpl: {},
        make: function make(name, data) {
            data = data || {};
            if (this.cachedTpl[name] === undefined) {
                var jadeSrc = $.ajax({
                    url: '../../tpl/' + name + '.jade',
                    async: false,
                }).responseText;
                var fn = jade.compile(jadeSrc);
                this.cachedTpl[name] = fn;
            }
            var html = this.cachedTpl[name](data);
            return html;
        },
    };
    Util.require('Renderer', '', Renderer);
}();
