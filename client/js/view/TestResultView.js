!function() {
    var TestResultView = function TestResultView() {
        this.renderTitle = function renderTitle(title) {
            var data = { title: title };
            var html = I.Renderer.make('TestResult-Title', data);
            $('#TestResult').append(html);
        };
        this.renderAssert = function renderAssert(result, caseName) {
            var data = { result: result, caseName: caseName };
            var html = I.Renderer.make('TestResult-Result', data);
            $('#TestResult').append(html);
        };
    };

    I.Util.require('TestResultView', 'View', TestResultView);
}();
