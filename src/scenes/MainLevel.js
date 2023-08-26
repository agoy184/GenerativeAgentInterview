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

    relevance(In,mem){
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
            let response = this.callChatGBT(text)

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

            break

        }

        //array of top 10 memories

        // return x amount of relevant mem

        return Object.keys(dic)
        
    }


    create() {
        //CoreMemory= //PQ

        //this.callChatGBT("Give me recipes for cheese!")
        const response = this.callChatGBT("Give me recipes for cheese!");
        console.log(response)

        // get player input string 
        this.add.text(10, 10, 'Enter your question:', { font: '32px Courier', fill: '#ffffff' });

        const textEntry = this.add.text(10, 50, '', { font: '32px Courier', fill: '#ffff00' });

        this.input.keyboard.on('keydown', event =>
        {

            if (event.keyCode === 13){
                this.playerInputtedString(textEntry.text)

                // DEBUG no edits to CHAT GBT INPUT
                //const response = this.callChatGBT(textEntry.text)
                //console.log(response)
                textEntry.text = ""
            }
            else if (event.keyCode === 8 && textEntry.text.length > 0)
            {
                textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
            }
            else if (event.keyCode === 32 || event.keyCode === 190 || event.keyCode === 191 || (event.keyCode >= 48 && event.keyCode < 90))
            {
                textEntry.text += event.key;
            }

        });
    }

    playerInputtedString(inputString) {

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


        let RelMem=this.relevance(PlayerInput,CoreMemory) 

        console.log(RelMem)


        // Pose question to AI in correct form
        

        // After relevant memories and Important memories are (Jonah)
        // found feed into GBT to get ai response 
        // Response=this.callChatGBT(PlayerInput,RelMem) 
        

        //PlayerInput is then added into CoreMemory () (Dylan)

        //Have the ai write out Response (Abel)

        


    }


}