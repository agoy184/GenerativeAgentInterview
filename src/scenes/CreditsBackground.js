class CreditsBackground extends Phaser.Scene {
    constructor() {
        super('creditsBackgroundScene');
    }

    create() {
        let menuConfig = {
            fontFamily: 'Verdana',
            fontSize: '28px',
            backgroundColor: '#303030',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
 
        let smallConfig = {
            fontFamily: 'Verdana',
            fontSize: '17px',
            backgroundColor: '#303030',
            color: '#FFFFFF',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.text(game.config.width/2, game.config.height/9, 'Credits 2', menuConfig).setOrigin(0.5);

        // instructions
        this.add.text(game.config.width/1.35, 8*game.config.height/9, 'Press R to return to the title screen menu', smallConfig).setOrigin(0.5).setFontSize(12);
        this.add.text(game.config.width/4, 8*game.config.height/9, 'Press D to view credits 1', smallConfig).setOrigin(0.5).setFontSize(12);

        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyD)) {
            this.scene.start("creditsMusicScene");    
        }

        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start("menuScene");    
        }
    }

}