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

            this.connection.onopen = function() {
                console.log('Websocket Opened');
                this.onopen();
            }.bind(this);

            this.connection.onerror = function(error) {
                console.log('Websocket Error', error);
                this.onerror();
            }.bind(this);

            this.connection.onclose = function(error) {
                console.log('Websocket Closed', error);
                this.onclose();
                setTimeout(function() {
                    this.connect();
                }.bind(this), 800);
            }.bind(this);

            this.connection.onmessage = function(message) {
                var res = JSON.parse(message.data);
                if (res.r !== 0) throw new I.Exception(res.r);

                var route = I.routes[res.a];
                console.log('Websocket Incoming: api:', res.a, 'code', res.r, 'data:', res.d);

                I.Ctrl[route.ctrl + 'Controller']['on' + route.action](res.d);
            };
        };

        this.send = function send(api, param) {
            if (this.connection.readyState !== WebSocket.OPEN) {
                console.log('Websocket Disconnected, cannot send message to server.');
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
