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

    // controller
    10301: 'Invalid request.',
    10302: 'Wrong parameter type length of controller config.',
    10303: 'Parameter cannot be empty.',
    10304: 'Wrong parameter allow type.',
    10305: 'Parameter is not int.',
    10306: 'Parameter is not string.',
    10307: 'Parameter is not array.',
    10308: 'Parameter is not hash map.',
    10309: 'Wrong parameter data type.',
};
var IException = function IException(code, err) {
    if (err) console.log(err);
    throw new Error(code);
};

global.IException = IException;
