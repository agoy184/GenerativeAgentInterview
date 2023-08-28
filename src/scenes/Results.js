//show results of the characters you chose
//shows the characteristics of the person you chose
//shows if it was a good choice or not

class Results extends Phaser.Scene{
    constructor(){
        super('resultsScene')
    }

    preload(){

    }

    create(){    

        // define keys
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        
    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.scene.start('RoadScene');    
        }
    }
}