/* This file is generated by deploy.js automatically */
var ItemList = function ItemList(pk, index, list) {
    IList.call(this, pk, index, list);
};

ItemList.prototype = new IList();
ItemList.prototype.constructor = ItemList;

global.ItemList = ItemList;