var game = new Phaser.Game(800, 600, Phaser.AUTO, document.getElementById('Diamond'));

game.state.add('Menu', Menu);

game.state.add('Game', Game);

game.state.add('Result', Result);

game.state.start('Menu');