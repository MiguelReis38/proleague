"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  CalendarDays,
  Play,
  Trophy,
  ChevronDown,
  ChevronUp,
  LockKeyhole,
  LockOpen,
  Dices,
  ArrowRight,
  Trash2,
  Sparkles,
  Share2,
  X,
  Flame,
  QrCode,
  Star,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TotwModal } from "@/components/TotwModal";

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

  // Matchday Banner Modal State
  const [bannerRound, setBannerRound] = useState<RoundGroup | null>(null);

  // Seleção da Rodada (TOTW) Modal State
  const [totwRound, setTotwRound] = useState<RoundGroup | null>(null);

  const handleDeleteRound = async (round: RoundGroup) => {
    if (
      !confirm(
        `Tem certeza que deseja excluir a Rodada ${round.number}? Todas as partidas, estatísticas e pontos dessa rodada serão totalmente ANULADOS e apagados.`
      )
    )
      return;

    try {
      const res = await fetchWithAuth(`/championships/${round.championshipId}/rounds/${round.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRounds((prev) => prev.filter((r) => r.id !== round.id));
      } else {
        alert("Erro ao excluir rodada.");
      }
    } catch {
      alert("Erro de conexão.");
    }
  };

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
            Acompanhe, apite os jogos e gere o Banner de Divulgação das Rodadas.
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
                  className="p-4 bg-zinc-900 hover:bg-zinc-800/80 cursor-pointer flex flex-wrap items-center justify-between gap-3 transition-colors select-none"
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
                        {round.matches.length} partida(s) nesta rodada
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
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

                    {/* BOTÃO PARA GERAR BANNER MATCHDAY DA RODADA */}
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBannerRound(round);
                      }}
                      title="Gerar banner visual com todos os jogos para WhatsApp e Instagram"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-zinc-950 fill-zinc-950" />
                      Banner
                    </Button>

                    {/* BOTÃO PARA GERAR SELEÇÃO DA RODADA */}
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-yellow-400 hover:bg-yellow-500 text-zinc-950 font-extrabold shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTotwRound(round);
                      }}
                      title="Exibir os melhores jogadores e goleiros da rodada"
                    >
                      <Star className="w-3.5 h-3.5 mr-1 fill-zinc-950" />
                      Seleção
                    </Button>

                    <Link
                      href={`/dashboard/rounds/${round.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                      >
                        Entrar <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 border-red-900/50 text-red-500 hover:bg-red-950"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRound(round);
                      }}
                      title="Excluir rodada (anula pontos e gols)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>

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
                              Confronto
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

      {/* ─── MODAL BANNER DE DIVULGAÇÃO MATCHDAY DA RODADA ───────────────── */}
      {bannerRound && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative flex flex-col items-center max-w-md w-full">
            <button
              onClick={() => setBannerRound(null)}
              className="absolute -top-10 right-0 text-zinc-400 hover:text-white bg-zinc-900 p-2 rounded-full border border-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* BANNER VISUAL PRONTO PARA PRINT E WHATSAPP */}
            <div
              id="matchday-banner"
              className="w-full rounded-3xl p-6 relative flex flex-col justify-between shadow-2xl overflow-hidden border-2 border-emerald-500/50 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white space-y-5"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />

              {/* Header do Banner */}
              <div className="text-center space-y-1 z-10 border-b border-zinc-800 pb-4">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                  <Flame className="w-3.5 h-3.5 fill-emerald-400" />
                  HOJE TEM JOGO · RODADA {bannerRound.number}
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                  {bannerRound.championshipName}
                </h2>
                <p className="text-xs text-zinc-400 font-medium">
                  {bannerRound.matches.length} Grande(s) Confronto(s) Aguardado(s)
                </p>
              </div>

              {/* Lista Completa de Todos os Jogos da Rodada */}
              <div className="space-y-3 z-10 max-h-72 overflow-y-auto pr-1">
                {bannerRound.matches.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 space-y-2 shadow-inner"
                  >
                    <div className="flex items-center justify-between font-extrabold text-sm">
                      <span className="text-emerald-400 flex-1 truncate text-left">
                        {m.homeTeam?.name || `Time A`}
                      </span>
                      <div className="px-3 py-1 bg-black rounded-lg border border-zinc-800 text-xs font-black text-amber-400 shrink-0">
                        {m.status === "FINISHED" ? `${m.homeScore} x ${m.awayScore}` : "VS"}
                      </div>
                      <span className="text-emerald-400 flex-1 truncate text-right">
                        {m.awayTeam?.name || `Time B`}
                      </span>
                    </div>

                    {/* Escalação / Jogadores dos Times */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 border-t border-zinc-800/60 pt-2">
                      <div className="truncate">
                        <span className="font-bold text-zinc-300 block">
                          {m.homeTeam?.name}:
                        </span>
                        {m.homeTeam?.players
                          ? m.homeTeam.players.map((p: any) => p.player?.name).join(", ")
                          : "Atletas escalados"}
                      </div>
                      <div className="truncate text-right">
                        <span className="font-bold text-zinc-300 block">
                          {m.awayTeam?.name}:
                        </span>
                        {m.awayTeam?.players
                          ? m.awayTeam.players.map((p: any) => p.player?.name).join(", ")
                          : "Atletas escalados"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rodapé do Banner */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-zinc-400 text-xs z-10">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Trophy className="w-4 h-4 text-emerald-400" /> ProLeague v2.0
                </div>
                <span className="text-[10px] text-zinc-500 font-semibold">
                  Acompanhe a tabela ao vivo
                </span>
              </div>
            </div>

            {/* Ação de Compartilhar */}
            <div className="flex gap-2 mt-4 w-full">
              <Button
                onClick={() =>
                  alert(
                    "Tire um print desta tela no seu celular ou computador para enviar o Banner completo de jogos no WhatsApp da galera ou publicar no Instagram!"
                  )
                }
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-sm py-3 shadow-lg shadow-emerald-950"
              >
                <Share2 className="w-4 h-4 mr-2" /> Tirar Print / Compartilhar no WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL SELEÇÃO DA RODADA (TOTW) ─────────────────────────────── */}
      {totwRound && (
        <TotwModal round={totwRound} onClose={() => setTotwRound(null)} />
      )}
    </div>
  );
}
