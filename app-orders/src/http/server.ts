import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { z } from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { channels } from "../broker/channels/index.ts";
import { db } from "../db/db.ts";
import { schema } from "../db/schema/index.ts";
import { randomUUID } from "node:crypto";
import { dispatchOrderCreated } from "../broker/messages/order-created.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

// app.register(fastifyCors, {
//   origin: "*",
// });

app.get("/health", () => {
  // return reply.status(200).send();
  return "OK";
});

app.post(
  "/orders",
  { schema: { body: z.object({ amount: z.coerce.number() }) } },
  async (req, reply) => {
    const { amount } = req.body;
    // Customer está mockado, pois o intuito aqui é ser demonstrado o uso do broker (esse usuario foi cadastrado no banco via sql)
    const customerId = "389c048f-5485-4e21-97d6-e120ad069e1e";

    console.log("Creating an order with amount", amount);

    dispatchOrderCreated({
      orderId: randomUUID(),
      amount,
      customerId,
    });

    await db.insert(schema.orders).values({
      id: randomUUID(),
      amount,
      customerId,
    });

    return reply.status(201).send();
  }
);

app
  .listen({ host: "0.0.0.0", port: 3333 })
  .then(() => console.log("[Orders] HTTP Server running!"));
