//How to use OpenAI with JS
//https://rollbar.com/blog/chatgpt-api-with-javascript/

require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY
console.log(apiKey)

const { Configuration, OpenAIApi } = require("openai");

console.log("Configuration:", Configuration);
console.log("OpenAIApi:", OpenAIApi);

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function runCompletion () {
    const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "How are you today?",
    max_tokens:4000
    });
    console.log(completion.data.choices[0].text);
}
runCompletion();