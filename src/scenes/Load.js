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
       
        // this.load.image('intern1', 'sprites/intern1/intern1.png')
        // this.load.image('intern1Talk', 'sprites/intern1/intern1Talk.png')
        // this.load.image('intern1Happy', 'sprites/intern1/intern1Happy.png')
        // this.load.image('intern1HappyTalk', 'sprites/intern1/intern1HappyTalk.png')
        // this.load.image('intern1Sad', 'sprites/intern1/intern1Sad.png')
        // this.load.image('intern1SadTalk', 'sprites/intern1/intern1SadTalk.png')
        // this.load.image('intern1Shock', 'sprites/intern1/intern1Shock.png')
        // this.load.image('intern1ShockTalk', 'sprites/intern1/intern5ShockTalk.png')

        // this.load.image('intern2', 'sprites/intern2/intern2.png')
        // this.load.image('intern2Talk', 'sprites/intern2/intern2Talk.png')
        // this.load.image('intern2Happy', 'sprites/intern2/intern2Happy.png')
        // this.load.image('intern2HappyTalk', 'sprites/intern2/intern2HappyTalk.png')
        // this.load.image('intern2Sad', 'sprites/intern2/intern2Sad.png')
        // this.load.image('intern2SadTalk', 'sprites/intern2/intern2SadTalk.png')
        // this.load.image('intern2Shock', 'sprites/intern2/intern2Shock.png')
        // this.load.image('intern2ShockTalk', 'sprites/intern2/intern5ShockTalk.png')

        // this.load.image('intern3', 'sprites/intern3/intern3.png')
        // this.load.image('intern3Talk', 'sprites/intern3/intern3Talk.png')
        // this.load.image('intern3Happy', 'sprites/intern3/intern3Happy.png')
        // this.load.image('intern3HappyTalk', 'sprites/intern3/intern3HappyTalk.png')
        // this.load.image('intern3Sad', 'sprites/intern3/intern3Sad.png')
        // this.load.image('intern3SadTalk', 'sprites/intern3/intern3SadTalk.png')
        // this.load.image('intern3Shock', 'sprites/intern3/intern3Shock.png')
        // this.load.image('intern3ShockTalk', 'sprites/intern3/intern5ShockTalk.png')

        // this.load.image('intern4', 'sprites/intern4/intern4.png')
        // this.load.image('intern4Talk', 'sprites/intern4/intern4Talk.png')
        // this.load.image('intern4Happy', 'sprites/intern4/intern4Happy.png')
        // this.load.image('intern4HappyTalk', 'sprites/intern4/intern4HappyTalk.png')
        // this.load.image('intern4Sad', 'sprites/intern4/intern4Sad.png')
        // this.load.image('intern4SadTalk', 'sprites/intern4/intern4SadTalk.png')
        // this.load.image('intern4Shock', 'sprites/intern4/intern4Shock.png')
        // this.load.image('intern4ShockTalk', 'sprites/intern4/intern5ShockTalk.png')

        // this.load.image('intern5', 'sprites/intern5/intern5.png')
        // this.load.image('intern5Talk', 'sprites/intern5/intern5Talk.png')
        // this.load.image('intern5Happy', 'sprites/intern5/intern5Happy.png')
        // this.load.image('intern5HappyTalk', 'sprites/intern5/intern5HappyTalk.png')
        // this.load.image('intern5Sad', 'sprites/intern5/intern5Sad.png')
        // this.load.image('intern5SadTalk', 'sprites/intern5/intern5SadTalk.png')
        // this.load.image('intern5Shock', 'sprites/intern5/intern5Shock.png')
        // this.load.image('intern5ShockTalk', 'sprites/intern5/intern5ShockTalk.png')

        this.load.image('topUI','UI_toplayer.png');
        this.load.image('bottomUI','UI_bottomlayer.png');

        this.load.image('bottomUI_left','UI_bottomlayer_left.png');
        this.load.image('UI_start','UI_start.png');

        this.load.image('topZoom','zoomOutlineTop.png');
        this.load.image('bottomZoom','zoomOutlineBottom.png');

        this.load.atlas('candidate1', 'sprites/intern1/candidate1.png', 'sprites/intern1/candidate1.json');
        this.load.atlas('candidate2', 'sprites/intern2/candidate2.png', 'sprites/intern2/candidate2.json');
        this.load.atlas('candidate3', 'sprites/intern3/candidate3.png', 'sprites/intern3/candidate3.json');
        this.load.atlas('candidate4', 'sprites/intern4/candidate4.png', 'sprites/intern4/candidate4.json');
        this.load.atlas('candidate5', 'sprites/intern5/candidate5.png', 'sprites/intern5/candidate5.json');

        this.load.atlas('loadingDots', 'loadingDots.png', 'loadingDots.json')

        // tilemap

        // scene 1

    }

    create() {
        this.scene.start('menuScene');
    }
}
