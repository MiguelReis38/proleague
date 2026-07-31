"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, UserCheck } from "lucide-react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";

export default function DraftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafting, setDrafting] = useState(false);

  useEffect(() => {
    async function loadPlayers() {
      try {
        const res = await fetchWithAuth(`/championships/${id}/players`);
        if (res.ok) {
          const data = await res.json();
          setPlayers(data);
          // By default, select everyone
          setSelectedIds(data.map((p: any) => p.id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPlayers();
  }, [id]);

  const togglePlayer = (playerId: string) => {
    if (selectedIds.includes(playerId)) {
      setSelectedIds(selectedIds.filter(id => id !== playerId));
    } else {
      setSelectedIds([...selectedIds, playerId]);
    }
  };

  const handleDraft = async () => {
    if (selectedIds.length < 10) {
      alert("Selecione pelo menos 10 jogadores para formar times");
      return;
    }

    setDrafting(true);
    try {
      const res = await fetchWithAuth(`/championships/${id}/rounds`, {
        method: "POST",
        body: JSON.stringify({ playerIds: selectedIds }),
      });

      if (res.ok) {
        const round = await res.json();
        router.push(`/dashboard/rounds/${round.id}`);
      } else {
        const error = await res.json();
        alert(error.message || "Erro ao sortear times");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão");
    } finally {
      setDrafting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/championships/${id}`}>
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sorteio de Times</h2>
            <p className="text-zinc-400">Selecione quem compareceu hoje para o sorteio.</p>
          </div>
        </div>
        <Button 
          onClick={handleDraft} 
          disabled={drafting || loading} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Play className="w-4 h-4 mr-2" />
          {drafting ? "Sorteando..." : "Realizar Sorteio"}
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Presença</span>
            <span className="text-sm font-normal text-zinc-400">
              {selectedIds.length} / {players.length} selecionados
            </span>
          </CardTitle>
          <CardDescription>
            Desmarque os jogadores que faltaram. O algoritmo balanceará as categorias automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-zinc-400">Carregando jogadores...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {players.map(player => {
                const isSelected = selectedIds.includes(player.id);
                return (
                  <div 
                    key={player.id} 
                    onClick={() => togglePlayer(player.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-emerald-500/50 bg-emerald-500/10' 
                        : 'border-zinc-800 bg-zinc-950 opacity-50 hover:opacity-100 hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-700'}`}>
                      {isSelected && <UserCheck className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-200">{player.name}</p>
                      <p className="text-xs text-zinc-500">{player.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
