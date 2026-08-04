"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Trophy } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import { Input } from "@/components/ui/input";

export default function PlayersGlobalPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchWithAuth(`/championships`);
        if (res.ok) {
          const championships = await res.json();
          // Extrair todos os jogadores de todos os campeonatos
          const allPlayers = championships.flatMap((champ: any) => 
            (champ.players || []).map((p: any) => ({
              ...p,
              championshipName: champ.name
            }))
          );
          setPlayers(allPlayers);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredPlayers = players.filter(p => 
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
                    <th className="px-4 py-3 rounded-tr-lg">Nº de Camisa</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player) => (
                    <tr key={player.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{player.name}</td>
                      <td className="px-4 py-3">
                        <span className="bg-zinc-800 px-2 py-1 rounded text-xs text-zinc-300">
                          {player.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <Trophy className="w-3 h-3 text-emerald-500" />
                        {player.championshipName}
                      </td>
                      <td className="px-4 py-3 text-zinc-500">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
