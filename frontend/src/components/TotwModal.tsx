"use client";

import { X, Share2, Flame, Trophy, Star, Award, Zap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";

type TotwPlayer = {
  id: string;
  name: string;
  photoUrl?: string;
  number?: number;
  category: string;
  teamName: string;
  score: number;
  goals: number;
  assists: number;
  saves: number;
  wins: number;
};

export function TotwModal({
  round,
  onClose,
}: {
  round: any;
  onClose: () => void;
}) {
  if (!round || !round.matches) return null;

  const playerStatsMap: Record<string, TotwPlayer> = {};

  // Calcular estatísticas e pontuação de cada atleta na rodada
  round.matches.forEach((match: any) => {
    const isHomeWin = (match.homeScore ?? 0) > (match.awayScore ?? 0);
    const isAwayWin = (match.awayScore ?? 0) > (match.homeScore ?? 0);

    const processTeam = (team: any, isWin: boolean) => {
      if (!team || !team.players) return;
      team.players.forEach((tp: any) => {
        const p = tp.player;
        if (!p) return;

        if (!playerStatsMap[p.id]) {
          playerStatsMap[p.id] = {
            id: p.id,
            name: p.name,
            photoUrl: p.photoUrl,
            number: p.number,
            category: p.category || "CAT_A",
            teamName: team.name || "Time",
            score: 0,
            goals: 0,
            assists: 0,
            saves: 0,
            wins: 0,
          };
        }

        const playerObj = playerStatsMap[p.id];
        if (isWin) playerObj.wins += 1;

        // Somar estatísticas das partidas da rodada
        if (match.matchStats) {
          const mStats = match.matchStats.filter((ms: any) => ms.playerId === p.id);
          mStats.forEach((ms: any) => {
            playerObj.goals += ms.goals || 0;
            playerObj.assists += ms.assists || 0;
            playerObj.saves += ms.saves || 0;
          });
        }
      });
    };

    processTeam(match.homeTeam, isHomeWin);
    processTeam(match.awayTeam, isAwayWin);
  });

  // Calcular pontuação final de cada atleta
  Object.values(playerStatsMap).forEach((p) => {
    p.score = p.goals * 3 + p.assists * 2 + p.saves * 1.5 + p.wins * 3;
  });

  const allPlayers = Object.values(playerStatsMap);

  // Separar Goleiros e Jogadores de Linha
  const goalkeepers = allPlayers.filter((p) => p.category === "GOALKEEPER");
  const fieldPlayers = allPlayers.filter((p) => p.category !== "GOALKEEPER");

  // Achar maior pontuação de Goleiros
  const maxGkScore = goalkeepers.length > 0 ? Math.max(...goalkeepers.map((g) => g.score)) : -1;
  const topGk = maxGkScore >= 0 ? goalkeepers.filter((g) => g.score === maxGkScore) : [];

  // Achar maior pontuação de Linha
  const maxFieldScore = fieldPlayers.length > 0 ? Math.max(...fieldPlayers.map((f) => f.score)) : -1;
  
  // Pegar todos os jogadores empatados na maior pontuação e também do segundo escalão se necessário
  let topField: TotwPlayer[] = [];
  if (maxFieldScore >= 0) {
    topField = fieldPlayers.filter((f) => f.score === maxFieldScore);
    
    // Se tiver menos de 4 jogadores no topo, adiciona a próxima melhor pontuação
    if (topField.length < 4) {
      const remaining = fieldPlayers.filter((f) => f.score < maxFieldScore);
      if (remaining.length > 0) {
        const nextScore = Math.max(...remaining.map((r) => r.score));
        if (nextScore > 0) {
          const nextTied = remaining.filter((r) => r.score === nextScore);
          topField = [...topField, ...nextTied];
        }
      }
    }
  }

  const hasTiedHighScorers = topField.length > 4 || topGk.length > 1;
  const championshipName = round.championship?.name || round.championshipName || "Campeonato ProLeague";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col items-center max-w-xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-zinc-400 hover:text-white bg-zinc-900 p-2 rounded-full border border-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CARTAZ DA SELEÇÃO DA RODADA */}
        <div
          id="totw-card"
          className="w-full rounded-3xl p-6 relative flex flex-col justify-between shadow-2xl overflow-hidden border-2 border-amber-400/60 bg-gradient-to-b from-amber-950/90 via-zinc-950 to-black text-amber-100 space-y-6"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-1 z-10 border-b border-amber-500/30 pb-4">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              SELEÇÃO DA RODADA {round.number}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
              {championshipName}
            </h2>
            <p className="text-xs text-amber-200/70 font-bold">
              Os Atletas em Destaque no Campo nesta Rodada
            </p>

            {hasTiedHighScorers && (
              <div className="mt-2 inline-block bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-extrabold px-3 py-0.5 rounded-full">
                🔥 EMPATE NO TOPO! Todos os atletas com maior pontuação foram selecionados.
              </div>
            )}
          </div>

          {/* Destaques da Rodada */}
          <div className="space-y-4 z-10 max-h-80 overflow-y-auto pr-1">
            {/* Goleiros de Destaque */}
            {topGk.length > 0 && (
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 block mb-2">
                  🧤 Paredão(ões) da Rodada (Goleiro)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {topGk.map((p) => (
                    <div
                      key={p.id}
                      className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full border-2 border-amber-400/60 overflow-hidden bg-zinc-900 shrink-0">
                        {p.photoUrl ? (
                          <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-black text-amber-400">
                            {p.name[0]}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-white text-sm block truncate">{p.name}</span>
                        <span className="text-[10px] text-amber-300/80 font-semibold block truncate">
                          {p.teamName} · {p.saves} defesa(s)
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-amber-300 block">{p.score}</span>
                        <span className="text-[9px] text-amber-200/60 uppercase font-bold">PTS</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Craques de Linha */}
            {topField.length > 0 && (
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 block mb-2">
                  ⚽ Craques de Linha da Rodada
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {topField.map((p) => (
                    <div
                      key={p.id}
                      className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full border-2 border-amber-400/60 overflow-hidden bg-zinc-900 shrink-0">
                        {p.photoUrl ? (
                          <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-black text-amber-400">
                            {p.name[0]}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-white text-sm block truncate">{p.name}</span>
                        <span className="text-[10px] text-amber-300/80 font-semibold block truncate">
                          {p.teamName} · {p.goals} gol(s) {p.assists > 0 ? `· ${p.assists} assist.` : ""}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-amber-300 block">{p.score}</span>
                        <span className="text-[9px] text-amber-200/60 uppercase font-bold">PTS</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rodapé do Cartaz */}
          <div className="pt-3 border-t border-amber-500/30 flex items-center justify-between text-amber-200/80 text-xs z-10">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Trophy className="w-4 h-4 text-amber-400" /> ProLeague v2.0
            </div>
            <span className="text-[10px] font-semibold text-amber-300/70">
              Desempenho oficial calculado ao vivo
            </span>
          </div>
        </div>

        {/* Botão de Ação: Baixar Imagem & Compartilhar */}
        <div className="grid grid-cols-2 gap-2 mt-4 w-full">
          <Button
            onClick={async () => {
              const elem = document.getElementById("totw-card");
              if (!elem) return;
              try {
                const canvas = await html2canvas(elem, { scale: 3, useCORS: true, backgroundColor: null });
                const dataUrl = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = `selecao_rodada_${round.number}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } catch {
                alert("Tire um print da tela para salvar a imagem da Seleção!");
              }
            }}
            className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs shadow-lg shadow-amber-950"
          >
            <Download className="w-4 h-4 mr-1.5" /> Baixar Imagem (PNG)
          </Button>

          <Button
            onClick={() =>
              alert("Tire um print da tela para postar no Instagram Stories ou enviar o Time da Rodada no WhatsApp da galera!")
            }
            variant="outline"
            className="border-amber-500/50 text-amber-300 hover:bg-amber-950/60 font-bold text-xs"
          >
            <Share2 className="w-4 h-4 mr-1.5" /> WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
