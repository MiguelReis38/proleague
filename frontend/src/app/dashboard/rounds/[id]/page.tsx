"use client";

import { useEffect, useState, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Trophy, X, UserPlus, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";

export default function RoundDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [round, setRound] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [activeMatch, setActiveMatch] = useState<any>(null);
  const [matchStats, setMatchStats] = useState<any>({});
  
  // Borrow Player State
  const [isBorrowing, setIsBorrowing] = useState<"HOME" | "AWAY" | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);

  // Team Photo Upload State
  const [uploadingTeamPhoto, setUploadingTeamPhoto] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(`/championships`);
      if (res.ok) {
        const championships = await res.json();
        let targetRound = null;
        let targetChamp = null;
        
        for (const champ of championships) {
          const found = (champ.rounds || []).find((r: any) => r.id === id);
          if (found) {
            targetRound = found;
            targetChamp = champ;
            break;
          }
        }
        
        if (targetRound && targetChamp) {
          // Precisamos dos dados completos da rodada com os times e jogadores (findAllByChampionship do RoundsController)
          const roundsRes = await fetchWithAuth(`/championships/${targetChamp.id}/rounds`);
          if (roundsRes.ok) {
            const allRounds = await roundsRes.json();
            const fullRound = allRounds.find((r: any) => r.id === id);
            if (fullRound) {
              fullRound.championship = targetChamp;
              setRound(fullRound);
              setAvailablePlayers(targetChamp.players);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const openMatchPopup = (match: any) => {
    setActiveMatch(match);
    
    // Inicializar state de stats para todos os jogadores dos dois times
    const initialStats: any = {};
    const homeTeam = round.teams.find((t: any) => t.id === match.homeTeamId);
    const awayTeam = round.teams.find((t: any) => t.id === match.awayTeamId);
    
    const initPlayer = (tp: any) => {
      initialStats[tp.playerId] = {
        goals: 0, assists: 0, yellowCards: 0, redCards: 0, ownGoals: 0, saves: 0,
        name: tp.player.name, category: tp.player.category, number: tp.player.number, isBorrowed: tp.isBorrowed
      };
    };
    
    homeTeam?.players?.forEach(initPlayer);
    awayTeam?.players?.forEach(initPlayer);
    
    setMatchStats(initialStats);
  };

  const closePopup = () => {
    setActiveMatch(null);
    setMatchStats({});
    setIsBorrowing(null);
  };

  const handleStatChange = (playerId: string, stat: string, delta: number) => {
    setMatchStats((prev: any) => {
      const current = prev[playerId][stat] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [playerId]: { ...prev[playerId], [stat]: next } };
    });
  };

  const handleBorrowPlayer = async (playerId: string) => {
    if (!activeMatch || !isBorrowing) return;
    const teamId = isBorrowing === "HOME" ? activeMatch.homeTeamId : activeMatch.awayTeamId;
    
    try {
      const res = await fetchWithAuth("/matches/borrow", {
        method: "POST",
        body: JSON.stringify({ teamId, playerId })
      });
      if (res.ok) {
        await loadData();
        setIsBorrowing(null);
        closePopup();
        alert("Jogador adicionado com sucesso! Clique na partida novamente para apitá-la.");
      } else {
        alert("Erro ao emprestar jogador");
      }
    } catch (e) {
      alert("Erro de conexão");
    }
  };

  const handleTeamPhotoUpload = async (teamId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingTeamPhoto(teamId);
    try {
      const data = new FormData();
      data.append("file", file);
      
      const res = await fetchWithAuth("/upload", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const result = await res.json();
        
        // Atualizar foto no backend
        const updateRes = await fetchWithAuth(`/matches/team/${teamId}/photo`, {
          method: "PUT",
          body: JSON.stringify({ photoUrl: result.url })
        });

        if (updateRes.ok) {
          await loadData();
        } else {
          alert("Falha ao salvar a imagem do time no sistema");
        }
      } else {
        alert("Falha no upload da imagem");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar a imagem");
    } finally {
      setUploadingTeamPhoto(null);
    }
  };

  const handleSaveMatch = async () => {
    if (!activeMatch) return;
    
    const homeTeam = round.teams.find((t: any) => t.id === activeMatch.homeTeamId);
    const awayTeam = round.teams.find((t: any) => t.id === activeMatch.awayTeamId);
    
    let homeScore = 0;
    let awayScore = 0;

    const statsPromises: Promise<any>[] = [];

    // Computar gols e enviar stats
    for (const [playerId, stats] of Object.entries<any>(matchStats)) {
      if (stats.goals > 0 || stats.yellowCards > 0 || stats.redCards > 0) {
        
        // Verifica de qual time ele é para somar no placar
        if (homeTeam?.players?.some((p: any) => p.playerId === playerId)) {
          homeScore += stats.goals;
        } else if (awayTeam?.players?.some((p: any) => p.playerId === playerId)) {
          awayScore += stats.goals;
        }

        statsPromises.push(
          fetchWithAuth(`/matches/${activeMatch.id}/stats`, {
            method: "POST",
            body: JSON.stringify({
              playerId,
              goals: stats.goals,
              yellowCards: stats.yellowCards,
              redCards: stats.redCards,
              assists: stats.assists,
              ownGoals: stats.ownGoals,
              saves: stats.saves
            })
          })
        );
      }
    }

    try {
      // 1. Enviar estatísticas dos jogadores
      await Promise.all(statsPromises);
      
      // 2. Atualizar placar e status
      await fetchWithAuth(`/matches/${activeMatch.id}/score`, {
        method: "PUT",
        body: JSON.stringify({ homeScore, awayScore, status: "FINISHED" })
      });

      alert(`Partida encerrada com sucesso! Placar: ${homeScore} x ${awayScore}`);
      closePopup();
      loadData();
    } catch (e) {
      alert("Erro ao salvar partida");
    }
  };

  if (loading && !round) return <div className="text-zinc-400 p-8">Carregando rodada...</div>;
  if (!round) return <div className="text-red-400 p-8">Rodada não encontrada.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
        <Link href={`/dashboard/championships/${round.championshipId}`}>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Rodada {round.number}
          </h2>
          <p className="text-zinc-400 flex items-center gap-1 text-sm mt-1">
            <Trophy className="w-3 h-3 text-emerald-500" />
            {round.championship?.name}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {round.matches.map((match: any) => (
          <Card 
            key={match.id} 
            className={`bg-zinc-900 border-zinc-800 transition-colors ${match.status !== 'FINISHED' ? 'hover:bg-zinc-800/80 cursor-pointer' : 'opacity-80'}`}
            onClick={() => { if (match.status !== 'FINISHED') openMatchPopup(match); }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 text-right">
                  <h3 className="text-xl font-bold text-white">{match.homeTeam?.name || "Time A"}</h3>
                </div>

                <div className="flex items-center gap-4 bg-zinc-950 px-6 py-3 rounded-xl border border-zinc-800">
                  <span className="text-3xl font-bold text-white">{match.homeScore ?? '-'}</span>
                  <span className="text-zinc-500 font-bold">X</span>
                  <span className="text-3xl font-bold text-white">{match.awayScore ?? '-'}</span>
                </div>

                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-white">{match.awayTeam?.name || "Time B"}</h3>
                </div>
              </div>

              {match.status === "FINISHED" ? (
                <div className="mt-4 flex justify-center">
                  <span className="text-emerald-500 text-sm font-medium flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full">
                    <Check className="w-4 h-4" /> Finalizado
                  </span>
                </div>
              ) : (
                <div className="mt-4 text-center text-sm text-zinc-500">
                  Clique para apitar a partida
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* POPUP (MODAL) DE PARTIDA */}
      {activeMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
            
            {/* Header Popup */}
            <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10">
              <h2 className="text-lg font-bold text-white">Apitar Partida</h2>
              <button onClick={closePopup} className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Popup */}
            <div className="p-6 overflow-y-auto flex-1">
              {isBorrowing ? (
                <div className="space-y-4">
                  <h3 className="font-bold text-white">Selecione um jogador para emprestar ao {isBorrowing === "HOME" ? activeMatch.homeTeam?.name : activeMatch.awayTeam?.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availablePlayers.map(p => (
                      <Button key={p.id} variant="outline" className="justify-start bg-zinc-950 border-zinc-800 text-zinc-300 hover:text-white" onClick={() => handleBorrowPlayer(p.id)}>
                        {p.name}
                      </Button>
                    ))}
                  </div>
                  <Button variant="ghost" onClick={() => setIsBorrowing(null)} className="mt-4 w-full text-zinc-400 hover:text-white">Cancelar</Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* TIME HOME */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                      <div className="flex items-center gap-3">
                        <div className="relative group w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0 flex items-center justify-center">
                          {round.teams.find((t: any) => t.id === activeMatch.homeTeamId)?.photoUrl ? (
                            <img src={round.teams.find((t: any) => t.id === activeMatch.homeTeamId)?.photoUrl} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-zinc-500" />
                          )}
                          
                          <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => handleTeamPhotoUpload(activeMatch.homeTeamId, e)}
                            disabled={uploadingTeamPhoto === activeMatch.homeTeamId}
                            title="Alterar escudo do time"
                          />
                          
                          {uploadingTeamPhoto === activeMatch.homeTeamId ? (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 text-white animate-spin" />
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center pointer-events-none">
                              <Upload className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-emerald-400">{activeMatch.homeTeam?.name}</h3>
                      </div>
                      <Button size="sm" variant="outline" className="border-zinc-700 bg-zinc-950 text-xs" onClick={() => setIsBorrowing("HOME")}>
                        <UserPlus className="w-3 h-3 mr-1" /> Emprestar
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {round.teams.find((t: any) => t.id === activeMatch.homeTeamId)?.players.map((tp: any) => {
                        const pId = tp.playerId;
                        const s = matchStats[pId];
                        if (!s) return null;
                        return (
                          <div key={pId} className="flex flex-col bg-zinc-950 border border-zinc-800 rounded p-3 gap-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-white flex items-center gap-2">
                                {s.name} 
                                {s.isBorrowed && <span className="bg-amber-500/20 text-amber-500 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Emprestado</span>}
                              </span>
                              <span className="text-xs text-zinc-500">{s.number ? `#${s.number}` : ""}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm mt-1">
                              {/* Gols */}
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-400">Gols:</span>
                                <button onClick={() => handleStatChange(pId, 'goals', -1)} className="w-6 h-6 bg-zinc-800 text-white rounded hover:bg-zinc-700 font-bold">-</button>
                                <span className="w-4 text-center font-bold">{s.goals}</span>
                                <button onClick={() => handleStatChange(pId, 'goals', 1)} className="w-6 h-6 bg-emerald-600 text-white rounded hover:bg-emerald-500 font-bold">+</button>
                              </div>
                              {/* Amarelos */}
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-4 bg-yellow-400 rounded-sm"></div>
                                <button onClick={() => handleStatChange(pId, 'yellowCards', -1)} className="w-6 h-6 bg-zinc-800 text-white rounded hover:bg-zinc-700 font-bold">-</button>
                                <span className="w-4 text-center font-bold">{s.yellowCards}</span>
                                <button onClick={() => handleStatChange(pId, 'yellowCards', 1)} className="w-6 h-6 bg-zinc-800 text-white rounded hover:bg-zinc-700 font-bold">+</button>
                              </div>
                              {/* Vermelhos */}
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-4 bg-red-500 rounded-sm"></div>
                                <button onClick={() => handleStatChange(pId, 'redCards', -1)} className="w-6 h-6 bg-zinc-800 text-white rounded hover:bg-zinc-700 font-bold">-</button>
                                <span className="w-4 text-center font-bold">{s.redCards}</span>
                                <button onClick={() => handleStatChange(pId, 'redCards', 1)} className="w-6 h-6 bg-zinc-800 text-white rounded hover:bg-zinc-700 font-bold">+</button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* TIME AWAY */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                      <div className="flex items-center gap-3">
                        <div className="relative group w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0 flex items-center justify-center">
                          {round.teams.find((t: any) => t.id === activeMatch.awayTeamId)?.photoUrl ? (
                            <img src={round.teams.find((t: any) => t.id === activeMatch.awayTeamId)?.photoUrl} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-zinc-500" />
                          )}
                          
                          <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => handleTeamPhotoUpload(activeMatch.awayTeamId, e)}
                            disabled={uploadingTeamPhoto === activeMatch.awayTeamId}
                            title="Alterar escudo do time"
                          />
                          
                          {uploadingTeamPhoto === activeMatch.awayTeamId ? (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 text-white animate-spin" />
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center pointer-events-none">
                              <Upload className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-emerald-400">{activeMatch.awayTeam?.name}</h3>
                      </div>
                      <Button size="sm" variant="outline" className="border-zinc-700 bg-zinc-950 text-xs" onClick={() => setIsBorrowing("AWAY")}>
                        <UserPlus className="w-3 h-3 mr-1" /> Emprestar
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {round.teams.find((t: any) => t.id === activeMatch.awayTeamId)?.players.map((tp: any) => {
                        const pId = tp.playerId;
                        const s = matchStats[pId];
                        if (!s) return null;
                        return (
                          <div key={pId} className="flex flex-col bg-zinc-950 border border-zinc-800 rounded p-3 gap-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-white flex items-center gap-2">
                                {s.name} 
                                {s.isBorrowed && <span className="bg-amber-500/20 text-amber-500 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Emprestado</span>}
                              </span>
                              <span className="text-xs text-zinc-500">{s.number ? `#${s.number}` : ""}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm mt-1">
                              {/* Gols */}
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-400">Gols:</span>
                                <button onClick={() => handleStatChange(pId, 'goals', -1)} className="w-6 h-6 bg-zinc-800 text-white rounded hover:bg-zinc-700 font-bold">-</button>
                                <span className="w-4 text-center font-bold">{s.goals}</span>
                                <button onClick={() => handleStatChange(pId, 'goals', 1)} className="w-6 h-6 bg-emerald-600 text-white rounded hover:bg-emerald-500 font-bold">+</button>
                              </div>
                              {/* Amarelos */}
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-4 bg-yellow-400 rounded-sm"></div>
                                <button onClick={() => handleStatChange(pId, 'yellowCards', -1)} className="w-6 h-6 bg-zinc-800 text-white rounded hover:bg-zinc-700 font-bold">-</button>
                                <span className="w-4 text-center font-bold">{s.yellowCards}</span>
                                <button onClick={() => handleStatChange(pId, 'yellowCards', 1)} className="w-6 h-6 bg-zinc-800 text-white rounded hover:bg-zinc-700 font-bold">+</button>
                              </div>
                              {/* Vermelhos */}
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-4 bg-red-500 rounded-sm"></div>
                                <button onClick={() => handleStatChange(pId, 'redCards', -1)} className="w-6 h-6 bg-zinc-800 text-white rounded hover:bg-zinc-700 font-bold">-</button>
                                <span className="w-4 text-center font-bold">{s.redCards}</span>
                                <button onClick={() => handleStatChange(pId, 'redCards', 1)} className="w-6 h-6 bg-zinc-800 text-white rounded hover:bg-zinc-700 font-bold">+</button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Popup */}
            {!isBorrowing && (
              <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3 sticky bottom-0 z-10">
                <Button variant="ghost" onClick={closePopup} className="text-zinc-400 hover:text-white">Cancelar</Button>
                <Button onClick={handleSaveMatch} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Check className="w-4 h-4 mr-2" /> Encerrar Partida
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
