require('./lib/ILoader.js');

var parse = require('url').parse;
var http = require('http');

http.createServer(function (req, res) {
    var util = IUtil;
    var start = process.hrtime();
    var params = parse(req.url, true).query;

    res.writeHead(200, {'Content-Type': 'text/plain'});
    try {
        IController.process(params, function(resData) {
            console.log(resData);
            res.end(JSON.stringify(resData));
            console.log('req:', params.req, 'cost', process.hrtime(start));
        });
    } catch (e) {
        util.printError(e);
        res.end('Wrong parameters');
    }
}).listen(1337, '10.88.228.232');

