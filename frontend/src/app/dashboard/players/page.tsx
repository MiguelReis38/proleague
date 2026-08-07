"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Trophy, Edit, X, Trash2 } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function PlayersGlobalPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Edit State
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const [playerForm, setPlayerForm] = useState({ name: "", category: "", number: "", photoUrl: "" });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(`/championships`);
      if (res.ok) {
        const championships = await res.json();
        const allPlayers = championships.flatMap((champ: any) =>
          (champ.players || []).map((p: any) => ({
            ...p,
            championshipName: champ.name,
            championshipId: champ.id,
          }))
        );
        setPlayers(allPlayers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEdit = (p: any) => {
    setEditingPlayer(p);
    setPlayerForm({
      name: p.name || "",
      category: p.category || "CAT_A",
      number: p.number || "",
      photoUrl: p.photoUrl || "",
    });
  };

  const handleSavePlayerEdit = async () => {
    if (!editingPlayer) return;
    setSaving(true);
    try {
      const res = await fetchWithAuth(
        `/championships/${editingPlayer.championshipId}/players/${editingPlayer.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: playerForm.name,
            category: playerForm.category,
            number: playerForm.number ? Number(playerForm.number) : null,
            photoUrl: playerForm.photoUrl || null,
          }),
        }
      );

      if (res.ok) {
        setEditingPlayer(null);
        await loadData();
      } else {
        alert("Erro ao salvar alterações do jogador.");
      }
    } catch {
      alert("Erro de conexão ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlayer = async (p: any) => {
    if (!confirm(`Tem certeza que deseja excluir o jogador "${p.name}"?`)) return;
    try {
      const res = await fetchWithAuth(`/championships/${p.championshipId}/players/${p.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await loadData();
      } else {
        alert("Erro ao excluir jogador.");
      }
    } catch {
      alert("Erro de conexão.");
    }
  };

  const filteredPlayers = players.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.championshipName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="text-emerald-500 w-6 h-6" />
            Todos os Jogadores
          </h2>
          <p className="text-zinc-400">Gerencie todos os atletas das suas competições.</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="border-b border-zinc-800 pb-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Buscar por nome, categoria ou campeonato..."
              className="pl-9 bg-zinc-950 border-zinc-700 text-white focus-visible:ring-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-zinc-400 text-center py-8">Carregando jogadores...</div>
          ) : filteredPlayers.length === 0 ? (
            <div className="text-zinc-500 text-center py-8">Nenhum jogador encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="text-xs uppercase bg-zinc-950/50 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Nome do Jogador</th>
                    <th className="px-4 py-3">Categoria/Nível</th>
                    <th className="px-4 py-3">Campeonato</th>
                    <th className="px-4 py-3">Nº de Camisa</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player) => (
                    <tr
                      key={player.id}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0 flex items-center justify-center">
                          {player.photoUrl ? (
                            <img
                              src={player.photoUrl}
                              alt={player.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="w-4 h-4 text-zinc-500" />
                          )}
                        </div>
                        {player.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-zinc-800 px-2 py-1 rounded text-xs text-zinc-300">
                          {player.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-3.5 h-3.5 text-emerald-500" />
                          {player.championshipName}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 font-mono">
                        {player.number ? `#${player.number}` : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleOpenEdit(player)}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                          >
                            <Edit className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Editar
                          </Button>
                          <Button
                            onClick={() => handleDeletePlayer(player)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-900"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL EDITAR JOGADOR */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setEditingPlayer(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Editar Jogador</h3>

            {/* Photo Preview & Edit */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0 flex items-center justify-center">
                {playerForm.photoUrl ? (
                  <img
                    src={playerForm.photoUrl}
                    alt="Foto"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Users className="w-8 h-8 text-zinc-500" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-zinc-300">URL da Foto</Label>
                <Input
                  placeholder="https://..."
                  value={playerForm.photoUrl}
                  onChange={(e) => setPlayerForm({ ...playerForm, photoUrl: e.target.value })}
                  className="bg-zinc-950 border-zinc-800 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Nome do Jogador</Label>
                <Input
                  value={playerForm.name}
                  onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Número da Camisa</Label>
                <Input
                  type="number"
                  placeholder="Ex: 10"
                  value={playerForm.number}
                  onChange={(e) => setPlayerForm({ ...playerForm, number: e.target.value })}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Categoria</Label>
                <select
                  className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
                  value={playerForm.category}
                  onChange={(e) => setPlayerForm({ ...playerForm, category: e.target.value })}
                >
                  <option value="CAT_A">Categoria A</option>
                  <option value="CAT_B">Categoria B</option>
                  <option value="CAT_C">Categoria C</option>
                  <option value="GOALKEEPER">Goleiro</option>
                </select>
              </div>

              <Button
                onClick={handleSavePlayerEdit}
                disabled={saving}
                className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold"
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
