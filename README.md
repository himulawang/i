ParaNoidz I Framework
===
* [Model层](#model)
  * [orm.js配置](#ormjs)
  * [自动生成模型文件](#createmodelfilesautomatically)
  * [继承顺序](#inherits)
* [Model API](#modelapi)

基于纯Javascript平台的MVC框架，为简洁和效率而生。

## Model层

### orm.js配置
Model主要由orm.js配置生成

```js
{
    name: 'Table',
    abb: 't',
    column: [
        'id',
        'name',
        'description',
    ],
    toAddFilter: [2],      
    toUpdateFilter: [0],
    toAbbFilter: [2],
    toArrayFilter: [2],
    pk: 'id',
    pkAutoIncrement: true,
    list: 'TableList',
},
```

* name: Model名，server启动会根据name生成对应Model文件
* abb: 缩写，用于存入Redis减少空间占用
* column: 该Model所含属性
* toAddFilter: 当该Model被调用toAdd方法时，过滤掉的字段，使用key来标识。适用场景，当Model在服务端运行时有id、name、description三个参数，但存入Redis只需id和name，则可以填2，将description过滤掉。
* toUpdateFilter: 当该Model被调用toUpdate方法时，过滤掉的字段标识。作用同上。
* toAbbFilter: 当该Model被调用toAbb、toAbbDiff方法时，过滤掉的字段标识。作用同上。
* toArrayFilter: 当该Model被调用toArray、toArrayDiff方法时，过滤掉的字段标识。作用同上。
* pk: 主键，如Model有List，必须有用该属性。
* pkAutoIncrement: pk需要自增时，置为true，框架会自动为新增Model分配全局唯一Id作为pk
* list: List名，server启动会根据name生成对应List文件

### Create Model Files Automatically 自动生成模型文件
orm.js配置完，重启server，框架会根据配置自动生成如下Model文件（若文件已存在，则跳过）。

* TablePK.js
* TablePKStore.js
* Table.js
* TableStore.js
* TableList.js
* TableListStore.js

### Inherits 继承顺序

I Framework中分3类模型，PK、Model、List。

* PK 用于保存主键
* Model 保存模型属性
* List Model集

以上述Table为例，继承顺序分别为

* PK
  * TablePK.js -> TablePKBase.js -> PK.js
  * TablePKStore.js -> TablePKBaseStore.js -> PKStore.js
* Model
  * Table.js -> TableBase.js -> Model.js
  * TableStore.js -> TableBaseStore.js -> ModelStore.js
* List
  * TableList.js -> TableListBase.js -> List.js
  * TableListStore.js -> TableListBaseStore.js -> ListStore.js

最上层的TablePK.js、Table.js、TableList.js直接继承Base层，用于给开发者制定特殊化模型，将模型方法进行添加和重写。

Base层负责区分不同模型，由服务端开启时在内存中生成，因此代码文件并不存在。

PK.js、Model.js、List.js拥有最基础的API。

以上设计灵感源于JonathanDai的Ef-Framework。在使用Ef-Framework的过程中发现，一旦Model被重写，再次修改orm生成的文件就无法自动更新。上层抽出放入Base层，将重写完全隔离，可以有效解决这个问题。

由于Base层根据不同模型有所区别，但服务一旦开启不会变更，因此想到使用Javascript动态生成类功能，该功能正是这门语言强悍的地方。

Store结尾的类文件用于和Redis进行交互，将3类模型文件转化为Redis指令进行存取。

# Model API
注：Model API分两种，异步模式和同步模式。

区别在于：

异步模式将数据完全放于Redis中，当有需要才去获取，因此需要大量Callback回调，好处是服务端不会占用过多内存，坏处是Callback编程会让代码变得复杂，较难维护。

同步模式将Redis中的数据完全存入服务端中，定时向Redis更新差量数据，好处是不会频繁调用Redis，程序执行效率最高，存取数据为同步进行，没有Callback链，代码易读，坏处是会消耗较大内存，在Redis数据过大时，不建议使用。

以下有*SyncAPI*标识的为同步模式API。

## 1、PK.js

### new([pk])

```js
/*
@param number || undefined pk val start from 0
@return instance
*/
var pk = new TablePK(pk);
```

### .set(val)

```js
/*
@param number pk
@return void
*/
var pk = new TablePK(pk);
pk.set(val);
```

### .get()

```js
/*
@param void
@return number
*/
var pk = new TablePK(14);
var val = pk.get(); // 14
```

### .reset()

```js
/*
@param void
@return void
*/
var pk = new TablePK(77);
pk.reset();
var val = pk.get(); // 0
```

### .incr([val])

```js
/*
@param number || undefined val
@return number
*/
var pk = new TablePK();  // 0
var val = pk.incr(); // 1
val = pk.incr(77); // 78
```


### .backup()

```js
/*
@param void
@return object bak
*/
var pk = new TablePK(1);  // 0
var bak = pk.backup(); // { type: 'PK', className: 'TablePK', pk: 1 }
```

### .restore(bak)

```js
/*
@param object bak
@return void
*/
var pk = new TablePK();  // 0
var bak = { type: 'PK', className: 'TablePK', pk: 255 }
pk.restore(bak);
var val = pk.get(); // 255
```

### *SyncAPI* .markDelSync() 
PRIVATE API FOR DataPool

### *SyncAPI* .restoreSync(bak)

```js
/*
@param object bak
@return void
*/
var pk = new TablePK();  // 0
var bak = { type: 'PK', className: 'TablePK', pk: 255 }
pk.restore(bak);
var val = pk.get(); // 255
```

## 2、Model.js

### new([args])

```js
/*
@param array || undefined args
@return instance
*/
var table = new Table();
var id = table.id; // ''
var name = table.name; // ''
var description = table.description; // ''

var table = new Table([1, 'user', 'sample']);
var id = table.id; // 1
var name = table.name; // 'user'
var description = table.description; // 'sample'
```

### .setPK(pk)

```js
/*
@param number pk
@return void
*/
var table = new Table();
table.setPK(18);

var id = table.id; // 18
var pk = table.getPK(); // 18
```

### .getPK()

```js
/*
@param void
@return number
*/
var table = new Table();
table.setPK(18);

var id = table.id; // 18
var pk = table.getPK(); // 18
```

### .clone()

```js
/*
@param void
@return instance
*/
var table1 = new Table([1, 'user', 'sample1']);
var table2 = table1.clone();
table2.id = '2';

var id1 = table1.id; // 1
var name1 = table1.name; // 'user'

var id2 = table2.id; // 2
var name2 = table2.name; // 'user'
```

### .resetUpdateList()

```js
/*
@param void
@return void
*/
var table = new Table([1, 'user', 'sample']);
table.description = 'description changed';

var toUpdate = table.toUpdate(); // { 2: 'description changed'}

table.resetUpdateList();

toUpdate = table.toUpdate(); // {}
```

同时，这个方法也会重置tagAddSync和tagDelSync两个标识。

### .toAdd([filterOn])

```js
/*
@param boolean || undefined filterOn
@return array
*/
var table = new Table([1, 'user', 'sample']);
var toAdd = table.toAdd(); // ['1', 'user', 'sample'];

// orm.js: toAddFilter: [2], 
var toFilteredAdd = table.toAdd(true); // ['1', 'user'];
```

### .toUpdate([filterOn])

```js
/*
@param boolean || undefined filterOn
@return object
*/
var table = new Table([1, 'user', 'sample']);
var toUpdate = table.toUpdate(); // { 0: 1, 1: 'user', 2: 'sample' };

// orm.js: toUpdateFilter: [0], 
var toFilteredUpdated = table.toUpdate(true); // { 1: 'user', 2: 'sample' };
```

### .toAbbArray([filterOn])

```js
/*
@param boolean || undefined filterOn
@return object
*/
var table = new Table([1, 'user', 'sample']);
var toAbbArray = table.toAbbArray(); // { i: 1, n: 'user', d: 'sample' };

// orm.js: toAbbFilter: [2],
var toFilteredAbbArray = table.toAbbArray(true); // { i: 1, n: 'user' };
```

abb为abbreviation缩写，会将Model属性名自动转化为短名缩写，减小网络传输量和Redis占用空间，但不适合阅读和调试。规则如下：

1. 将第一个小写字母和后续的大写字母、数字拼成，如：autoResetTimestamp1 -> art1
2. 遇到重名，先在重名后的缩写中 + '1'，然后累加。如：已有art，autoRestartTime -> art1;已有art1，autoRestartTime1 -> art2

```js
return /^([a-zA-Z0-9]+?)(\d+)$/.test(abb) ? RegExp.$1 + (parseInt(RegExp.$2) + 1) : abb + 1;
```

### .toArray([filterOn])

```js
/*
@param boolean || undefined filterOn
@return object
*/
var table = new Table([1, 'user', 'sample']);
var toArray = table.toArray(); // { id: 1, name: 'user', description: 'sample' };

// orm.js: toFilter: [2],
var toFilteredArray = table.toArray(true); // { id: 1, name: 'user' };
```

### .toAbbDiff([filterOn])

```js
/*
@param boolean || undefined filterOn
@return object
*/
var table = new Table([1, 'user', 'sample']);
table.name = 'nameChanged';
var toAbbDiff = table.toAbbDiff(); // { n: 'nameChanged' };

// orm.js: toAbbFilter: [2],
table.description = 'descriptionChanged';
var toFilteredAbbDiff = table.toAbbDiff(true); // { n: 'nameChanged' };
```

### .toArrayDiff([filterOn])

```js
/*
@param boolean || undefined filterOn
@return object
*/
var table = new Table([1, 'user', 'sample']);
table.name = 'nameChanged';
var toArrayDiff = table.toArrayDiff(); // { name: 'nameChanged' };

// orm.js: toAbbFilter: [2],
table.description = 'descriptionChanged';
var toFilteredArrayDiff = table.toArrayDiff(true); // { name: 'nameChanged' };
```

### .fromAbbArray(data[, resetUpdateList])

```js
/*
@param object data
@param boolean || undefined resetUpdateList
@return void
*/
var table = new Table();
var data = { n: 'nameChanged' };
table.fromAbbArray(data);

var val = table.name; // 'nameChanged'
table.updateList; // [undefined, 1, undefined]

table.fromAbbArray(data, true);
var val = table.name; // 'nameChanged'
table.updateList; // [undefined, undefined, undefined]
```

### .fromArray(data[, resetUpdateList])

```js
/*
@param object data
@param boolean || undefined resetUpdateList
@return void
*/
var table = new Table();
var data = { name: 'nameChanged' };
table.fromArray(data);

var val = table.name; // 'nameChanged'
table.updateList; // [undefined, 1, undefined]

table.fromArray(data, true);
var val = table.name; // 'nameChanged'
table.updateList; // [undefined, undefined, undefined]
```

### .backup()

```js
/*
@param void
@return object
*/
var table = new Table([1, 'user', 'sample']);
var bak = table.backup(); // { type: 'Model', className: 'Table', data: { id: 1, name: 'user', 'description': 'sample'} }
```

### .restore(bak)

```js
/*
@param object bak
@return void
*/
var table = new Table();
var bak = { type: 'Model', className: 'Table', data: { id: 1, name: 'user', 'description': 'sample'} };
table.restore(bak);

var id = table.id; // 1
var name = table.name; // 'user'
var description = table.description; // 'sample'
```

### *SyncAPI* .restoreSync(bak)

```js
/*
@param object bak
@return void
*/
var table = new Table();
var bak = { type: 'Model', className: 'Table', data: { id: 1, name: 'user', 'description': 'sample'} };
table.restoreSync(bak);

var id = table.id; // 1
var name = table.name; // 'user'
var description = table.description; // 'sample'
var tagAddSync = table.tagAddSync; // true
```

### *SyncAPI* .markAddSync()

```js
/*
@param object bak
@return void
*/
var table = new Table([1, 'table', 'sample']);
table.markAddSync();

dataPool.set('table', 1);
dataPool.sync(); // this will add Table 1 to redis
```

### *SyncAPI* .markDelSync()
PRIVATE API FOR DataPool

## 3、List.js

### new(pk[, list])

```js
/*
@param number pk
@param object list
@return instance
*/
var tableList1 = new TableList(1);

var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([2, 'item', 'sample']);
var tableList2 = new TableList(2, { 1: table1, 2: table2});
```

### .setPK(pk)

```js
/*
@param number pk
@return void
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([2, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 2: table2});
tableList.set(2);
var pk = tableList.getPK(); // 2
```

### .getPK()

```js
/*
@param void
@return number
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([2, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 2: table2});
tableList.set(2);
var pk = tableList.getPK(); // 2
```

### .reset([list])

```js
/*
@param object || undefined list
@return void
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([2, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 2: table2});

var table3 = new Table([3, 'itemName', 'sample']);
var table4 = new Table([4, 'fullName', 'sample']);
tableList.reset({ 3: table3, 4: table4});

tableList.toAddList; // []
tableList.toDelList; // []
tableList.toUpdateList; // []

this.toAddSyncList = []; // []
this.toDelSyncList = []; // []
this.toUpdateSyncList = []; // []
```

### .add(child)

```js
/*
@param object child
@return void
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([2, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1 });

tableList.add(table2);

// table2 won't in tableList.list, it appears in toAddList
```

### .del(input)

```js
/*
@param object || number input
@return void
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([2, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 2: table2 });

tableList.del(table2);
tableList.del(1);

// table1 table2 won't delete from tableList.list, it appears in toDelList
```

### .update(child)

```js
/*
@param object child
@return void
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([2, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 2: table2 });

table1.name = 'nameChanged';
tableList.update(table1);

// table1 will change in tableList.list, also appears in toUpdateList
```

### .get(pk)

```js
/*
@param number pk 
@return object
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([2, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 2: table2 });

var tableMirror = TableList.get(1);
```

### .set(child)

```js
/*
@param object child 
@return void
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([2, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1 });

tableList.set(table2);

// .set() will not change toAddList,toDelList,toUpdateList, it change tableList.list directly
```

### .unset(input)

```js
/*
@param number || object input
@return void
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([2, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1 });

tableList.unset(1);
tableList.unset(table2);

// .unset() will not change toAddList,toDelList,toUpdateList, it change tableList.list directly
```

###. getKeys()

```js
/*
@param void
@return array
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([3, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1 });

tableList.getKeys(); // [1, 3];

// you can use this API forEach: tableList.getKeys().forEach(function() { something });
```

###. getList()

```js
/*
@param void
@return object
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([3, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1 });

tableList.getList(); // {1: table1, 3: table2 };
```

### .toAbbArray([filterOn])

```js
/*
@param boolean || undefined filterOn
@return object
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([3, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 2: table2 });

tableList.toAbbArray(); // {1: { i: 1, n: 'user', d: 'sample' }, 3: { i: 3, n: 'item', d: 'sample' }};

// orm.js: toAbbFilter: [2],
tableList.toAbbArray(true); // {1: { i: 1, n: 'user'}, 3: { i: 3, n: 'item'}};
```

### .toArray([filterOn])

```js
/*
@param boolean || undefined filterOn
@return object
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([3, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 2: table2 });

tableList.toArray(); // {1: { id: 1, name: 'user', description: 'sample' }, 3: { id: 3, name: 'item', description: 'sample' }};

// orm.js: toArrayFilter: [2],
tableList.toArray(true); // {1: { id: 1, name: 'user' }, 3: { id: 3, name: 'item' }};
```

### .fromAbbArray(data[, resetUpdateList])

```js
/*
@param object || data
@param boolean || undefined resetUpdateList
@return object
*/
var tableList = new TableList(1);
var data = {1: { i: 1, n: 'user', d: 'sample' }, 3: { i: 3, n: 'item', d: 'sample' }};
tableList.fromAbbArray(data);

// or
tableList.fromAbbArray(data, true);
```

### .fromArray(data[, resetUpdateList])

```js
/*
@param object || data
@param boolean || undefined resetUpdateList
@return object
*/
var tableList = new TableList(1);
var data = {1: { id: 1, name: 'user', description: 'sample' }, 3: { id: 3, name: 'item', description: 'sample' }};
tableList.fromArray(data);

// or
tableList.fromArray(data, true);
```

### .last()

```js
/*
@param void
@return void
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([3, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 3: table2 });

var lastTable = tableList.last(); // table2
```

### .backup()

```js
/*
@param void
@return object
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([3, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 3: table2 });

var bak = tableList.backup(); // { type: 'List', className: 'TableList', pk: 1, data: {1: { i: 1, n: 'user', d: 'sample' }, 3: { i: 3, n: 'item', d: 'sample' }} };
```

### .restore(bak)

```js
/*
@param object bak
@return void
*/
var tableList = new TableList(1);
var bak = { type: 'List', className: 'TableList', pk: 1, data: {1: { i: 1, n: 'user', d: 'sample' }, 3: { i: 3, n: 'item', d: 'sample' }} };
tableList.restore(bak);
```

### .restoreSync(bak)

```js
/*
@param object bak
@return void
*/
var tableList = new TableList(1);
var bak = { type: 'List', className: 'TableList', pk: 1, data: {1: { i: 1, n: 'user', d: 'sample' }, 3: { i: 3, n: 'item', d: 'sample' }} };
tableList.restoreSync(bak);

dataPool.set('tableList', 1);
dataPool.sync();
```

### *SyncAPI* .addSync(child)

```js
/*
@param object child
@return void
*/
var tableList = dataPool.get('tableList', 1);
var table1 = new Table([1, 'user', 'sample']);

tableList.addSync(table1);
// table1 appears in tableList.list and toAddSyncList

dataPool.sync(); // this will add table1 to redis
```

### *SyncAPI* .delSync(input)

```js
/*
@param number || object input
@return void
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([3, 'item', 'sample']);
var tableList = new TableList(1);

tableList.addSync(table1);
tableList.addSync(table2);

dataPool.set('tableList', 1, tableList);
dataPool.sync();

/* after a while */

var tableList = dataPool.get('tableList', 1);

tableList.delSync(table1);
tableList.delSync(3);
// table1,table2 disappears in tableList.list and appear in toDelSyncList

dataPool.sync(); // this will del 2 tables from redis
```

### *SyncAPI* .updateSync(child)

```js
/*
@param object child
@return void
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([3, 'item', 'sample']);
var tableList = new TableList(1);

tableList.addSync(table1);
tableList.addSync(table2);

dataPool.set('tableList', 1, tableList);
dataPool.sync();

/* after a while */

var tableList = dataPool.get('tableList', 1);
var table1 = tableList.get(1);

table1.name = 'nameChanged';
tableList.updateSync(table1);

dataPool.sync(); // this will update table1 to redis
```

### *SyncAPI* .markDelSync()
PRIVATE API FOR DataPool

## 4、PKStore.js

### .get(cb);

```js
/*
@param function cb
@return void
*/
TablePKStore.get(function(err, tablePK) {
    if (err) {
        // something
        return;
    }

    // something with tablePK
});
```

### .set(pk[, cb])

```js
/*
@param object pk
@param function || undefined cb
@return void
*/
var tablePK = new TablePK(22);
TablePKStore.set(tablePK, function(err, redisResult) {
    if (err) {
        // something
        return;
    }

    // something with redisResult
});

// this will set a STRING to redis, key: 'I-GK-t', value: 22
```

### .unset(pk[, cb])

```js
/*
@param object pk
@param function || undefined cb
@return void
*/
TablePKStore.get(function(err, tablePK) {
    if (err) {
        // something
        return;
    }

    TablePKStore.unset(tablePK, function(err, redisResult) {
        if (err) {
            // something
            return;
        }

        // something with redisResult
    });
});

// this will remove key: 'I-GK-t' from redis
```

### *SyncAPI* .sync()
PRIVATE API FOR DataPool

## 5、ModelStore.js

### .get(pk, cb)

```js
/*
@param number pk
@param function || undefined cb
@return void
*/
TableStore.get(1, function(err, table) {
    if (err) {
        // something
        return;
    }

    // something with table
});
```

### .add(model[, cb])

```js
/*
@param object model
@param function || undefined cb
@return void
*/
var table = new Table([1, 'user', 'sample']);
TableStore.add(table, function(err, table, redisResult) {
    if (err) {
        // something
        return;
    }

    // something with table or redisResult
});

// this will add a HASH to redis, key: 't-1', fields: [0, 1, 2], values:['1', 'user', 'sample']
```

### .del(input[, cb])

```js
/*
@param number || object input
@param function || undefined cb
@return void
*/
TableStore.del(1, function(err, redisResult) {
    if (err) {
        // something
        return;
    }

    // something with redisResult
});

// this will remove a HASH from redis, key: 't-1'

// also can
var table = new Table(['1', 'name', 'description']);
TableStore.del(table, function(err, redisResult) {
    if (err) {
        // something
        return;
    }

    // something with redisResult
});

// same effect
```

### .update(model[, cb])

```js
/*
@param object model
@param function || undefined cb
@return void
*/
TableStore.get(1, function(err, table) {
    if (err) {
        // something
        return;
    }

    table.name = 'nameChanged';

    TableStore.update(table, function(err, table, redisResult) {
        // something with table or redisResult
    });
});

// this will update a HASH to redis, key: 't-1', field: '1', value: 'nameChanged'
```

### *SyncAPI* .sync()
PRIVATE API FOR DataPool

## 6、ListStore.js

### .get(pk, cb)

```js
/*
@param number pk
@param function cb
@return void
*/
TableListStore.get(1, function(err, tableList) {
    if (err) {
        // something
        return;
    }

    // something with tableList
});

// this will get 'tl-1', 't1', 't3' from redis and make a TableList instance
```

### .del(list[, cb])

```js
/*
@param object list
@param function || undefined cb
@return void
*/
TableListStore.get(1, function(err, tableList) {
    if (err) {
        // something
        return;
    }

    TableListStore.del(tableList, function(err, list, redisResult) {
        if (err) {
            // something
            return;
        }

        // something with empty list or redisResult
    });
});

// this will del 'tl-1', 't1', 't3' from redis and return a empty TableList instance
```

### .update(list[, cb])

```js
/*
@param object list
@param function || undefined cb
@return void
*/
TableListStore.get(1, function(err, tableList) {
    if (err) {
        // something
        return;
    }

    // add new table
    var newTable = new Table([7, 'log', 'sample']);
    tableList.add(newTable);

    // del a table
    tableList.del(1);

    // update a table
    var table3 = tableList.get(3);
    table3.name = 'nameChanged';

    TableListStore.update(tableList, function(err, list, redisResult) {
        if (err) {
            // something
            return;
        }

        // something with updated list or redisResult
    });
});

// this will del 't1'

// set new HASH key: 't7', field: [0, 1, 2], value: ['7', 'log', 'sample']
// set HASH key: 'tl1', field: 7, value: 1

// update HASH key: 't3', field: 1, value: 'nameChanged'

// to redis
```

### *SyncAPI* .sync()
PRIVATE API FOR DataPool
