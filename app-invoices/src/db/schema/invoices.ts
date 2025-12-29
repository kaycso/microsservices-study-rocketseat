import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
// import { custumers } from "./customers.ts";

// export const orderStatusEnum = pgEnum("order_status", [
//   "pending",
//   "paid",
//   "cancelled",
// ]);

export const invoices = pgTable("invoices", {
  id: text().primaryKey(),
  orderId: text().notNull(),
  // amount: integer().notNull(),
  // status: orderStatusEnum().notNull().default("pending"),
  craetedAt: timestamp().notNull().defaultNow(),
});
