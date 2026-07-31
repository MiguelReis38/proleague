"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { fetchWithAuth, API_URL } from "@/lib/api";

export default function NewChampionshipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    playersPerTeam: 7,
    winPoints: 3,
    drawPoints: 1,
    participationPoints: 1,
    goalPoints: 0,
    yellowCardPoints: -1,
    redCardPoints: -3,
    logoUrl: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalLogoUrl = formData.logoUrl;
      
      // Upload do arquivo primeiro
      if (logoFile) {
        const uploadData = new FormData();
        uploadData.append('file', logoFile);
        
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: uploadData,
        });
        
        if (uploadRes.ok) {
          const uploaded = await uploadRes.json();
          finalLogoUrl = `${API_URL}${uploaded.url}`;
        }
      }

      const res = await fetchWithAuth("/championships", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          playersPerTeam: Number(formData.playersPerTeam),
          winPoints: Number(formData.winPoints),
          drawPoints: Number(formData.drawPoints),
          participationPoints: Number(formData.participationPoints),
          goalPoints: Number(formData.goalPoints),
          yellowCardPoints: Number(formData.yellowCardPoints),
          redCardPoints: Number(formData.redCardPoints),
          logoUrl: finalLogoUrl,
        }),
      });

      if (res.ok) {
        router.push("/dashboard/championships");
      } else {
        const error = await res.json();
        alert(error.message || "Erro ao criar campeonato");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/championships">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Novo Campeonato</h2>
          <p className="text-zinc-400">Configure as regras do seu novo torneio.</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-500" />
            Configurações Básicas
          </CardTitle>
          <CardDescription>
            Defina o nome e os parâmetros de pontuação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-200">Nome do Campeonato</Label>
              <Input 
                required 
                placeholder="Ex: Superliga 2026"
                className="bg-zinc-950 border-zinc-700 text-white focus-visible:ring-emerald-500"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-zinc-200">Logotipo (Opcional)</Label>
              <Input 
                type="file"
                accept="image/*"
                className="bg-zinc-950 border-zinc-700 text-zinc-400 file:bg-emerald-500 file:text-zinc-950 file:border-0 file:rounded-md file:mr-4 file:px-4 file:py-1 hover:file:bg-emerald-400 cursor-pointer"
                onChange={e => setLogoFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-zinc-200">Jogadores de linha (s/ goleiro)</Label>
                <Input 
                  type="number" 
                  required 
                  min="4"
                  max="11"
                  className="bg-zinc-950 border-zinc-700 text-white focus-visible:ring-emerald-500"
                  value={formData.playersPerTeam}
                  onChange={e => setFormData({...formData, playersPerTeam: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-200">Pontos por Vitória</Label>
                <Input 
                  type="number" 
                  required 
                  className="bg-zinc-950 border-zinc-700 text-white focus-visible:ring-emerald-500"
                  value={formData.winPoints}
                  onChange={e => setFormData({...formData, winPoints: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-200">Pontos por Empate</Label>
                <Input 
                  type="number" 
                  required 
                  className="bg-zinc-950 border-zinc-700 text-white focus-visible:ring-emerald-500"
                  value={formData.drawPoints}
                  onChange={e => setFormData({...formData, drawPoints: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <h3 className="text-lg font-medium text-white mb-4">Pontuação Extra e Penalidades</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-zinc-200">Pontos por Presença/Participação</Label>
                  <Input 
                    type="number" 
                    required 
                    className="bg-zinc-950 border-zinc-700 text-white focus-visible:ring-emerald-500"
                    value={formData.participationPoints}
                    onChange={e => setFormData({...formData, participationPoints: Number(e.target.value)})}
                  />
                  <p className="text-xs text-zinc-500">Ex: 1 ponto só por jogar a partida</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-200">Pontos por Gol Marcado</Label>
                  <Input 
                    type="number" 
                    required 
                    className="bg-zinc-950 border-zinc-700 text-white focus-visible:ring-emerald-500"
                    value={formData.goalPoints}
                    onChange={e => setFormData({...formData, goalPoints: Number(e.target.value)})}
                  />
                  <p className="text-xs text-zinc-500">Ex: 0 para não contar</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-200">Cartão Amarelo (Desconto)</Label>
                  <Input 
                    type="number" 
                    required 
                    className="bg-zinc-950 border-zinc-700 text-white focus-visible:ring-emerald-500"
                    value={formData.yellowCardPoints}
                    onChange={e => setFormData({...formData, yellowCardPoints: Number(e.target.value)})}
                  />
                  <p className="text-xs text-zinc-500">Ex: -1 (Use valor negativo)</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-200">Cartão Vermelho (Desconto)</Label>
                  <Input 
                    type="number" 
                    required 
                    className="bg-zinc-950 border-zinc-700 text-white focus-visible:ring-emerald-500"
                    value={formData.redCardPoints}
                    onChange={e => setFormData({...formData, redCardPoints: Number(e.target.value)})}
                  />
                  <p className="text-xs text-zinc-500">Ex: -3 (Use valor negativo)</p>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 mt-6 text-base font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              {loading ? "Criando..." : "Criar Campeonato"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
