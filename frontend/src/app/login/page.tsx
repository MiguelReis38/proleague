"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/lib/api";
import { Trophy, ArrowRight, Activity, ShieldCheck, KeyRound, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMsg(null);

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setResetMsg({ type: "success", text: data.message || "Senha redefinida com sucesso!" });
        setEmail(resetEmail);
        setPassword(newPassword);
        setTimeout(() => setShowForgotModal(false), 2000);
      } else {
        setResetMsg({ type: "error", text: data.message || "E-mail não encontrado." });
      }
    } catch (err) {
      setResetMsg({ type: "error", text: "Erro de conexão." });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-zinc-950">
      {/* Left Panel - Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/bg.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30 z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 z-0"></div>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            <Trophy className="text-white w-6 h-6 drop-shadow-md" />
          </div>
          <span className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
            ProLeague
          </span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg bg-black/20 p-6 rounded-2xl backdrop-blur-sm border border-white/5 shadow-2xl">
          <h1 className="text-5xl font-bold text-white leading-tight drop-shadow-xl">
            Eleve o nível do seu torneio.
          </h1>
          <p className="text-lg text-zinc-200 font-medium drop-shadow-md">
            A plataforma definitiva para organizar, gerenciar e sortear campeonatos de futebol de
            forma 100% automatizada.
          </p>

          <div className="flex flex-col gap-4 pt-6">
            <div className="flex items-center gap-4 text-white font-medium drop-shadow-md">
              <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center border border-white/10 shadow-inner">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <span>Sorteio inteligente de equipes</span>
            </div>
            <div className="flex items-center gap-4 text-white font-medium drop-shadow-md">
              <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center border border-white/10 shadow-inner">
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <span>Estatísticas em tempo real</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-zinc-500 text-sm">
          &copy; 2026 ProLeague. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                <Trophy className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">ProLeague</span>
            </div>

            <h2 className="text-3xl font-bold text-white tracking-tight">Bem-vindo de volta</h2>
            <p className="text-zinc-400">Insira suas credenciais para acessar seu painel.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300 font-medium">
                E-mail
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 text-white placeholder:text-zinc-600 h-12 px-4 rounded-xl transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300 font-medium">
                  Senha
                </Label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 text-white placeholder:text-zinc-600 h-12 px-4 rounded-xl transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] group"
              disabled={loading}
            >
              {loading ? "Autenticando..." : "Acessar Plataforma"}
              {!loading && (
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-zinc-400">
              Novo por aqui?{" "}
              <Link
                href="/register"
                className="font-semibold text-white hover:text-emerald-400 transition-colors"
              >
                Crie sua conta gratuitamente
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* MODAL REDEFINIR SENHA */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl space-y-4">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <KeyRound className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Redefinir Senha</h3>
            </div>

            <p className="text-xs text-zinc-400">
              Digite seu e-mail cadastrado e escolha a nova senha para acessar sua conta.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">E-mail Cadastrado</Label>
                <Input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Nova Senha</Label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              {resetMsg && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    resetMsg.type === "success"
                      ? "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
                      : "bg-red-950/80 border border-red-800 text-red-300"
                  }`}
                >
                  {resetMsg.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  <span>{resetMsg.text}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold"
              >
                {resetLoading ? "Redefinindo..." : "Confirmar Nova Senha"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
