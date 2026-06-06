import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TransactionType, Transaction } from "../types";
import { PlusCircle } from "lucide-react";

interface Props {
  onAdd: (transaction: Omit<Transaction, "id" | "user_id">) => void;
}

export function AddTransaction({ onAdd }: Props) {
  const [type, setType] = useState<TransactionType>("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.toString());
    if (!description || isNaN(numAmount)) return;

    onAdd({
      type,
      description,
      category,
      amount: numAmount,
      date: date || new Date().toISOString().split("T")[0],
      paid: type === "income" ? true : false,
    });

    setDescription("");
    setAmount("");
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <h3 className="text-sm font-semibold tracking-wide text-zinc-300 mb-6">
        Nova Transação
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${type === "income" ? "border-emerald-500 bg-emerald-500/20" : "border-white/20 bg-white/5 group-hover:border-white/40"}`}
            >
              {type === "income" && (
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </div>
            <input
              type="radio"
              name="type"
              className="hidden"
              checked={type === "income"}
              onChange={() => setType("income")}
            />
            <span
              className={`text-xs font-bold uppercase tracking-widest ${type === "income" ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"}`}
            >
              Entrada
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${type === "expense" ? "border-rose-500 bg-rose-500/20" : "border-white/20 bg-white/5 group-hover:border-white/40"}`}
            >
              {type === "expense" && (
                <div className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </div>
            <input
              type="radio"
              name="type"
              className="hidden"
              checked={type === "expense"}
              onChange={() => setType("expense")}
            />
            <span
              className={`text-xs font-bold uppercase tracking-widest ${type === "expense" ? "text-rose-500" : "text-zinc-500 group-hover:text-zinc-300"}`}
            >
              Despesa
            </span>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">
              Descrição
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Salário, Aluguel..."
              className="w-full border border-white/10 bg-black/20 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">
              Categoria
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Contas, Lazer, Salário..."
              className="w-full border border-white/10 bg-black/20 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-white/10 bg-black/20 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">
                Data
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-white/10 bg-black/20 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 uppercase tracking-wide flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Adicionar
        </button>
      </form>
    </div>
  );
}
