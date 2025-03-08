const { kafka } = require("./client");

async function init() {
    const admin = kafka.admin();
    console.log("Admin Connecting...");

    await admin.connect();
    console.log("Admin Connected Successfully !!");

    console.log("Creating Topics...'[rider-updates]'");

    await admin.createTopics({
        topics: [
            {
                topic: "rider-updates",
                numPartitions: 2
            }
        ]
    });

    console.log("'[rider-updates]' Topics Created Successfully !!");

    console.log("Disconnecting Admin...");

    await admin.disconnect();
}

init().catch(console.error);