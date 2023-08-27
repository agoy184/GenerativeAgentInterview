let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#8C8C8C',
    pixelArt: true,
    autoCenter: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {
          x:0,
          y:0
        }
      }
    },
    scene:  [ Load, Menu, CreditsMusic, CreditsBackground, Controls, MainLevel ]
}

let game = new Phaser.Game(config);

// Reserve keyboard vars
let keySPACE, keyENTER;
let keyW, keyA, keyS, keyD, keyR

// Set UI Sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
