export interface OrderCreatedMessage {
  orderId: string;
  customerId: string;
  amount: number;
}
