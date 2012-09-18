var CardLogic = function() {};

CardLogic.prototype.makeCard = function makeCard(cardTypeId, quality, cardLevel) {
    var card = new Card([
        null,                                       // cardId        
        cardTypeId,                                 // cardTypeId
        cardLevel,                                  // cardLevel
        0,                                          // exp
        0,                                          // strengthenLevel
        0,                                          // strengthenExp
        0,                                          // hp
        0,                                          // atk
        0,                                          // def
        0,                                          // hit
        0,                                          // dodge
        0,                                          // critical
        0,                                          // tough
        0,                                          // initAnger
        quality,                                    // quality
        PvzkConst.CARD_FLAG_NEW,                    // flag
        PvzkConst.CARD_STATUS_CANDIDATE,            // status
        PvzkConst.CARD_TODO_STATUS_DONOTHING,       // todoStatus
        '[0,0,0,0,0,0]'                             // gemSlot
    ]);

    card = this.recalculateCardAttribute(card);
    return card;
};

CardLogic.prototype.recalculateCardAttribute = function recalculateCardAttribute(card) {
    var level = card.level;
    var quality = card.quality;

    var cardConfig = DCard[card.cardTypeId];
    var globalConfig = DGlobal;
    if (!cardConfig) throw new IException(20600);

    // hp
    var baseHp = cardConfig.init_hp * (1 + globalConfig['cardQuality' + quality + 'HpFactor']['paramValue'] / 10000);
    var levelHp = baseHp * (1 + (level - 1) * cardConfig.base_grow_hp / 10000);

    // atk
    var baseAtk = cardConfig.init_atk * (1 + globalConfig['cardQuality' + quality + 'AtkFactor']['paramValue'] / 10000);
    var levelAtk = baseAtk * (1 + (level - 1) * cardConfig.base_grow_atk / 10000);

    // def
    var baseDef = cardConfig.init_def * (1 + globalConfig['cardQuality' + quality + 'DefFactor']['paramValue'] / 10000);
    var levelDef = baseDef * (1 + (level - 1) * cardConfig.base_grow_def / 10000);

    // add all
    var hp = Math.round(levelHp);
    var atk = Math.round(levelAtk);
    var def = Math.round(levelDef);
    var hit = cardConfig.init_hit;
    var dodge = cardConfig.init_dodge;
    var critical = cardConfig.init_critical;
    var tough = cardConfig.init_tough;

    card.hp = hp;
    card.atk = atk;
    card.def = def;
    card.hit = hit;
    card.dodge = dodge;
    card.critical = critical;
    card.tough = tough;
    card.initAnger = 50;

    return card;
};

exports.CardLogic = new CardLogic();
