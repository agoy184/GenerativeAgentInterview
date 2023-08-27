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
        return data.choices[0].message.content;
    }

    async relevance(In,mem){
        // In is the player input string and mem is core memory

        // dicionary for sorting top memories 
        let dic ={}


        // if mem is a dictornary where key is the string and the value is the inportance
        // depends on how memory is implemented 
        // just need to iterate through mem to get strings and then importance value    
        for( let key in mem){

            //In should be player input and key is the memory 
            let text= "on a scale of 1 to 10 rate the relevancy of these two statements only say a number. "+In+" "+key

            console.log(text)

            // put text through GBT
            // if function is updated with memory then hopefully we should be able to leave it empty
            let response = await this.callChatGBT(text)
            

            console.log(response)

            // get numbers from string
            let NumbersFromString=0
            NumbersFromString= parseInt(response)

            //console.log(NumbersFromString)

            //find the relevance number 
            let rel = NumbersFromString

            
            console.log(rel)



            // get to total retrieval. simple way by just adding them.
            let retrieval = rel + mem[key]

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


    create() {
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        //CoreMemory= //PQ

        //this.callChatGBT("Give me recipes for cheese!")
        const response = this.callChatGBT("Give me recipes for cheese!");
        console.log(response)

        // get player input string 
        this.add.text(10, 10, 'Enter your question:', { fontFamily: 'header', fontSize: '36px', fill: '#ffffff' });

        const textEntry = this.add.text(10, 50, '', { fontFamily: 'type', fontSize: '36px',  fill: '#ffff00' });

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

    update() {

        if (Phaser.Input.Keyboard.JustDown(keyENTER)) {
            console.log("Initiating response")
            this.add.text(10, 100, 'Response:', { fontFamily: 'header', fontSize: '36px', fill: '#ffffff' });
        }
    }

    async playerInputtedString(inputString) {

        //PlayerInput = string (Jonah) 

        //Memory Stream 
        // Priority Queue (Dylan) 
        // https://www.geeksforgeeks.org/implementation-priority-queue-javascript/ 
        
        
        

        //find relevant of memories probably top 10? (Michael) 


        let PlayerInput="do you eat cats?"

        let CoreMemory= {
            "Steve likes dogs":   4,
            "Steve worked at the cat cafe": 3,
            "Steve has a freight licence":  6,
            "Steve is a olympic gold medalist":  9,
            "Steve burned a few houses down":  2,
            "Steve really likes megazord":  9,
            "Steve cant drive":  3,
            "Steve thinks hes super cool":  8,
            "Steve was a major part of watergate":  6,
            "Steve voted for himslef in the last election":  8,
            "Steve cant read":  5,
            "Steve cant jump that good":  1,
            "Steve eats cats":   5,
        }

        // Pose question to AI in correct form
        
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
        const relevant_memories = await this.relevance(PlayerInput,CoreMemory) 
        const npc_name = "Steve"
        const player_name = "Jonah"
        
        // Base prompt, always same
        let input_prompt = `${npc_name}'s status: ${npc_name} is being interviewed by ${player_name}\
            for a job at a very important company.\n\
            Observation: ${player_name} is asking another question in the interview.\n\
            Summary of relevant context from ${npc_name}'s memory:\n`
        
        
        console.log(typeof  relevant_memories)
        // Add all relevant memories
        for(const element of relevant_memories){
            input_prompt += (element + "\n")

        }
        //relevant_memories.forEach((element) => input_prompt += (element + "\n"))

        // Pose question
        input_prompt += `${player_name}: ${inputString}\nHow would ${npc_name} respond to ${player_name}?\n`

        // Limits to answer
        input_prompt += `Please respond as if you were ${npc_name}. Be brief in response, under 4 sentences.\n\
            Use casual language and don't be too descriptive. Be confident but a little arrogant.`

        var response_from_NPC = this.callChatGBT(input_prompt)
    
        // For debugging
        console.log(response_from_NPC)
        
        //PlayerInput is then added into CoreMemory () (Dylan)

        //Have the ai write out Response (Abel)
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
}

// PriorityQueue class
class PriorityQueue {

    // An array is used to implement priority
    constructor()
    {
        this.items = [];
    }

    // enqueue function to add element
    // to the queue as per priority
    enqueue(element, priority)
    {
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
    dequeue()
    {
        // return the dequeued element
        // and remove it.
        // if the queue is empty
        // returns Underflow
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

    // front function
    front()
    {
        // returns the highest priority element
        // in the Priority queue without removing it.
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }

    // rear function
    rear()
    {
        // returns the lowest priority
        // element of the queue
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[this.items.length - 1];
    }

    // isEmpty function
    isEmpty()
    {
        // return true if the queue is empty.
        return this.items.length == 0;
    }

    // printQueue function
    // prints all the element of the queue
    printPQueue()
    {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i].element + " ";
        return str;
    }   
}