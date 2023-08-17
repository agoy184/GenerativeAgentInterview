class Load extends Phaser.Scene {
    constructor(){
        super('preLoad')
    }

    preload() {
        this.add.text(game.config.width / 2, game.config.height / 2.5, 'Loading...').setOrigin(0.5, 0.5);

        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();                                 // reset fill/line style
            loadingBar.fillStyle(0xFFFFFF, 1);                  // (color, alpha)
            loadingBar.fillRect(0, game.config.height/2, game.config.width * value, 10);  // (x, y, w, h)
        });
        this.load.on('complete', () => {
            loadingBar.destroy();
        });

        this.load.path = './assets/';

        // background audio

        //sfx
        this.load.audio('sfx_select', 'pop.wav');

        // images

        // character images
        this.load.image('Keizo', 'sprites/keizo_spr.png')

        // tilemap

        // scene 1

    }

    create() {
        this.scene.start('menuScene');
    }
}
