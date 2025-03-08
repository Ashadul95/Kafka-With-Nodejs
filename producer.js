const { kafka } = require('./client');
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function init() {
    const producer = kafka.producer();
    console.log("Producer Connecting...");

    await producer.connect();
    console.log("Producer Connected Successfully !!");

    rl.setPrompt("> ");
    rl.prompt();

    rl.on("line", async function (line) {
        const [riderName, location] = line.split(" ");


        await producer.send({
            topic: "rider-updates",
            messages: [
                {
                    value: JSON.stringify({
                        rider_id: 1,
                        latitude: 19.0760,
                        longitude: 72.8777,
                        timestamp: Date.now(),
                        name: riderName,
                        location: location
                    }),
                    partition: location === "north" ? 0 : 1,
                    key: "rider-1"
                }
            ]
        });

    }).on("close", async () => {
        await producer.disconnect
    }
    );



}

init().catch(console.error);