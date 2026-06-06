import React from "react";
import { Database, AlertCircle } from "lucide-react";

export function SetupSupabase() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full backdrop-blur-md z-10 shadow-2xl flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30 mb-6">
          <Database className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-2xl font-light tracking-tight text-white mb-2 text-center">
          Configurar Supabase
        </h1>
        <p className="text-sm text-zinc-400 text-center mb-6">
          Para usar este sistema, você precisa configurar as chaves do Supabase.
        </p>

        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-6 w-full flex gap-3 text-left items-start">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-300">
            <p className="font-bold mb-1">Passo 1: Secret Keys</p>
            <p className="opacity-90">
              Adicione suas chaves no painel lateral de Secrets (Settings {">"}{" "}
              Secrets):
            </p>
            <ul className="list-disc ml-4 mt-2 mb-2 font-mono opacity-80">
              <li>VITE_SUPABASE_URL</li>
              <li>VITE_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full text-left">
          <p className="text-xs font-bold text-zinc-300 mb-2">
            Passo 2: SQL Editor
          </p>
          <p className="text-[10px] text-zinc-500 mb-2">
            Rode este código no SQL Editor do Supabase:
          </p>
          <pre className="text-[10px] font-mono text-zinc-400 overflow-x-auto p-3 bg-black/40 rounded-lg border border-white/5">
            {`create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text not null,
  description text not null,
  category text,
  amount numeric not null,
  date date not null,
  due_date date,
  paid boolean default false,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;

create policy "Users can view their own transactions"
  on public.transactions for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own transactions"
  on public.transactions for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own transactions"
  on public.transactions for delete
  using ( auth.uid() = user_id );`}
          </pre>
        </div>
      </div>
    </div>
  );
}
