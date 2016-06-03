var emitterMenu;
var Menu = {
    preload: function () {
        game.load.image('titleBg', 'Resource/Background/BackgroundMenu.jpg');
        game.load.image('startB', 'Resource/Menu/StartGame.png');
        game.load.image('title', 'Resource/Menu/LogoMenu.png');

        game.load.image('blue', 'Resource/Diamonds/Blue.png');
        game.load.image('green', 'Resource/Diamonds/Green.png');
        game.load.image('orange', 'Resource/Diamonds/Orange.png');
        game.load.image('purple', 'Resource/Diamonds/Purple.png');
        game.load.image('red', 'Resource/Diamonds/Red.png');
        game.load.image('white', 'Resource/Diamonds/White.png');
        game.load.image('yellow', 'Resource/Diamonds/Yellow.png');
    },

    create: function () {
        game.add.image(0, 0, 'titleBg');

        emitterMenu = game.add.emitter(game.world.centerX, 0, 200);
        emitterMenu.width = 800;

        emitterMenu.makeParticles(['blue', 'green', 'orange', 'purple', 'red', 'white', 'yellow']);

        emitterMenu.minParticleSpeed.set(0, 300);
        emitterMenu.maxParticleSpeed.set(0, 400);

        emitterMenu.setRotation(100, 200);
        //emitterMenu.setAlpha(0.3, 0.8);
        emitterMenu.setScale(0.5, 0.5, 1, 1);
        emitterMenu.gravity = -150;

        emitterMenu.start(false, 5000, 400);

        game.add.image(200, 50, 'title');
        this.add.button(300, 300, 'startB', this.startGame, this);
    },

    startGame: function() {
        this.state.start('Game', true, true);
    }
};