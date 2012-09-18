var UserAction = function() {};

UserAction.prototype.i999 = function i999(syn, params, cb) {
    return UserLogic.signUp(syn, params, cb);
};

exports.UserAction = new UserAction();
