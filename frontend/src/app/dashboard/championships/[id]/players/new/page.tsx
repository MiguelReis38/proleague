"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";

export default function NewPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "CAT_A",
    birthDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/championships/${id}/players`, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push(`/dashboard/championships/${id}`);
      } else {
        const error = await res.json();
        alert(error.message || "Erro ao adicionar jogador");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/championships/${id}`}>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Adicionar Jogador</h2>
          <p className="text-zinc-400">Cadastre um novo atleta no campeonato.</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Dados do Jogador</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input 
                required 
                className="bg-zinc-950 border-zinc-800"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <select 
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="CAT_A">Categoria A</option>
                <option value="CAT_B">Categoria B</option>
                <option value="CAT_C">Categoria C</option>
                <option value="GOALKEEPER">Goleiro</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Data de Nascimento</Label>
              <Input 
                type="date"
                required 
                className="bg-zinc-950 border-zinc-800"
                value={formData.birthDate}
                onChange={e => setFormData({...formData, birthDate: e.target.value})}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
              {loading ? "Salvando..." : "Salvar Jogador"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
