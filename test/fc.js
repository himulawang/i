// load Modules
var http = require('http');
var querystring = require('querystring');

// global parameters
var path = '/pvzk/?'; 
var options = {
    host: '10.88.228.232',
    //host: '10.88.230.51',
    port: 1337,
    path: '',
    method: 'GET',
};

var assert = function(result, expect, data) {
    var report = [];
    var _assert = function(_result, _expect, data) {
        if (typeof _expect === 'object') {
            for (var i in _expect) {
                _assert(_result[i], _expect[i], data);
            }
        } else {
            var reportItem = ''
            if (typeof _expect === 'function') {
                ++data.caseCount;
                if (_expect(_result)) {
                    reportItem += 'Success';
                    ++data.successCaseCount;
                } else {
                    reportItem += 'Fail';
                }
                reportItem += ' This is a function test';
            } else {
                ++data.caseCount;
                if (_expect == _result) {
                    reportItem += 'Success';
                    ++data.successCaseCount;
                } else {
                    reportItem += 'Fail';
                }
                reportItem += ' Expect: ' + _expect + ' Result: ' + _result
            }
            report.push(reportItem);
        }
    };

    try {
        _assert(result, expect, data);
    } catch (e) {
        console.log(e);
    }
    return report.join('\n');
};

var parse = function(string) {
    try {
        //console.log(string);
        return object = JSON.parse(string);
    } catch (e) {
        console.log('bad json', e);
        console.log(string);
    }
};

var send = function(caseName, param, expect, dataHandler, callback, data) {
    // prepare param
    param.app = 'PVZK';
    apiName = param.req;
    options.path = path + querystring.stringify(param);

    var startTimestamp = Date.now();
    
    var req = http.request(options, function(res) {
        var resData = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            resData += chunk;
        });
        res.on('end', function() {
            // print caseName
            console.log('---------- Test ' + caseName + ' Start ----------');
            var endTimestamp = Date.now();
            // assert result
            var result = parse(resData);
            if (result) {
                var report = assert(result, expect, data);
                console.log(report);
            }

            // data handler
            dataHandler(result);

            console.log('Time Consume: ' + (endTimestamp - startTimestamp) + 'ms');
            console.log('---------- Test ' + caseName + ' End ----------' + "\n");
            // callback
            callback();
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();
};

var run = function(id, queue, data) {
    var job = queue.shift();
    var callback = function() {
        if (queue.length === 0) {
            return function() { 
                if (data.caseCount != data.successCaseCount) {
                    console.log(data);
                }
                console.log('---------- Final Result ----------');
                console.log('CaseCount:', data.caseCount + '; successCaseCount:', data.successCaseCount);
                console.log(
                    'Rate:', data.successCaseCount / data.caseCount * 100 + '%',
                    'Cost:', Date.now() - data.startTimestamp + 'ms'
                );
            };
        } else {
            return function() { run(id, queue, data); };
        }
    };
    send(job.caseName, job.param(data), job.expect(data), job.dataHandler(data), callback(), data);
};

var lineUp = function(queue, newJobs) {
    for (var i in newJobs) {
        queue.push(newJobs[i]);
    }
    return queue;
};

exports.assert = assert;
exports.lineUp = lineUp;
exports.send = send;
exports.run = run;
