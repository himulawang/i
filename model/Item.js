/* This file is generated by deploy.js automatically */
var Item = function Item(args) {
    this.pk = 'itemId';
    this.column = ['itemId', 'itemTypeId', 'count', 'updateTime'];
    this.init.call(this, args);
};

Item.prototype = new IObject();
Item.prototype.constructor = Item;

/* Getter */
Item.prototype.__defineGetter__('itemId', function() { return this.args[0]; });
Item.prototype.__defineGetter__('itemTypeId', function() { return this.args[1]; });
Item.prototype.__defineGetter__('count', function() { return this.args[2]; });
Item.prototype.__defineGetter__('updateTime', function() { return this.args[3]; });

/* Setter */
Item.prototype.__defineSetter__('itemId', function(val) { this.args[0] = val; this.updateList[0] = 1; });
Item.prototype.__defineSetter__('itemTypeId', function(val) { this.args[1] = val; this.updateList[1] = 1; });
Item.prototype.__defineSetter__('count', function(val) { this.args[2] = val; this.updateList[2] = 1; });
Item.prototype.__defineSetter__('updateTime', function(val) { this.args[3] = val; this.updateList[3] = 1; });

global.Item = Item;