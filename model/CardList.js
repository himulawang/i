/* This file is generated by deploy.js automatically */
var CardList = function CardList(pk, index, list) {
    IList.call(this, pk, index, list);
};

CardList.prototype = new IList();
CardList.prototype.constructor = CardList;

CardList.prototype.deleteCandidateCard = function() {
    var card;
    for (var i in this.list) {
        card = this.list[i];
        if (card.status == PvzkConst.CARD_STATUS_CANDIDATE) {
            this.del(card);
        }
    }
};

global.CardList = CardList;
