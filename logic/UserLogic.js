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
            user = result;
            syn.emit('one');
        });
    });

    // 2. add building
    var building;
    syn.add(function() {
        var newBuilding = new Building();
        var nowTimestamp = IUtil.getTimestamp();
        newBuilding.userId = user.userId;
        newBuilding.castleNextHarvestMoneyTime = nowTimestamp;
        newBuilding.castleHarvestBonus = 0;
        newBuilding.cardNextRecruit1Time = nowTimestamp;
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
            building = result;
            syn.emit('one');
        });
    });

    // 3. return output
    syn.on('final', function() {
        var output = {
            u: user.toClient(),
            b: building.toClient(),
        };
        cb(output);
    });

    return syn;
};

exports.UserLogic = new UserLogic();
