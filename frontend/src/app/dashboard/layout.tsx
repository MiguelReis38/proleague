"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Trophy, Users, CalendarDays, Settings, LogOut, LayoutDashboard, Crown, AlertTriangle, Clock, DollarSign } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

type Subscription = {
  planType: string;
  status: string;
  currentPeriodEnd?: string;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<Subscription | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
      fetchWithAuth("/payments/subscription")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setSub(data);
        })
        .catch(() => {});
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">Carregando...</div>;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Campeonatos", href: "/dashboard/championships", icon: Trophy },
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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
            ProLeague
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
                    ? "bg-emerald-600/10 text-emerald-400"
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
        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <h1 className="text-lg font-medium text-zinc-200">
            {navItems.find((i) => i.href === pathname)?.name || "Dashboard"}
          </h1>
          {sub && (
            <div className="flex items-center gap-2">
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

        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
}
