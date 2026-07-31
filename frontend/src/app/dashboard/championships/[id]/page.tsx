"use client";

import { useEffect, useState, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Play, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";

export default function ChampionshipDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [championship, setChampionship] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchWithAuth(`/championships/${id}`);
        if (res.ok) {
          const data = await res.json();
          setChampionship(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleDownloadPDF = async () => {
    try {
      const res = await fetchWithAuth(`/reports/championship/${id}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-${championship?.name || 'campeonato'}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Erro ao baixar relatório PDF");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar PDF");
    }
  };

  if (loading) return <div className="text-zinc-400">Carregando...</div>;
  if (!championship) return <div className="text-red-400">Campeonato não encontrado.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/championships">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Trophy className="text-emerald-500 w-6 h-6" />
                {championship.name}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {championship.players.length} Inscritos</span>
                <span className="flex items-center gap-1"><Play className="w-4 h-4" /> {championship.rounds.length} Rodadas</span>
              </div>
            </div>
            <Button onClick={handleDownloadPDF} variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
              <FileText className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/dashboard/championships/${id}/players/new`}>
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              <Users className="w-4 h-4 mr-2" />
              Add Jogador
            </Button>
          </Link>
          <Link href={`/dashboard/championships/${id}/draft`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Play className="w-4 h-4 mr-2" />
              Sortear Times
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">Jogadores</CardTitle>
          </CardHeader>
          <CardContent>
            {championship.players.length === 0 ? (
              <p className="text-zinc-500 text-sm">Nenhum jogador cadastrado.</p>
            ) : (
              <div className="space-y-2">
                {championship.players.map((p: any) => (
                  <div key={p.id} className="flex justify-between p-2 rounded bg-zinc-950 border border-zinc-800">
                    <span>{p.name}</span>
                    <span className="text-zinc-500 text-sm">{p.category}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">Rodadas</CardTitle>
          </CardHeader>
          <CardContent>
            {championship.rounds.length === 0 ? (
              <p className="text-zinc-500 text-sm">Nenhuma rodada iniciada.</p>
            ) : (
              <div className="space-y-2">
                {championship.rounds.map((r: any) => (
                  <div key={r.id} className="flex justify-between p-3 rounded bg-zinc-950 border border-zinc-800">
                    <span className="font-medium text-emerald-400">Rodada {r.number}</span>
                    <Link href={`/dashboard/rounds/${r.id}`} className="text-sm text-zinc-400 hover:text-white">
                      Ver partidas &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
