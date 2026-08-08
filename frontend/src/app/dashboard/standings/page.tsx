"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { BarChart, Trophy, Target, Shirt, Award, QrCode, Share2, FileText, Trash2, Edit } from "lucide-react";
import { FifaCardModal } from "@/components/FifaCardModal";
import { TrophyModal } from "@/components/TrophyModal";

type Championship = { id: string; name: string; logoUrl?: string };

export default function StandingsGlobalPage() {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [selectedChampId, setSelectedChampId] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [scorers, setScorers] = useState<any[]>([]);
  const [goalkeepers, setGoalkeepers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [classTab, setClassTab] = useState<"pontos" | "artilheiros" | "luva">("pontos");

  // Modals
  const [selectedFifaPlayer, setSelectedFifaPlayer] = useState<any>(null);
  const [showTrophyModal, setShowTrophyModal] = useState(false);

  useEffect(() => {
    fetchWithAuth("/championships")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setChampionships(data);
        if (data.length > 0) {
          setSelectedChampId(data[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const loadChampData = async (champId: string) => {
    if (!champId) return;
    setLoading(true);
    try {
      const [leadRes, scorersRes, gkRes] = await Promise.all([
        fetchWithAuth(`/championships/${champId}/leaderboard`),
        fetchWithAuth(`/championships/${champId}/scorers`),
        fetchWithAuth(`/championships/${champId}/goalkeepers`),
      ]);

      if (leadRes.ok) setLeaderboard(await leadRes.json());
      if (scorersRes.ok) setScorers(await scorersRes.json());
      if (gkRes.ok) setGoalkeepers(await gkRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChampId) {
      loadChampData(selectedChampId);
    }
  }, [selectedChampId]);

  const selectedChamp = championships.find((c) => c.id === selectedChampId);

  const handleDownloadPDF = async () => {
    if (!selectedChampId) return;
    try {
      const res = await fetchWithAuth(`/reports/championship/${selectedChampId}/leaderboard`, {
        method: "POST",
        body: JSON.stringify({ leaderboard, scorers, goalkeepers }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `classificacao-${selectedChamp?.name || "campeonato"}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Erro ao baixar PDF");
      }
    } catch (e) {
      alert("Erro ao gerar PDF");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart className="text-emerald-500 w-6 h-6" />
            Tabela de Classificação
          </h2>
          <p className="text-zinc-400 text-sm mt-0.5">
            Acompanhe a pontuação dos atletas, artilharia e luva de ouro.
          </p>
        </div>

        {/* Championship Selector */}
        {championships.length > 0 && (
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <select
              value={selectedChampId}
              onChange={(e) => setSelectedChampId(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-semibold"
            >
              {championships.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-zinc-400 text-center py-12">Carregando classificação...</div>
      ) : championships.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl text-center py-12 p-6 text-zinc-400">
          Nenhum campeonato cadastrado ainda.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Sub-tabs & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
            <div className="flex gap-2">
              {[
                { key: "pontos", label: "Pontos", icon: BarChart },
                { key: "artilheiros", label: "Artilheiros", icon: Target },
                { key: "luva", label: "Luva de Ouro", icon: Shirt },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setClassTab(key as any)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    classTab === key ? "bg-emerald-600 text-white font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setShowTrophyModal(true)}
                variant="outline"
                className="border-yellow-600/60 text-yellow-400 hover:bg-yellow-950/60 h-8 text-xs font-bold"
              >
                <Award className="w-3.5 h-3.5 mr-1.5 text-yellow-400" /> Troféu Digital
              </Button>
              <Button
                onClick={async () => {
                  const url = `${window.location.origin}/public/championship/${selectedChampId}`;
                  // @ts-ignore
                  const QRCode = (await import("qrcode")).default;
                  const dataUrl = await QRCode.toDataURL(url, {
                    width: 300,
                    color: { dark: "#10b981", light: "#09090b" },
                  });
                  const win = window.open("");
                  win?.document.write(
                    `<html><body style='background:#09090b;display:flex;align-items:center;justify-content:center;height:100vh;margin:0'><div style='text-align:center'><img src='${dataUrl}' style='width:300px'/><p style='color:#10b981;font-family:sans-serif;margin-top:16px'>QR Code — ${url}</p></div></body></html>`
                  );
                }}
                variant="outline"
                className="border-purple-700 text-purple-400 hover:bg-purple-950 h-8 text-xs"
              >
                <QrCode className="w-3.5 h-3.5 mr-1.5" /> QR Code
              </Button>
              <Button
                onClick={() => {
                  const url = `${window.location.origin}/public/championship/${selectedChampId}`;
                  navigator.clipboard.writeText(url);
                  alert("Link público copiado com sucesso!");
                }}
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-8 text-xs"
              >
                <Share2 className="w-3.5 h-3.5 mr-1.5" /> Compartilhar
              </Button>
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 h-8 text-xs font-semibold"
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" /> Exportar PDF
              </Button>
            </div>
          </div>

          {/* TABELA PONTOS */}
          {classTab === "pontos" && (
            <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-zinc-950/80 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3">Pos</th>
                    <th className="px-4 py-3">Jogador</th>
                    <th className="px-4 py-3 text-center">Nº</th>
                    <th className="px-4 py-3 text-center text-emerald-400 font-bold">PTS</th>
                    <th className="px-4 py-3 text-center">J</th>
                    <th className="px-4 py-3 text-center">V</th>
                    <th className="px-4 py-3 text-center">E</th>
                    <th className="px-4 py-3 text-center">D</th>
                    <th className="px-4 py-3 text-center">Gols</th>
                    <th className="px-4 py-3 text-center text-red-400/70">GC</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-zinc-500">
                        Nenhuma pontuação computada ainda.
                      </td>
                    </tr>
                  )}
                  {leaderboard.map((p, idx) => (
                    <tr
                      key={p.id}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-bold">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                            idx === 0
                              ? "bg-yellow-500 text-black font-black"
                              : idx === 1
                              ? "bg-zinc-300 text-black font-black"
                              : idx === 2
                              ? "bg-amber-700 text-white font-black"
                              : "text-zinc-400"
                          }`}
                        >
                          {idx + 1}º
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-zinc-100">
                        <div
                          onClick={() => setSelectedFifaPlayer(p)}
                          className="flex items-center gap-2 cursor-pointer hover:text-emerald-400 transition-colors group"
                        >
                          {p.photoUrl ? (
                            <img
                              src={p.photoUrl}
                              alt={p.name}
                              className="w-7 h-7 rounded-full object-cover shrink-0 border border-amber-500/40"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                              <Trophy className="w-3.5 h-3.5 text-zinc-500" />
                            </div>
                          )}
                          <span>{p.name}</span>
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                            🎴 Card
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-zinc-400 text-xs font-mono">
                        {p.number ? `#${p.number}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-center font-black text-emerald-400 text-lg">
                        {p.points}
                      </td>
                      <td className="px-4 py-3 text-center text-zinc-300">{p.matchesPlayed}</td>
                      <td className="px-4 py-3 text-center text-emerald-400">{p.wins}</td>
                      <td className="px-4 py-3 text-center text-yellow-400">{p.draws}</td>
                      <td className="px-4 py-3 text-center text-red-400">{p.losses}</td>
                      <td className="px-4 py-3 text-center font-bold text-white">{p.goals}</td>
                      <td className="px-4 py-3 text-center text-red-400/70 text-xs">
                        {p.ownGoals || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TABELA ARTILHEIROS */}
          {classTab === "artilheiros" && (
            <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-zinc-950/80 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3">Pos</th>
                    <th className="px-4 py-3">Jogador</th>
                    <th className="px-4 py-3 text-center">Nº</th>
                    <th className="px-4 py-3 text-center font-bold text-emerald-400">Gols Marcados</th>
                  </tr>
                </thead>
                <tbody>
                  {scorers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                        Nenhum gol marcado ainda.
                      </td>
                    </tr>
                  )}
                  {scorers.map((p, idx) => (
                    <tr
                      key={p.id}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-emerald-400">{idx + 1}º</td>
                      <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                      <td className="px-4 py-3 text-center text-zinc-400 font-mono text-xs">
                        {p.number ? `#${p.number}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-center font-black text-emerald-400 text-lg">
                        {p.goals}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TABELA LUVA DE OURO */}
          {classTab === "luva" && (
            <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-zinc-950/80 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3">Pos</th>
                    <th className="px-4 py-3">Goleiro</th>
                    <th className="px-4 py-3 text-center">Nº</th>
                    <th className="px-4 py-3 text-center font-bold text-blue-400">Defesas Realizadas</th>
                  </tr>
                </thead>
                <tbody>
                  {goalkeepers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                        Nenhuma defesa registrada ainda.
                      </td>
                    </tr>
                  )}
                  {goalkeepers.map((p, idx) => (
                    <tr
                      key={p.id}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-blue-400">{idx + 1}º</td>
                      <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                      <td className="px-4 py-3 text-center text-zinc-400 font-mono text-xs">
                        {p.number ? `#${p.number}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-center font-black text-blue-400 text-lg">
                        {p.saves}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL CARD EA FC / FIFA */}
      {selectedFifaPlayer && (
        <FifaCardModal
          player={selectedFifaPlayer}
          championshipName={selectedChamp?.name || "ProLeague"}
          onClose={() => setSelectedFifaPlayer(null)}
        />
      )}

      {/* MODAL TROFÉU DIGITAL & HALL DA FAMA */}
      {showTrophyModal && (
        <TrophyModal
          championshipName={selectedChamp?.name || "ProLeague"}
          data={{
            championName: leaderboard[0]?.name,
            topScorerName: scorers[0]?.name,
            topScorerGoals: scorers[0]?.goals,
            bestGoalkeeperName: goalkeepers[0]?.name,
            bestGoalkeeperSaves: goalkeepers[0]?.saves,
          }}
          onClose={() => setShowTrophyModal(false)}
        />
      )}
    </div>
  );
}
