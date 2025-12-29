import amqp from "amqplib";

const BROKER_URL = process.env.BROKER_URL;

export async function connectBroker() {
  if (!BROKER_URL) {
    throw new Error("env BROKER_URL is not defined");
  }

  const connection = await amqp.connect(BROKER_URL);
  return connection;
}
