// https://stackoverflow.com/questions/76917525/module-has-no-exported-member-when-importing-from-openai
// https://github.com/openai/openai-node/discussions/217

// New
import OpenAI from 'openai';

console.log("OpenAI:", OpenAI)

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY
console.log(apiKey)

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{"role": "user", "content": "Hello!"}],
});
console.log(chatCompletion.choices[0].message);