Apache Kafka Crash Course

This project demonstrates the basic setup and usage of Apache Kafka using Node.js, including creating topics, producing messages, and consuming messages.

📌 Prerequisites

Before running this project, ensure you have the following:

Node.js (Intermediate Level) - Download Node.js

Docker (for Kafka and Zookeeper) - Download Docker

VS Code (Recommended Editor) - Download VSCode

Experience with distributed systems (Recommended)

🔧 Setup and Installation

Step 1: Start Zookeeper

Run the following command to start a Zookeeper container and expose port 2181:


docker run -p 2181:2181 zookeeper


Step 2: Start Kafka

Run the following command to start a Kafka container, expose port 9092, and set up the required environment variables:

docker run -p 9092:9092 \
  -e KAFKA_ZOOKEEPER_CONNECT=<PRIVATE_IP>:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://<PRIVATE_IP>:9092 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  confluentinc/cp-kafka


Replace <PRIVATE_IP> with your actual private IP address.

📝 Code Overview

This project consists of the following files:

client.js

Creates a Kafka client instance using kafkajs.



const { Kafka } = require("kafkajs");

exports.kafka = new Kafka({
  clientId: "my-app",
  brokers: ["<PRIVATE_IP>:9092"],
});


admin.js

Creates a Kafka topic named rider-updates with two partitions.



const { kafka } = require("./client");

async function init() {
  const admin = kafka.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Admin Connection Success...");

  console.log("Creating Topic [rider-updates]");
  await admin.createTopics({
    topics: [{ topic: "rider-updates", numPartitions: 2 }],
  });
  console.log("Topic Created Successfully [rider-updates]");

  console.log("Disconnecting Admin...");
  await admin.disconnect();
}

init();




producer.js

Sends messages to the Kafka topic rider-updates.


const { kafka } = require("./client");
const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function init() {
  const producer = kafka.producer();
  console.log("Connecting Producer");
  await producer.connect();
  console.log("Producer Connected Successfully");

  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", async function (line) {
    const [riderName, location] = line.split(" ");
    await producer.send({
      topic: "rider-updates",
      messages: [{
        partition: location.toLowerCase() === "north" ? 0 : 1,
        key: "location-update",
        value: JSON.stringify({ name: riderName, location }),
      }],
    });
  }).on("close", async () => {
    await producer.disconnect();
  });
}

init();



consumer.js

Consumes messages from the rider-updates topic.



const { kafka } = require("./client");
const group = process.argv[2];

async function init() {
  const consumer = kafka.consumer({ groupId: group });
  await consumer.connect();
  await consumer.subscribe({ topics: ["rider-updates"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `${group}: [${topic}]: PART:${partition}:`,
        message.value.toString()
      );
    },
  });
}

init();


🚀 Running the Application

1️⃣ Run Multiple Consumers
node consumer.js <GROUP_NAME>

Replace <GROUP_NAME> with your desired consumer group name.


2️⃣ Create a Producer

node producer.js

Then, enter messages in the format:


> tony south
> tony north


These messages will be sent to the appropriate partition based on the location.

🎯 Summary

Zookeeper and Kafka containers are started using Docker.

Admin script creates a topic rider-updates with two partitions.

Producer script sends messages based on location (north/south).

Consumer script listens to messages based on the consumer group.

🛠 Troubleshooting

Ensure Docker is running.

Replace <PRIVATE_IP> with the correct private IP of your system.

Verify ports 2181 (Zookeeper) and 9092 (Kafka) are open.

If Kafka fails to start, try restarting Docker and re-running the commands.

📜 License

This project is open-source and available under the MIT License.



