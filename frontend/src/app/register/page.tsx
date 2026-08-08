"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/lib/api";
import { Trophy, ArrowRight, Activity, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Erro ao fazer cadastro");
      }

      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      if (Array.isArray(err.message)) {
        setError(err.message[0]);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
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
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              <Trophy className="text-white w-6 h-6 drop-shadow-md" />
            </div>
            <span className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">ProLeague</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-emerald-400 bg-black/40 hover:bg-black/60 px-3.5 py-2 rounded-lg border border-white/10 transition-all backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Site
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg bg-black/20 p-6 rounded-2xl backdrop-blur-sm border border-white/5 shadow-2xl">
          <h1 className="text-5xl font-bold text-white leading-tight drop-shadow-xl">
            Comece a organizar agora.
          </h1>
          <p className="text-lg text-zinc-200 font-medium drop-shadow-md">
            Crie sua conta gratuitamente e ganhe controle total sobre os jogadores, times e calendário de partidas do seu torneio.
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

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Back Link on Mobile Header */}
        <div className="flex justify-between items-center relative z-10 lg:hidden mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Trophy className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-white">ProLeague</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-emerald-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Site
          </Link>
        </div>

        <div className="w-full max-w-md my-auto mx-auto relative z-10 space-y-8">
          
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">Criar Conta Grátis</h2>
            <p className="text-zinc-400">Preencha seus dados e crie seu primeiro campeonato em minutos.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300 font-medium">Nome completo</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Seu nome" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 text-white placeholder:text-zinc-600 h-12 px-4 rounded-xl transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300 font-medium">E-mail corporativo ou pessoal</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@proleague.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 text-white placeholder:text-zinc-600 h-12 px-4 rounded-xl transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300 font-medium">Senha segura (mín. 6 caracteres)</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 text-white placeholder:text-zinc-600 h-12 px-4 rounded-xl transition-all"
              />
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
              {loading ? "Criando conta..." : "Começar Agora"}
              {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-zinc-400">
              Já possui uma conta?{" "}
              <Link href="/login" className="font-semibold text-white hover:text-emerald-400 transition-colors">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
