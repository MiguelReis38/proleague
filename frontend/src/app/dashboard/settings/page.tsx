"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, KeyRound, CheckCircle2, ShieldAlert } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMsg({ type: "error", text: "As novas senhas não conferem." });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMsg({ type: "error", text: "A nova senha deve ter no mínimo 6 caracteres." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetchWithAuth("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: data.message || "Senha alterada com sucesso!" });
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMsg({ type: "error", text: data.message || "Senha atual incorreta." });
      }
    } catch {
      setMsg({ type: "error", text: "Erro de conexão ao alterar a senha." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className="text-emerald-500 w-6 h-6" />
            Configurações da Conta
          </h2>
          <p className="text-zinc-400">Gerencie a segurança e preferências do seu perfil de organizador.</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <KeyRound className="w-5 h-5 text-emerald-400" /> Alterar Senha
          </CardTitle>
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
                placeholder="••••••••"
                className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-emerald-500"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-200">Nova Senha (mín. 6 caracteres)</Label>
              <Input
                type="password"
                required
                placeholder="••••••••"
                minLength={6}
                className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-emerald-500"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-200">Confirmar Nova Senha</Label>
              <Input
                type="password"
                required
                placeholder="••••••••"
                className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-emerald-500"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            {msg && (
              <div
                className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  msg.type === "success"
                    ? "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
                    : "bg-red-950/80 border border-red-800 text-red-300"
                }`}
              >
                {msg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{msg.text}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold text-white mt-4"
            >
              {loading ? "Salvando..." : "Atualizar Senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
