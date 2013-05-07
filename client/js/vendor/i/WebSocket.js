!function () {
    var WS = function WS() {
        this.connection = null;
        this.url = '';
        this.protocol = '';
        this.onopen = function() {};
        this.onerror = function() {};
        this.onclose = function() {};
        this.onmessage = function() {};

        this.start = function start(url, protocol) {
            this.url = url;
            this.protocol = protocol;
            this.connect();
            return this;
        };

        this.connect = function connect() {
            this.connection = new WebSocket(this.url, this.protocol);
            var self = this;

            this.connection.onopen = function() {
                console.log('open');
                self.onopen();
            };

            this.connection.onerror = function(error) {
                console.log('error', error);
                self.onerror();
            };

            this.connection.onclose = function(error) {
                console.log('close', error);
                self.onclose();
                setTimeout(function() {
                    self.connect();
                }, 800);
            };

            this.connection.onmessage = function(message) {
                var res = JSON.parse(message.data);
                if (res.r !== 0) throw new Exception(res.r);

                var route = routes[res.a];
                console.log('api:', res.a, 'code', res.r, 'data:', res.d);
                window[route.ctrl + 'Controller']['on' + route.action](res.d);
            };
        };

        this.send = function send(api, param) {
            if (this.connection.readyState !== WebSocket.OPEN) {
                console.log('u r offline, cannot send message to server.');
                return;
            }
            param = param || {};
            var req = {
                a: api,
                p: param,
            };
            this.connection.send(JSON.stringify(req));
        };
    };
    I.Util.require('WebSocket', '', WS);
}();
