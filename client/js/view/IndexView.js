!function() {
    var IndexView = function IndexView() {
        this.render = function render() {
            var html = I.Renderer.make('Index');
            $('body').html(html);
        };
    };

    I.Util.require('IndexView', 'View', IndexView);
}();
