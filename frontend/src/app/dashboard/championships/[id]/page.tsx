"use client";

import { useEffect, useState, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Users, Play, ArrowLeft, FileText, Settings, BarChart, LayoutGrid, X, Trash2, LockKeyhole, LockOpen, Target, Shirt, Share2, QrCode, DollarSign } from "lucide-react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";

export default function ChampionshipDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [championship, setChampionship] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [scorers, setScorers] = useState<any[]>([]);
  const [goalkeepers, setGoalkeepers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"gerenciar" | "times" | "jogadores" | "classificacao">("gerenciar");
  const [classTab, setClassTab] = useState<"pontos" | "artilheiros" | "luva">("pontos");

  // Edit Player State
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const [playerForm, setPlayerForm] = useState({ name: "", category: "", number: "" });

  // Edit Points State
  const [editingPointsPlayer, setEditingPointsPlayer] = useState<any>(null);
  const [pointsForm, setPointsForm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [champRes, leadRes, scorersRes, gkRes] = await Promise.all([
        fetchWithAuth(`/championships/${id}`),
        fetchWithAuth(`/championships/${id}/leaderboard`),
        fetchWithAuth(`/championships/${id}/scorers`),
        fetchWithAuth(`/championships/${id}/goalkeepers`),
      ]);

      if (champRes.ok) setChampionship(await champRes.json());
      if (leadRes.ok) setLeaderboard(await leadRes.json());
      if (scorersRes.ok) setScorers(await scorersRes.json());
      if (gkRes.ok) setGoalkeepers(await gkRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const handleDownloadPDF = async () => {
    try {
      const res = await fetchWithAuth(`/reports/championship/${id}/leaderboard`, {
        method: "POST",
        body: JSON.stringify({ leaderboard })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `classificacao-${championship?.name || 'campeonato'}.pdf`;
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

  const handleSavePlayerEdit = async () => {
    try {
      const res = await fetchWithAuth(`/championships/${id}/players/${editingPlayer.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: playerForm.name, category: playerForm.category, number: playerForm.number ? Number(playerForm.number) : null })
      });
      if (res.ok) { setEditingPlayer(null); loadData(); }
      else alert("Erro ao editar jogador");
    } catch { alert("Erro de conexão"); }
  };

  const handleSavePointsEdit = async () => {
    try {
      const res = await fetchWithAuth(`/championships/${id}/players/${editingPointsPlayer.id}/manual-points`, {
        method: "PUT",
        body: JSON.stringify({ points: Number(pointsForm) })
      });
      if (res.ok) { setEditingPointsPlayer(null); loadData(); }
      else alert("Erro ao alterar pontuação");
    } catch { alert("Erro de conexão"); }
  };

  const handleRoundAction = async (roundId: string, action: "close" | "reopen" | "delete") => {
    if (action === "delete" && !confirm("Excluir esta rodada apagará todas as partidas e estatísticas dela. Confirma?")) return;
    const methods: any = { close: "PUT", reopen: "PUT", delete: "DELETE" };
    const paths: any = {
      close: `/championships/${id}/rounds/${roundId}/close`,
      reopen: `/championships/${id}/rounds/${roundId}/reopen`,
      delete: `/championships/${id}/rounds/${roundId}`,
    };
    try {
      const res = await fetchWithAuth(paths[action], { method: methods[action] });
      if (res.ok) loadData();
      else alert("Erro na operação");
    } catch { alert("Erro de conexão"); }
  };

  const handleResetStats = async () => {
    if (!confirm("ATENÇÃO: Isso vai ZERAR todas as estatísticas e pontuações deste campeonato. Confirma?")) return;
    try {
      const res = await fetchWithAuth(`/championships/${id}/stats`, { method: "DELETE" });
      if (res.ok) { loadData(); alert("Classificação zerada com sucesso!"); }
      else alert("Erro ao zerar classificação");
    } catch { alert("Erro de conexão"); }
  };

  if (loading && !championship) return <div className="text-zinc-400">Carregando...</div>;
  if (!championship) return <div className="text-red-400">Campeonato não encontrado.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
        <Link href="/dashboard/championships">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          {championship.logoUrl ? (
            <img src={championship.logoUrl} alt="Logo" className="w-10 h-10 rounded-full object-cover border border-zinc-700" />
          ) : (
            <Trophy className="text-emerald-500 w-6 h-6" />
          )}
          <h2 className="text-2xl font-bold tracking-tight">{championship.name}</h2>
        </div>
      </div>

      {/* TABS */}
      <div className="flex overflow-x-auto border-b border-zinc-800 scrollbar-hide">
        {[
          { key: "gerenciar", label: "Gerenciar", icon: Settings },
          { key: "jogadores", label: `Jogadores (${championship.players?.length || 0})`, icon: Users },
          { key: "times", label: "Times e Rodadas", icon: LayoutGrid },
          { key: "classificacao", label: "Classificação", icon: BarChart },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === key ? "border-emerald-500 text-white" : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4 inline-block mr-2 mb-0.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ABA: GERENCIAR */}
      {activeTab === "gerenciar" && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader><CardTitle>Visão Geral</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Total de Inscritos", value: championship.players.length },
                { label: "Rodadas", value: championship.rounds.length },
                { label: "Jogadores por Time", value: championship.playersPerTeam },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400">{label}</span>
                  <span className="font-bold text-white">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ABA: JOGADORES */}
      {activeTab === "jogadores" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Elenco Inscrito</h3>
            <Link href={`/dashboard/championships/${id}/players/new`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Users className="w-4 h-4 mr-2" /> Adicionar Jogador
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {championship.players.length === 0 && <p className="text-zinc-500">Nenhum jogador inscrito.</p>}
            {championship.players.map((p: any) => (
              <div key={p.id} className="flex justify-between items-center p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                    {p.photoUrl ? <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" /> : <Users className="w-5 h-5 text-zinc-500" />}
                  </div>
                  <div>
                    <span className="block font-medium text-white">{p.name}</span>
                    <span className="text-zinc-500 text-xs">{p.category} · {p.number ? `#${p.number}` : "Sem Número"}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-zinc-700 hover:bg-zinc-800"
                  onClick={() => { setEditingPlayer(p); setPlayerForm({ name: p.name, category: p.category, number: p.number || "" }); }}>
                  Editar
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA: TIMES E RODADAS */}
      {activeTab === "times" && (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Rodadas</h2>
              <Link href={`/dashboard/championships/${id}/finance`}>
                <Button variant="outline" size="sm" className="border-emerald-700 text-emerald-400 hover:bg-emerald-950 h-8 text-xs">
                  <DollarSign className="w-3.5 h-3.5 mr-1" /> Financeiro
                </Button>
              </Link>
            </div>
            <div className="flex justify-end">
              <Link href={`/dashboard/championships/${id}/draft`}>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Play className="w-4 h-4 mr-2" /> Sortear Nova Rodada
                </Button>
              </Link>
            </div>
          <div className="grid grid-cols-1 gap-4">
            {championship.rounds.length === 0 && <p className="text-zinc-500">Nenhuma rodada iniciada.</p>}
            {championship.rounds.map((r: any) => (
              <Card key={r.id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4 flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <h4 className="font-bold text-emerald-400 text-lg">Rodada {r.number}</h4>
                    <p className="text-sm text-zinc-500">
                      {r.matches?.length || 0} Partidas ·{" "}
                      <span className={r.closed ? "text-red-400" : "text-emerald-400"}>
                        {r.closed ? "Finalizada" : "Em Andamento"}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/dashboard/rounds/${r.id}`}>
                      <Button variant="secondary" className="bg-zinc-800 text-white hover:bg-zinc-700 h-8 text-xs">
                        Entrar
                      </Button>
                    </Link>
                    {r.closed ? (
                      <Button
                        variant="outline"
                        className="h-8 text-xs border-emerald-800 text-emerald-400 hover:bg-emerald-950"
                        onClick={() => handleRoundAction(r.id, "reopen")}
                      >
                        <LockOpen className="w-3 h-3 mr-1" /> Reabrir
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="h-8 text-xs border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                        onClick={() => handleRoundAction(r.id, "close")}
                      >
                        <LockKeyhole className="w-3 h-3 mr-1" /> Finalizar
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0 border-red-900/50 text-red-500 hover:bg-red-950"
                      onClick={() => handleRoundAction(r.id, "delete")}
                      title="Excluir rodada"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ABA: CLASSIFICAÇÃO */}
      {activeTab === "classificacao" && (
        <div className="space-y-5">
          {/* Sub-tabs */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
              {[
                { key: "pontos", label: "Pontos", icon: BarChart },
                { key: "artilheiros", label: "Artilheiros", icon: Target },
                { key: "luva", label: "Luva de Ouro", icon: Shirt },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setClassTab(key as any)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    classTab === key ? "bg-emerald-600 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={async () => {
                  const url = `${window.location.origin}/public/championship/${id}`;
                  // @ts-ignore
                  const QRCode = (await import('qrcode')).default;
                  const dataUrl = await QRCode.toDataURL(url, { width: 300, color: { dark: '#10b981', light: '#09090b' } });
                  const win = window.open('');
                  win?.document.write(`<html><body style='background:#09090b;display:flex;align-items:center;justify-content:center;height:100vh;margin:0'><div style='text-align:center'><img src='${dataUrl}' style='width:300px'/><p style='color:#10b981;font-family:sans-serif;margin-top:16px'>QR Code — ${url}</p></div></body></html>`);
                }}
                variant="outline" className="border-purple-700 text-purple-400 hover:bg-purple-950 h-8 text-xs"
              >
                <QrCode className="w-3.5 h-3.5 mr-1.5" /> QR Code
              </Button>
              <Button
                onClick={() => {
                  const url = `${window.location.origin}/public/championship/${id}`;
                  navigator.clipboard.writeText(url);
                  alert("Link copiado! Qualquer pessoa com ele pode ver a classificação.");
                }}
                variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-8 text-xs"
              >
                <Share2 className="w-3.5 h-3.5 mr-1.5" /> Compartilhar
              </Button>
              <Button onClick={handleDownloadPDF} variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 h-8 text-xs">
                <FileText className="w-3.5 h-3.5 mr-1.5" /> Exportar PDF
              </Button>
              <Button onClick={handleResetStats} variant="outline" className="border-red-900/50 text-red-400 hover:bg-red-950 h-8 text-xs">
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Zerar
              </Button>
            </div>
          </div>

          {/* Tabela Pontos */}
          {classTab === "pontos" && (
            <div className="overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-zinc-900/50 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-3 py-3">Pos</th>
                    <th className="px-3 py-3">Jogador</th>
                    <th className="px-3 py-3 text-center">Nº</th>
                    <th className="px-3 py-3 text-center">PTS</th>
                    <th className="px-3 py-3 text-center">J</th>
                    <th className="px-3 py-3 text-center">V</th>
                    <th className="px-3 py-3 text-center">E</th>
                    <th className="px-3 py-3 text-center">D</th>
                    <th className="px-3 py-3 text-center">Gols</th>
                    <th className="px-3 py-3 text-center text-red-400/70">GC</th>
                    <th className="px-3 py-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length === 0 && (
                    <tr><td colSpan={10} className="px-4 py-8 text-center text-zinc-500">Nenhuma pontuação computada ainda.</td></tr>
                  )}
                  {leaderboard.map((p, idx) => (
                    <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                      <td className="px-3 py-3 font-mono text-zinc-400 text-xs">{idx + 1}º</td>
                      <td className="px-3 py-3 font-medium text-white">
                        <div className="flex items-center gap-2">
                          {p.photoUrl ? (
                            <img src={p.photoUrl} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                              <Users className="w-3.5 h-3.5 text-zinc-500" />
                            </div>
                          )}
                          <span className="truncate max-w-[120px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-zinc-400 text-xs">{p.number ? `#${p.number}` : "—"}</td>
                      <td className="px-3 py-3 text-center font-bold text-emerald-400">{p.points}</td>
                      <td className="px-3 py-3 text-center text-zinc-400">{p.matchesPlayed}</td>
                      <td className="px-3 py-3 text-center text-zinc-400">{p.wins}</td>
                      <td className="px-3 py-3 text-center text-zinc-400">{p.draws}</td>
                      <td className="px-3 py-3 text-center text-zinc-400">{p.losses}</td>
                      <td className="px-3 py-3 text-center text-zinc-400">{p.goals}</td>
                      <td className="px-3 py-3 text-center text-red-400/70 text-xs">{(p.ownGoals || 0) > 0 ? p.ownGoals : '—'}</td>
                      <td className="px-3 py-3 text-right">
                        <Button variant="outline" size="sm" className="h-7 text-xs border-zinc-700 bg-zinc-900"
                          onClick={() => { setEditingPointsPlayer(p); setPointsForm(p.points.toString()); }}>
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tabela Artilheiros */}
          {classTab === "artilheiros" && (
            <div className="overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-zinc-900/50 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-3 py-3">Pos</th>
                    <th className="px-3 py-3">Jogador</th>
                    <th className="px-3 py-3 text-center">Nº</th>
                    <th className="px-3 py-3 text-center">⚽ Gols</th>
                  </tr>
                </thead>
                <tbody>
                  {scorers.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-zinc-500">Nenhum gol registrado ainda.</td></tr>
                  )}
                  {scorers.map((p, idx) => (
                    <tr key={p.playerId} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                      <td className="px-3 py-3 font-mono text-zinc-400 text-xs">{idx + 1}º</td>
                      <td className="px-3 py-3 font-medium text-white">
                        <div className="flex items-center gap-2">
                          {p.photoUrl ? (
                            <img src={p.photoUrl} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                              <Users className="w-3.5 h-3.5 text-zinc-500" />
                            </div>
                          )}
                          {p.name}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-zinc-400 text-xs">{p.number ? `#${p.number}` : "—"}</td>
                      <td className="px-3 py-3 text-center font-bold text-emerald-400 text-lg">{p.goals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tabela Luva de Ouro */}
          {classTab === "luva" && (
            <div className="overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-zinc-900/50 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-3 py-3">Pos</th>
                    <th className="px-3 py-3">Goleiro</th>
                    <th className="px-3 py-3 text-center">Nº</th>
                    <th className="px-3 py-3 text-center">🧤 Defesas</th>
                  </tr>
                </thead>
                <tbody>
                  {goalkeepers.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-zinc-500">Nenhuma defesa registrada ainda.</td></tr>
                  )}
                  {goalkeepers.map((p, idx) => (
                    <tr key={p.playerId} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                      <td className="px-3 py-3 font-mono text-zinc-400 text-xs">{idx + 1}º</td>
                      <td className="px-3 py-3 font-medium text-white">
                        <div className="flex items-center gap-2">
                          {p.photoUrl ? (
                            <img src={p.photoUrl} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                              <Users className="w-3.5 h-3.5 text-zinc-500" />
                            </div>
                          )}
                          {p.name}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-zinc-400 text-xs">{p.number ? `#${p.number}` : "—"}</td>
                      <td className="px-3 py-3 text-center font-bold text-blue-400 text-lg">{p.saves}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* POPUP EDITAR JOGADOR */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl p-6 relative">
            <button onClick={() => setEditingPlayer(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold text-white mb-4">Editar Jogador</h3>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nome</Label><Input value={playerForm.name} onChange={e => setPlayerForm({ ...playerForm, name: e.target.value })} className="bg-zinc-950 border-zinc-800" /></div>
              <div className="space-y-2"><Label>Camisa</Label><Input type="number" value={playerForm.number} onChange={e => setPlayerForm({ ...playerForm, number: e.target.value })} className="bg-zinc-950 border-zinc-800" /></div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <select className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200" value={playerForm.category} onChange={e => setPlayerForm({ ...playerForm, category: e.target.value })}>
                  <option value="CAT_A">Categoria A</option>
                  <option value="CAT_B">Categoria B</option>
                  <option value="CAT_C">Categoria C</option>
                  <option value="GOALKEEPER">Goleiro</option>
                </select>
              </div>
              <Button onClick={handleSavePlayerEdit} className="w-full bg-emerald-600 hover:bg-emerald-700">Salvar Alterações</Button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP EDITAR PONTOS */}
      {editingPointsPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm shadow-2xl p-6 relative">
            <button onClick={() => setEditingPointsPlayer(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold text-white mb-4">Ajustar Pontuação Base</h3>
            <p className="text-sm text-zinc-400 mb-4">Altere a pontuação base de <strong className="text-white">{editingPointsPlayer.name}</strong>.</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Pontuação Manual (+/-)</Label>
                <Input type="number" value={pointsForm} onChange={e => setPointsForm(e.target.value)} className="bg-zinc-950 border-zinc-800 text-xl font-bold text-center" />
              </div>
              <Button onClick={handleSavePointsEdit} className="w-full bg-emerald-600 hover:bg-emerald-700">Confirmar Pontuação</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
