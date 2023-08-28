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
        // this.load.image('Keizo', 'sprites/keizo_spr.png')
       
        this.load.image('intern1', 'sprites/intern1/intern1.png')
        this.load.image('intern1Talk', 'sprites/intern1/intern1Talk.png')
        this.load.image('intern1Happy', 'sprites/intern1/intern1Happy.png')
        this.load.image('intern1HappyTalk', 'sprites/intern1/intern1HappyTalk.png')
        this.load.image('intern1Sad', 'sprites/intern1/intern1Sad.png')
        this.load.image('intern1SadTalk', 'sprites/intern1/intern1SadTalk.png')
        this.load.image('intern1Shock', 'sprites/intern1/intern1Shock.png')
        this.load.image('intern1ShockTalk', 'sprites/intern1/intern5ShockTalk.png')

        this.load.image('intern5', 'sprites/intern5/intern5.png')
        this.load.image('intern5Talk', 'sprites/intern5/intern5Talk.png')
        this.load.image('intern5Happy', 'sprites/intern5/intern5Happy.png')
        this.load.image('intern5HappyTalk', 'sprites/intern5/intern5HappyTalk.png')
        this.load.image('intern5Sad', 'sprites/intern5/intern5Sad.png')
        this.load.image('intern5SadTalk', 'sprites/intern5/intern5SadTalk.png')
        this.load.image('intern5Shock', 'sprites/intern5/intern5Shock.png')
        this.load.image('intern5ShockTalk', 'sprites/intern5/intern5ShockTalk.png')

        this.load.atlas('loadingDots', 'loadingDots.png', 'loadingDots.json')

        // tilemap

        // scene 1

    }

    create() {
        this.scene.start('menuScene');
    }
}
