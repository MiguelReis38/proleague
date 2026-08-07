"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Plus, Pencil, Trash2, X, Upload, Loader2, CheckCircle2, PlayCircle } from "lucide-react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";

export default function ChampionshipsPage() {
  const [championships, setChampionships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Status Filter
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "FINISHED">("ALL");

  // Edit Modal
  const [editingChamp, setEditingChamp] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    logoUrl: "",
    status: "ACTIVE",
    winPoints: 3,
    drawPoints: 1,
    losePoints: 0,
    goalPoints: 1,
    yellowCardPoints: 0,
    redCardPoints: 0,
    participationPoints: 0,
    playersPerTeam: 7,
  });

  const loadChampionships = async () => {
    try {
      const res = await fetchWithAuth("/championships");
      if (res.ok) setChampionships(await res.json());
    } catch (err) {
      console.error("Failed to load championships", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChampionships();
  }, []);

  const openEdit = (champ: any) => {
    setEditingChamp(champ);
    setEditForm({
      name: champ.name || "",
      logoUrl: champ.logoUrl || "",
      status: champ.status || "ACTIVE",
      winPoints: champ.winPoints ?? 3,
      drawPoints: champ.drawPoints ?? 1,
      losePoints: champ.losePoints ?? 0,
      goalPoints: champ.goalPoints ?? 1,
      yellowCardPoints: champ.yellowCardPoints ?? 0,
      redCardPoints: champ.redCardPoints ?? 0,
      participationPoints: champ.participationPoints ?? 0,
      playersPerTeam: champ.playersPerTeam ?? 7,
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingLogo(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetchWithAuth("/upload", { method: "POST", body: data });
      if (res.ok) {
        const result = await res.json();
        setEditForm((f) => ({ ...f, logoUrl: result.url }));
      }
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetchWithAuth(`/championships/${editingChamp.id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditingChamp(null);
        loadChampionships();
      } else {
        alert("Erro ao salvar alterações.");
      }
    } catch {
      alert("Erro de conexão");
    }
  };

  const toggleChampStatus = async (champ: any) => {
    const nextStatus = champ.status === "ACTIVE" ? "FINISHED" : "ACTIVE";
    const label = nextStatus === "FINISHED" ? "Concluir/Finalizar" : "Reabrir";
    if (!confirm(`Deseja alterar o status do campeonato "${champ.name}" para ${label}?`)) return;

    try {
      const res = await fetchWithAuth(`/championships/${champ.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) loadChampionships();
      else alert("Erro ao mudar status");
    } catch {
      alert("Erro de conexão");
    }
  };

  const handleDelete = async (champ: any) => {
    if (
      !confirm(
        `Tem certeza que deseja excluir "${champ.name}"? Isso apagará TODAS as rodadas, jogadores e estatísticas.`
      )
    )
      return;
    try {
      const res = await fetchWithAuth(`/championships/${champ.id}`, { method: "DELETE" });
      if (res.ok) loadChampionships();
      else alert("Erro ao excluir");
    } catch {
      alert("Erro de conexão");
    }
  };

  const filteredChampionships = championships.filter((c) => {
    if (statusFilter === "ACTIVE") return c.status === "ACTIVE";
    if (statusFilter === "FINISHED") return c.status === "FINISHED";
    return true;
  });

  const activeCount = championships.filter((c) => c.status === "ACTIVE").length;
  const finishedCount = championships.filter((c) => c.status === "FINISHED").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Meus Campeonatos</h2>
          <p className="text-zinc-400">Gerencie seus torneios em andamento ou histórico de concluídos.</p>
        </div>
        <Link href="/dashboard/championships/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
            <Plus className="w-4 h-4 mr-2" />
            Criar Campeonato
          </Button>
        </Link>
      </div>

      {/* FILTRO DE STATUS: TODOS / ATIVOS / CONCLUÍDOS */}
      <div className="flex gap-2">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            statusFilter === "ALL"
              ? "bg-emerald-600 text-white"
              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          }`}
        >
          Todos ({championships.length})
        </button>
        <button
          onClick={() => setStatusFilter("ACTIVE")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            statusFilter === "ACTIVE"
              ? "bg-emerald-600 text-white"
              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          }`}
        >
          🟢 Em Andamento ({activeCount})
        </button>
        <button
          onClick={() => setStatusFilter("FINISHED")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            statusFilter === "FINISHED"
              ? "bg-emerald-600 text-white"
              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          }`}
        >
          🏁 Concluídos ({finishedCount})
        </button>
      </div>

      {loading ? (
        <div className="text-zinc-400 py-8">Carregando campeonatos...</div>
      ) : filteredChampionships.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Trophy className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-200">Nenhum campeonato nesta categoria</h3>
          <p className="text-zinc-500 mb-6">Nenhum torneio encontrado no filtro selecionado.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredChampionships.map((champ) => (
            <Card
              key={champ.id}
              className={`bg-zinc-900 border transition-all group ${
                champ.status === "FINISHED" ? "border-zinc-800/80 opacity-90" : "border-zinc-800 hover:border-emerald-500/30"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  {champ.logoUrl ? (
                    <img
                      src={champ.logoUrl}
                      alt={champ.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0 border border-zinc-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                      <Trophy className="w-5 h-5 text-zinc-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{champ.name}</CardTitle>
                    <CardDescription className="text-zinc-500 text-xs mt-0.5 flex items-center gap-1.5">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                          champ.status === "ACTIVE"
                            ? "bg-emerald-950 border border-emerald-800 text-emerald-400"
                            : "bg-red-950 border border-red-800 text-red-400"
                        }`}
                      >
                        {champ.status === "ACTIVE" ? "🟢 Em Andamento" : "🏁 Concluído"}
                      </span>
                      <span>· {champ.players?.length || 0} jog.</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-xs text-zinc-500 mb-3">
                  {champ.playersPerTeam} jog/time · {champ.rounds?.length || 0} rodadas
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/championships/${champ.id}`} className="flex-1">
                    <Button
                      variant="secondary"
                      className="w-full bg-zinc-800 text-white hover:bg-zinc-700 h-8 text-xs font-semibold"
                    >
                      Abrir
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                    onClick={() => toggleChampStatus(champ)}
                    title="Mudar status do campeonato"
                  >
                    {champ.status === "ACTIVE" ? "Finalizar" : "Reabrir"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
                    onClick={() => openEdit(champ)}
                    title="Editar campeonato"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-red-900/50 bg-zinc-900 hover:bg-red-950 text-red-500"
                    onClick={() => handleDelete(champ)}
                    title="Excluir campeonato"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL EDITAR CAMPEONATO */}
      {editingChamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl my-8">
            <div className="flex justify-between items-center p-5 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">Editar Campeonato</h3>
              <button onClick={() => setEditingChamp(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <div className="relative group w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center shrink-0">
                  {editForm.logoUrl ? (
                    <img src={editForm.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Trophy className="w-6 h-6 text-zinc-500" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                  />
                  <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center pointer-events-none">
                    {uploadingLogo ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <Label>Nome do Campeonato</Label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <Label>Status do Campeonato</Label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="ACTIVE">🟢 Em Andamento (Ativo)</option>
                  <option value="FINISHED">🏁 Concluído (Finalizado)</option>
                </select>
              </div>

              {/* Config */}
              <div className="space-y-1">
                <Label>Jogadores por Time</Label>
                <Input
                  type="number"
                  value={editForm.playersPerTeam}
                  onChange={(e) => setEditForm((f) => ({ ...f, playersPerTeam: Number(e.target.value) }))}
                  className="bg-zinc-950 border-zinc-800"
                />
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <h4 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
                  Regras de Pontuação
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Pts por Vitória", key: "winPoints" },
                    { label: "Pts por Empate", key: "drawPoints" },
                    { label: "Pts por Derrota", key: "losePoints" },
                    { label: "Pts por Gol", key: "goalPoints" },
                    { label: "Pts Participação", key: "participationPoints" },
                    { label: "Pts Amarelo (neg.)", key: "yellowCardPoints" },
                    { label: "Pts Vermelho (neg.)", key: "redCardPoints" },
                  ].map(({ label, key }) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs">{label}</Label>
                      <Input
                        type="number"
                        value={(editForm as any)[key]}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, [key]: Number(e.target.value) }))
                        }
                        className="bg-zinc-950 border-zinc-800 h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-zinc-800 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setEditingChamp(null)} className="text-zinc-400">
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} className="bg-emerald-600 hover:bg-emerald-700 font-bold">
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
