var yourScore;
var scoreText;

var Result = {
    init: function(score) {
        yourScore = score;
    },

    preload: function () {
        game.load.image('resultBg', 'Resource/Background/BackgroundHighScore.jpg');
        game.load.image('exit', 'Resource/Menu/Exit.png');
        game.load.bitmapFont('desyrel', 'Resource/Fonts/desyrel.png', 'Resource/Fonts/desyrel.xml');
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