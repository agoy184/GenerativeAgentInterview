// // How to use OpenAI with JS
// // https://rollbar.com/blog/chatgpt-api-with-javascript/
// // https://stackoverflow.com/questions/76917525/module-has-no-exported-member-when-importing-from-openai
// // https://github.com/openai/openai-node/discussions/217

// // New
// import OpenAI from 'openai';
// import dotenv from 'dotenv';

// export async function callChatGBT(question){
//     const apiKey = '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'
//     const openai = new OpenAI({
//         apiKey: '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' // This is also the default, can be omitted
//     });
    
//     //const question = "Act like intern being interviewed. Tell me about your past job experiences as a game development programmer.  Tell me about the games you've made, and the tools that you use (Game Engines, Types of games).  Also tell me about your strengths and weaknesses";
    
//     const chatCompletion = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [{"role": "user", "content": question}],
//     });

//     //console.log(chatCompletion.choices[0].message);
//     console.log(chatCompletion.choices[0].message['content']);
// }



