export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  description: string;
  category: string;
  amount: number;
  date: string;
  due_date?: string;
  paid: boolean;
  notes?: string;
  created_at?: string;
}
