global.IExceptionCodes = {
    // deploy
    10001: 'Invalid object type when deploying.',
    
    // model
    10101: 'Invalid object type when retrieve object.',
    10102: 'Invalid model name.',
    10103: 'Error when retrieve data from db.',
    10104: 'Error when get global key from db.',
    10105: 'Cannot hash mutiple set empty object to db.',
    10106: 'Invalid object type when update object.',
    10107: 'Error when retrieve list from db.',
    10108: 'List cannot call create function.',
    10109: 'Invalid object type when remove object.',
    10110: 'Error when del data from db.',
    10111: 'Invalid pk for list when get object.',
    10112: 'Invalid child for list when remove object.',
    10113: 'Invalid pk for list when get object index.',
    10114: 'Invalid child for list when del object.',
    10115: 'Invalid child for list when update object.',
    10116: 'Error when del list from db.',
    10117: 'Error when update list from db.',

    // util
    10201: 'Invalid object when get length.',
    10202: 'Invalid object when get last element.',

    // util time
    10251: 'Invalid time to convert to timestamp.',
};
var IException = function IException(code, err) {
    if (err) console.log(err);
    Error.call(this, code, IExceptionCodes[code]);
};

IException.prototype = new Error();
IException.prototype.constructor = IException;

global.IException = IException;
