import { connectBroker } from "../broker.ts";

const broker = await connectBroker();

export const orders = await broker.createChannel();

await orders.assertQueue("orders");
