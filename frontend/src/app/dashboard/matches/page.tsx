"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Play, Trophy } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MatchesGlobalPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchWithAuth(`/championships`);
        if (res.ok) {
          const championships = await res.json();
          // Extrair todas as partidas de todas as rodadas
          let allMatches: any[] = [];
          championships.forEach((champ: any) => {
            (champ.rounds || []).forEach((round: any) => {
              (round.matches || []).forEach((match: any) => {
                allMatches.push({
                  ...match,
                  championshipName: champ.name,
                  championshipId: champ.id,
                  roundNumber: round.number,
                  roundId: round.id
                });
              });
            });
          });
          
          // Ordenar por mais recentes/status
          allMatches.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setMatches(allMatches);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarDays className="text-emerald-500 w-6 h-6" />
            Agenda de Partidas
          </h2>
          <p className="text-zinc-400">Acompanhe todos os jogos dos seus campeonatos.</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-zinc-400 text-center py-8">Carregando partidas...</div>
          ) : matches.length === 0 ? (
            <div className="text-zinc-500 text-center py-8">Nenhuma partida gerada ainda. Vá em um Campeonato e Sorteie os Times!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((match) => (
                <div key={match.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
                  <div className="flex justify-between items-center mb-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-emerald-500" />
                      {match.championshipName}
                    </span>
                    <span className="bg-zinc-800 px-2 py-1 rounded">Rodada {match.roundNumber}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-center flex-1">
                      <span className="font-semibold text-white block mb-1 truncate">{match.homeTeam?.name || "Time A"}</span>
                    </div>
                    <div className="px-4 text-center">
                      <div className="bg-zinc-900 text-emerald-400 font-bold text-xl px-4 py-2 rounded-lg border border-zinc-800 flex gap-2">
                        <span>{match.homeScore ?? "-"}</span>
                        <span className="text-zinc-600">x</span>
                        <span>{match.awayScore ?? "-"}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 uppercase mt-1 block">
                        {match.status === "FINISHED" ? "Encerrado" : "Pendente"}
                      </span>
                    </div>
                    <div className="text-center flex-1">
                      <span className="font-semibold text-white block mb-1 truncate">{match.awayTeam?.name || "Time B"}</span>
                    </div>
                  </div>

                  <Link href={`/dashboard/rounds/${match.roundId}`}>
                    <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                      <Play className="w-4 h-4 mr-2" />
                      Apitar Jogo
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
