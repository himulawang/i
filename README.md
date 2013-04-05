ParaNoidz I Framework
===

基于纯Javascript平台的MVC框架，为效率而生。

## Model层

### 配置
Model主要有orm.js配置生成

```js
{                         
    name: 'Table',        
    abb: 't',             
    column: [             
        'id',             
        'name',           
        'description',    
    ],                    
    toAddFilter: [],      
    toUpdateFilter: [0],  
    toAbbFilter: [],      
    toArrayFilter: [],    
    pk: 'id',             
    pkAutoIncrement: true,
    list: 'TableList',    
},                        
```

* name: Model名，server启动会根据name生成对应Model文件
* abb: 缩写，用于存入Redis减少空间占用
* column: 该Model所含属性
* toAddFilter: 当该Model被调用toAdd方法时，过滤掉的字段标识，使用key来表识。适用场景，当Model在服务端运行时有id、name、description三个参数，但存入Redis只需id和name，则可以填2，将description过滤掉。
* toUpdateFilter: 当该Model被调用toUpdate方法时，过滤掉的字段标识。作用同上。
* toAbbFilter: 当该Model被调用toAbb、toAbbDiff方法时，过滤掉的字段标识。作用同上。
* toArrayFilter: 当该Model被调用toArray、toArrayDiff方法时，过滤掉的字段标识。作用同上。
* pk: 主键，如Model有List，必须有用该属性。
* pkAutoIncrement: pk需要自增时，置为true，框架会自动将新增元素分配该List全局唯一Id作为pk
* list: List名，server启动会根据name生成对应List文件

### 自动生成
orm.js配置完，重启server，框架会根据配置自动生成如下Model文件

* TablePK.js
* TablePKStore.js
* Table.js
* TableStore.js
* TableList.js
* TableListStore.js

### 继承顺序

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

由于Base层根据不同模型有所区别，但服务一旦开启不会变更，因此想到使用Javascript动态生成类功能，该功能是这门语言非常强悍的地方。

Store结尾的类文件用于和Redis进行交互，3类模型文件转化为Redis指令进行存取。

# API
注：模型API分两种，异步模式和同步模式。

区别在于：

异步模式将数据完全放于Redis中，当有需要才去获取，因此需要大量Callback回调，好处是服务端不会占用过多内存，坏处是Callback式服务端编程会让代码变得复杂。

同步模式将Redis中的数据完全存入服务端中，定时向Redis更新差量数据，好处是不会频繁调用Redis，程序执行效率最高，存取数据为同步进行，没有Callback链，代码易读，坏处是会消耗较大内存，在Redis数据过大时，不建议使用。

以下有*SyncAPI*标识的为同步模式API。

## PK.js

### new(pk)

```js
/*
@param number || undefined pk val start from 0
@return void
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

### .incr(val)

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

```js
/*
@param void
@return void
*/
var pk = dataPool.get('tablePK', 1);
pk.markDelSync();

dataPool.sync(); // remove this pk from redis
```

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



