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
        // Set up Input
        this.prompt = this.add.text(10, 10, 'Choose who to Hire:', { fontFamily: 'header', fontSize: '32px', fill: '#ffffff' });

        //options
        this.option1 = this.add.text(10, 75, 'Jake', { fontFamily: 'header', fontSize: '28px' }).setColor('#668de3');
        this.option2 = this.add.text(10, 125, 'Clinton', { fontFamily: 'header', fontSize: '28px' }).setColor('#ffffff');
        this.option3 = this.add.text(10, 175, 'Linda', { fontFamily: 'header', fontSize: '28px' }).setColor('#ffffff');

        this.optionIndex = 0;
        this.options = [this.option1, this.option2, this.option3];
        // define keys
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.restart = this.add.text(10, 275, 'Click Enter to Choose', { fontFamily: 'header', fontSize: '25px', fill: '#ffffff' }).setOrigin(0,1);
        this.restart = this.add.text(10, 635, 'Reload to restart the game', { fontFamily: 'header', fontSize: '25px', fill: '#ffffff' }).setOrigin(0,1);
        
        //Have you chosen? Boolean
        this.chose = false;
        console.log(this.option1);
        console.log(this.option2);
        console.log(this.option3);

        // Add interviewee NPC sprite
        this.candidate1 = this.add.sprite(-20, 190, 'candidate1').setScale(0.4).setOrigin(0,0).setAlpha(0); //Jake
        this.candidate2 = this.add.sprite(-20, 190, 'candidate2').setScale(0.8).setOrigin(0,0).setAlpha(0);
        this.candidate3 = this.add.sprite(-20, 190, 'candidate3').setScale(0.8).setOrigin(0,0).setAlpha(0); //Clinton
        this.candidate4 = this.add.sprite(-20, 190, 'candidate4').setScale(0.4).setOrigin(0,0).setAlpha(0); //Linda
        this.candidate5 = this.add.sprite(-20, 190, 'candidate5').setScale(0.8).setOrigin(0,0).setAlpha(0);

        this.candidates = [this.candidate1,this.candidate2,this.candidate3,this.candidate4,this.candidate5];

        this.candidate1.setFrame('neutral (1)');
        this.candidate2.setFrame('neutral (1)');
        this.candidate3.setFrame('neutral (1)');
        this.candidate4.setFrame('neutral (1)');
        this.candidate5.setFrame('neutral (1)');

        // PERSON 1, Jake a charitable guy, Olympic gold metalist, with a record of being fired 55 times and highway robbery
        this.jake_CoreMemory = {
            "Jake is a tiny bit arrogant and confident." : 100,
            "Jake donated both of his kidneys.": 100,
            "Jake used to work as a garbage boy at Safeway": 90,
            "Jake can only cook Quesadillas and French Toast.": 80,
            "Jake can't jump that good and is sad about it.": 80,
            "Jake was part of the cooking club in high school.": 80,
            "Jake is a high school student in Santa Cruz.": 70,
            "Jake has been fired twice.": 70,
            "Jake takes short bathroom breaks, but he peed his pants one time from going too fast.": 60,
            "Jake burns his food often, and his mother says he’s proud of him": 50,
            "Jake has a 3.6 GPA.": 50, 
            "Jake does track at his high school.": 40,
            "Jake can't drive.": 20
        }

        // PERSON 2, Clinton a former class president of his elementary school, and shy about his CEO position at Microsoft
        this.clinton_CoreMemory = {
            "Clinton is kind and shy" : 100,
            "Clinton is a former class president of his elementary school.": 100,
            "Clinton hates questions about his relationships." : 90,
            "Clinton is shy about his CEO position at Microsoft.": 80,
            "Clinton loves ice cream, but only in a dish.": 70,
            "Clinton has no pets and is sad about it.": 40,
            "Clinton saw Jake, the olympic gold medalist, at the store last week.": 50,
            "Clinton woke up at 7:53 AM this morning.": 30,
            "Jessica, Clinton's Wife, loves apple cider donuts.": 20,
            "Clinton is shy about his favorite song, The Pokemon Theme.": 10,
            "Clinton has organized many students in his elementary school.": 40
        }

        // PERSON 3, Linda a pencil collector and poet but also stole every pencil she owns
        this.linda_CoreMemory = {
            "Linda is nice but a bit weird": 100,
            "Linda is a pencil collector with 576 pencils in her house": 80,
            "Linda likes sleeping on Tuesdays": 70,
            "Linda has stolen every pencil she owns, minus one which her dad gave her": 100,
            "Linda is nervous people will find out about her pencil theft": 100,
            "Linda has eaten nothing for lunch": 50,
            "Linda lives in a small Suburb of Brooklyn": 40,
            "Linda hates how many trees her neighbor has": 30,
            "Linda likes eating cake donuts": 30,
            "Linda likes eating hot dogs but not with ketchup": 40      
        }

        //selected person detail
        this.detailsTop = this.add.text(450, 10, '', { fontFamily: 'header', fontSize: '32px', fill: '#000' }).setOrigin(0,0);
        this.details = this.add.text(380, 100, '', { fontFamily: 'header', fontSize: '15px', fill: '#000' }).setOrigin(0,0);
    }
    
    update() {
        // if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
        //     this.scene.start('RoadScene');    
        // }
        if(!this.chose){
            if (Phaser.Input.Keyboard.JustDown(this.keyDOWN)) {
                // console.log(this.optionIndex);
                // console.log(this.options[this.optionIndex].color);
                this.options[this.optionIndex].setColor('#ffffff');
                this.optionIndex += 1;
                if( !(this.optionIndex<this.options.length) ){
                    this.optionIndex = 0;
                }
                this.options[this.optionIndex].setColor('#668de3');
                // console.log(this.optionIndex);
            }

            if (Phaser.Input.Keyboard.JustDown(this.keyUP)) {
                // console.log(this.optionIndex);
                // console.log(this.options[this.optionIndex].color)
                this.options[this.optionIndex].setColor('#ffffff');
                this.optionIndex -= 1;
                if( this.optionIndex < 0 ) {
                    this.optionIndex = this.options.length-1;
                }
                this.options[this.optionIndex].setColor('#668de3');
                // console.log(this.optionIndex);
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.keyENTER)) {
            this.chose = true;
            var newDetailText = '';
            if(this.optionIndex == 0){
                this.candidate1.setAlpha(1);
                newDetailText = '';
                this.detailsTop.setText('You chose Jake.\nHere are his details:\n');
                for(const key in this.jake_CoreMemory){
                    var value = this.jake_CoreMemory[key];
                    newDetailText += key+': '+value+'\n';
                }
                this.details.setText(newDetailText);

                // //chat GPT set text bounds
                // const textBounds = details.getBounds();
                // const textWidth = textBounds.width;
                // const textHeight = textBounds.height;
                // const gameWidth = this.sys.game.config.width;
                // const gameHeight = this.sys.game.config.height;
            }
            if(this.optionIndex == 1){
                this.candidate3.setAlpha(1);
                this.detailsTop.setText('You chose Clinton.\nHere are his details:\n');
                newDetailText = '';
                for(const key in this.clinton_CoreMemory){
                    var value = this.clinton_CoreMemory[key];
                    newDetailText += key+': '+value+'\n';
                }
                this.details.setText(newDetailText);
            }
            if(this.optionIndex == 2){
                this.candidate4.setAlpha(1);
                this.detailsTop.setText('You chose Linda.\nHere are her details:\n');
                newDetailText = '';
                for(const key in this.linda_CoreMemory){
                    var value = this.linda_CoreMemory[key];
                    newDetailText += key+': '+value+'\n';
                }
                this.details.setText(newDetailText);
            }
        }
    }
}