import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "../types";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  transactions: Transaction[];
}

export function MonthlyChart({ transactions }: Props) {
  const data = useMemo(() => {
    // Group by YYYY-MM
    const groups: Record<
      string,
      { month: string; rawMonth: string; income: number; debt: number }
    > = {};

    transactions.forEach((t) => {
      const d = t.date ? parseISO(t.date) : new Date();
      const validDate = isValid(d) ? d : new Date();
      const key = format(validDate, "yyyy-MM");
      const displayMonth = format(validDate, "MMM", { locale: ptBR }); // ex: "jun"

      if (!groups[key]) {
        groups[key] = {
          month: displayMonth,
          rawMonth: key,
          income: 0,
          debt: 0,
        };
      }

      const val = Number(t.amount) || 0;
      if (t.type === "income") {
        groups[key].income += val;
      } else {
        groups[key].debt += val;
      }
    });

    return Object.values(groups).sort((a, b) =>
      a.rawMonth.localeCompare(b.rawMonth),
    );
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex items-center justify-center h-64 text-zinc-500 text-sm">
        Dados insuficientes para o gráfico
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <h3 className="text-sm font-semibold tracking-wide text-zinc-300 mb-6">
        Fluxo Mensal
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ffffff10"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fill: "#71717a",
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#71717a", fontFamily: "monospace" }}
              tickFormatter={(val) => `R$${val}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: "rgba(5,5,5,0.8)",
                backdropFilter: "blur(8px)",
              }}
              itemStyle={{ fontSize: "13px", fontFamily: "monospace" }}
              labelStyle={{
                color: "#a1a1aa",
                marginBottom: "4px",
                fontSize: "10px",
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
              formatter={(value: number) => [`R$ ${value.toFixed(2)}`, ""]}
            />
            <Area
              type="monotone"
              name="Receitas"
              dataKey="income"
              stroke="#34d399"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              name="Despesas"
              dataKey="debt"
              stroke="#fb7185"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDebt)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
