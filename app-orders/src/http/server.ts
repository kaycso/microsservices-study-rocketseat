import "@opentelemetry/auto-instrumentations-node/register";

import { fastify } from "fastify";
// import { fastifyCors } from "@fastify/cors";
import { z } from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { db } from "../db/db.ts";
import { trace } from "@opentelemetry/api";
import { schema } from "../db/schema/index.ts";
import { randomUUID } from "node:crypto";
import { dispatchOrderCreated } from "../broker/messages/order-created.ts";
import { tracer } from "../tracer/tracer.ts";

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
    try {
      const { amount } = req.body;
      // Customer está mockado, pois o intuito aqui é ser demonstrado o uso do broker (esse usuario foi cadastrado no banco via sql)
      const customerId = "389c048f-5485-4e21-97d6-e120ad069e1e";
      const orderId = randomUUID();
      console.log(`[CREATING] order ${orderId} with amount ${amount}`);

      await db.insert(schema.orders).values({
        id: orderId,
        amount,
        customerId,
      });

      // Simulando um delay de 2 segundos para ver o trace no jaeger
      const span = tracer.startSpan("wait-for-2-seconds");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      span.end();

      trace.getActiveSpan()?.setAttribute("order_id", orderId);

      dispatchOrderCreated({
        orderId,
        amount,
        customerId,
      });
      console.log(`[FINISHED] Order ${orderId} created\n`);

      return reply.status(201).send();
    } catch (error: unknown) {
      console.error(
        error instanceof Error ? `[ERROR] ${error.message}` : `[ERROR] ${error}`
      );
      return reply.status(500).send();
    }
  }
);

app
  .listen({ host: "0.0.0.0", port: 3333 })
  .then(() => console.log("[Orders] HTTP Server running!"));
