/* This file is generated by deploy.js automatically */
var CardModel = function CardModel() {
    this.type = 'hash';
    this.objectName = 'Card';
    this.abb = 'c';
    this.pk = 'cardId';
    this.updateFilter = [0];
};

CardModel.prototype = new IModel();
CardModel.prototype.constructor = CardModel;

global.CardModel = new CardModel();
