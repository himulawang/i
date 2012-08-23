var CardMarketAction = function() {};

CardMarketAction.prototype.i3002 = function i3002(syn, params, cb) {
    return CardMarketLogic.refreshCard(syn, params, cb);
};

var cardMarketAction = new CardMarketAction();

global.CardMarketAction = cardMarketAction;
