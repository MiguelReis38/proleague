"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Plus } from "lucide-react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";

export default function ChampionshipsPage() {
  const [championships, setChampionships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChampionships() {
      try {
        const res = await fetchWithAuth("/championships");
        if (res.ok) {
          const data = await res.json();
          setChampionships(data);
        }
      } catch (err) {
        console.error("Failed to load championships", err);
      } finally {
        setLoading(false);
      }
    }
    loadChampionships();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Meus Campeonatos</h2>
          <p className="text-zinc-400">Gerencie todos os seus torneios ativos e finalizados.</p>
        </div>
        <Link href="/dashboard/championships/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Criar Campeonato
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-zinc-400">Carregando campeonatos...</div>
      ) : championships.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Trophy className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-200">Nenhum campeonato encontrado</h3>
          <p className="text-zinc-500 mb-6">Você ainda não criou nenhum campeonato.</p>
          <Link href="/dashboard/championships/new">
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              Criar o primeiro
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {championships.map((champ) => (
            <Card key={champ.id} className="bg-zinc-900 border-zinc-800 hover:border-emerald-500/50 transition-colors cursor-pointer group">
              <Link href={`/dashboard/championships/${champ.id}`}>
                <CardHeader>
                  <CardTitle className="group-hover:text-emerald-400 transition-colors">{champ.name}</CardTitle>
                  <CardDescription className="text-zinc-500">
                    Status: <span className={champ.status === 'ACTIVE' ? 'text-emerald-500' : 'text-zinc-400'}>{champ.status}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span>{champ.playersPerTeam} jogadores / time</span>
                    <span>{new Date(champ.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
