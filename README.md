I - Pure Node.js + Redis high performance MVC framework
===========================
directory structure:
app/action/
app/config/ctrl.js ex.js orm.js
app/const/
app/data/
app/logic/
app/model/ --auto generate
app/node_modules/i/
## Install
copy ./i to app/node_modules
## Use
```js
    require('i').init();
```
## Model
orm.js
```js
{
    name: 'Card',           // object name
    abb: 'c',               // abbreviation for redis hash name
    column: [               // column to create object file, column index is hash field in redis
        'cardId',
        'cardTypeId',
        'level',
        'exp',
        'hp',
        'atk',
        'def',
        'status',
    ],
    updateFilter: [0],      // not update this column when update
    clientFilter: [7],      // not convert this column when execute toClient
    pk: 'cardId',           // primary key
    pkAutoIncrement: true,  // if this true, I will set a global key in redis like: I-GK-c to count an unique key
    list: 'CardList',       // if this is not null, I will generate list file
}
```
When orm.js is set,
First I will auto generate class `CardBase`, `CardListBase`, `CardBaseModel`, `CardListBaseModel`on server start in memory. These classes are middle classes.
`CardBase` contains getter and setter.
`CardListBase` contains function add / del / update / get / getKeys / toClient
`CardBaseModel` contains function retrieve / add / del / update
`CardListBaseModel` contains function retrieve / del / update
Second create `Card.js`, `CardList.js`, `CardModel.js`, `CardListModel.js` into app/model. These files extends middle classes and let programmer rewrite and custom special functions. If model .js file exists, I will skip creating them.

