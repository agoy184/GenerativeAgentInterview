class MainLevel extends Phaser.Scene{
    constructor() {
        super('mainSceneGame');
    }

    async callChatGBT(message) {

        const apiKey = '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';
        const endpoint = `https://api.openai.com/v1/chat/completions`;
    
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": `application/json`,
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{"role": "user", "content": message}],
                temperature: 0.5,
                max_tokens: 512,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            })
        });
    
        const data = await response.json();
        //console.log(data.choices[0].message.content)
        return data.choices[0].message.content;     // ERROR: Cannot read properties of undefined
    }

    async relevance(In,mem){
        // In is the player input string and mem is core memory

        // dicionary for sorting top memories
        let dic ={}


        // if mem is a dictornary where key is the string and the value is the inportance
        // depends on how memory is implemented 
        // just need to iterate through mem to get strings and then importance value    

        console.log(mem.element)
        let len = mem.length 

        for( let i = 0; i < len; i++ ){

            let key=mem[i].element;

            //In should be player input and key is the memory 
            let text= `on a scale of 1 to 100 rate how connected these two phrases are with only a number: "${In}" and "${key}"`

            // console.log(text)

            // put text through GBT
            // if function is updated with memory then hopefully we should be able to leave it empty
            let response = await this.callChatGBT(text)
            
            //output response to console
            // console.log(response)
            
            //check if response is a number
            if (!this.isInteger(response)) {
                var tryAgain = "I only wanted you to respond only a whole number without additional words are symbols. On a scale of 1 to 100 how connected two phrases are: " +
                "\"" +
                In + 
                "\"" +
                " and " +
                "\"" +
                key + 
                "\". Try again.";
                while(!this.isInteger(response)){
                    console.log(tryAgain);
                    console.log("Try Again");
                    console.log(response);
                    response = await this.callChatGBT(tryAgain);
                }
                console.log('FOUND!', response);
            }

            // get numbers from string
            let NumbersFromString=0
            NumbersFromString= parseInt(response)

            //console.log(NumbersFromString)

            //find the relevance number 
            let rel = NumbersFromString            
            //console.log(rel)
            // get to total retrieval. simple way by just adding them.
            let retrieval = rel + mem[i].prority 

            //if 10 elements in dict
            if (Object.keys(dic).length == 10){
                // if lowest value in dict is lower than current retrieval
                if( Math.min(Object.values(dic)) < retrieval){

                    //find the key
                    let RepKey=Object.keys(obj).find(key => obj[key] === value)
                    //remove that element
                    dic.delete(RepKey)

                    dic[key]=retrieval

                }

            }
            else{
                //add to new dic with new number
                dic[key]=retrieval

            }
        }
        //array of top 10 memories
        // return x amount of relevant mem
        console.log(Object.keys(dic))
        return Object.keys(dic)   
    }

    //Importance
    //Prompts ChatGPT to rate the importance of a memory
    //Prompt from here: https://arxiv.org/pdf/2304.03442.pdf
    // On the scale of 1 to 10, where 1 is purely mundane
    // (e.g., brushing teeth, making bed) and 10 is
    // extremely poignant (e.g., a break up, college
    // acceptance), rate the likely poignancy of the
    // following piece of memory.
    // Memory: buying groceries at The Willows Market
    // and Pharmacy
    // Rating: <fill in></fill>
    async importance(memory) {
        var prompt = "On the scale of 1 to 100, where 1 is purely mundane" +
            "(e.g., brushing teeth, making bed) and 10 is" +
            "extremely poignant (e.g., a break up, college" +
            "acceptance), rate the likely poignancy of the" +
            "following piece of memory. " +
            `Memory: ${memory}` +
            "and Pharmacy" +
            "Only respond with one whole number from 1 to 100.";
        var response = await this.callChatGBT(prompt);
        console.log(response);
        return response;
    }

    //check if string is an integer from chatGPT
    isInteger(str) {
        return !isNaN(parseInt(str)) && Number.isInteger(parseFloat(str));
    }

    create() {
        //adding UI layers
        this.add.image(0,0, 'bottomUI').setDepth(-3).setOrigin(0,0);
        this.add.image(0,0, 'bottomUI_left').setDepth(-1).setOrigin(0,0);
        this.add.image(0,0, 'topUI').setDepth(10).setOrigin(0,0);


        //adding Zoom UI layers
        this.add.image(15,48, 'topZoom').setDepth(10).setOrigin(0,0).setScale(0.3625);
        this.add.image(15,425, 'bottomZoom').setDepth(10).setOrigin(0,0).setScale(0.3625);

        // Add interviewee NPC sprite
        this.candidate1 = this.add.sprite(-200, -50, 'candidate1').setScale(.7).setOrigin(0,0).setAlpha(1).setDepth(-2); //Jake
        this.candidate2 = this.add.sprite(-200, -50, 'candidate2').setScale(0.8).setOrigin(0,0).setAlpha(0).setDepth(-2);
        this.candidate3 = this.add.sprite(-350, -50, 'candidate3').setScale(2).setOrigin(0,0).setAlpha(0).setDepth(-2); //Clinton
        this.candidate4 = this.add.sprite(-200, -50, 'candidate4').setScale(0.7).setOrigin(0,0).setAlpha(0).setDepth(-2); //Linda
        this.candidate5 = this.add.sprite(-200, -50, 'candidate5').setScale(0.8).setOrigin(0,0).setAlpha(0).setDepth(-2);

        this.candidates = [this.candidate1,this.candidate2,this.candidate3,this.candidate4,this.candidate5];

        this.candidate1.setFrame('neutral (1)');
        this.candidate2.setFrame('neutral (1)');
        this.candidate3.setFrame('neutral (1)');
        this.candidate4.setFrame('neutral (1)');
        this.candidate5.setFrame('neutral (1)');

        //Neutral Talk Anim
        this.anims.create({
            key: 'neutralTalk1',
            frames: this.anims.generateFrameNames('candidate1', {
                prefix: 'neutral (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'neutralTalk2',
            frames: this.anims.generateFrameNames('candidate2', {
                prefix: 'neutral (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'neutralTalk3',
            frames: this.anims.generateFrameNames('candidate3', {
                prefix: 'neutral (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'neutralTalk4',
            frames: this.anims.generateFrameNames('candidate4', {
                prefix: 'neutral (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'neutralTalk5',
            frames: this.anims.generateFrameNames('candidate5', {
                prefix: 'neutral (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });

        //Happy Talk Anim
        this.anims.create({
            key: 'happyTalk1',
            frames: this.anims.generateFrameNames('candidate1', {
                prefix: 'happy (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'happyTalk2',
            frames: this.anims.generateFrameNames('candidate2', {
                prefix: 'happy (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'happyTalk3',
            frames: this.anims.generateFrameNames('candidate3', {
                prefix: 'happy (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'happyTalk4',
            frames: this.anims.generateFrameNames('candidate4', {
                prefix: 'happy (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'happyTalk5',
            frames: this.anims.generateFrameNames('candidate5', {
                prefix: 'happy (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });

        //Sad Talk Anim
        this.anims.create({
            key: 'sadTalk1',
            frames: this.anims.generateFrameNames('candidate1', {
                prefix: 'sad (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'sadTalk2',
            frames: this.anims.generateFrameNames('candidate2', {
                prefix: 'sad (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'sadTalk3',
            frames: this.anims.generateFrameNames('candidate3', {
                prefix: 'sad (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'sadTalk4',
            frames: this.anims.generateFrameNames('candidate4', {
                prefix: 'sad (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'sadTalk5',
            frames: this.anims.generateFrameNames('candidate5', {
                prefix: 'sad (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });

        //Shock Talk Anim
        this.anims.create({
            key: 'shockTalk1',
            frames: this.anims.generateFrameNames('candidate1', {
                prefix: 'shock (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'shockTalk2',
            frames: this.anims.generateFrameNames('candidate2', {
                prefix: 'shock (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'shockTalk3',
            frames: this.anims.generateFrameNames('candidate3', {
                prefix: 'shock (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'shockTalk4',
            frames: this.anims.generateFrameNames('candidate4', {
                prefix: 'shock (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'shockTalk5',
            frames: this.anims.generateFrameNames('candidate5', {
                prefix: 'shock (',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });
        
        //loading dots animation and sprite
        this.anims.create({
            key: 'load',
            frames: this.anims.generateFrameNames('loadingDots', {
                prefix: 'loading (',
                start: 1,
                end: 3,
                suffix: ')'
            }),
            frameRate: 4,
            repeat: -1
        });

        this.loadingAnim = this.add.sprite(30,500,'loadingDots').setOrigin(0,0).setScale(0.5);

        this.npcNames = ["Jake","Clinton","Linda"]
        this.currentNPC = 0

        // PERSON 1, Jake a charitable guy, Olympic gold metalist, with a record of being fired 55 times and highway robbery

        // this.jake_CoreMemory = {
        //     "Jake is a arrogant and confident." : 100,
        //     "Jake donated both of his kidneys.": 100,
        //     "Jake is a Olympic gold medalist.": 80,
        //     "Jake has been fired 55 times.": 80,
        //     "Jake has stolen two cars in his lifetime but never caught.": 90,
        //     "Jake's Dog is named Snuckles.": 40,
        //     "Jake's Dog Snuckles is 5 years old.": 50,
        //     "Jake's Dog Snuckles loves bagels.": 20,
        //     "Jake can't drive.": 50,
        //     "Jake can't jump that good and is sad about it.": 90,
        //     "Jake doesn't like being asked questions about the olympics.": 60,
        //     "Jake's mom thinks he isn't going to make it as a car thief.": 80
        // }
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


        // Create our Memory Stream
        this.jake_pQ = new PriorityQueue();
        this.clinton_pQ = new PriorityQueue();
        this.linda_pQ = new PriorityQueue();

        for (const key in this.jake_CoreMemory) {
            const value = this.jake_CoreMemory[key];
            this.jake_pQ.enqueue(key, value);
        }

        for (const key in this.clinton_CoreMemory) {
            const value = this.clinton_CoreMemory[key];
            this.clinton_pQ.enqueue(key, value);
        }

        for (const key in this.linda_CoreMemory) {
            const value = this.linda_CoreMemory[key];
            this.linda_pQ.enqueue(key, value);
        }

        // Set up Input
        this.topPrompt = this.add.text(410, 50, 'Enter your question:', { fontFamily: 'header', fontSize: '25px', fill: '#ffffff' });

        this.startQuestions = 5; //5;
        this.questionsLeft = this.startQuestions;
        // Set up Input
        this.questionsLeftText = this.add.text(30, 570, this.questionsLeft + ' Q\'s left', { fontFamily: 'header', fontSize: '36px', fill: '#000' }).setOrigin(0,0);

        const textEntry = this.add.text(410, 80, '', { fontFamily: 'type', fontSize: '15px',  fill: '#ffff00' });
        
        const monospacedFont = 'Courier New';
        this.textResponse = this.add.text(410, 140, '', { fontFamily: monospacedFont, fontSize: '12px', fill: '#ffffff' });

        this.input.keyboard.on('keydown', async event =>
        {

            if(event.keyCode === 38){
                this.currentNPC += 1
                if(this.currentNPC>2){
                    this.scene.start('resultsScene');  
                    this.currentNPC = 0
                }
                this.textResponse.setText('');
                textEntry.setText('');
                this.questionsLeft = this.startQuestions;
                this.questionsLeftText.setText(this.questionsLeft + ' Q\'s left');
                this.topPrompt.setText('Enter your question:');
                console.log("New NPC is: "+ this.npcNames[this.currentNPC]);

                if(this.currentNPC == 0){
                    for(var i=0; i<this.candidates.length; i++){
                        this.candidates[i].setAlpha(0);
                    }
                    this.candidate1.setAlpha(1);
                }
                if(this.currentNPC == 1){
                    for(var i=0; i<this.candidates.length; i++){
                        this.candidates[i].setAlpha(0);
                    }
                    this.candidate3.setAlpha(1);
                }
                if(this.currentNPC == 2){
                    for(var i=0; i<this.candidates.length; i++){
                        this.candidates[i].setAlpha(0);
                    }
                    this.candidate4.setAlpha(1);
                }
                this.candidate1.setFrame('neutral (1)');
                this.candidate2.setFrame('neutral (1)');
                this.candidate3.setFrame('neutral (1)');
                this.candidate4.setFrame('neutral (1)');
                this.candidate5.setFrame('neutral (1)');
            }

            if(this.questionsLeft>=0){
                if (textEntry.text.substr(textEntry.text.length - 1,textEntry.text.length) === "?" &&  event.keyCode === 13){
                    await this.run(textEntry.text)
                    textEntry.text = "";
                    this.questionsLeft-=1;
                    this.questionsLeftText.setText(this.questionsLeft + ' Q\'s left');
                    if (this.questionsLeft == 0){
                        this.topPrompt.setText('Say Thanks+Goodbye:');
                    }
                    if (this.questionsLeft < 0){
                        textEntry.setText('Click the Up Arrow to Move to the Next Candidate')
                        this.questionsLeftText.setText(0 + ' Q\'s left');
                    }    
                }
                else if (event.keyCode === 8 && textEntry.text.length > 0)
                {
                    textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
                }
                else if (textEntry.text.substr(textEntry.text.length - 1,textEntry.text.length) != "?" && 
                    (event.keyCode === 32 || event.keyCode === 191 || (event.keyCode >= 48 && event.keyCode < 90)))
                {
                    textEntry.text += event.key;
                }
            }
        });

        this.emotionSpeech = 'neutral';

    }

    //aycn + await management from chat gpt
    async run(inputString) {
        const asyncPromise = this.playerInputtedString(inputString);
        
        // Run something concurrently with the async function
        this.loadingAnim.anims.play('load');
        
        await asyncPromise;
        
        // this.loadingAnim.anims.stop('load');
    }

    async displayResponse(inputString){
        var textContent = this.textResponse.text;
        var newText = '';
        var displayText = '';
        newText = "\n\n" + newText;
        this.textResponse.setText(newText);
        //scroll out the response
        for(var i=0; i<inputString.length; i++){
            newText = newText + inputString[i];
            displayText = newText + textContent;
            //chat GPT slight delay in for loop
            await new Promise(resolve => setTimeout(resolve, 50));
            this.textResponse.setText(displayText);
        }
    }

    isEmotion(inputString){
        if(inputString == 'sad'){
            return true;
        }
        if(inputString == 'happy'){
            return true;
        }
        if(inputString == 'neutral'){
            return true;
        }
        if(inputString == 'shock'){
            return true;
        }
        return false
    }

    //prompt GPT for an emotion
    async whatEmotion(inputQuestion) {
        var gptQuestion = `What is the most likely emotion a candidate being interviewed would feel when asked this question: "${inputQuestion}">`
            + `only respond with one of the following words: (sad, happy, neutral, shock).`;
        var emotionResponse = await this.callChatGBT(gptQuestion);

        if (!this.isEmotion(emotionResponse)) {
            var tryAgain = "Remember to only respond with one of the following words: (sad, happy, neutral, shock). Try again.";
            while(!this.isEmotion(emotionResponse)){
                console.log(tryAgain);
                console.log("Try Again");
                console.log(emotionResponse);
                emotionResponse = await this.callChatGBT(tryAgain);
            }
            console.log('FOUND!', emotionResponse);
        }

        this.emotionSpeech = emotionResponse;
    }

    //aycnc + await management from chat gpt 
    async respondWithSpeach(inputString) {
        const asyncPromise = this.displayResponse(inputString);
        
        var visibleCandidate;
        var visibleCandidateNumber;
        // Run something concurrently with the async function
        for(var i=0; i<this.candidates.length; i++){
            if(this.candidates[i].alpha == 1){
                visibleCandidate = this.candidates[i];
                visibleCandidateNumber = i+1;
                this.candidates[i].anims.play(this.emotionSpeech + 'Talk' + visibleCandidateNumber);
            }
        }

        await asyncPromise;
        
        visibleCandidate.anims.stop(this.emotionSpeech + 'Talk' + visibleCandidateNumber);
    }

    async playerInputtedString(inputString) {
        
        // Pose question to AI in correct form
        // var responseHeight = 150;

        /*
        (NPC)'s status: (NPC) is being interviewed by (PLAYER NAME) for a job at a very important company.
        Observation: (PLAYER NAME) is asking another question in the interview
        Summary of relevant context from (NPC) memory:
        [1][2][3][4][5][6][7][8][9]
        (PLAYER NAME): (PLAYER INPUT)
        How would (NPC) respond to (PLAYER)
        */

        // Editable Variables
        // Test Case
        let pQ = new PriorityQueue();
        if(this.currentNPC == 0){ pQ = this.jake_pQ}
        if(this.currentNPC == 1){ pQ = this.clinton_pQ}
        if(this.currentNPC == 2){ pQ = this.linda_pQ}

        const relevant_memories = await this.relevance(inputString,pQ.qItems()) 
        const npc_name = this.npcNames[this.currentNPC]
        const player_name = "Interviewer"
        
        // Base prompt, always same
        let input_prompt = `${npc_name}'s status: ${npc_name} is being interviewed by ${player_name}\
            for a job at a very important company.\n\
            Observation: ${player_name} is asking another question in the interview.\n\
            Summary of relevant context from ${npc_name}'s memory:\n`
        
        // Add all relevant memories
        for(const element of relevant_memories){
            input_prompt += (element + "\n")
        }

        // Pose question
        input_prompt += `${player_name}: ${inputString}\nHow would ${npc_name} respond to ${player_name}?\n`

        // Limits to answer
        input_prompt += `Please respond as if you were ${npc_name}. Be brief in response, under 4 sentences.\n\
            Use casual language and don't be too descriptive.`

        var response_from_NPC = await this.callChatGBT(input_prompt)
    
        // For debugging
        //console.log(response_from_NPC)
        
        //console.log("OLD MEMORY STREAM: " + pQ.items);

        //Putting New Memories into Memory Stream/PQ
        var question = inputString; //questionToAsk[i];

        //vategorizing the question as an emotion for mii emotions
        this.whatEmotion(question);

        var newMemory = "You got asked the question: " + question;

        //experimenting with taking out having just the question as a memory

        // var importancePriority = await this.importance(newMemory);
        // console.log(typeof importancePriority)
        // if (this.isInteger(importancePriority)) {
        //     var importancePriorityNumber = parseInt(importancePriority);

        //     if(this.currentNPC == 0){  this.jake_pQ.enqueue(newMemory, importancePriorityNumber); }
        //     if(this.currentNPC == 1){  this.clinton_pQ.enqueue(newMemory, importancePriorityNumber);}
        //     if(this.currentNPC == 2){  this.linda_pQ.enqueue(newMemory, importancePriorityNumber);}
           
        // }
        // else{
        //     var tryAgain = "I only wanted you to respond with one number from 1 to 100 rating the importance of the memory: \"" +
        //     newMemory +
        //     "\". Try again.";
        //     while(!this.isInteger(importancePriority)){
        //         console.log("Try Again");
        //         console.log(importancePriority);
        //         importancePriority = await this.importance(tryAgain);
        //     }
        //     if(this.currentNPC == 0){  this.jake_pQ.enqueue(newMemory, importancePriorityNumber); }
        //     if(this.currentNPC == 1){  this.clinton_pQ.enqueue(newMemory, importancePriorityNumber);}
        //     if(this.currentNPC == 2){  this.linda_pQ.enqueue(newMemory, importancePriorityNumber);}
        //     // console.log(importancePriority);
        //     // console.log("ERROR: CHATGPT No Longer Prompts the same way");
        //     // throw new Error("ERROR: CHATGPT No Longer Prompts the same way");
        // }
        
        //Putting New Memories into Memory Stream/PQ
        var response = response_from_NPC; //questionToAsk[i];
        var newMemory = "You responded to the question: " + question + " With the response: " + response;
        var importancePriority = await this.importance(newMemory);
        console.log(typeof importancePriority)
        if (this.isInteger(importancePriority)) {
            var importancePriorityNumber = parseInt(importancePriority);
            if(this.currentNPC == 0){  this.jake_pQ.enqueue(newMemory, importancePriorityNumber); }
            if(this.currentNPC == 1){  this.clinton_pQ.enqueue(newMemory, importancePriorityNumber);}
            if(this.currentNPC == 2){  this.linda_pQ.enqueue(newMemory, importancePriorityNumber);}
        }
        else{
            var tryAgain = "I only wanted you to respond with one number from 1 to 100 rating the importance of the memory: \"" +
            newMemory +
            "\". Try again.";
            while(!this.isInteger(importancePriority)){
                console.log("Try Again");
                console.log(importancePriority);
                importancePriority = await this.importance(tryAgain);
            }
            if(this.currentNPC == 0){  this.jake_pQ.enqueue(newMemory, importancePriorityNumber); }
            if(this.currentNPC == 1){  this.clinton_pQ.enqueue(newMemory, importancePriorityNumber);}
            if(this.currentNPC == 2){  this.linda_pQ.enqueue(newMemory, importancePriorityNumber);}
        }

        var cutOff = 63;
        var counter = 0;
        var partsString = '';
        for(var i=0; i<response_from_NPC.length; i++){
            partsString += response_from_NPC[i];
            counter += 1;
            if(counter>cutOff){
                partsString += '\n';
                counter = 0;
            } 
        }

        this.loadingAnim.anims.stop('load');
        
        console.log(response_from_NPC);
        console.log('got to this.respondWithSpeech');
        await this.respondWithSpeach(partsString);
        console.log(response_from_NPC);
        console.log(this.emotionSpeech);
    }
}

// https://www.geeksforgeeks.org/implementation-priority-queue-javascript/ 
// Pririority Queue From Link Above
// to store element and its priority
class QElement {
    constructor(element, priority)
    {
        this.element = element;
        this.priority = priority;
    }

    qElement() {
        return this.element;
    }

    qPriority() {
        return this.priority;
    }
}

// PriorityQueue class
class PriorityQueue {

    // An array is used to implement priority
    constructor() {
        this.items = [];
    }

    // enqueue function to add element
    // to the queue as per priority
    enqueue(element, priority) {
        // creating object from queue element
        var qElement = new QElement(element, priority);
        var contain = false;
    
        // iterating through the entire
        // item array to add element at the
        // correct location of the Queue
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                // Once the correct location is found it is
                // enqueued
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }
    
        // if the element have the highest priority
        // it is added at the end of the queue
        if (!contain) {
            this.items.push(qElement);
        }
    }

    // dequeue method to remove
    // element from the queue
    dequeue() {
        // return the dequeued element
        // and remove it.
        // if the queue is empty
        // returns Underflow
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

    // front function
    front() {
        // returns the highest priority element
        // in the Priority queue without removing it.
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }

    // rear function
    rear() {
        // returns the lowest priority
        // element of the queue
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[this.items.length - 1];
    }

    // isEmpty function
    isEmpty() {
        // return true if the queue is empty.
        return this.items.length == 0;
    }

    // printQueue function
    // prints all the element of the queue
    printPQueue() {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i].element + " ";
        return str;
    }
    
    qItems() {
        return this.items;
    }

    
}

