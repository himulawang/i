var UserLogic = function() {};

UserLogic.prototype.signUp = function signUp(syn, params, cb) {
    // 1. add user
    var user;
    syn.add(function() {
        var newUser = new User();
        var nowTimestamp = IUtil.getTimestamp();
        newUser.level = 1;
        newUser.exp = 0;
        newUser.money = 100000;
        newUser.energy = 50;
        newUser.energyLimit = 50;
        newUser.lastEnergyChargedTime = nowTimestamp;
        newUser.lastLoginTime = nowTimestamp;
        newUser.honor = 0;
        newUser.dailyVisitedFriends = 0;
        newUser.lastResetDailyVisitedFriendsTime = nowTimestamp;
        newUser.side = 0;
        newUser.kingHeartLevel = 0;
        newUser.kingHeartAppearance = 0;
        newUser.loginCount = 0;

        UserModel.add(newUser, function(result) {
            var user = result;
            syn.emit('one', user.toClient());
        });
    }, null);

    // 2. add building
    var building;
    syn.add(function() {
        var newBuilding = new Building();
        var nowTimestamp = IUtil.getTimestamp();
        newBuilding.userId = user.userId;
        newBuilding.castleNextHarvestMoneyTime = nowTimestamp;
        newBuilding.castleHarvestBonus = 0;
        newBuilding.castleNextRecruit1Time = nowTimestamp;
        newBuilding.cardDailyRecruit1Time = nowTimestamp;
        newBuilding.cardDailyRecruit1Count = 0;
        newBuilding.cardLastResetDailyRecruit1CountTime = nowTimestamp;
        newBuilding.cardNextRecruit2Time = nowTimestamp;
        newBuilding.cardNextRecruit3Time = nowTimestamp;
        newBuilding.cardNextRecruit4Time = nowTimestamp;
        newBuilding.barrackFormation1 = '[0,0,0,0,0,0,0,0,0]';
        newBuilding.barrackFormation2 = '[0,0,0,0,0,0,0,0,0]';
        newBuilding.barrackFormation3 = '[0,0,0,0,0,0,0,0,0]';
        newBuilding.barrackActiveFormationId = 1;

        BuildingModel.add(newBuilding, function(result) {
            var building = result;
            syn.emit('one', building.toClinet());
        });
    }, null);

    // 2. return user
    syn.on('final', function(data) {
        cb(data);
    });

    return syn;
};

var userLogic = new UserLogic();

global.UserLogic = userLogic;
