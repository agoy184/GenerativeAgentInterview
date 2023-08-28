let config = {
    type: Phaser.AUTO,
    width: 896,
    height: 640,
    backgroundColor: '#639bff',
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
