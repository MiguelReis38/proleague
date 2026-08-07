"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Play, Trophy, ChevronDown, ChevronUp, LockKeyhole, LockOpen, Dices, ArrowRight } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type RoundGroup = {
  id: string;
  number: number;
  closed: boolean;
  championshipId: string;
  championshipName: string;
  matches: any[];
};

export default function MatchesGlobalPage() {
  const [rounds, setRounds] = useState<RoundGroup[]>([]);
  const [championships, setChampionships] = useState<any[]>([]);
  const [expandedRounds, setExpandedRounds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchWithAuth(`/championships`);
        if (res.ok) {
          const list = await res.json();
          setChampionships(list);

          let allRounds: RoundGroup[] = [];
          const initialExpanded: Record<string, boolean> = {};

          list.forEach((champ: any) => {
            (champ.rounds || []).forEach((round: any) => {
              const rGroup: RoundGroup = {
                id: round.id,
                number: round.number,
                closed: round.closed,
                championshipId: champ.id,
                championshipName: champ.name,
                matches: (round.matches || []).map((m: any) => ({
                  ...m,
                  championshipName: champ.name,
                  roundNumber: round.number,
                  roundId: round.id,
                })),
              };
              allRounds.push(rGroup);

              // Rodadas em andamento começam abertas; finalizadas começam minimizadas
              initialExpanded[round.id] = !round.closed;
            });
          });

          // Ordenar rodadas por mais recente
          allRounds.sort((a, b) => b.number - a.number);
          setRounds(allRounds);
          setExpandedRounds(initialExpanded);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleRound = (roundId: string) => {
    setExpandedRounds((prev) => ({
      ...prev,
      [roundId]: !prev[roundId],
    }));
  };

  const firstChampId = championships[0]?.id;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Sortear Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarDays className="text-emerald-500 w-6 h-6" />
            Agenda de Rodadas & Partidas
          </h2>
          <p className="text-zinc-400 text-sm mt-0.5">
            Acompanhe e apite os jogos dos seus campeonatos.
          </p>
        </div>

        {firstChampId && (
          <Link href={`/dashboard/championships/${firstChampId}/draft`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-950">
              <Dices className="w-4 h-4 mr-2" /> Sortear Nova Rodada
            </Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="text-zinc-400 text-center py-12">Carregando rodadas...</div>
      ) : rounds.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800 text-center py-12 p-6">
          <p className="text-zinc-400 text-base mb-4">Nenhuma rodada gerada ainda.</p>
          {firstChampId ? (
            <Link href={`/dashboard/championships/${firstChampId}/draft`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold">
                <Dices className="w-4 h-4 mr-2" /> Sortear Primeira Rodada
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/championships/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold">
                Criar Campeonato
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {rounds.map((round) => {
            const isExpanded = !!expandedRounds[round.id];

            return (
              <div
                key={round.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all"
              >
                {/* Header da Rodada (Acordeão Minimizável) */}
                <div
                  onClick={() => toggleRound(round.id)}
                  className="p-4 bg-zinc-900 hover:bg-zinc-800/80 cursor-pointer flex items-center justify-between transition-colors select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800 text-emerald-400 border border-zinc-700">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">
                          Rodada {round.number}
                        </span>
                        <span className="text-xs text-zinc-400 font-medium">
                          · {round.championshipName}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">
                        {round.matches.length} partida(s)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                        round.closed
                          ? "bg-red-950/80 border border-red-800 text-red-400"
                          : "bg-emerald-950/80 border border-emerald-800 text-emerald-400"
                      }`}
                    >
                      {round.closed ? (
                        <>
                          <LockKeyhole className="w-3 h-3" /> Finalizada
                        </>
                      ) : (
                        <>
                          <LockOpen className="w-3 h-3" /> Em Andamento
                        </>
                      )}
                    </span>

                    <Link
                      href={`/dashboard/rounds/${round.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                      >
                        Entrar na Rodada <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>

                    <button className="text-zinc-400 hover:text-white p-1">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Lista de Partidas da Rodada (Expandida / Minimizada) */}
                {isExpanded && (
                  <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/50 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {round.matches.map((match) => (
                        <div
                          key={match.id}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/30 transition-colors"
                        >
                          <div className="flex justify-between items-center mb-4 text-xs text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Trophy className="w-3 h-3 text-emerald-500" />
                              {match.championshipName}
                            </span>
                            <span className="bg-zinc-800 px-2 py-1 rounded">
                              Jogo
                            </span>
                          </div>

                          <div className="flex justify-between items-center mb-6">
                            <div className="text-center flex-1">
                              <span className="font-semibold text-white block mb-1 truncate">
                                {match.homeTeam?.name || "Time A"}
                              </span>
                            </div>
                            <div className="px-4 text-center">
                              <div className="bg-zinc-950 text-emerald-400 font-bold text-xl px-4 py-2 rounded-lg border border-zinc-800 flex gap-2">
                                <span>{match.homeScore ?? "-"}</span>
                                <span className="text-zinc-600">x</span>
                                <span>{match.awayScore ?? "-"}</span>
                              </div>
                              <span className="text-[10px] text-zinc-500 uppercase mt-1 block font-semibold">
                                {match.status === "FINISHED" ? "Encerrado" : "Pendente"}
                              </span>
                            </div>
                            <div className="text-center flex-1">
                              <span className="font-semibold text-white block mb-1 truncate">
                                {match.awayTeam?.name || "Time B"}
                              </span>
                            </div>
                          </div>

                          <Link href={`/dashboard/rounds/${match.roundId}`}>
                            <Button
                              variant="outline"
                              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs font-semibold"
                            >
                              <Play className="w-3.5 h-3.5 mr-2 text-emerald-400" />
                              Apitar Jogo
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
