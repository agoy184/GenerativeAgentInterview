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
            let text= "on a scale of 1 to 100 rate how connected these two phrases are with only a number: "+In+"and, "+ key


            //console.log(text)

            // put text through GBT
            // if function is updated with memory then hopefully we should be able to leave it empty
            let response = await this.callChatGBT(text)
            

            //console.log(response)

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
        // Add interviewee NPC sprite
        this.intern1 = this.add.sprite(215, 355, 'intern1').setScale(0.7);
        // this.intern5 = this.add.sprite(355, 355, 'intern5').setScale(0.7);
        // this.intern5 = this.add.sprite(355, 355, 'intern5').setScale(0.7);
        // this.intern5 = this.add.sprite(355, 355, 'intern5').setScale(0.7);
        this.intern5 = this.add.sprite(355, 355, 'intern5').setScale(0.7);


        //CoreMemory= //PQ

        this.CoreMemory= {
            "Steve likes dogs":   4,
            "Steve worked at the cat cafe": 4,
            "Steve has a freight licence":  6,
            "Steve is a olympic gold medalist":  9,
            "Steve burned a few houses down":  2,
            "Steve really likes megazord":  9,
            "Steve cant drive":  3,
            "Steve thinks hes super cool":  8,
            "Steve was a major part of watergate":  6,
            "Steve voted for himself in the last election":  8,
            "Steve cant read":  5,
            "Steve cant jump that good":  3,
            "Steve eats cats":   5,
        }

        // Create our Memory Stream
        this.pQ = new PriorityQueue();
        for (const key in this.CoreMemory) {
            const value = this.CoreMemory[key];
            console.log(`Key: ${key}, Value: ${value}`)

            this.pQ.enqueue(key, value);
        }

        // Set up Input
        this.add.text(10, 10, 'Enter your question:', { fontFamily: 'header', fontSize: '36px', fill: '#ffffff' });

        const textEntry = this.add.text(10, 50, '', { fontFamily: 'type', fontSize: '36px',  fill: '#ffff00' });
        
        const monospacedFont = 'Monaco';
        this.textResponse = this.add.text(10, 200, '', { fontFamily: monospacedFont, fontSize: '16px', fill: '#ffffff' });

        this.input.keyboard.on('keydown', event =>
        {

            if (textEntry.text.substr(textEntry.text.length - 1,textEntry.text.length) === "?" &&  event.keyCode === 13){
                this.playerInputtedString(textEntry.text)

                textEntry.text = ""
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

        });

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
        const relevant_memories = await this.relevance(inputString,this.pQ.qItems()) 
        const npc_name = "Steve"
        const player_name = "Jonah"
        
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
            Use casual language and don't be too descriptive. Be confident but a little arrogant.`

        var response_from_NPC = await this.callChatGBT(input_prompt)
    
        // For debugging
        console.log(response_from_NPC)
        
        console.log("OLD MEMORY STREAM: " + this.pQ.items);

        //Putting New Memories into Memory Stream/PQ
        var question = inputString; //questionToAsk[i];
        var newMemory = "You got asked the question: " + question;
        var importancePriority = await this.importance(newMemory);
        console.log(typeof importancePriority)
        if (this.isInteger(importancePriority)) {
            var importancePriorityNumber = parseInt(importancePriority);
            this.pQ.enqueue(newMemory, importancePriorityNumber);
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
            this.pQ.enqueue(newMemory, importancePriorityNumber);
            // console.log(importancePriority);
            // console.log("ERROR: CHATGPT No Longer Prompts the same way");
            // throw new Error("ERROR: CHATGPT No Longer Prompts the same way");
        }
        
        //Putting New Memories into Memory Stream/PQ
        var response = response_from_NPC; //questionToAsk[i];
        var newMemory = "You responded to the question: " + question + " With the response: " + response;
        var importancePriority = await this.importance(newMemory);
        console.log(typeof importancePriority)
        if (this.isInteger(importancePriority)) {
            var importancePriorityNumber = parseInt(importancePriority);
            this.pQ.enqueue(newMemory, importancePriorityNumber);
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
            this.pQ.enqueue(newMemory, importancePriorityNumber);
        }

        console.log("UPDATED MEMORY STREAM: " + this.pQ.printPQueue());

        console.log("Response: ", response_from_NPC)
        //Have the ai write out Response (Abel)

        console.log("Initiating response")
        // this.add.text(10, 100, 'Response:', { fontFamily: 'header',fontSize: '36px', fill: '#ffffff' });
        // var x = 0
        // var ff = String(response_from_NPC);
        // //while (x == 0) {
        // //    if(ff.length >= 15) {
        //         console.log(ff.length);
        //         console.log("long");
        // //       ff.insert(15, '\n');
        // //   } else {
        // //       x++;
        // //   }
        // // }
        // const parts = ff.split(".");
        // ff = ff.split("!");

        // console.log(parts)

        // var partsString = "";
        // for(var i=0; i<parts.length; i++){
        //     partsString += parts[i] + '.' + '\n';
        // }
        var cutOff = 140;
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

        var textContent = this.textResponse.text
        this.textResponse.setText(partsString + "\n\n" + textContent);

    }

    update() {
        
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

