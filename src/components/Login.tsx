import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Wallet, LogIn, Loader2 } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMsg(null);

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.user && !data.session) {
          setMsg("Cadastro realizado! Verifique sua caixa de entrada (ou spam) para confirmar o e-mail.");
        } else {
          setMsg("Conta criada com sucesso!");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
             throw new Error("E-mail ou senha incorretos.");
          }
          if (error.message.includes("Email not confirmed")) {
             throw new Error("Por favor, confirme seu e-mail antes de fazer login.");
          }
          throw error;
        }
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro no login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-sm w-full backdrop-blur-md z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4">
            <Wallet className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-light tracking-tight text-white">
            Fluxo de Caixa
          </h1>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-widest font-bold">
            Autenticação
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-white/10 bg-black/20 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-white/10 bg-black/20 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-xs text-rose-400 mt-2 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
              {error}
            </div>
          )}

          {msg && (
            <div className="text-xs text-emerald-400 mt-2 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRegistering ? (
              "Criar Conta"
            ) : (
              "Entrar"
            )}
            {!loading && !isRegistering && <LogIn className="w-4 h-4 ml-1" />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            {isRegistering
              ? "Já tenho uma conta. Fazer login"
              : "Não tem conta? Cadastre-se"}
          </button>
        </div>
      </div>
    </div>
  );
}
