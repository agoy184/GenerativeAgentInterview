class MainLevel extends Phaser.Scene{
    constructor() {
        super('mainSceneGame');
    }

    async getResponseFromAPI(message) {

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
                messages: [{"role": "user", "content": "Hello!"}],
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

    callChatGBT(prompt){

        // const apiKey = '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';
        
        // async function getResponseFromAPI(message) {

        //     const apiKey = "sk-myapikey";
        //     const endpoint = `https://api.openai.com/v1/completions`;
        
        //     const response = await fetch(endpoint, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": `application/json`,
        //             "Authorization": `Bearer ${apiKey}`,
        //         },
        //         body: JSON.stringify({
        //             model: "text-davinci-003",
        //             prompt: "test prompt", 
        //             temperature: 0.5,
        //             max_tokens: 512,
        //             top_p: 1,
        //             frequency_penalty: 0,
        //             presence_penalty: 0,
        //         })
        //     });
        
        //     const data = await response.json();
        //     return data.choices[0].text;
        // }

        // console.log("called")
        // const openai = new OpenAI({
        //     apiKey: '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' // This is also the default, can be omitted
        // });
        
        // const chatCompletion = await openai.chat.completions.create({
        //     model: "gpt-3.5-turbo",
        //     messages: [{"role": "user", "content": question}],
        // });

        // console.log("reached")
        // console.log(chatCompletion.choices[0].message['content']);
    }

    relevance(In,mem){
        // In is the player input string and mem is core memory
        
        //


        
        // return x amount of relevant mem
    }


    create() {
        //CoreMemory= //PQ

        console.log("started")
        //this.callChatGBT("Give me recipes for cheese!")
        const response = this.getResponseFromAPI("Give me recipes for cheese!");
        console.log("ended")

    }

    update() {


        // get player input string 
        //PlayerInput = string

        //find relevant of memories  probably top 10? 
        //RelMem=this.relevance(PlayerInput,CoreMemory)

        // After relevant memories are found feed into GBT to get ai response 
        //Response=this.callChatGBT(PlayerInput,RelMem)

        //PlayerInput is then added into CoreMemory

        //Have the ai write out Response 




    }


}