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
        this.add.text(10, 10, 'Enter your question:', { fontFamily: 'header', fontSize: '36px', fill: '#ffffff' });

        const textEntry = this.add.text(10, 50, '', { fontFamily: 'type', fontSize: '36px',  fill: '#ffff00' });

        this.input.keyboard.on('keydown', event =>
        {

            if (textEntry.text.substr(textEntry.text.length - 1,textEntry.text.length) === "?" &&  event.keyCode === 13){
                this.playerInputtedString(textEntry.text)

                // DEBUG no edits to CHAT GBT INPUT
                // const response = this.callChatGBT(textEntry.text)
                // console.log(response)

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

    playerInputtedString(inputString) {

        //Memory Stream 
        // Priority Queue (Dylan)
        // https://www.geeksforgeeks.org/implementation-priority-queue-javascript/


        //find relevant of memories probably top 10? (Michael) 
        //RelMem=this.relevance(PlayerInput,CoreMemory) 

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
        const relevant_memories = ["Steve is a olympic gold metalist",
                                    "Steve hates chickens",
                                    "Steve remembers seeing Stacy at the grocery store",
                                    "Steve's mom says he is not qualified for the job",
                                    "Jim is a cook",
                                    "Steve hates rainbows",
                                    "Steve is skilled with Excel and Google Docs",
                                    "Steve likes writing poems",
                                    "Steve burned his mom's house down in 2006."]
        const npc_name = "Steve"
        const player_name = "Jonah"
        
        // Base prompt, always same
        let input_prompt = `${npc_name}'s status: ${npc_name} is being interviewed by ${player_name}\
            for a job at a very important company.\n\
            Observation: ${player_name} is asking another question in the interview.\n\
            Summary of relevant context from ${npc_name}'s memory:\n`
        
        // Add all relevant memories
        relevant_memories.forEach((element) => input_prompt += (element + "\n"))

        // Pose question
        input_prompt += `${player_name}: ${inputString}\nHow would ${npc_name} respond to ${player_name}?\n`

        // Limits to answer
        input_prompt += `Please respond as if you were ${npc_name}. Be brief in response, under 4 sentences.\n\
            Use casual language and don't be too descriptive. Be confident but a little arrogant.`

        const response_from_NPC = this.callChatGBT(input_prompt)
    
        // For debugging
        console.log(response_from_NPC)
        
        //PlayerInput is then added into CoreMemory () (Dylan)

        //Have the ai write out Response (Abel)
    }


}