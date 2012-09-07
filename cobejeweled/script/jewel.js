var JewelClass = function() {
    this.init();
};
JewelClass.prototype.init = function() {
    this.jewels = {};
    this.setJewelType();
    this.defaultSettings();
};
JewelClass.prototype.defaultSettings = function() {
    // default settings without confirm
    this.setJewelContainer('jewel-battle-ground');
    this.initGroundSize = { horizon : 8, vertical : 8 };
    this.setGroundSize(this.initGroundSize);
    this.initJewelVolume = { width : 50, height: 50 };
    this.setJewelVolume(this.initJewelVolume);
    this.initJewelMargin = { marginLeft : 5, marginBottom : 5 };
    this.setJewelMargin(this.initJewelMargin);
    this.setJewelGemBorder();
    this.resetMovingGems();
    this.resetCheckGems();
    this.resetEliminateChains();
    this.resetToEliminates();
    this.resetLatestGem();
};
JewelClass.prototype.resetLatestGem = function() {
    this.latestGem = undefined;
};
JewelClass.prototype.resetEliminateChains = function() {
    this.eliminateChains = [];
};
JewelClass.prototype.resetToEliminates = function() {
    this.toEliminate = [];
};
JewelClass.prototype.resetCheckGems = function() {
    this.changedGems = [];
    this.gemsToCheck = [];
};
JewelClass.prototype.resetMovingGems = function() {
    this.gemI = undefined;
    this.gemII = undefined;
};
JewelClass.prototype.setJewelGemBorder = function() {
    this.jewelBorder = 1;
};
JewelClass.prototype.setJewelType = function() {
    this.jewelType = {
        diamond : '#EFEFEF',
        sapphire : '#0072E3',
        emerald : '#00DB00',
        ruby : '#FF0000',
        obsidian : '#3C3C3C',
        topaz : '#F9F900'
    };
    this.jewelTypeMapping = [ 'diamond', 'sapphire', 'emerald', 'ruby', 'obsidian', 'topaz' ];
};
JewelClass.prototype.setGroundSize = function(param) {
    this.sizeHorizon = param.horizon;
    this.sizeVertical = param.vertical;
};
JewelClass.prototype.setJewelContainer = function(elementID) {
    this.container = document.getElementById(elementID);
};
JewelClass.prototype.resizeContainer = function() {
    var width = this.sizeHorizon * (this.jewelVolumeWidth + this.jewelMarginLeft + this.jewelBorder) + this.jewelMarginLeft;
    var height = this.sizeVertical * (this.jewelVolumeHeight + this.jewelMarginBottom + this.jewelBorder) + this.jewelMarginLeft;
    this.container.style.width = width + 'px';
    this.container.style.height = height + 'px';
};
JewelClass.prototype.setJewelVolume = function(param) {
    this.jewelVolumeWidth = param.width;
    this.jewelVolumeHeight = param.height;
};
JewelClass.prototype.setJewelMargin = function(param) {
    this.jewelMarginLeft = param.marginLeft;
    this.jewelMarginBottom = param.marginBottom;
};
JewelClass.prototype.randomJewel = function() {
    // random function for ramdom gems
    var random;
    while (true) {
        random = Math.random() * 10;
        if (random < 6) break;
    };
    return Math.floor(random);
};
JewelClass.prototype.generatGround = function() {
    // initialize the play ground through settings
    var index;
    for (var x = 0; x < this.sizeHorizon; ++x) {
        for (var y = 0; y < this.sizeVertical; ++y) {
            index = x + ',' + y;
            this.jewels[index] = this.randomJewel();
            this.generateGem(index);
        }
    }
};
JewelClass.prototype.generateGem = function(index) {
    // front function for generate a gem
    var gem = document.createElement('div');
    var coordinate = index.split(',');
    var coordX = coordinate[0];
    var coordY = coordinate[1];
    gem.id = index;
    gem.className = 'jewel-gems ' + this.jewelTypeMapping[this.jewels[index]];
    gem.coordinate = index;
    gem.style.position = 'absolute';
    gem.style.bottom = coordY * (this.jewelVolumeWidth + this.jewelMarginBottom + this.jewelBorder) + this.jewelMarginBottom + 'px';
    gem.style.left = coordX * (this.jewelVolumeHeight + this.jewelMarginLeft + this.jewelBorder) + this.jewelMarginLeft + 'px';
    gem.style.background = this.jewelType[this.jewelTypeMapping[this.jewels[index]]];
    gem.style.width = this.jewelVolumeWidth + 'px';
    gem.style.height = this.jewelVolumeHeight + 'px';
    gem.innerHTML = index;
    this.container.appendChild(gem);
};
JewelClass.prototype.startGame = function() {
    // front function for start game event process
    this.resizeContainer();
    this.clearGround();
    this.generatGround();
    this.tillNoMoreEliminate();
    // reset gem position through this.jewels object, IMPORTANT!
    this.resetGemPosition();
    EVENT.bindEventGemMove();
};
JewelClass.prototype.clearGround = function() {
    $(this.container).empty();
};
JewelClass.prototype.gemSelected = function(gem) {
    $(gem).addClass('selected');
};
JewelClass.prototype.gemUnselected = function() {
    $('.jewel-gems').removeClass('selected');
};
JewelClass.prototype.moveJewel = function(coordinate, gem) {
    // entrance for moving event
    if (this.gemI == undefined) {
        this.gemI = coordinate;
        this.gemSelected(gem);
    } else if (this.gemII == undefined) {
        this.gemII = coordinate;
        this.gemSelected(gem);
        // moving could be done or not, TODO catch or message part
        this.doMoving();
        this.resetMovingGems();
        this.gemUnselected();
    }
};
JewelClass.prototype.doMoving = function() {
    // moving cound not be done, return false to inform the program (front)
    if (this.weAreNeibor() == false) {
        this.resetMovingGems();
        return false;
    }
    // moving cound be done, return true and do the moving process, then eliminate them TODO
    this.switchPlace();
    if (!this.process()) {
        this.switchPlace();
        return false;
    }
    return true;
};
JewelClass.prototype.weAreNeibor = function() {
    var gemI = this.gemI.split(',');
    var gemII = this.gemII.split(',');
    if ( (Math.abs(gemI[0] - gemII[0]) == 1 && Math.abs(gemI[1] - gemII[1]) == 0) 
            || (Math.abs(gemI[1] - gemII[1]) == 1 && Math.abs(gemI[0] - gemII[0]) == 0) 
            ) return true;
    return false;
};
JewelClass.prototype.switchPlace = function() {
    console.log(this.gemI, this.gemII);
    var i = this.showMeThisGem(this.gemII);
    var ii = this.showMeThisGem(this.gemI);
    this.jewels[this.gemI] = i;
    this.jewels[this.gemII] = ii;
    this.resetGemPosition();
    this.changedGems.push(this.gemI);
    this.changedGems.push(this.gemII);
};
JewelClass.prototype.resetGemPosition = function() {
    var ele, color;
    for (var x in this.jewels) {
        ele = document.getElementById(x);
        color = this.jewelType[this.jewelTypeMapping[this.jewels[x]]] ? this.jewelType[this.jewelTypeMapping[this.jewels[x]]] : '#000000';
        $(ele).css({ background : color });
    }
};
JewelClass.prototype.showMeThisGem = function(index) {
    return this.jewels[index];
};
JewelClass.prototype.process = function() {
    this.checkRelativeGems();
    this.checkGems();
    if (!this.isMovingTriggerEliminate()) return false;
    this.doEliminate();
    this.doGravityFall();
    this.resetGemPosition();
    this.resetCheckGems();
    this.resetToEliminates();
    this.tillNoMoreEliminate();
    return true;
};
JewelClass.prototype.tillNoMoreEliminate = function() {
    while (true) {
        if (this.anyMore() == false) break;
    }
};
JewelClass.prototype.allGemsRelative = function() {
    // x-axis
    var coordinate;
    for (var x = 0; x < this.sizeHorizon; ++x) {
        for (var y = 0; y < this.sizeVertical; ++y) {
            coordinate = x + ',' + y;
            this.gemsToCheck.push(coordinate);
        }
    }
    // y-axis
    for (var y = 0; y < this.sizeVertical; ++y) {
        for (var x = 0; x < this.sizeHorizon; ++x) {
            coordinate = x + ',' + y;
            this.gemsToCheck.push(coordinate);
        }
    }
};
JewelClass.prototype.anyMore = function() {
    this.allGemsRelative();
    this.checkGems();
    if (!this.isMovingTriggerEliminate()) return false;
    this.doEliminate();
    this.doGravityFall();
    this.resetGemPosition();
    this.resetCheckGems();
    this.resetToEliminates();
    return true;
};
JewelClass.prototype.doEliminate = function() {
    var coordinate;
    console.log(this.toEliminate);
    for (var x in this.toEliminate) {
        coordinate = this.toEliminate[x];
        // do eliminate 3 chain gems
        this.jewels[coordinate] = undefined;
    }
};
JewelClass.prototype.doGravityFall = function() {
    var coordinate, axis, xaxis, yaxis, tmpCoord, aboveCoord, aboveIndex, nogems = {};
    for (var x in this.toEliminate) {
        coordinate = this.toEliminate[x];
        axis = coordinate.split(',');
        xaxis = axis[0];
        yaxis = axis[1];
        if (nogems[xaxis]) {
            nogems[xaxis].push(coordinate);
        } else {
            nogems[xaxis] = [];
            nogems[xaxis].push(coordinate);
        }
    }
    var aboveGem;
    for (var x in nogems) {
        // do gravity fall
        for (var index = 0; index < this.sizeVertical; ++index) {
            tmpCoord = x + ',' + index;
            if (this.jewels[tmpCoord] != undefined) continue;
            aboveIndex = Number(index) + nogems[x].length;
            if (aboveIndex >= this.sizeVertical) {
                this.jewels[tmpCoord] = this.randomJewel();
            } else {
                //aboveCoord = x + ',' + aboveIndex;
                //aboveGem = this.showMeThisGem(aboveCoord);
                this.nearestDefinedAbove(x, index);
            }
        }
    }
};
JewelClass.prototype.nearestDefinedAbove = function(xaxis, yaxis) {
    var tmpY = yaxis, aboveCoord, tmpCoord = xaxis + ',' + yaxis;
    do {
        ++tmpY;
        aboveCoord = xaxis + ',' + tmpY;
        aboveGem = this.showMeThisGem(aboveCoord);
    } while (aboveCoord == undefined && tmpY < this.sizeHorizon);
    if (aboveGem == undefined) {
        this.jewels[tmpCoord] = this.randomJewel();
    } else {
        this.jewels[tmpCoord] = aboveGem;
        this.jewels[aboveCoord] = undefined;
    }
};
JewelClass.prototype.checkGems = function() {
    var coordinate;
    for (var x in this.gemsToCheck) {
        coordinate = this.gemsToCheck[x];
        /*
         *  sizeHorizon === sizeVertical
         *  check single row or column if it is able to eliminate
         *  if row or column changed, reset latest gem to undefined and reset eliminate chain
         */
        if (x % this.sizeHorizon == 0) {
            this.checkEliminateChains();
            this.resetLatestGem();
            this.resetEliminateChains();
        }
        //  if latest gem is undefined, set latest gem as this gem, push gem to eliminate chain and jump out
        if (this.latestGem == undefined) {
            this.latestGem = this.jewels[coordinate];
            this.eliminateChains.push(coordinate);
            continue;
        }
        // if latest gem type equal current gem, push gem to eliminate chain and check next
        // if latest gem type not equal current gem, check eliminate chain is larger than 3 or not
        if (this.latestGem != this.jewels[coordinate]) {
            this.checkEliminateChains();
            this.resetEliminateChains();
            this.latestGem = this.jewels[coordinate];
        }
        this.eliminateChains.push(coordinate);
    }
};
JewelClass.prototype.isMovingTriggerEliminate = function() {
    if (this.toEliminate.length > 2) return true;
    return false;
};
JewelClass.prototype.checkEliminateChains = function() {
    var length = this.eliminateChains.length;
    if (length < 3) return false;
    for (var x in this.eliminateChains) {
        if (FUNC.inArray(this.eliminateChains[x], this.toEliminate)) continue;
        this.toEliminate.push(this.eliminateChains[x]);
    }
    return true;
};
JewelClass.prototype.checkRelativeGems = function() {
    // when moving 2 gems, there will be 3(4) lines of gems affected, find them
    var xaxis = [], yaxis = [], gem;
    // explode the x and y axis, find the lines through axis
    for (var x in this.changedGems) {
        gem = this.changedGems[x].split(',');
        xaxis.push(gem[0]);
        yaxis.push(gem[1]);
    }
    this.checkRelativeGemsXaxis(xaxis);
    this.checkRelativeGemsYaxis(yaxis);
};
JewelClass.prototype.checkRelativeGemsXaxis = function(xaxis) {
    // x axis related
    var coordinate;
    for (var x in xaxis) {
        for (var index in this.jewels) {
            if (index.search(xaxis[x] + ',') == -1) continue;
            this.gemsToCheck.push(index);
        }
    }
};
JewelClass.prototype.checkRelativeGemsYaxis = function(yaxis) {
    // y axis related
    var coordinate;
    for (var x in yaxis) {
        for (var index in this.jewels) {
            if (index.search(',' + yaxis[x]) == -1) continue;
            this.gemsToCheck.push(index);
        }
    }
};
