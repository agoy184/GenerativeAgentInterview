async function callChatGBT(message) {

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
            str += this.items[i].element + ",\n";
        return str;
    }   
}

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

//Importance
//Prompt from here: https://arxiv.org/pdf/2304.03442.pdf
// On the scale of 1 to 10, where 1 is purely mundane
// (e.g., brushing teeth, making bed) and 10 is
// extremely poignant (e.g., a break up, college
// acceptance), rate the likely poignancy of the
// following piece of memory.
// Memory: buying groceries at The Willows Market
// and Pharmacy
// Rating: <fill in></fill>

//rates the importance of a memoryby prompting GPT
async function importance(memory) {
    var prompt = "On the scale of 1 to 10, where 1 is purely mundane" +
        "(e.g., brushing teeth, making bed) and 10 is" +
        "extremely poignant (e.g., a break up, college" +
        "acceptance), rate the likely poignancy of the" +
        "following piece of memory. " +
        `Memory: ${memory}` +
        "and Pharmacy" +
        "Only say a number.";
    var response = await callChatGBT(prompt);
    console.log(response);
    return response;
}

var pQ = new PriorityQueue();
for (const key in CoreMemory) {
    const value = CoreMemory[key];
    console.log(`Key: ${key}, Value: ${value}`)

    pQ.enqueue(key, value);
}

console.log('\n Break \n');
console.log(pQ.printPQueue());
console.log(pQ.items);
console.log('\n Break \n');

let questionToAsk = [
    "Do you like dogs?",
    "What is your prior job experiences?",
    "Are you afraid of clowns?",
    "What skills could you add to this company?",
    "What is a time that you were a leader?"
]

for (let i = 0; i < questionToAsk.length; i++) {
    var question = questionToAsk[i];
    var newMemory = "You got asked the question: " + question;
    var importancePriority = await importance(newMemory);

    console.log(typeof importancePriority)
    //check if string is an integer from chatGPT
    function isInteger(str) {
        return !isNaN(parseInt(str)) && Number.isInteger(parseFloat(str));
    }

    if (isInteger(importancePriority)) {
        var importancePriorityNumber = parseInt(importancePriority);
        pQ.enqueue(newMemory, importancePriorityNumber);
    }
}

console.log(pQ.items);