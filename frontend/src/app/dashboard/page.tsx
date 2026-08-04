"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Activity, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    championships: 0,
    players: 0,
    activeMatches: 0
  });
  
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchWithAuth("/championships");
        if (res.ok) {
          const championships = await res.json();
          
          let totalPlayers = 0;
          let activeMatches = 0;
          let allMatches: any[] = [];
          
          championships.forEach((champ: any) => {
            totalPlayers += (champ.players || []).length;
            
            (champ.rounds || []).forEach((round: any) => {
              (round.matches || []).forEach((match: any) => {
                allMatches.push({
                  ...match,
                  championshipName: champ.name,
                  roundNumber: round.number
                });
                if (match.status !== "FINISHED") {
                  activeMatches++;
                }
              });
            });
          });

          setStats({
            championships: championships.length,
            players: totalPlayers,
            activeMatches: activeMatches
          });

          // Pegar as 5 partidas mais recentes (criadas recentemente)
          allMatches.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setRecentActivities(allMatches.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Visão Geral</h2>
          <p className="text-zinc-400">Bem-vindo de volta! Aqui está o resumo dos seus torneios.</p>
        </div>
        <Link href="/dashboard/championships/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Trophy className="w-4 h-4 mr-2" />
            Novo Campeonato
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Campeonatos Ativos</CardTitle>
            <Trophy className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "..." : stats.championships}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total de Jogadores</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "..." : stats.players}</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Partidas Pendentes</CardTitle>
            <Activity className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "..." : stats.activeMatches}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-zinc-500 text-sm">Carregando...</p>
            ) : recentActivities.length === 0 ? (
              <p className="text-zinc-500 text-sm">Nenhuma atividade registrada ainda.</p>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <PlayCircle className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Partida: {act.homeTeam?.name} vs {act.awayTeam?.name}</p>
                      <p className="text-xs text-zinc-400">
                        {act.championshipName} - Rodada {act.roundNumber} {act.status === "FINISHED" ? "(Finalizada)" : "(Pendente)"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
