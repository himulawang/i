var CardMarketAction = function() {};

CardMarketAction.prototype.i3002 = function i3002(syn, params, cb) {
    return CardMarketLogic.refreshCard(syn, params, cb);
};

exports.CardMarketAction = new CardMarketAction();
