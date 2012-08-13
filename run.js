require('./lib/ILoader.js');

var parse = require('url').parse;
var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var params = parse(req.url, true).query;
    try {
        var resData = IController.process(params, function(resData) {
            console.log(resData);
            res.end('Hello World\n');
        });
    } catch (e) {
        IUtil.printError(e);
        res.end('Wrong parameters');
    }
}).listen(1337, '10.88.228.232');

