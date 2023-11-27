export type TransactionsObject = {
  sum?: number;
  type?: "receive" | "send";
  resEmail?: string;
  date?: Date;
  id: string;
};
