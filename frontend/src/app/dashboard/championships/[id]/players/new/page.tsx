"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";

export default function NewPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "CAT_A",
    birthDate: "",
    photoUrl: "",
    number: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append("file", file);
      
      const res = await fetchWithAuth("/upload", {
        method: "POST",
        body: data, // fetchWithAuth remove o Content-Type para FormData automaticamente
      });

      if (res.ok) {
        const result = await res.json();
        setFormData({ ...formData, photoUrl: result.url });
      } else {
        alert("Falha no upload da imagem");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar a imagem");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = {
        name: formData.name,
        category: formData.category,
        birthDate: formData.birthDate,
      };
      
      if (formData.photoUrl) payload.photoUrl = formData.photoUrl;
      if (formData.number) payload.number = parseInt(formData.number);

      const res = await fetchWithAuth(`/championships/${id}/players`, {
        method: "POST",
        body: JSON.stringify(payload),
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
            
            <div className="flex flex-col items-center justify-center gap-4 mb-6">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-zinc-700 bg-zinc-950 flex items-center justify-center overflow-hidden relative group">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Foto do jogador" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-zinc-500 flex flex-col items-center">
                    {uploadingImage ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8 mb-2" />}
                    <span className="text-xs">Sem foto</span>
                  </div>
                )}
                
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                
                {!uploadingImage && !formData.photoUrl && (
                  <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center pointer-events-none">
                    <span className="text-xs text-white">Upload</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-zinc-500">Clique para enviar a foto (opcional)</p>
            </div>

            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input 
                required 
                className="bg-zinc-950 border-zinc-800"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nº da Camisa (Opcional)</Label>
                <Input 
                  type="number"
                  min="1"
                  max="99"
                  className="bg-zinc-950 border-zinc-800"
                  value={formData.number}
                  onChange={e => setFormData({...formData, number: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <select 
                  className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="CAT_A">Categoria A</option>
                  <option value="CAT_B">Categoria B</option>
                  <option value="CAT_C">Categoria C</option>
                  <option value="GOALKEEPER">Goleiro</option>
                </select>
              </div>
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

            <Button type="submit" disabled={loading || uploadingImage} className="w-full bg-emerald-600 hover:bg-emerald-700">
              {loading ? "Salvando..." : "Salvar Jogador"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
