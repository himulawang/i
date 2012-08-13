var UserLogic = function() {};

UserLogic.prototype.signUp = function signUp(params, cb) {
    var user = new User();
    var nowTimestamp = IUtil.getTimestamp();
    user.level = 1;
    user.exp = 0;
    user.money = 100000;
    user.energy = 50;
    user.energyLimit = 50;
    user.lastEnergyChargedTime = nowTimestamp;
    user.lastLoginTime = nowTimestamp;
    user.honor = 0;
    user.dailyVisitedFriends = 0;
    user.lastResetDailyVisitedFriendsTime = nowTimestamp;
    user.side = 0;
    user.kingHeartLevel = 0;
    user.kingHeartAppearance = 0;
    user.loginCount = 0;

    UserModel.add(user, function(user) {
        cb(user);
    });
};

var userLogic = new UserLogic();

global.UserLogic = userLogic;
