$(function() {
    I.Loader.init(function() {
        $('#Status').html('<span class="label label-success">Online </span>');
        I.Ctrl.NetController.GetOnlineUserCount();
    }, function() {
    });

    I.ws.onclose = function() {
        $('#Status').html('<span class="label label-important">Offline </span>');
        $('#OnlineUser').html('<span class="badge badge-default"> ? </span>');
    };

    /* view */
    window.indexView = new I.View.IndexView();
    indexView.render();

var List = function List() {};

var fns = {
    constructor: List,
    add: function add(i) { this.toAddList.push(i); this[i] = i; },
    init: function init() {
        Object.defineProperty(this, 'toAddList', {
            value: [],
            writable: true, enumerable: false, configurable: false,
        });
    },
};

I.Util.define(List.prototype, fns);

var BaseList = function BaseList() {};

BaseList.prototype = Object.create(List.prototype, {
    className: {
        value: 'ConnectionList',
        writable: false, enumerable: false, configurable: false,
    },
});

window.ConnectionList = function ConnectionList() {};
ConnectionList.prototype = Object.create(BaseList.prototype, {
});

var c1 = new I.Models.Connection();
c1.setPK(1);
var c2 = new I.Models.Connection();
c2.setPK(2);

window.cl = new I.Models.ConnectionList(1, {1: c1, 2: c2});
console.dir(cl);

});
