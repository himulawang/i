!function() {
    var WS = function WS() {
        this.connection = null;
        this.url = '';
        this.protocol = '';
        this.onopen = function() {};
        this.onerror = function() {};
        this.onclose = function() {};
        this.onmessage = function() {};

        this.start = function start(url, protocol, autoReconnectInterval) {
            this.url = url;
            this.protocol = protocol;
            this.autoReconnectInterval = autoReconnectInterval;
            this.connect();
            return this;
        };

        this.connect = function connect() {
            this.connection = new WebSocket(this.url, this.protocol);

            this.connection.onopen = function() {
                I.l6('Websocket Opened');
                this.onopen();
            }.bind(this);

            this.connection.onerror = function(error) {
                I.l3('Websocket Error', error);
                this.onerror();
            }.bind(this);

            this.connection.onclose = function(error) {
                I.l4('Websocket Closed', error);
                this.onclose();

                if (this.autoReconnectInterval !== 0) {
                    setTimeout(this.connect.bind(this), this.autoReconnectInterval);
                }
            }.bind(this);

            this.connection.onmessage = function(message) {
                var res = JSON.parse(message.data);
                if (res.r !== 0) throw new I.Exception(res.r);

                var route = I.routes[res.a];
                I.l6('WS In api:', res.a, 'code:', res.r, 'data:', res.d);

                I.Ctrl[route.ctrl + 'Controller']['on' + route.action](res.d);
            };
        };

        this.send = function send(api, param) {
            if (this.connection.readyState !== WebSocket.OPEN) {
                I.l4('Websocket Disconnected, cannot send message to server.');
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
