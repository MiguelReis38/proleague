"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Trophy, Users, CalendarDays, Settings, LogOut, Crown, AlertTriangle, Clock, DollarSign, BarChart, ArrowLeftRight } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

type Subscription = {
  planType: string;
  status: string;
  currentPeriodEnd?: string;
};

type Championship = {
  id: string;
  name: string;
  logoUrl?: string;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<Subscription | null>(null);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [activeChampId, setActiveChampId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(false);

    // Carregar Assinatura
    fetchWithAuth("/payments/subscription")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSub(data);
      })
      .catch(() => {});

    // Carregar Campeonatos do Organizador
    fetchWithAuth("/championships")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setChampionships(data);
        const storedId = localStorage.getItem("activeChampionshipId");
        if (storedId && data.some((c: any) => c.id === storedId)) {
          setActiveChampId(storedId);
        } else if (data.length > 0) {
          setActiveChampId(data[0].id);
        }
      })
      .catch(() => {});
  }, [router, pathname]);

  const handleSelectChampionship = (champId: string) => {
    if (!champId) return;
    setActiveChampId(champId);
    localStorage.setItem("activeChampionshipId", champId);
    router.push(`/dashboard/championships/${champId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeChampionshipId");
    router.push("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Carregando...
      </div>
    );

  const navItems = [
    { name: "Meus Campeonatos", href: "/dashboard/championships", icon: Trophy },
    { name: "Classificação", href: "/dashboard/standings", icon: BarChart },
    { name: "Jogadores", href: "/dashboard/players", icon: Users },
    { name: "Rodadas & Partidas", href: "/dashboard/matches", icon: CalendarDays },
    { name: "Financeiro", href: "/dashboard/finance", icon: DollarSign },
    { name: "Assinatura PRO", href: "/dashboard/billing", icon: Crown },
    { name: "Configurações", href: "/dashboard/settings", icon: Settings },
  ];

  // Cálculo de expiração da assinatura
  let expirationNotice: { type: "warning" | "expired"; daysLeft: number; planName: string } | null = null;

  if (sub && sub.planType !== "FREE" && sub.currentPeriodEnd) {
    const endDate = new Date(sub.currentPeriodEnd);
    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      expirationNotice = { type: "expired", daysLeft: 0, planName: sub.planType };
    } else if (daysLeft <= 5) {
      expirationNotice = { type: "warning", daysLeft, planName: sub.planType };
    }
  }

  const activeChamp = championships.find((c) => c.id === activeChampId);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800 justify-between">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
            ProLeague
          </span>
          <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-bold">
            v2.0
          </span>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-600/10 text-emerald-400 font-bold"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER COM SELETOR DE CAMPEONATO */}
        <header className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 shrink-0 gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {championships.length > 0 && (
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 max-w-xs md:max-w-md w-full">
                <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
                <select
                  value={activeChampId}
                  onChange={(e) => handleSelectChampionship(e.target.value)}
                  className="bg-transparent text-sm text-white font-semibold focus:outline-none w-full cursor-pointer truncate"
                >
                  <option value="" disabled className="bg-zinc-900 text-zinc-400">
                    Selecione um Campeonato...
                  </option>
                  {championships.map((c) => (
                    <option key={c.id} value={c.id} className="bg-zinc-900 text-white">
                      🏆 {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Link
              href="/dashboard/championships"
              className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg font-medium transition-colors shrink-0"
              title="Trocar ou gerenciar campeonatos"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Trocar Torneio
            </Link>
          </div>

          {sub && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 font-semibold text-emerald-400">
                Plano {sub.planType}
              </span>
            </div>
          )}
        </header>

        {/* Banner de Aviso de Expiração */}
        {expirationNotice && (
          <div
            className={`px-6 py-3 flex items-center justify-between text-xs md:text-sm font-medium ${
              expirationNotice.type === "expired"
                ? "bg-red-950/80 border-b border-red-800/60 text-red-200"
                : "bg-yellow-950/80 border-b border-yellow-800/60 text-yellow-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {expirationNotice.type === "expired" ? (
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              )}
              <span>
                {expirationNotice.type === "expired"
                  ? `Sua assinatura ${expirationNotice.planName} expirou. Renove para continuar com todos os benefícios.`
                  : `Atenção: Sua assinatura ${expirationNotice.planName} vence em ${expirationNotice.daysLeft} dia(s).`}
              </span>
            </div>
            <Link
              href="/dashboard/billing"
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                expirationNotice.type === "expired"
                  ? "bg-red-600 hover:bg-red-500 text-white"
                  : "bg-yellow-500 hover:bg-yellow-400 text-black"
              }`}
            >
              Renovar Agora
            </Link>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
