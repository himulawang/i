var EventClass = function() {
    this.init();
};
EventClass.prototype.init = function() {
    this.bindEventToGroundSize();
    this.bindEventGameStart();
};
EventClass.prototype.bindEventToGroundSize = function() {
    var select = document.getElementById('jewel-ground-size');
    select.onchange = function() {
        if (!this.value) return false;
        var groundSize = { horizon : this.value, vertical : this.value };
        JEWEL.setGroundSize(groundSize);
    };
};
EventClass.prototype.bindEventGameStart = function() {
    var button = document.getElementById('jewel-start-game');
    button.onclick = function() {
        JEWEL.startGame();
    };
};
EventClass.prototype.bindEventGemMove = function() {
    var gems = document.getElementsByClassName('jewel-gems');

    for (var x in gems) {
        gems[x].onclick = function() {
            JEWEL.moveJewel(this.coordinate, this);
        }
    }
};
