"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { DollarSign, Trophy, ArrowRight, Wallet, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

type Championship = {
  id: string;
  name: string;
  logoUrl?: string;
  players: any[];
  status: string;
};

export default function GeneralFinancePage() {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth("/championships")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setChampionships(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" /> Controle Financeiro Geral
          </h1>
          <p className="text-sm text-zinc-400">
            Selecione o campeonato abaixo para gerenciar mensalidades dos jogadores e despesas de quadra.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {championships.length === 0 && (
          <p className="text-zinc-500 text-sm">Nenhum campeonato cadastrado ainda.</p>
        )}

        {championships.map((c) => (
          <div
            key={c.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between hover:border-emerald-500/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                {c.logoUrl ? (
                  <img src={c.logoUrl} alt={c.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Trophy className="w-6 h-6 text-emerald-500" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{c.name}</h3>
                <p className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-zinc-500" /> {c.players?.length || 0} Jogadores cadastrados
                </p>
              </div>
            </div>

            <Link href={`/dashboard/championships/${c.id}/finance`}>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs">
                Acessar <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
