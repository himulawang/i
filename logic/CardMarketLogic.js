var CardMarketLogic = function() {};

CardMarketLogic.prototype.refreshCard = function refreshCard(syn, params, cb) {
    // verify params
    this.verifyRecruitTypeId(params.recruitTypeId);
    this.verifyRecruitUseItemId(params.useItemId);

    // 1. retrieve user
    var user, level;
    syn.add(function(params) {
        UserModel.retrieve(params.userId, function(result) {
            user = result;
            level = user.level;
            syn.emit('one', null);
        });
    }, params);

    // 2. retrieve cardList
    var cardList;
    syn.add(function(params) {
        CardListModel.retrieve(params.userId, function(result) {
            cardList = result;
            syn.emit('one', null);
        });
    }, params);

    // 3. retrieve building
    var building;
    syn.add(function(params) {
        BuildingModel.retrieve(params.userId, function(result) {
            building = result;
            syn.emit('one', null);
        });
    }, params);

    var util = IUtil;
    // 4. delete candidate card & add new candidate cards
    syn.add(function(params) {
        // delete candidate cards
        cardList.deleteCandidateCard();

        // get packageId
        var packageId = null;
        var config;
        for (var i in LevelRecruitPackage) {
            config = LevelRecruitPackage[i];
            if (level >= config.bottom_level &&
                level <= config.top_level &&
                params.recruitTypeId == config.recruit_type_id
            ) {
                packageId = config.recruit_drop_package_id;
                break;
            }
        }
        if (packageId === null) {
            throw new IException(20206);
        }

        // random card
        var poolList = CardDropPackage[packageId];
        var probabilityList = {};

        // make probability list
        for (var i in poolList) {
            probabilityList[i] = poolList[i].probability;
        }

        var id, cardTypeId, quality;
        for (var c = 0; c < 3; ++c) {
            id = util.getElementByProbability(probabilityList);
            cardTypeId = poolList[id].card_type_id;
            quality = poolList[id].quality;

            card = CardLogic.makeCard(cardTypeId, quality, 1);
            cardList.add(card);
        }
        syn.emit('one', null);
    }, params);

    // 5. update
    syn.add(function(params) {
        CardListModel.update(cardList, function(result) {
            cardList = result;
            syn.emit('one', cardList.toClient());
        });
    }, params);

    // 2. return user
    syn.on('final', function(data) {
        cb(data);
    });

    return syn;
};

CardMarketLogic.prototype.verifyRecruitTypeId = function(recruitTypeId) {
    if (
        recruitTypeId != PvzkConst.CARD_MARKET_RECRUIT_NORMAL_REFRESH_TYPE_ID &&
        recruitTypeId != PvzkConst.CARD_MARKET_RECRUIT_SILVER_REFRESH_TYPE_ID &&
        recruitTypeId != PvzkConst.CARD_MARKET_RECRUIT_GOLD_REFRESH_TYPE_ID &&
        recruitTypeId != PvzkConst.CARD_MARKET_RECRUIT_PLATINUM_REFRESH_TYPE_ID
    ) throw new IException(20209);
};

CardMarketLogic.prototype.verifyRecruitUseItemId = function(useItemId) {
    if (
        useItemId != PvzkConst.CARD_MARKET_RECRUIT_NOT_USE_ITEM &&
        useItemId != PvzkConst.CARD_MARKET_RECRUIT_USE_NORMAL_ITEM &&
        useItemId != PvzkConst.CARD_MARKET_RECRUIT_USE_SILVER_ITEM &&
        useItemId != PvzkConst.CARD_MARKET_RECRUIT_USE_GOLD_ITEM &&
        useItemId != PvzkConst.CARD_MARKET_RECRUIT_USE_PLATINUM_ITEM
    ) throw new IException(20210);
};

var cardMarketLogic = new CardMarketLogic();

global.CardMarketLogic = cardMarketLogic;
