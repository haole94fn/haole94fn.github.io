// Variables
var grid;
var gems;
var mark;
var ranNum;
var score;

// Animation state
var currentState;
var lastState;

// Gem logic
var chosenGemFlag;
var chosenGemIndex;
var lastChosenGemPos;
var nextGemIndex;

// Pointer
var lastPointerPos;

// Time bar;
var timeBar;
var timer;
var bonusTime;

// Sound control
var fxDestroyGem;
var fxDestroyBomb;
var fxDestroyLightning;
var fxComboBomb;
var fxComboLightning;
var fxBackgroundPlayGame;
var fxGameOver;
var fxGo;

// Font
var scoreText;
var bonusTimeText;
var timeLeftText;
var alertText;
var timeUpText;

// Load status
var loadText;

var Game = {
    preload: function () {
        // Set loadText
        loadText = game.add.text(350, 300, '', { fill: '#ffffff' });
        game.load.onLoadStart.add(this.loadStart);
        game.load.onFileComplete.add(this.fileComplete);
        game.load.onLoadComplete.add(this.loadComplete);


        // Background Play Game
        game.load.image('playBg', 'Resource/Background/BackgroundPlayGame.jpg');
        // Grid
        game.load.image('grid', 'Resource/Supports/Grid.png');
        // Gems
        game.load.image('mark', 'Resource/Supports/Square.png');
        game.load.image('blue', 'Resource/Diamonds/Blue.png');
        game.load.image('green', 'Resource/Diamonds/Green.png');
        game.load.image('orange', 'Resource/Diamonds/Orange.png');
        game.load.image('purple', 'Resource/Diamonds/Purple.png');
        game.load.image('red', 'Resource/Diamonds/Red.png');
        game.load.image('white', 'Resource/Diamonds/White.png');
        game.load.image('yellow', 'Resource/Diamonds/Yellow.png');
        // Particles Effect
        game.load.image('fire1', 'Resource/Particles/fire1.png');
        game.load.image('fire2', 'Resource/Particles/fire2.png');
        game.load.image('fire3', 'Resource/Particles/fire3.png');
        game.load.image('flare', 'Resource/Particles/flare_vertical.png');
        // Fx
        game.load.audio('destroyGem', 'Resource/Sounds/DestroyGem1.wav');
        game.load.audio('destroyBomb', 'Resource/Sounds/DestroyBomb.wav');
        game.load.audio('destroyLightning', 'Resource/Sounds/DestroyLightning.wav');
        game.load.audio('comboBomb', 'Resource/Sounds/ComboBomb.wav');
        game.load.audio('comboLightning', 'Resource/Sounds/ComboLightning.wav');
        game.load.audio('bgPlayMusic', 'Resource/Sounds/Butterflies.mp3');
        game.load.audio('gameOver', 'Resource/Sounds/GameOver.wav');
        game.load.audio('go', 'Resource/Sounds/Go.wav');
        // Others
        game.load.image('timeBar', 'Resource/Supports/HealthBar.jpg')
        game.load.bitmapFont('desyrel', 'Resource/Fonts/desyrel.png', 'Resource/Fonts/desyrel.xml');
        game.load.bitmapFont('desyrel-pink', 'Resource/Fonts/desyrel-pink.png', 'Resource/Fonts/desyrel-pink.xml');
    },

    loadStart: function() {
        loadText.text = 'Loading...';
    },

    fileComplete: function (progress, cacheKey, success, totalLoaded, totalFiles) {
        loadText.text = 'Complete: ' + progress + '%';
    },

    loadComplete: function() {
        loadText.text = '';
    },

    create: function () {
        // Initialization
        gems = [NUMBER_OF_GEM_ON_GRID];
        for (var i = 0; i < NUMBER_OF_GEM_ON_GRID; i++) {
            gems[i] = {
                image: null,
                x: null,
                y: null,
                area: null,
                colorIndex: null,
                stateIndex: null
            };
        }

        game.physics.startSystem(Phaser.Physics.ARCADE); // Enable physics

        // Enable Fx
        fxComboBomb = game.add.audio('comboBomb');
        fxComboLightning = game.add.audio('comboLightning');
        fxDestroyBomb = game.add.audio('destroyBomb');
        fxDestroyGem = game.add.audio('destroyGem');
        fxDestroyLightning = game.add.audio('destroyLightning');
        fxBackgroundPlayGame = game.add.audio('bgPlayMusic', 0.5, true);
        fxGameOver = game.add.audio('gameOver');
        fxGo = game.add.audio('go');

        fxComboBomb.allowMultiple = true;
        fxComboLightning.allowMultiple = true;
        fxDestroyBomb.allowMultiple = true;
        fxDestroyGem.allowMultiple = true;
        fxDestroyLightning.allowMultiple = true;

        mark = null;
        score = 0;

        chosenGemFlag = false;
        chosenGemIndex = null;
        lastChosenGemPos = new Phaser.Point(0, 0);

        lastPointerPos = null;

        currentState = ANIMATION_STATE.Wait;
        lastState = currentState;

        ranNum = [NUMBER_OF_GEM_ON_GRID];

        // Bonus time
        bonusTime = 0;

        // Supports
        game.add.image(0, 0, 'playBg');
        grid = game.add.image(X_GRID, Y_GRID, 'grid');
        grid.alpha = 0.4;

        timeBar = game.add.image(X_GRID, Y_END_GRID + WIDTH_GEM, 'timeBar');
        timeBar.width = WIDTH_BAR;

        scoreText = game.add.bitmapText(20, 20, 'desyrel', 'SCORE: 0', 30);
        bonusTimeText = game.add.bitmapText(20, 50, 'desyrel', 'BONUS: +' + bonusTime / 1000, 30);
        timeLeftText = game.add.bitmapText(150, 100, 'desyrel-pink', '', 60);


        this.startGameLogic();

        for (var i = 0; i < NUMBER_OF_GEM_ON_GRID; i++) {
            switch (gems[i].colorIndex) {
                case COLOR_GEM.Blue: gems[i].image = game.add.image(gems[i].x, gems[i].y, 'blue'); break;
                case COLOR_GEM.Green: gems[i].image = game.add.image(gems[i].x, gems[i].y, 'green'); break;
                case COLOR_GEM.Orange: gems[i].image = game.add.image(gems[i].x, gems[i].y, 'orange'); break;
                case COLOR_GEM.Purple: gems[i].image = game.add.image(gems[i].x, gems[i].y, 'purple'); break;
                case COLOR_GEM.Red: gems[i].image = game.add.image(gems[i].x, gems[i].y, 'red'); break;
                case COLOR_GEM.Yellow: gems[i].image = game.add.image(gems[i].x, gems[i].y, 'yellow'); break;
                case COLOR_GEM.White: gems[i].image = game.add.image(gems[i].x, gems[i].y, 'white'); break;
            }
        }

        alertText = game.add.bitmapText(40, 200, 'desyrel-pink', '', 100);
        timeUpText = game.add.bitmapText(160, 200, 'desyrel-pink', '', 100);

        fxGo.play();

        fxBackgroundPlayGame.play(); // Play music
        timer = game.time.create();
        timer.add(SET_TIME, this.checkBonusTime);
        timer.start();
    },

    reloadTexture: function(i) {
        switch (gems[i].colorIndex) {
            case COLOR_GEM.Blue: gems[i].image.loadTexture('blue'); break;
            case COLOR_GEM.Green: gems[i].image.loadTexture('green'); break;
            case COLOR_GEM.Orange: gems[i].image.loadTexture('orange'); break;
            case COLOR_GEM.Purple: gems[i].image.loadTexture('purple'); break;
            case COLOR_GEM.Red: gems[i].image.loadTexture('red'); break;
            case COLOR_GEM.Yellow: gems[i].image.loadTexture('yellow'); break;
            case COLOR_GEM.White: gems[i].image.loadTexture('white'); break;
        }
    },

    update: function () {
        // Vẽ hình ảnh điểm số và bonus time
        scoreText.text = 'SCORE: ' + score;
        //bonusTimeText.text = 'BONUS: +' + bonusTime / 1000;
        if (bonusTime <= 30000)
            bonusTimeText.text = 'BONUS: +' + bonusTime / 1000;
        else
            bonusTimeText.text = 'BONUS: +MAX'

        timeLeftText.text = Math.floor(timer.duration / 1000);

        // Vẽ mark
        if (mark != null) {
            if (lastChosenGemPos.x != 0 && lastChosenGemPos != 0) {
                mark.x = lastChosenGemPos.x;
                mark.y = lastChosenGemPos.y;
            } else {
                mark.destroy();
                mark = null;
            }
        } else {
            if (lastChosenGemPos.x != 0 && lastChosenGemPos != 0) {
                mark = game.add.image(lastChosenGemPos.x, lastChosenGemPos.y, 'mark');
            }
        }

        // Update logic và vẽ
        this.solveGameLogic();
    },



    // Handle specific logic
    //
    startGameLogic: function() {
        do {
            this.generateGems();
            this.checkEveryGemAndFix();
        }
        while (!this.atLeastOnePossibleMove());
    },

    solveGameLogic: function() {
        //DecreaseTime(_manager.Mode); // Giảm thời gian
        this.updateTimeBar();

        this.performPerticlesEffect(); // Thể hiện và cập nhật hiệu ứng

        switch (currentState)
        {
            case ANIMATION_STATE.Wait: this.stateWait(); break;
            case ANIMATION_STATE.Swap: this.stateSwap(); break;
            case ANIMATION_STATE.Match: this.stateMatch(); break; // Cần tính điểm
            case ANIMATION_STATE.Destroy: this.stateDestroy(); break;
            case ANIMATION_STATE.Fall: this.stateFall(); break;
            case ANIMATION_STATE.Check: this.stateCheck(); break;
            case ANIMATION_STATE.CaculatePoint: this.stateCaculate(); break;
        }
    },

    stateWait: function () {
        if (chosenGemFlag == false)
            this.firstClick();
        else {
            this.secondClick();
        }
    },

    stateSwap: function() {
        this.moveSwap(chosenGemIndex, nextGemIndex);
    },

    stateMatch: function () {
        var a = this.isValid(chosenGemIndex);
        var b = this.isValid(nextGemIndex);
        if (a || b)
        {
            if (a)
                this.getScore(chosenGemIndex);
            if (b)
                this.getScore(nextGemIndex);

            this.goToDestruction();
        }
        else
        {
            lastState = currentState;
            currentState = ANIMATION_STATE.Swap;

            chosenGemFlag = false;
        }
    },

    stateDestroy: function() {
        this.performDestructiveAnimation();
    },

    stateFall: function() {
        this.reArrangeGrid();

        for (var i = 0; i < NUMBER_OF_GEM_ON_GRID; i++)
        {
            if (gems[i].stateIndex != STATE_GEM.normal &&
                gems[i].stateIndex != STATE_GEM.bomb &&
                gems[i].stateIndex != STATE_GEM.lightning)
                return;
        }

        for (var i = 0; i < NUMBER_OF_GEM_ON_GRID; i++) {
            gems[i].image.x = gems[i].x;
            gems[i].image.y = gems[i].y;
        }

        lastState = currentState;
        currentState = ANIMATION_STATE.Check;
    },

    stateCheck: function() {
        var flag = false;
        for (var i = 0; i < NUMBER_OF_GEM_ON_GRID; i++)
        {
            if (this.isValid(i))
            {
                this.getScore(i);
                this.destroyGem(i);
                flag = true;
            }
        }

        lastState = currentState;

        if (flag)
        {
            currentState = ANIMATION_STATE.Destroy;
        }
        else
        {
            currentState = ANIMATION_STATE.CaculatePoint;
            chosenGemFlag = false;
        }
    },

    stateCaculate: function() {
        lastState = currentState;
        currentState = ANIMATION_STATE.Wait;

        if (this.isGameOver()) {
            fxGameOver.play();
            //alert("Change board");

            alertText.text = 'NO MORE MOVE';

            game.time.events.add(2000, this.goToResultScreen);
        }
    },

    goToResultScreen: function() {
        game.state.start('Result', true, true, score);
    },

    updateBonusTime: function(type, n) {
        switch (type) {
            case STATE_GEM.empty: bonusTime += NORMAL_VALUE * n; break;
            case STATE_GEM.emptyBomb: bonusTime += BOMB_VALUE; break;
            case STATE_GEM.emptyLightning: bonusTime += LIGHTNING_VALUE; break;
        }
    },

    isGameOver: function() {
        if (this.atLeastOnePossibleMove())
            return false;

        return true;
    },

    timeUp: function () {
        fxGameOver.play();
        //alert("Time up");

        timeUpText.text = 'TIME\'S UP';

        game.time.events.add(2000, this.goToResultScreen);
    },

    updateTimeBar: function () {
        var timeLeft = Math.floor(WIDTH_BAR * timer.duration / SET_TIME);
        if (timeLeft < 0)
            timeLeft = 0;
        timeBar.width = timeLeft;
    },

    checkBonusTime: function () {
        if (bonusTime > 0) {
            if (bonusTime > 30000)
                bonusTime = 30000;
            Game.reUpdateTime();
        } else {
            Game.timeUp();
        }
    },

    reUpdateTime: function() {
        timer.destroy();
        timer = game.time.create();
        timer.add(bonusTime, this.checkBonusTime);
        bonusTime = 0;
        timer.start();
    },

    updateScore: function(type, n) {
        switch (type) {
            case STATE_GEM.empty: score += NORMAL_SCORE * n; break;
            case STATE_GEM.emptyBomb: score += BOMB_SCORE; break;
            case STATE_GEM.emptyLightning: score += LIGHTNING_SCORE; break;
        }
    },

    reArrangeGrid: function() {
        for (var i = NUMBER_OF_GEM_ON_GRID - 1; i >= 0; i--)
        {
            this.reArrangeGem(i);
        }
    },

    reArrangeGem: function(i) {
        var flag = true;
        if (gems[i].stateIndex == STATE_GEM.charge)
        {
            flag = this.getGemFromAbove(i);
        }

        if (flag == false)
        {
            gems[i].image.x = gems[i].x;
            gems[i].image.y = gems[i].y;

            this.randomChargeGem(i);
        }
    },

    getGemFromAbove: function(i) {
        if (gems[i].area.y == Y_GRID) {
            return false;
        }

        this.fallDown(i - NUMBER_OF_GEM_IN_A_ROW, i);
        this.getGemFromAbove(i - NUMBER_OF_GEM_IN_A_ROW);

        return true;
    },

    fallDown: function (a, b) {
        if (gems[a].image.y < gems[b].y && gems[b].image.y > gems[a].y) {
            gems[a].image.y += GO;
        } else {
            this.completeFallDown(a, b);
        }
    },

    completeFallDown: function(a, b) {
        gems[a].image.x = gems[a].x;
        gems[a].image.y = gems[a].y;
        gems[b].image.x = gems[b].x;
        gems[b].image.y = gems[b].y;

        this.swap(a, b);
        var visible = gems[a].image.visible;
        gems[a].image.visible = gems[b].image.visible;
        gems[b].image.visible = visible;

        this.reloadTexture(b);
        this.randomChargeGem(a);
    },

    randomChargeGem: function(i) {
        this.randomThisGem(i);
        gems[i].image.visible = true;
        this.reloadTexture(i);
    },

    createParticle: function (pos, gem, type) {
        if (type == 0) {
            var emitter = game.add.emitter(0, 0, 200);

            switch (gem) {
                case 0: emitter.makeParticles('blue'); break;
                case 1: emitter.makeParticles('green'); break;
                case 2: emitter.makeParticles('orange'); break;
                case 3: emitter.makeParticles('purple'); break;
                case 4: emitter.makeParticles('red'); break;
                case 5: emitter.makeParticles('yellow'); break;
                case 6: emitter.makeParticles('white'); break;
            }

            emitter.gravity = 500;
            emitter.x = pos.x;
            emitter.y = pos.y;
            emitter.minParticleScale = 0.3;
            emitter.maxParticleScale = 0.3;
            emitter.start(true, 4000, null, 10);

            game.time.events.add(2000, function () { emitter.destroy() });
        } else if (type == 1) {
            var emitter = game.add.emitter(0, 0, 10);
            emitter.makeParticles(['fire1', 'fire2', 'fire3']);

            emitter.gravity = 0;
            emitter.x = pos.x;
            emitter.y = pos.y;
            emitter.minParticleScale = 0.3;
            emitter.maxParticleScale = 0.3;
            emitter.setAlpha(0.5, 0.5);
            emitter.start(true, 200, null, 1);

            game.time.events.add(200, function () { emitter.destroy() });
        } else if (type == 2) {
            var emitter = game.add.emitter(0, 0, 10);
            emitter.makeParticles('flare');

            emitter.gravity = 0;
            emitter.x = pos.x;
            emitter.y = pos.y;
            emitter.minParticleScale = 0.3;
            emitter.maxParticleScale = 0.3;
            emitter.setAlpha(0.5, 0.5);
            emitter.start(true, 200, null, 1);

            game.time.events.add(200, function () { emitter.destroy() });
        }
    },

    performDestructiveAnimation: function () {
        var notEmpty = 0;
        for (var i = 0; i < NUMBER_OF_GEM_ON_GRID; i++) {
            var position = new Phaser.Point(gems[i].x + WIDTH_GEM / 2, gems[i].y + HEIGHT_GEM / 2);

            if (gems[i].stateIndex == STATE_GEM.empty) {
                gems[i].image.visible = false;

                this.createParticle(position, gems[i].colorIndex, 0);

                gems[i].stateIndex = STATE_GEM.charge;
            }
            else if (gems[i].stateIndex == STATE_GEM.emptyBomb) {
                gems[i].image.visible = false;

                this.createParticle(position, gems[i].colorIndex, 0);

                gems[i].stateIndex = STATE_GEM.charge;
            }
            else if (gems[i].stateIndex == STATE_GEM.emptyLightning) {
                gems[i].image.visible = false;

                this.createParticle(position, gems[i].colorIndex, 0);

                gems[i].stateIndex = STATE_GEM.charge;
            }
            else
                notEmpty++;
        }

        if (notEmpty == 64) {
            lastState = currentState;
            currentState = ANIMATION_STATE.Fall;
        }
    },

    performPerticlesEffect: function () {
        for (var i = 0; i < NUMBER_OF_GEM_ON_GRID; i++) {
            var pos = new Phaser.Point(gems[i].image.x + WIDTH_GEM / 2, gems[i].image.y + HEIGHT_GEM / 2);

            if (gems[i].stateIndex == STATE_GEM.bomb)
            {
                this.createParticle(pos, null, 1);
            }

            if (gems[i].stateIndex == STATE_GEM.lightning)
            {
                this.createParticle(pos, null, 2);
            }
        }
    },

    isValid: function(i) {
        var nH = this.getNumberOfGemsInH(i);
        var nV = this.getNumberOfGemsInV(i);

        if (nH >= 2 || nV >= 2)
        {
            return true;
        }
        else
            return false;
    },

    getScore: function (i) {
        if (gems[i].stateIndex == STATE_GEM.empty)
            return;

        var nH = this.getNumberOfGemsInH(i);
        var nV = this.getNumberOfGemsInV(i);

        if (nH >= 2) {
            this.updateScore(STATE_GEM.empty, nH + 1);
            this.updateBonusTime(STATE_GEM.empty, nH + 1);
        }
        if (nV >= 2) {
            this.updateScore(STATE_GEM.empty, nV + 1);
            this.updateBonusTime(STATE_GEM.empty, nV + 1);
        }
    },

    goToDestruction: function() {
        this.destroyGem(chosenGemIndex);
        this.destroyGem(nextGemIndex);

        lastState = currentState;
        currentState = ANIMATION_STATE.Destroy;
    },

    destroyGem: function(i) {
        var save = gems[i].colorIndex;

        var nH = this.getNumberOfGemsInH(i);
        var nV = this.getNumberOfGemsInV(i);

        this.normalPhase(i, save, nH, nV);

        this.setSpecialGem(i, save, nH, nV);
    },

    normalPhase: function(i, save, nH, nV) {
        if (nH >= 2) {
            fxDestroyGem.play();

            this.destroyGemInH(i);
        }

        if (nV >= 2) {
            fxDestroyGem.play();

            gems[i].colorIndex = save;
            this.destroyGemInV(i);
        }
    },

    destroyGemInH: function(i) {
        var t = gems[i].colorIndex;
        this.destroyGemLeft(i);
        gems[i].colorIndex = t;
        this.destroyGemRight(i);

        return true;
    },

    destroyGemInV: function(i) {
        var t = gems[i].colorIndex;
        this.destroyGemUp(i);
        gems[i].colorIndex = t;
        this.destroyGemDown(i);
    },

    destroyGemLeft: function(i) {
        this.checkSpecialGem(i);

        if (gems[i].area.x == X_GRID)
        {
            gems[i].stateIndex = STATE_GEM.empty;
            return;
        }

        if (gems[i].colorIndex == gems[i - 1].colorIndex)
        {
            this.destroyGemLeft(i - 1);
        }

        gems[i].stateIndex = STATE_GEM.empty;
    },

    destroyGemRight: function(i) {
        this.checkSpecialGem(i);

        if (gems[i].area.x == X_END_GRID)
        {
            gems[i].stateIndex = STATE_GEM.empty;
            return;
        }

        if (gems[i].colorIndex == gems[i + 1].colorIndex)
        {
            this.destroyGemRight(i + 1);
        }

        gems[i].stateIndex = STATE_GEM.empty;
    },

    destroyGemUp: function(i) {
        this.checkSpecialGem(i);

        if (gems[i].area.y == Y_GRID)
        {
            gems[i].stateIndex = STATE_GEM.empty;
            return;
        }

        if (gems[i].colorIndex == gems[i - NUMBER_OF_GEM_IN_A_ROW].colorIndex)
        {
            this.destroyGemUp(i - NUMBER_OF_GEM_IN_A_ROW);
        }

        gems[i].stateIndex = STATE_GEM.empty;
    },

    destroyGemDown: function(i) {
        this.checkSpecialGem(i);

        if (gems[i].area.y == Y_END_GRID)
        {
            gems[i].stateIndex = STATE_GEM.empty;
            return;
        }

        if (gems[i].colorIndex == gems[i + NUMBER_OF_GEM_IN_A_ROW].colorIndex)
        {
            this.destroyGemDown(i + NUMBER_OF_GEM_IN_A_ROW);
        }

        gems[i].stateIndex = STATE_GEM.empty;
    },

    checkSpecialGem: function(i) {
        this.checkBombGem(i);
        this.checkLightningGem(i);
    },

    checkBombGem: function(i) {
        if (gems[i].stateIndex == STATE_GEM.bomb)
        {
            gems[i].stateIndex = STATE_GEM.emptyBomb;

            this.updateScore(STATE_GEM.emptyBomb, null);
            this.updateBonusTime(STATE_GEM.emptyBomb, null);

            this.destroyBombGem(i);

            return true;
        }

        return false;
    },

    checkLightningGem: function(i) {
        if (gems[i].stateIndex == STATE_GEM.lightning)
        {
            gems[i].stateIndex = STATE_GEM.emptyLightning;

            this.updateScore(STATE_GEM.emptyLightning, null);
            this.updateBonusTime(STATE_GEM.emptyLightning, null);

            this.destroyLightningGem(i);

            return true;
        }

        return false;
    },

    destroyBombGem: function(i) {
        fxDestroyBomb.play();

        this.destroyBombUp(i);
        this.destroyBombDown(i);
        this.destroyBombLeft(i);
        this.destroyBombRight(i);
        this.destroyBombUpLeft(i);
        this.destroyBombUpRight(i);
        this.destroyBombDownLeft(i);
        this.destroyBombDownRight(i);
    },

    destroyBombUp: function(i) {
        if (gems[i].area.y == Y_GRID)
            return;

        this.checkSpecialGem(i - NUMBER_OF_GEM_IN_A_ROW);

        if (gems[i - NUMBER_OF_GEM_IN_A_ROW].stateIndex != STATE_GEM.emptyBomb) {
            this.updateScore(STATE_GEM.emptyBomb, null);
            this.updateBonusTime(STATE_GEM.emptyBomb, null);
        }

        gems[i - NUMBER_OF_GEM_IN_A_ROW].stateIndex = STATE_GEM.emptyBomb;
    },

    destroyBombDown: function(i) {
        if (gems[i].area.y == Y_END_GRID)
            return;

        this.checkSpecialGem(i + NUMBER_OF_GEM_IN_A_ROW);

        if (gems[i + NUMBER_OF_GEM_IN_A_ROW].stateIndex != STATE_GEM.emptyBomb) {
            this.updateScore(STATE_GEM.emptyBomb, null);
            this.updateBonusTime(STATE_GEM.emptyBomb, null);
        }

        gems[i + NUMBER_OF_GEM_IN_A_ROW].stateIndex = STATE_GEM.emptyBomb;
    },

    destroyBombLeft: function(i) {
        if (gems[i].area.x == X_GRID)
            return;

        this.checkSpecialGem(i - 1);

        if (gems[i - 1].stateIndex != STATE_GEM.emptyBomb) {
            this.updateScore(STATE_GEM.emptyBomb, null);
            this.updateBonusTime(STATE_GEM.emptyBomb, null);
        }

        gems[i - 1].stateIndex = STATE_GEM.emptyBomb;
    },

    destroyBombRight: function(i) {
        if (gems[i].area.x == X_END_GRID)
            return;

        this.checkSpecialGem(i + 1);

        if (gems[i + 1].stateIndex != STATE_GEM.emptyBomb) {
            this.updateScore(STATE_GEM.emptyBomb, null);
            this.updateBonusTime(STATE_GEM.emptyBomb, null);
        }

        gems[i + 1].stateIndex = STATE_GEM.emptyBomb;
    },

    destroyBombUpLeft: function(i) {
        if (gems[i].area.y == Y_GRID || gems[i].area.x == X_GRID)
            return;

        this.checkSpecialGem(i - 1 - NUMBER_OF_GEM_IN_A_ROW);

        if (gems[i - 1 - NUMBER_OF_GEM_IN_A_ROW].stateIndex != STATE_GEM.emptyBomb) {
            this.updateScore(STATE_GEM.emptyBomb, null);
            this.updateBonusTime(STATE_GEM.emptyBomb, null);
        }

        gems[i - 1 - NUMBER_OF_GEM_IN_A_ROW].stateIndex = STATE_GEM.emptyBomb;
    },

    destroyBombUpRight: function(i) {
        if (gems[i].area.y == Y_GRID || gems[i].area.x == X_END_GRID)
            return;

        this.checkSpecialGem(i + 1 - NUMBER_OF_GEM_IN_A_ROW);

        if (gems[i + 1 - NUMBER_OF_GEM_IN_A_ROW].stateIndex != STATE_GEM.emptyBomb) {
            this.updateScore(STATE_GEM.emptyBomb, null);
            this.updateBonusTime(STATE_GEM.emptyBomb, null);
        }

        gems[i + 1 - NUMBER_OF_GEM_IN_A_ROW].stateIndex = STATE_GEM.emptyBomb;
    },

    destroyBombDownLeft: function(i) {
        if (gems[i].area.y == Y_END_GRID || gems[i].area.x == X_GRID)
            return;

        this.checkSpecialGem(i - 1 + NUMBER_OF_GEM_IN_A_ROW);

        if (gems[i - 1 + NUMBER_OF_GEM_IN_A_ROW].stateIndex != STATE_GEM.emptyBomb) {
            this.updateScore(STATE_GEM.emptyBomb, null);
            this.updateBonusTime(STATE_GEM.emptyBomb, null);
        }

        gems[i - 1 + NUMBER_OF_GEM_IN_A_ROW].stateIndex = STATE_GEM.emptyBomb;
    },

    destroyBombDownRight: function (i) {
        if (gems[i].area.y == Y_END_GRID || gems[i].area.x == X_END_GRID)
            return;

        this.checkSpecialGem(i + 1 + NUMBER_OF_GEM_IN_A_ROW);

        if (gems[i + 1 + NUMBER_OF_GEM_IN_A_ROW].stateIndex != STATE_GEM.emptyBomb) {
            this.updateScore(STATE_GEM.emptyBomb, null);
            this.updateBonusTime(STATE_GEM.emptyBomb, null);
        }

        gems[i + 1 + NUMBER_OF_GEM_IN_A_ROW].stateIndex = STATE_GEM.emptyBomb;
    },

    destroyLightningGem: function(i) {
        fxDestroyLightning.play();

        this.destroyLightninginH(i);
        this.destroyLightninginV(i);
    },

    destroyLightninginH: function(i) {
        this.destroyLightningLeft(i);
        this.destroyLightningRight(i);
    },

    destroyLightninginV: function(i) {
        this.destroyLightningUp(i);
        this.destroyLightningDown(i);
    },

    destroyLightningLeft: function(i) {
        this.checkSpecialGem(i);

        if (gems[i].area.x == X_GRID)
        {
            gems[i].stateIndex = STATE_GEM.emptyLightning;
            return;
        }

        this.destroyLightningLeft(i - 1);

        if (gems[i].stateIndex != STATE_GEM.emptyLightning) {
            this.updateScore(STATE_GEM.emptyLightning, null);
            this.updateBonusTime(STATE_GEM.emptyLightning, null);
        }

        gems[i].stateIndex = STATE_GEM.emptyLightning;
    },

    destroyLightningRight: function(i) {
        this.checkSpecialGem(i);

        if (gems[i].area.x == X_END_GRID)
        {
            gems[i].stateIndex = STATE_GEM.emptyLightning;
            return;
        }

        this.destroyLightningRight(i + 1);

        if (gems[i].stateIndex != STATE_GEM.emptyLightning) {
            this.updateScore(STATE_GEM.emptyLightning, null);
            this.updateBonusTime(STATE_GEM.emptyLightning, null);
        }

        gems[i].stateIndex = STATE_GEM.emptyLightning;
    },

    destroyLightningUp: function(i) {
        this.checkSpecialGem(i);

        if (gems[i].area.y == Y_GRID)
        {
            gems[i].stateIndex = STATE_GEM.emptyLightning;
            return;
        }

        this.destroyLightningUp(i - NUMBER_OF_GEM_IN_A_ROW);

        if (gems[i].stateIndex != STATE_GEM.emptyLightning) {
            this.updateScore(STATE_GEM.emptyLightning, null);
            this.updateBonusTime(STATE_GEM.emptyLightning, null);
        }

        gems[i].stateIndex = STATE_GEM.emptyLightning;
    },

    destroyLightningDown: function(i) {
        this.checkSpecialGem(i);

        if (gems[i].area.y == Y_END_GRID)
        {
            gems[i].stateIndex = STATE_GEM.emptyLightning;
            return;
        }

        this.destroyLightningDown(i + NUMBER_OF_GEM_IN_A_ROW);

        if (gems[i].stateIndex != STATE_GEM.emptyLightning) {
            this.updateScore(STATE_GEM.emptyLightning, null);
            this.updateBonusTime(STATE_GEM.emptyLightning, null);
        }

        gems[i].stateIndex = STATE_GEM.emptyLightning;
    },

    setSpecialGem: function(i, save, nH, nV) {
        if (nH > nV)
        {
            if (nH == 3)
            {
                fxComboBomb.play();

                gems[i].colorIndex = save;
                gems[i].stateIndex = STATE_GEM.bomb;
            }

            if (nH == 4)
            {
                fxComboLightning.play();

                gems[i].colorIndex = save;
                gems[i].stateIndex = STATE_GEM.lightning;
            }
        }
        else
        {
            if (nV == 3)
            {
                fxComboBomb.play();

                gems[i].colorIndex = save;
                gems[i].stateIndex = STATE_GEM.bomb;
            }

            if (nV == 4)
            {
                fxComboLightning.play();

                gems[i].colorIndex = save;
                gems[i].stateIndex = STATE_GEM.lightning;
            }
        }
    },

    moveSwap: function (a, b) {
        if (a - b == -1)
            this.moveSwapRight(a, b);
        else if (a - b == 1)
            this.moveSwapLeft(a, b);
        else if (a - b == -NUMBER_OF_GEM_IN_A_ROW)
            this.moveSwapDown(a, b);
        else if (a - b == NUMBER_OF_GEM_IN_A_ROW)
            this.moveSwapUp(a, b);
    },

    moveSwapRight: function(a, b) {
        if (gems[a].image.x < gems[b].x && gems[b].image.x > gems[a].x) {
            gems[a].image.x += GO;
            gems[b].image.x += -GO;
        }
        else {
            this.completeSwap(a, b);
        }
    },

    moveSwapLeft: function(a, b) {
        if (gems[a].image.x > gems[b].x && gems[b].image.x < gems[a].x) {
            gems[a].image.x += -GO;
            gems[b].image.x += GO;
        }
        else {
            this.completeSwap(a, b);
        }
    },

    moveSwapDown: function(a, b) {
        if (gems[a].image.y < gems[b].y && gems[b].image.y > gems[a].y) {
            gems[a].image.y += GO;
            gems[b].image.y += -GO;
        }
        else {
            this.completeSwap(a, b);
        }
    },

    moveSwapUp: function(a, b) {
        if (gems[a].image.y > gems[b].y && gems[b].image.y < gems[a].y) {
            gems[a].image.y += -GO;
            gems[b].image.y += GO;
        }
        else {
            this.completeSwap(a, b);
        }
    },

    completeSwap: function (a, b) {
        gems[a].image.x = gems[a].x;
        gems[a].image.y = gems[a].y;
        gems[b].image.x = gems[b].x;
        gems[b].image.y = gems[b].y;

        this.swap(a, b);

        this.reloadTexture(a);
        this.reloadTexture(b);

        if (lastState == ANIMATION_STATE.Match) {
            lastState = currentState;
            currentState = ANIMATION_STATE.Wait;
        }
        else {
            lastState = currentState;
            currentState = ANIMATION_STATE.Match;
        }
    },

    firstClick: function() {

        if (game.input.activePointer.isDown)
        {
            lastPointerPos = game.input.activePointer.positionDown;
            for (var i = 0; i < NUMBER_OF_GEM_ON_GRID; i++)
            if (gems[i].area.contains(lastPointerPos.x, lastPointerPos.y))
            {
                lastChosenGemPos = new Phaser.Point(gems[i].area.x, gems[i].area.y);
                chosenGemIndex = i;
                chosenGemFlag = true;
            }
        }
    },

    secondClick: function() {

        if (game.input.activePointer.isDown)
        {
            lastPointerPos = game.input.activePointer.positionDown;
            var contain = false;
            for (var i = 0; i < NUMBER_OF_GEM_ON_GRID; i++)
                if (gems[i].area.contains(lastPointerPos.x, lastPointerPos.y))
                {
                    nextGemIndex = i;
                    this.checkConditionAndSolve();
                    contain = true;
                }

            if (!contain)
            {
                currentState = ANIMATION_STATE.Wait;
                chosenGemFlag = false;

                lastChosenGemPos = new Phaser.Point(0, 0);
            }
        }
    },

    checkConditionAndSolve: function () {
        if ((gems[chosenGemIndex].area.x + WIDTH_GEM == gems[nextGemIndex].area.x &&
                gems[chosenGemIndex].area.y == gems[nextGemIndex].area.y) ||
                (gems[chosenGemIndex].area.x - WIDTH_GEM == gems[nextGemIndex].area.x &&
                gems[chosenGemIndex].area.y == gems[nextGemIndex].area.y) ||
                (gems[chosenGemIndex].area.x == gems[nextGemIndex].area.x &&
                gems[chosenGemIndex].area.y + HEIGHT_GEM == gems[nextGemIndex].area.y) ||
                (gems[chosenGemIndex].area.x == gems[nextGemIndex].area.x &&
                gems[chosenGemIndex].area.y - HEIGHT_GEM == gems[nextGemIndex].area.y))
        {
            currentState = ANIMATION_STATE.Swap;

            lastChosenGemPos = new Phaser.Point(0, 0);
        }
        else
        {
            lastChosenGemPos = new Phaser.Point(gems[nextGemIndex].area.x, gems[nextGemIndex].area.y);
            currentState = ANIMATION_STATE.Wait;

            chosenGemIndex = nextGemIndex;
        }
    },

    generateGems: function () {
        for (var i = 0; i < NUMBER_OF_GEM_ON_GRID; i++) {
            ranNum[i] = this.getRandomNumber(0, NUMBER_OF_GEM_COLOR);
        }

        var d = 0;
        for (var j = 0; j < NUMBER_OF_GEM_IN_A_ROW; j++)
            for (var i = 0; i < NUMBER_OF_GEM_IN_A_ROW; i++) {
                gems[d].colorIndex = ranNum[d];
                gems[d].x = X_GRID + i * WIDTH_GEM;
                gems[d].y = Y_GRID + j * HEIGHT_GEM;
                gems[d].area = new Phaser.Rectangle(gems[d].x, gems[d].y, WIDTH_GEM, HEIGHT_GEM);
                gems[d].stateIndex = STATE_GEM.normal;
                d++;
            }
    },

    getRandomNumber: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    checkEveryGemAndFix: function () {
        for (var d = 0; d < NUMBER_OF_GEM_ON_GRID; d++)
            this.checkGemAndFix(d, 0);
    },

    checkGemAndFix: function (d, c) {
        this.checkUpAndFix(d, c);
        this.checkDownAndFix(d, c);
        this.checkLeftAndFix(d, c);
        this.checkRightAndFix(d, c);
    },

    checkUpAndFix: function (d, c) {
        if (gems[d].area.y == Y_GRID)
            return;
        if (gems[d - NUMBER_OF_GEM_IN_A_ROW].colorIndex == gems[d].colorIndex) {
            c++;
            if (c == 2) {
                this.randomThisGem(d - NUMBER_OF_GEM_IN_A_ROW);
                return;
            }
            this.checkUpAndFix(d - NUMBER_OF_GEM_IN_A_ROW, c);
        }
        else
            return;
    },

    checkDownAndFix: function (d, c) {
        if (gems[d].area.y == Y_END_GRID)
            return;
        if (gems[d + NUMBER_OF_GEM_IN_A_ROW].colorIndex == gems[d].colorIndex) {
            c++;
            if (c == 2) {
                this.randomThisGem(d + NUMBER_OF_GEM_IN_A_ROW);
                return;
            }
            this.checkDownAndFix(d + NUMBER_OF_GEM_IN_A_ROW, c);
        }
        else
            return;
    },

    checkLeftAndFix: function (d, c) {
        if (gems[d].area.x == X_GRID)
            return;
        if (gems[d - 1].colorIndex == gems[d].colorIndex) {
            c++;
            if (c == 2) {
                this.randomThisGem(d - 1);
                return;
            }
            this.checkLeftAndFix(d - 1, c);
        }
        else
            return;
    },

    checkRightAndFix: function (d, c) {
        if (gems[d].area.x == X_END_GRID)
            return;
        if (gems[d + 1].colorIndex == gems[d].colorIndex) {
            c++;
            if (c == 2) {
                this.randomThisGem(d + 1);
                return;
            }
            this.checkRightAndFix(d + 1, c);
        }
        else
            return;
    },

    randomThisGem: function (d) {
        var temp = this.getRandomNumber(0, NUMBER_OF_GEM_COLOR);

        while (temp == gems[d].colorIndex)
        {
            temp = this.getRandomNumber(0, NUMBER_OF_GEM_COLOR);
        }

        gems[d].colorIndex = temp;
        gems[d].stateIndex = STATE_GEM.normal;
    },

    atLeastOnePossibleMove: function () {
        for (var i = 0; i < NUMBER_OF_GEM_ON_GRID; i++)
        {
            if (this.isPossible(i))
                return true;
        }

        return false;
    },

    isPossible: function (i) {
        if (this.swapUp(i) || this.swapDown(i) || this.swapLeft(i) || this.swapRight(i))
            return true;
        else
            return false;
    },

    swapUp: function (i) {
        if (gems[i].area.y == Y_GRID)
            return false;
        this.swap(i, i - NUMBER_OF_GEM_IN_A_ROW);
        if (this.checkMatch(i) || this.checkMatch(i - NUMBER_OF_GEM_IN_A_ROW)) {
            this.swap(i, i - NUMBER_OF_GEM_IN_A_ROW);
            return true;
        }
        else {
            this.swap(i, i - NUMBER_OF_GEM_IN_A_ROW);
            return false;
        }
    },

    swapDown: function (i) {
        if (gems[i].area.y == Y_END_GRID)
            return false;
        this.swap(i, i + NUMBER_OF_GEM_IN_A_ROW);
        if (this.checkMatch(i) || this.checkMatch(i + NUMBER_OF_GEM_IN_A_ROW)) {
            this.swap(i, i + NUMBER_OF_GEM_IN_A_ROW);
            return true;
        }
        else {
            this.swap(i, i + NUMBER_OF_GEM_IN_A_ROW);
            return false;
        }
    },

    swapLeft: function (i) {
        if (gems[i].area.x == X_GRID)
            return false;
        this.swap(i, i - 1);
        if (this.checkMatch(i) || this.checkMatch(i - 1)) {
            this.swap(i, i - 1);
            return true;
        }
        else {
            this.swap(i, i - 1);
            return false;
        }
    },

    swapRight: function (i) {
        if (gems[i].area.x == X_END_GRID)
            return false;
        this.swap(i, i + 1);
        if (this.checkMatch(i) || this.checkMatch(i + 1)) {
            this.swap(i, i + 1);
            return true;
        }
        else {
            this.swap(i, i + 1);
            return false;
        }
    },

    swap: function (a, b) {
        var color = gems[a].colorIndex;
        gems[a].colorIndex = gems[b].colorIndex;
        gems[b].colorIndex = color;

        var stateIndex = gems[a].stateIndex;
        gems[a].stateIndex = gems[b].stateIndex;
        gems[b].stateIndex = stateIndex;
    },

    checkMatch: function (i) {
        var nH = this.getNumberOfGemsInH(i);
        var nV = this.getNumberOfGemsInV(i);

        if (nH >= 2 || nV >= 2)
            return true;
        else
            return false;
    },

    getNumberOfGemsInH: function (i) {
        return this.getNuLeft(i) + this.getNuRight(i);
    },

    getNumberOfGemsInV: function (i) {
        return this.getNuUp(i) + this.getNuDown(i);
    },

    getNuLeft: function (i) {
        if (gems[i].area.x == X_GRID)
            return 0;
        if (gems[i].colorIndex == gems[i - 1].colorIndex) {
            return this.getNuLeft(i - 1) + 1;
        }
        else
            return 0;
    },

    getNuRight: function (i) {
        if (gems[i].area.x == X_END_GRID)
            return 0;
        if (gems[i].colorIndex == gems[i + 1].colorIndex) {
            return this.getNuRight(i + 1) + 1;
        }
        else
            return 0;
    },

    getNuUp: function (i) {
        if (gems[i].area.y == Y_GRID)
            return 0;
        if (gems[i].colorIndex == gems[i - NUMBER_OF_GEM_IN_A_ROW].colorIndex) {
            return this.getNuUp(i - NUMBER_OF_GEM_IN_A_ROW) + 1;
        }
        else
            return 0;
    },

    getNuDown: function (i) {
        if (gems[i].area.y == Y_END_GRID)
            return 0;
        if (gems[i].colorIndex == gems[i + NUMBER_OF_GEM_IN_A_ROW].colorIndex) {
            return this.getNuDown(i + NUMBER_OF_GEM_IN_A_ROW) + 1;
        }
        else
            return 0;
    }
};