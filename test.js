var redis = require('redis');
global.db = redis.createClient();

require('./lib/IConst.js');
require('./lib/IException.js');
require('./lib/IUtil.js');
require('./lib/IObject.js');
require('./lib/IModel.js');
require('./lib/IList.js');

// model
require('./model/UserModel.js');
require('./model/ItemModel.js');
require('./model/ItemListModel.js');

// object & list
require('./model/User.js');
require('./model/Item.js');
require('./model/ItemList.js');

var itemList = new ItemList(2);
var testAddItem = function() {
    var item1 = new Item([null, 1, 2, 3]);
    var item2 = new Item([null, 2, 3, 4]);
    var item3 = new Item([null, 2, 3, 4]);

    itemList.add(item1);
    itemList.add(item2);
    itemList.add(item3);

    ItemListModel.update(itemList, function(itemList) {
        console.log(itemList);
        testRetrieveItem();
    });
};

var testRetrieveItem = function() {
    ItemListModel.retrieve(2, function(itemList) {
        console.log(itemList);
        testUpdateItem(itemList);
    });
};

var testUpdateItem = function(itemList) {
    var lastItem = IUtil.getLastElement(itemList.list);
    lastItem.count = 100;
    itemList.update(lastItem);
    ItemListModel.update(itemList, function(itemList) {
        console.log(itemList);
        testDelItem(itemList);
    });
};

var testDelItem = function(itemList) {
    var lastItem = IUtil.getLastElement(itemList.list);
    console.log(lastItem);
    itemList.del(lastItem);

    ItemListModel.update(itemList, function(itemList) {
        console.log(itemList);
        testDropItem(itemList);
    });
};

var testDropItem = function(itemList) {
    ItemListModel.del(itemList, function(itemList) {
        console.log(itemList);
    });
};

// start chain
testAddItem();
