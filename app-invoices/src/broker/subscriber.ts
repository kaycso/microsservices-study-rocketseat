import { orders } from "./channels/orders.ts";

orders.consume(
  "orders",
  async (message) => {
    if (!message) {
      return null;
    }
    const msg = message.content.toString();

    console.log(msg);

    orders.ack(message);
    console.log();
  },
  { noAck: false }
);
