"use client";

import { useEffect, useState, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Check, Trophy } from "lucide-react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";

export default function RoundDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [round, setRound] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<Record<string, { home: number | '', away: number | '' }>>({});

  useEffect(() => {
    async function loadData() {
      try {
        // Como não temos um endpoint só de round que inclua as partidas, 
        // a forma mais rápida pro MVP é puxar os campeonatos e achar o round.
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
          
          if (targetRound) {
            targetRound.championship = targetChamp;
            setRound(targetRound);
            
            // Inicializar state de placares
            const initialScores: any = {};
            targetRound.matches.forEach((m: any) => {
              initialScores[m.id] = {
                home: m.homeScore ?? '',
                away: m.awayScore ?? ''
              };
            });
            setScores(initialScores);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSaveScore = async (matchId: string) => {
    const s = scores[matchId];
    if (s.home === '' || s.away === '') {
      alert("Preencha os dois placares");
      return;
    }

    try {
      const res = await fetchWithAuth(`/matches/${matchId}/score`, {
        method: "PUT",
        body: JSON.stringify({
          homeScore: Number(s.home),
          awayScore: Number(s.away),
          status: "FINISHED"
        })
      });

      if (res.ok) {
        alert("Placar salvo e pontos computados com sucesso!");
        // Opcional: Atualizar a página para refletir as mudanças do banco
        window.location.reload();
      } else {
        alert("Erro ao salvar placar");
      }
    } catch (e) {
      alert("Erro de conexão");
    }
  };

  if (loading) return <div className="text-zinc-400 p-8">Carregando rodada...</div>;
  if (!round) return <div className="text-red-400 p-8">Rodada não encontrada.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
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

      <div className="grid gap-6">
        {round.matches.map((match: any) => (
          <Card key={match.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Time A */}
                <div className="flex-1 text-center md:text-right">
                  <h3 className="text-lg font-bold text-white">{match.homeTeam?.name || "Time A"}</h3>
                </div>

                {/* Placar Central */}
                <div className="flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <Input 
                    type="number"
                    min="0"
                    className="w-16 h-12 text-center text-xl font-bold bg-zinc-900 border-zinc-700 text-white focus-visible:ring-emerald-500"
                    value={scores[match.id]?.home}
                    onChange={e => setScores({
                      ...scores,
                      [match.id]: { ...scores[match.id], home: e.target.value }
                    })}
                    disabled={match.status === "FINISHED"}
                  />
                  <span className="text-zinc-500 font-bold">X</span>
                  <Input 
                    type="number"
                    min="0"
                    className="w-16 h-12 text-center text-xl font-bold bg-zinc-900 border-zinc-700 text-white focus-visible:ring-emerald-500"
                    value={scores[match.id]?.away}
                    onChange={e => setScores({
                      ...scores,
                      [match.id]: { ...scores[match.id], away: e.target.value }
                    })}
                    disabled={match.status === "FINISHED"}
                  />
                </div>

                {/* Time B */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-bold text-white">{match.awayTeam?.name || "Time B"}</h3>
                </div>
              </div>

              {/* Botão de Salvar */}
              {match.status !== "FINISHED" ? (
                <div className="mt-6 flex justify-center">
                  <Button 
                    onClick={() => handleSaveScore(match.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Encerrar Partida e Computar Pontos
                  </Button>
                </div>
              ) : (
                <div className="mt-6 flex justify-center">
                  <span className="bg-zinc-800 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium border border-zinc-700 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Partida Encerrada
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
