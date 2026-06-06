import React from "react";
import { Transaction } from "../types";
import {
  CheckCircle2,
  Circle,
  Trash2,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  transactions: Transaction[];
  onTogglePaid: (id: string, currentPaid: boolean) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export function TransactionList({
  transactions,
  onTogglePaid,
  onDelete,
  loading,
}: Props) {
  // Sort by date mostly, or newest first
  const sorted = [...transactions].sort(
    (a, b) =>
      new Date(b.date || Date.now()).getTime() -
      new Date(a.date || Date.now()).getTime(),
  );

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md flex items-center justify-center min-h-[300px]">
        <div className="text-zinc-500 font-mono text-xs animate-pulse">
          Carregando Transações...
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md text-center text-zinc-500 text-sm flex items-center justify-center h-full">
        Nenhuma transação registrada ainda.
      </div>
    );
  }

  const safeDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const d = parseISO(dateStr);
    return isValid(d) ? d : new Date();
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-300">
          Gerenciamento de Transações
        </h2>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="text-[10px] uppercase text-zinc-500 border-b border-white/5 sticky top-0 bg-[#050505]/20 backdrop-blur-sm z-10">
            <tr>
              <th className="pb-4 font-medium pl-2">Tipo / Operação</th>
              <th className="pb-4 font-medium">Vencimento</th>
              <th className="pb-4 font-medium">Valor (R$)</th>
              <th className="pb-4 font-medium">Status / Pagar</th>
              <th className="pb-4 font-medium text-right pr-2">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5">
            {sorted.map((t) => (
              <tr
                key={t.id}
                className={`group ${t.type === "expense" && t.paid ? "opacity-50" : "hover:bg-white/[0.02]"} transition-colors`}
              >
                <td className="py-4 pl-2 font-medium text-zinc-200 truncate max-w-[200px]">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {t.type === "income" ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                          <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                          <ArrowDownRight className="w-4 h-4 text-rose-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={
                          t.type === "expense" && t.paid
                            ? "line-through text-zinc-500 font-normal"
                            : ""
                        }
                      >
                        {t.description}
                      </span>
                      {t.category && (
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                          {t.category}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 text-zinc-400 font-mono text-xs whitespace-nowrap">
                  {format(safeDate(t.date), "dd/MM/yyyy")}
                </td>
                <td
                  className={`py-4 font-mono whitespace-nowrap ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {t.type === "income" ? "+" : "-"}{" "}
                  {Number(t.amount || 0)
                    .toFixed(2)
                    .replace(".", ",")}
                </td>
                <td className="py-4">
                  {t.type === "income" ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold border border-emerald-500/20">
                      Recebido
                    </span>
                  ) : (
                    <button
                      onClick={() => onTogglePaid(t.id, t.paid)}
                      className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border transition-colors ${
                        t.paid
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20 cursor-pointer"
                      }`}
                    >
                      {t.paid ? "Pago" : "Aberto"}
                    </button>
                  )}
                </td>
                <td className="py-4 pr-2 text-right">
                  <button
                    onClick={() => onDelete(t.id)}
                    className="p-2 text-zinc-600 hover:text-rose-500 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
