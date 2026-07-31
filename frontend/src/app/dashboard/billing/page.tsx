"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap, Shield, Crown } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Mocked user id for now (usually comes from auth context)
      const res = await fetchWithAuth("/payments/checkout", {
        method: "POST",
        body: JSON.stringify({ planId: "pro_monthly", userId: "dummy_user" }),
      });
      
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao iniciar checkout: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Falha na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Upgrade para o ProLeague PRO</h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Desbloqueie estatísticas avançadas, elimine anúncios dos times e ganhe relatórios premium em PDF para todos os seus campeonatos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        {/* FREE PLAN */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-300">Plano Free</CardTitle>
            <CardDescription>O essencial para brincar com os amigos.</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold text-white">R$ 0</span>
              <span className="text-zinc-500">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-zinc-300">
              <Check className="w-5 h-5 text-zinc-500" />
              <span>Até 1 Campeonato simultâneo</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-300">
              <Check className="w-5 h-5 text-zinc-500" />
              <span>Sorteio automático (Draft)</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-300">
              <Check className="w-5 h-5 text-zinc-500" />
              <span>Tabela básica de classificação</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:text-white" disabled>
              Plano Atual
            </Button>
          </CardFooter>
        </Card>

        {/* PRO PLAN */}
        <Card className="bg-zinc-900 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-bl-lg">
            RECOMENDADO
          </div>
          <CardHeader>
            <CardTitle className="text-emerald-400 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Plano PRO
            </CardTitle>
            <CardDescription>Para organizadores sérios e ligas profissionais.</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold text-white">R$ 49,90</span>
              <span className="text-zinc-500">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-zinc-200">
              <Check className="w-5 h-5 text-emerald-500" />
              <span>Campeonatos ilimitados</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-200">
              <Check className="w-5 h-5 text-emerald-500" />
              <span>Geração de PDFs e Relatórios Oficiais</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-200">
              <Check className="w-5 h-5 text-emerald-500" />
              <span>Upload de Logotipos personalizados</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-200">
              <Check className="w-5 h-5 text-emerald-500" />
              <span>Estatísticas avançadas e suporte prioritário</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleCheckout} 
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            >
              {loading ? "Redirecionando..." : "Assinar PRO Agora"}
              {!loading && <Zap className="w-4 h-4 ml-2" />}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm pt-8">
        <Shield className="w-4 h-4" />
        <span>Pagamento 100% seguro processado via Stripe. Cancele a qualquer momento.</span>
      </div>
    </div>
  );
}
