!function () {
    var ExceptionCodes = {
        /* Server */
        // loader
        10001: 'Invalid object type when making classes.',
        10002: 'Model abb exists when making classes.',
        
        // model
        10101: 'Wrong child add to list.',
        10102: 'Invalid model name.',
        10103: 'Error when retrieve data from db.',
        10104: 'Error when get global key from db.',
        10105: 'Cannot set empty hash to db.',
        10106: 'Wrong child update to list.',
        10107: 'Error when retrieve list from db.',
        10108: 'Wrong list to del.',
        10109: 'Wrong pk set to db.',
        10110: 'Error when del model from db.',
        10111: 'Error when add hash to db.',
        10112: 'Invalid child for list when remove object.',
        10113: 'Invalid pk for list when get object index.',
        10114: 'Invalid child for list when del object.',
        10115: 'Invalid child for list when update object.',
        10116: 'Error when del list from db.',
        10117: 'Error when update list from db.',
        10118: 'Init list must set pk.',
        10119: 'Error when update hash to db.',
        10120: 'Child addSync to list, child has no pk.',
        10121: 'Wrong pk unset to db.',
        10122: 'Error when set pk to db.',
        10123: 'Error when updateSync list to db.',
        10124: 'Error when unset pk to db.',
        10125: 'Error when get pk from db.',
        10126: 'Invalid model when del model from db.',
        10127: 'Invalid child model when add model to list.',
        10128: 'Invalid child model when del model to list.',
        10129: 'Child not exists in this list when del it.',
        10130: 'Invalid child model when update model to list.',
        10131: 'Child not exists in this list when update it.',
        10132: 'Child has no pk when set it into list.',
        10133: 'Child has no pk when unset it from list.',
        10134: 'Pk is not UInt when setPK to list.',
        10135: 'Invalid child model when addSync model to list.',
        10136: 'Invalid child model when delSync model from list.',
        10137: 'Child not exists in this list when delSync it.',
        10136: 'Invalid child model when updateSync model from list.',
        10137: 'Child not exists in this list when updateSync it.',
        10138: 'Invalid list model when update list to db.',
        10139: 'Invalid child model when updateSync to list.',
        10140: 'Child exists when add to list.',
        10141: 'Child exists when addSync to list.',
        10142: 'Invalid list model when updateSync list to db.',

        // util
        10201: 'Invalid object when get length.',
        10202: 'Invalid object when get last element.',
        10203: 'Invalid hash when get element by probabilityList.',
        10204: 'Invalid empty probabilityList when get element by probabilityList.',
        10205: 'Cannot get any element when get element by probabilityList.',
        10206: 'Invalid object when test value exist.',
        10207: 'Invalid object when get last index.',
        10208: 'Invalid object when unique.',
        10209: 'Invalid object when max.',
        10210: 'Invalid object when min.',
        10211: 'Key conflict when merge object.',

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

        // logic controller
        10401: 'LogicController: logic function not exporter all values that needed.',

        /* Client */
        // model
        20001: 'Wrong pk set to IndexedDB.',
        20002: 'Wrong pk unset to IndexedDB.',
        20003: 'Wrong model set to IndexedDB.',
        20004: 'Wrong input unset to IndexedDB.',
        20005: 'Wrong list update to IndexedDB.',
        20006: 'Wrong list del to IndexedDB.',
        20007: 'Wrong list updateSync to IndexedDB.',
    };

    I.Util.require('ExceptionCodes', '', ExceptionCodes);
}();
