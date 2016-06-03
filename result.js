var yourScore;
var scoreText;
var loadTextResult;

var Result = {
    init: function(score) {
        yourScore = score;
    },

    preload: function () {
        // Set loadText
        loadTextResult = game.add.text(350, 300, '', { fill: '#ffffff' });
        game.load.onLoadStart.add(this.loadStart);
        game.load.onFileComplete.add(this.fileComplete);
        game.load.onLoadComplete.add(this.loadComplete);

        game.load.image('resultBg', 'Resource/Background/BackGroundHighScore.jpg');
        game.load.image('exit', 'Resource/Menu/Exit.png');
        game.load.bitmapFont('desyrel', 'Resource/Fonts/desyrel.png', 'Resource/Fonts/desyrel.xml');
    },

    loadStart: function () {
        loadTextResult.text = 'Loading...';
    },

    fileComplete: function (progress, cacheKey, success, totalLoaded, totalFiles) {
        loadTextResult.text = 'Complete: ' + progress + '%';
    },

    loadComplete: function () {
        loadTextResult.text = '';
    },

    create: function () {
        game.add.image(0, 0, 'resultBg');
        scoreText = game.add.bitmapText(50, 200, 'desyrel', 'YOUR SCORE: ' + yourScore, 70);
        this.add.button(700, 500, 'exit', this.returnToMenu, this);
    },

    returnToMenu: function () {
        this.state.start('Menu', true, true);
    }
};