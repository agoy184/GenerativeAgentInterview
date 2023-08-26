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
        console.log(data.choices[0].message.content)
        return data.choices[0].message.content;
    }

    relevance(In,mem){
        // In is the player input string and mem is core memory
        
        //prompt GBT "on a scale of 1 to 100 rate the relevancy of these two statements  playerinput memory"
        
        // return x amount of relevant mem
    }


    create() {
        //CoreMemory= //PQ

        //this.callChatGBT("Give me recipes for cheese!")
        //const response = this.callChatGBT("Give me recipes for cheese!");
        //console.log(response)

        // get player input string 
        this.add.text(10, 10, 'Enter your question:', { font: '32px Courier', fill: '#ffffff' });

        const textEntry = this.add.text(10, 50, '', { font: '32px Courier', fill: '#ffff00' });

        this.input.keyboard.on('keydown', event =>
        {

            if (event.keyCode === 13){
                playerInputtedString(textEntry.text)

                // DEBUG no edits to CHAT GBT INPUT
                const response = this.callChatGBT(textEntry.text)
                console.log(response)
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
        //RelMem=this.relevance(PlayerInput,CoreMemory) 

        // Pose question to AI in correct form
        

        // After relevant memories and Important memories are (Jonah)
        // found feed into GBT to get ai response 
        // Response=this.callChatGBT(PlayerInput,RelMem) 
        

        //PlayerInput is then added into CoreMemory () (Dylan)

        //Have the ai write out Response (Abel)

        


    }


}