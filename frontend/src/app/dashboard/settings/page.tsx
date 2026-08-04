"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("As novas senhas não conferem.");
      return;
    }
    
    setLoading(true);
    // Como é um MVP, a API de troca de senha ainda não foi exposta, mas a UI já fica preparada.
    setTimeout(() => {
      alert("Recurso de troca de senha em desenvolvimento para a próxima versão!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className="text-emerald-500 w-6 h-6" />
            Configurações
          </h2>
          <p className="text-zinc-400">Gerencie as preferências da sua conta.</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>
            Atualize a sua senha de acesso ao painel ProLeague.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-200">Senha Atual</Label>
              <Input 
                type="password"
                required 
                className="bg-zinc-950 border-zinc-700 text-white focus-visible:ring-emerald-500"
                value={formData.currentPassword}
                onChange={e => setFormData({...formData, currentPassword: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-200">Nova Senha</Label>
              <Input 
                type="password"
                required 
                className="bg-zinc-950 border-zinc-700 text-white focus-visible:ring-emerald-500"
                value={formData.newPassword}
                onChange={e => setFormData({...formData, newPassword: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-200">Confirmar Nova Senha</Label>
              <Input 
                type="password"
                required 
                className="bg-zinc-950 border-zinc-700 text-white focus-visible:ring-emerald-500"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white mt-4">
              {loading ? "Salvando..." : "Atualizar Senha"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-red-950/20 border-red-900/50">
        <CardHeader>
          <CardTitle className="text-red-400">Zona de Perigo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400 text-sm mb-4">
            Ao excluir sua conta, todos os seus campeonatos, jogadores e rodadas serão deletados permanentemente. Esta ação não pode ser desfeita.
          </p>
          <Button variant="destructive" className="bg-red-900 hover:bg-red-800 text-red-100 border border-red-700">
            Excluir Minha Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
