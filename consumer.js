const { kafka } = require('./client');
const group = process.argv[2];

async function consumer() {
    const consumer = kafka.consumer({ groupId: group });
    console.log("Consumer Connecting...");

    await consumer.connect();
    console.log("Consumer Connected Successfully !!");

    await consumer.subscribe({ topic: "rider-updates", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
                key: message.key.toString(),
                partition,
                topic
            });
        }
    });
}

consumer().catch(console.error);