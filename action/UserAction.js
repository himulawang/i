var UserAction = function() {};

UserAction.prototype.i999 = function i999(syn, params, cb) {
    return UserLogic.signUp(syn, params, cb);
};

/*
UserAction.prototype.i1001 = function i1001(params) {
    return resData = UserLogic.login(params);
};
*/

var userAction = new UserAction();

global.UserAction = userAction;
