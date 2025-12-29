import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { custumers } from "./customers.ts";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "cancelled",
]);

export const orders = pgTable("orders", {
  id: text().primaryKey(),
  customerId: text()
    .notNull()
    .references(() => custumers.id),
  amount: integer().notNull(),
  status: orderStatusEnum().notNull().default("pending"),
  craetedAt: timestamp().notNull().defaultNow(),
});
