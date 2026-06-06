/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Transaction } from "./types";
import { AddTransaction } from "./components/AddTransaction";
import { TransactionList } from "./components/TransactionList";
import { MonthlyChart } from "./components/MonthlyChart";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "./lib/AuthContext";
import { Login } from "./components/Login";
import { SetupSupabase } from "./components/SetupSupabase";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

export default function App() {
  const { user, signOut, loading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    setDataLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (data) {
      setTransactions(data as unknown as Transaction[]);
    }
    setDataLoading(false);
  };

  if (!isSupabaseConfigured()) {
    return <SetupSupabase />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-zinc-500 font-mono text-xs animate-pulse">
          Carregando Sessão...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleAdd = async (t: Omit<Transaction, "id" | "user_id">) => {
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.id,
          type: t.type,
          description: t.description,
          category: t.category || "",
          amount: t.amount,
          date: t.date,
          due_date: t.due_date || null,
          paid: t.paid,
          notes: t.notes || "",
        },
      ])
      .select()
      .single();

    if (data) {
      setTransactions((prev) => [data as unknown as Transaction, ...prev]);
    }
  };

  const handleTogglePaid = async (id: string, currentPaid: boolean) => {
    const { data, error } = await supabase
      .from("transactions")
      .update({ paid: !currentPaid })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (data) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? (data as unknown as Transaction) : t)),
      );
    }
  };

  const handleDelete = async (id: string) => {
    await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const safeAmount = (val: any) => Number(val) || 0;
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + safeAmount(t.amount), 0);
  const totalDebtPaid = transactions
    .filter((t) => t.type === "expense" && t.paid)
    .reduce((acc, t) => acc + safeAmount(t.amount), 0);
  const totalDebtUnpaid = transactions
    .filter((t) => t.type === "expense" && !t.paid)
    .reduce((acc, t) => acc + safeAmount(t.amount), 0);
  const remainingCapital = totalIncome - totalDebtPaid;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-x-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 w-full relative z-10 flex flex-col min-h-[calc(100vh-6rem)]">
        {/* Header */}
        <header className="flex justify-between items-end mb-8 z-10">
          <div>
            <h1 className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-bold mb-1">
              Painel de Controle Financeiro
            </h1>
            <div className="text-4xl font-light tracking-tight text-white flex items-baseline gap-3">
              CRM Financeiro
            </div>
            <p className="text-sm text-zinc-500 mt-2">
              Logado como: {user.email}
            </p>
          </div>
          <button
            onClick={signOut}
            className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-medium transition-all border border-white/5 flex items-center gap-2"
          >
            Sair
            <LogOut className="w-3 h-3" />
          </button>
        </header>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wallet className="w-16 h-16 text-blue-400" />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-[10px] uppercase text-zinc-500 tracking-widest font-bold">
                Saldo Atual
              </span>
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Wallet className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div
              className={`text-2xl font-mono relative z-10 ${remainingCapital >= 0 ? "text-emerald-400" : "text-rose-500"}`}
            >
              R$ {remainingCapital.toFixed(2)}
            </div>
            <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-wide relative z-10">
              Receitas - Pendências
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase text-zinc-500 tracking-widest font-bold">
                Total Receitas
              </span>
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="text-2xl font-mono text-white">
              R$ {totalIncome.toFixed(2)}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase text-zinc-500 tracking-widest font-bold">
                Dívidas Pendentes
              </span>
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-rose-500" />
              </div>
            </div>
            <div className="text-2xl font-mono text-rose-500">
              R$ {totalDebtUnpaid.toFixed(2)}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase text-zinc-500 tracking-widest font-bold">
                Dívidas Pagas
              </span>
              <div className="p-2 bg-white/5 border border-white/10 rounded-lg">
                <TrendingDown className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
            <div className="text-2xl font-mono text-white">
              R$ {totalDebtPaid.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
          <div className="lg:col-span-1 space-y-8 flex flex-col h-full">
            <AddTransaction onAdd={handleAdd} />
            <MonthlyChart transactions={transactions} />
          </div>

          <div className="lg:col-span-2 flex flex-col h-full">
            <TransactionList
              transactions={transactions}
              onTogglePaid={handleTogglePaid}
              onDelete={handleDelete}
              loading={dataLoading}
            />
          </div>
        </div>

        <footer className="mt-auto flex justify-between items-center text-[10px] text-zinc-600 font-mono tracking-widest z-10 uppercase border-t border-white/5 pt-4">
          <div>Sistema Criado por Luiz Jaques</div>
          <div>Versão 1.0</div>
        </footer>
      </div>
    </div>
  );
}
