ParaNoidz I Framework
===
基于纯Javascript平台的MVC框架，为简洁和效率而生。

Chrome、Websocket、node.js、Redis的组合，将HTML5 App的效率推到极致。

Sample: [PCS](https://github.com/himulawang/pcs)

目录

Model

* [Model层概述及运行机理](#model)
  * [orm.js配置](#ormjs)
  * [Create Model Files Automatically 自动生成模型文件](#create-model-files-automatically-)
  * [Inherits 继承顺序](#inherits-)
  * [Model转换为Redis的数据结构规则](#modelredis)
  * [Client Model文件](#client-model)

[Model API](#model-api)

* [1、PK.js](#1pkjs)
  * [new PK([pk])](#new-pkpk)
  * [PK.set(val)](#pksetval)
  * [PK.get()](#pkget)
  * [PK.reset()](#pkreset)
  * [PK.incr([val])](#pkincrval)
  * [PK.backup()](#pkbackup)
  * [PK.restore(bak)](#pkrestorebak)
  * [PK.restoreSync(bak) SyncAPI](#pkrestoresyncbak-syncapi)
  * [PK.markDelSync() SyncAPI](#pkmarkdelsync-syncapi)
* [2、Model.js](#2modeljs)
  * [new Model([args])](#new-modelargs)
  * [Model.setPK(pk)](#modelsetpkpk)
  * [Model.getPK()](#modelgetpk)
  * [Model.clone()](#modelclone)
  * [Model.resetUpdateList()](#modelresetupdatelist)
  * [Model.toAdd([filterOn])](#modeltoaddfilteron)
  * [Model.toUpdate([filterOn])](#modeltoupdatefilteron)
  * [Model.toAbbArray([filterOn])](#modeltoabbarrayfilteron)
  * [Model.toArray([filterOn])](#modeltoarrayfilteron)
  * [Model.toAbbDiff([filterOn])](#modeltoabbdifffilteron)
  * [Model.toArrayDiff([filterOn])](#modeltoarraydifffilteron)
  * [Model.fromAbbArray(data[, resetUpdateList])](#modelfromabbarraydata-resetupdatelist)
  * [Model.fromArray(data[, resetUpdateList])](#modelfromarraydata-resetupdatelist)
  * [Model.backup()](#modelbackup)
  * [Model.restore(bak)](#modelrestorebak)
  * [Model.restoreSync(bak) SyncAPI](#modelrestoresyncbak-syncapi)
  * [Model.markAddSync() SyncAPI](#modelmarkaddsync-syncapi)
  * [Model.markDelSync() SyncAPI](#modelmarkdelsync-syncapi)
* [3、List.js](#3listjs)
  * [new List(pk[, list])](#new-listpk-list)
  * [List.setPK(pk)](#listsetpkpk)
  * [List.getPK()](#listgetpk)
  * [List.reset([list])](#listresetlist)
  * [List.add(child)](#listaddchild)
  * [List.del(input)](#listdelinput)
  * [List.update(child)](#listupdatechild)
  * [List.get(pk)](#listgetpk-1)
  * [List.set(child)](#listsetchild)
  * [List.unset(input)](#listunsetinput)
  * [List.getKeys()](#listgetkeys)
  * [List.getList()](#listgetlist)
  * [List.toAbbArray([filterOn])](#listtoabbarrayfilteron)
  * [List.toArray([filterOn])](#listtoarrayfilteron)
  * [List.fromAbbArray(data[, resetUpdateList])](#listfromabbarraydata-resetupdatelist)
  * [List.fromArray(data[, resetUpdateList])](#listfromarraydata-resetupdatelist)
  * [List.last()](#listlast)
  * [List.backup()](#listbackup)
  * [List.restore(bak)](#listrestorebak)
  * [List.restoreSync(bak)](#listrestoresyncbak)
  * [List.addSync(child) SyncAPI](#listaddsyncchild-syncapi)
  * [List.delSync(input) SyncAPI](#listdelsyncinput-syncapi)
  * [List.updateSync(child) SyncAPI](#listupdatesyncchild-syncapi)
  * [List.markDelSync() SyncAPI](#listmarkdelsync-syncapi)
* [4、PKStore.js](#4pkstorejs)
  * [PKStore.get(cb)](#pkstoregetcb)
  * [PKStore.set(pk[, cb])](#pkstoresetpk-cb)
  * [PKStore.unset(pk[, cb])](#pkstoreunsetpk-cb)
  * [PKStore.sync() SyncAPI](#pkstoresync-syncapi)
* [5、ModelStore.js](#5modelstorejs)
  * [ModelStore.get(pk, cb)](#modelstoregetpk-cb)
  * [ModelStore.add(model[, cb])](#modelstoreaddmodel-cb)
  * [ModelStore.del(input[, cb])](#modelstoredelinput-cb)
  * [ModelStore.update(model[, cb])](#modelstoreupdatemodel-cb)
  * [ModelStore.sync() SyncAPI](#modelstoresync-syncapi)
* [6、ListStore.js](#6liststorejs)
  * [ListStore.get(pk, cb)](#liststoregetpk-cb)
  * [ListStore.del(list[, cb])](#liststoredellist-cb)
  * [ListStore.update(list[, cb])](#liststoreupdatelist-cb)
  * [ListStore.sync() SyncAPI](#liststoresync-syncapi)

View

* [View层概述及运行机理](#view)
  * [Server端View层](#serverview)
  * [Client端View层](#clientview)

Controller

* [Controller层概述及运行机理](#controller)
  * [Server端Controller层](#servercontroller)
  * [Client端Controller层](#clientcontroller)

TODO

* [TODO](#todo)

Acknowledgement

* [Acknowledgement](#acknowledgement)

# Model层概述及运行机理

### orm.js配置
Model文件主要由orm.js配置生成，Server和Client两边都需要配置。

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

### Model转换为Redis的数据结构规则

PK转化为type: STRING, key: 'I-GK-' + abb, value: pk

Model转化为type: HASH, key: abb + pk, field: ['0', '1'... n], value: [value0, value1, ... valueN]

List转化为

一个type: HASH, key: abb + 'l' + pk, field: [child1.pk, child2.pk... childN.pk], value: [1, 1... 1]，用于记录List的主键。

N个type: HASH, key: abb + pk, field: ['0', '1'... n], value: [value0, value1, ... valueN]

### Client Model文件
Model文件在客户端只有PK、Model、List有效。当服务端生成Model文件后，直接将文件Copy入client目录下，直接引用即可。

# Model API
注：Model API分两种，异步模式和同步模式。

区别在于：

异步模式将数据完全放于Redis中，当有需要才去获取，因此需要大量Callback回调，好处是服务端不会占用过多内存，坏处是Callback编程会让代码变得复杂，较难维护。

同步模式将Redis中的数据完全存入服务端中，定时向Redis更新差量数据，好处是不会频繁调用Redis，程序执行效率最高，存取数据为同步进行，没有Callback链，代码易读，坏处是会消耗较大内存，在Redis数据过大时，不建议使用。

以下有*SyncAPI*标识的为同步模式API。

## 1、PK.js

### new PK([pk])

```js
/*
@param number || undefined pk val start from 0
@return instance
*/
var pk = new TablePK(256);
pk.get(); // 256
```

### PK.set(val)

```js
/*
@param number val
@return void
*/
var pk = new TablePK();
pk.set(1024);
pk.get() // 1024
```

### PK.get()

```js
/*
@param void
@return number
*/
var pk = new TablePK(14);
pk.get(); // 14
```

### PK.reset()

```js
/*
@param void
@return void
*/
var pk = new TablePK(77);
pk.reset();
pk.get(); // 0
```

### PK.incr([val])

```js
/*
@param number || undefined val
@return number
*/
var pk = new TablePK();  // 0
pk.incr(); // 1
pk.incr(77); // 78
```


### PK.backup()

```js
/*
@param void
@return object bak
*/
var pk = new TablePK(1);
pk.backup(); // { type: 'PK', className: 'TablePK', pk: 1 }
```

### PK.restore(bak)

```js
/*
@param object bak
@return void
*/
var pk = new TablePK();  // 0
var bak = { type: 'PK', className: 'TablePK', pk: 255 }
pk.restore(bak);
pk.get(); // 255
```

### PK.restoreSync(bak) *SyncAPI*

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

### PK.markDelSync() *SyncAPI*

PRIVATE API FOR DataPool

## 2、Model.js

### new Model([args])

```js
/*
@param array || undefined args
@return instance
*/
var table = new Table();
table.id; // ''
table.name; // ''
table.description; // ''

var table = new Table([1, 'user', 'sample']);
table.id; // 1
table.name; // 'user'
table.description; // 'sample'
```

### Model.setPK(pk)

```js
/*
@param number pk
@return void
*/
var table = new Table();
table.setPK(18);

table.id; // 18
table.getPK(); // 18
```

### Model.getPK()

```js
/*
@param void
@return number
*/
var table = new Table();
table.setPK(18);

table.id; // 18
table.getPK(); // 18
```

### Model.clone()

```js
/*
@param void
@return instance
*/
var table1 = new Table([1, 'user', 'sample1']);
var table2 = table1.clone();
table2.id = '2';

table1.id; // 1
table1.name; // 'user'

table2.id; // 2
table2.name; // 'user'
```

### Model.resetUpdateList()

```js
/*
@param void
@return void
*/
var table = new Table([1, 'user', 'sample']);
table.description = 'description changed';

table.toUpdate(); // { 2: 'description changed'}

table.resetUpdateList();

table.toUpdate(); // {}
```

同时，这个方法也会重置tagAddSync和tagDelSync两个标识。

### Model.toAdd([filterOn])

```js
/*
@param boolean || undefined filterOn
@return array
*/
var table = new Table([1, 'user', 'sample']);
table.toAdd(); // ['1', 'user', 'sample'];

// orm.js: toAddFilter: [2], 
table.toAdd(true); // ['1', 'user'];
```

### Model.toUpdate([filterOn])

```js
/*
@param boolean || undefined filterOn
@return object
*/
var table = new Table([1, 'user', 'sample']);
table.id = 2;
table.description = 'description changed';
table.toUpdate(); // { 0: 2, 2: 'description changed' };

// orm.js: toUpdateFilter: [0], 
table.toUpdate(true); // { 2: 'description changed' };
```

### Model.toAbbArray([filterOn])

```js
/*
@param boolean || undefined filterOn
@return object
*/
var table = new Table([1, 'user', 'sample']);
table.toAbbArray(); // { i: 1, n: 'user', d: 'sample' };

// orm.js: toAbbFilter: [2],
table.toAbbArray(true); // { i: 1, n: 'user' };
```

abb为abbreviation缩写，会将Model属性名自动转化为短名缩写，减小网络传输量和Redis占用空间，但不易阅读和调试。规则如下：

1. 以第一个小写字母和后续的大写字母、数字拼成，并全部转为小写，如：autoResetTimestamp1 -> art1
2. 遇到重名，先在重名后的缩写中 + '1'，然后累加。如：已有art，autoRestartTime -> art1;已有art1，autoRestartTime1 -> art2

```js
return /^([a-zA-Z0-9]+?)(\d+)$/.test(abb) ? RegExp.$1 + (parseInt(RegExp.$2) + 1) : abb + 1;
```

### Model.toArray([filterOn])

```js
/*
@param boolean || undefined filterOn
@return object
*/
var table = new Table([1, 'user', 'sample']);
table.toArray(); // { id: 1, name: 'user', description: 'sample' };

// orm.js: toFilter: [2],
table.toArray(true); // { id: 1, name: 'user' };
```

### Model.toAbbDiff([filterOn])

```js
/*
@param boolean || undefined filterOn
@return object
*/
var table = new Table([1, 'user', 'sample']);
table.name = 'nameChanged';
table.toAbbDiff(); // { n: 'nameChanged' };

// orm.js: toAbbFilter: [2],
table.description = 'descriptionChanged';
table.toAbbDiff(true); // { n: 'nameChanged' };
```

### Model.toArrayDiff([filterOn])

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

### Model.fromAbbArray(data[, resetUpdateList])

```js
/*
@param object data
@param boolean || undefined resetUpdateList
@return void
*/
var table = new Table();
var data = { n: 'nameChanged' };
table.fromAbbArray(data);

table.name; // 'nameChanged'
table.updateList; // [undefined, 1, undefined]

table.fromAbbArray(data, true);
table.name; // 'nameChanged'
table.updateList; // [undefined, undefined, undefined]
```

### Model.fromArray(data[, resetUpdateList])

```js
/*
@param object data
@param boolean || undefined resetUpdateList
@return void
*/
var table = new Table();
var data = { name: 'nameChanged' };
table.fromArray(data);

table.name; // 'nameChanged'
table.updateList; // [undefined, 1, undefined]

table.fromArray(data, true);
table.name; // 'nameChanged'
table.updateList; // [undefined, undefined, undefined]
```

### Model.backup()

```js
/*
@param void
@return object
*/
var table = new Table([1, 'user', 'sample']);
table.backup(); // { type: 'Model', className: 'Table', data: { id: 1, name: 'user', description: 'sample'} }
```

### Model.restore(bak)

```js
/*
@param object bak
@return void
*/
var table = new Table();
var bak = { type: 'Model', className: 'Table', data: { id: 1, name: 'user', description: 'sample'} };
table.restore(bak);

table.id; // 1
table.name; // 'user'
table.description; // 'sample'
```

### Model.restoreSync(bak) *SyncAPI*

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

### Model.markAddSync() *SyncAPI*

```js
/*
@param void
@return void
*/
var table = new Table([1, 'table', 'sample']);
table.markAddSync();

dataPool.set('table', 1);
dataPool.sync(); // this will add a HASH to redis, key: 't1', field: ['0', '1', '2'], value: ['1', 'table', 'sample']
```

### Model.markDelSync() *SyncAPI*
PRIVATE API FOR DataPool

## 3、List.js

### new List(pk[, list])

```js
/*
@param number pk
@param object || undefined list
@return instance
*/
var tableList1 = new TableList(1);

// or

var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([2, 'item', 'sample']);

var tableList2 = new TableList(2, { 1: table1, 2: table2});
```

### List.setPK(pk)

```js
/*
@param number pk
@return void
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([2, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 2: table2});

tableList.setPK(2);
tableList.getPK(); // 2
```

### List.getPK()

```js
/*
@param void
@return number
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([2, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 2: table2});

tableList.setPK(2);
tableList.getPK(); // 2
```

### List.reset([list])

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

### List.add(child)

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

### List.del(input)

```js
/*
@param number || object input
@return void
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([2, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 2: table2 });

tableList.del(table2);
tableList.del(1);
// table1 table2 won't delete from tableList.list, it appears in toDelList
```

### List.update(child)

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

### List.get(pk)

```js
/*
@param number pk 
@return object
*/
var table1 = new Table([1, 'user', 'sample']);
var table2 = new Table([2, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 2: table2 });

TableList.get(1); // table1
```

### List.set(child)

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

### List.unset(input)

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

### List.getKeys()

```js
/*
@param void
@return array
*/
var table1 = new Table([1, 'user', 'sample']);
var table3 = new Table([3, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1 });

tableList.getKeys(); // [1, 3];
// you can use this API chain to forEach: tableList.getKeys().forEach(function() { something });
```

### List.getList()

```js
/*
@param void
@return object
*/
var table1 = new Table([1, 'user', 'sample']);
var table3 = new Table([3, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 3: table3 });

tableList.getList(); // {1: table1, 3: table3 };
```

### List.toAbbArray([filterOn])

```js
/*
@param boolean || undefined filterOn
@return object
*/
var table1 = new Table([1, 'user', 'sample']);
var table3 = new Table([3, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 3: table3 });

tableList.toAbbArray(); // {1: { i: 1, n: 'user', d: 'sample' }, 3: { i: 3, n: 'item', d: 'sample' }};

// orm.js: toAbbFilter: [2],
tableList.toAbbArray(true); // {1: { i: 1, n: 'user'}, 3: { i: 3, n: 'item'}};
```

### List.toArray([filterOn])

```js
/*
@param boolean || undefined filterOn
@return object
*/
var table1 = new Table([1, 'user', 'sample']);
var table3 = new Table([3, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 3: table3 });

tableList.toArray(); // {1: { id: 1, name: 'user', description: 'sample' }, 3: { id: 3, name: 'item', description: 'sample' }};

// orm.js: toArrayFilter: [2],
tableList.toArray(true); // {1: { id: 1, name: 'user' }, 3: { id: 3, name: 'item' }};
```

### List.fromAbbArray(data[, resetUpdateList])

```js
/*
@param object data
@param boolean || undefined resetUpdateList
@return object
*/
var tableList = new TableList(1);
var data = { 1: { i: 1, n: 'user', d: 'sample' }, 3: { i: 3, n: 'item', d: 'sample' } };
tableList.fromAbbArray(data);

// or
tableList.fromAbbArray(data, true);
```

### List.fromArray(data[, resetUpdateList])

```js
/*
@param object data
@param boolean || undefined resetUpdateList
@return object
*/
var tableList = new TableList(1);
var data = { 1: { id: 1, name: 'user', description: 'sample' }, 3: { id: 3, name: 'item', description: 'sample' } };
tableList.fromArray(data);

// or
tableList.fromArray(data, true);
```

### List.last()

```js
/*
@param void
@return void
*/
var table1 = new Table([1, 'user', 'sample']);
var table3 = new Table([3, 'item', 'sample']);
var table10 = new Table([10, 'last', 'sample']);
var tableList = new TableList(1, { 1: table1, 3: table3, 10: table10 });

var lastTable = tableList.last(); // table10
```

### List.backup()

```js
/*
@param void
@return object
*/
var table1 = new Table([1, 'user', 'sample']);
var table3 = new Table([3, 'item', 'sample']);
var tableList = new TableList(1, { 1: table1, 3: table3 });

tableList.backup(); // { type: 'List', className: 'TableList', pk: 1, data: {1: { i: 1, n: 'user', d: 'sample' }, 3: { i: 3, n: 'item', d: 'sample' }} };
```

### List.restore(bak)

```js
/*
@param object bak
@return void
*/
var tableList = new TableList(1);
var bak = { type: 'List', className: 'TableList', pk: 1, data: {1: { i: 1, n: 'user', d: 'sample' }, 3: { i: 3, n: 'item', d: 'sample' } } };
tableList.restore(bak);
```

### List.restoreSync(bak)

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

### List.addSync(child) *SyncAPI*

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

### List.delSync(input) *SyncAPI*

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

### List.updateSync(child) *SyncAPI*

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

### List.markDelSync() *SyncAPI*
PRIVATE API FOR DataPool

## 4、PKStore.js

### PKStore.get(cb)

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

### PKStore.set(pk[, cb])

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

### PKStore.unset(pk[, cb])

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

### PKStore.sync() *SyncAPI*
PRIVATE API FOR DataPool

## 5、ModelStore.js

### ModelStore.get(pk, cb)

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

### ModelStore.add(model[, cb])

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

### ModelStore.del(input[, cb])

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

// also can
var table = new Table([1, 'name', 'description']);
TableStore.del(table, function(err, redisResult) {
    if (err) {
        // something
        return;
    }

    // something with redisResult
});
// both will remove a HASH from redis, key: 't-1'
```

### ModelStore.update(model[, cb])

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
// this will update a HASH field to redis, key: 't-1', field: '1', value: 'nameChanged'
```

### ModelStore.sync() *SyncAPI*
PRIVATE API FOR DataPool

## 6、ListStore.js

### ListStore.get(pk, cb)

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

### ListStore.del(list[, cb])

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

// this will del 'tl-1', 't1', 't3' from redis and make a empty TableList instance
```

### ListStore.update(list[, cb])

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
    tableList.update(table3);

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

### ListStore.sync() *SyncAPI*
PRIVATE API FOR DataPool

# View层概述及运行机理

### Server端View层
就Server来看，view层可以忽略不计，多数情况只需JSON.stringify即可满足需求。虽然I Framework的服务端中包含Jade模板引擎，但还是强烈建议服务端只处理数据，渲染交给客户端来执行。

### Client端View层
Client端，由于view层千变万化，因此没做任何封装。渲染HTML可以直接使用Renderer.js。该类将Jade进行了一层封装，会将模板进行缓存，提高运行效率。以下是个简单的Sample

Index.jade
```jade
h2 Wendy
p #{text}
```

IndexView.js
```js
var IndexView = function IndexView() {
    this.renderAll = renderAll(text) {
        var html = Renender.make('Index'/* means get Index.jade */, { text: 'Welcome to the United States of America, have a nice day' });
        $('body').empty().html(html);
    };
};
```

main.js
```js
$(function() {
    var indexView = new IndexView();
    indexView.renderAll();
});
```

更详尽的使用范例可以参考：[PCS](https://github.com/himulawang/pcs)

# Controller层概述及运行机理

### Server端Controller层
通过配置routes.js来完成

```js
C0001: {
    ctrl: 'Table',
    action: 'Update'
    param: {
        id: 'ni',
        name: 'ns',
        description: 'ns',
    },              
},                  
```

* ctrl: 控制器名，会根据该名称寻找Controller文件，如上述配置就会自动寻找TableController.js
* action: 动作名，会根据该名字寻找Controller文件下的方法，上述配置会自动寻找Update方法
* param: 传入参数，由两个字母组成，前一个字母为m e n标识存在与否，后一个字母i s h a标识类型
  * m: Miss参数允许不存在
  * e: Empty参数允许为空字符串
  * n: NotEmpty参数不允许为空字符串
  * i: Int参数为数字
  * s: String参数为数字
  * h: Hash参数为哈希数组如：{ name: 'time', description: 'sample' }
  * a: Array参数为数组如：[0, 1, 3, 9];

以Websocket为范例Server Controller如下：

```js
var WebSocketServer = require('websocket').server;
var routes = require('./config/routes.js').routes;

var ws = new WebSocketServer({
    httpServer: server,
});
var Route = new I.Route(routes);

global.connectionPool = new I.ConnectionPool();
ws.on('request', function(req) {
    var connection = req.accept('i', req.origin);
    connectionPool.push(connection);

    console.log(connection.remoteAddress + " connected - Protocol Version " + connection.webSocketVersion);

    connection.on('close', function(reasonCode, description) {
        console.log(reasonCode, description);
        connectionPool.remove(connection);
    });

    connection.on('message', function(message) {
        var start = process.hrtime();

        if (message.type === 'binary') return;
        var req = JSON.parse(message.utf8Data);

        try {
            Route.process(connection, req);
        } catch (e) {
            console.log('Error', e);
        }
    });
});
```

Route.process(connection, req);会先检查传入参数，通过后自动找到对应Controller下的方法并执行。

### Client端Controller层

通过route.js来完成

```js
C0001: {
    ctrl: 'Table',
    action: 'Update'         
},                  
```

Client端的routes.js没有param参数，服务端传回数据默认为可信，没必要验证。

WebSocket.js会将传回信息自动解析并执行对应Controller下的方法。

注：按照上述配置，TableController下的onUpdate方法会被执行。

## TODO

1. Doc Exception
2. Doc Util
3. Doc LogicController

## Acknowledgement

- node.js: http://nodejs.org/
- Redis: http://redis.io/
- Chrome: https://www.google.com/intl/en/chrome/browser/
- node.js lib
    - express: https://github.com/visionmedia/express
    - hiredis: https://github.com/redis/hiredis
    - node_redis: https://github.com/mranney/node_redis
    - WebSocket-Node: https://github.com/Worlize/WebSocket-Node
- bootstrap: https://github.com/twitter/bootstrap
- jquery: http://jquery.com/
- jade: https://github.com/visionmedia/jade
