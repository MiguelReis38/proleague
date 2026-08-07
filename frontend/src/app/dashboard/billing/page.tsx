"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Shield } from "lucide-react";

type Subscription = { planType: string; status: string; currentPeriodEnd?: string };

const PLANS = [
  {
    id: "FREE",
    name: "Free",
    price: "Grátis",
    period: "para sempre",
    icon: Shield,
    color: "zinc",
    features: ["1 campeonato ativo", "Até 30 jogadores", "Link público da classificação", "Sorteio automático"],
    missing: ["Exportar PDF", "QR Code", "Controle financeiro"],
  },
  {
    id: "PRO",
    name: "Pro",
    price: "R$ 19,90",
    period: "/mês",
    icon: Zap,
    color: "emerald",
    highlight: true,
    features: ["Campeonatos ilimitados", "Jogadores ilimitados", "Exportar PDF", "QR Code da classificação", "Controle financeiro", "Link público"],
    missing: ["Suporte prioritário"],
  },
  {
    id: "PREMIUM",
    name: "Premium",
    price: "R$ 149,90",
    period: "/ano",
    icon: Crown,
    color: "yellow",
    badge: "37% OFF",
    features: ["Tudo do Pro", "Suporte prioritário", "Acesso antecipado a novas funcionalidades", "Sem anúncios"],
    missing: [],
  },
];

export default function BillingPage() {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth("/payments/subscription")
      .then(r => r.ok ? r.json() : null)
      .then(d => { setSub(d); setLoading(false); });
  }, []);

  const handleSubscribe = async (planId: string) => {
    const res = await fetchWithAuth("/payments/subscribe", {
      method: "POST",
      body: JSON.stringify({ planId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.message ?? "Em breve disponível!");
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Escolha seu Plano</h1>
          <p className="text-zinc-400">Comece grátis e escale conforme seu campeonato cresce</p>
          {sub && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-zinc-800 border border-zinc-700 text-sm">
              <span className="text-zinc-400">Plano atual:</span>
              <span className="font-bold text-emerald-400">{sub.planType}</span>
              {sub.currentPeriodEnd && <span className="text-zinc-500">· até {new Date(sub.currentPeriodEnd).toLocaleDateString("pt-BR")}</span>}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(plan => {
            const Icon = plan.icon;
            const isCurrent = sub?.planType === plan.id;
            const isHighlight = (plan as any).highlight;
            return (
              <div key={plan.id} className={`relative rounded-2xl border p-6 flex flex-col transition-all ${isHighlight ? "border-emerald-500 bg-emerald-950/20 shadow-xl shadow-emerald-900/20" : "border-zinc-800 bg-zinc-900"}`}>
                {(plan as any).badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">{(plan as any).badge}</div>}
                {isHighlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full">Mais Popular</div>}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl ${plan.color === "emerald" ? "bg-emerald-500/20" : plan.color === "yellow" ? "bg-yellow-500/20" : "bg-zinc-700"}`}>
                    <Icon className={`w-5 h-5 ${plan.color === "emerald" ? "text-emerald-400" : plan.color === "yellow" ? "text-yellow-400" : "text-zinc-400"}`} />
                  </div>
                  <h2 className="text-lg font-bold">{plan.name}</h2>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-black">{plan.price}</span>
                  <span className="text-zinc-500 text-sm ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map(f => <li key={f} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>{f}</span></li>)}
                  {plan.missing.map(f => <li key={f} className="flex items-center gap-2 text-sm text-zinc-600"><span className="w-4 h-4 flex-shrink-0 text-center">—</span><span>{f}</span></li>)}
                </ul>
                {isCurrent
                  ? <Button disabled className="w-full bg-zinc-700 text-zinc-400">✓ Plano Atual</Button>
                  : plan.id === "FREE"
                    ? <Button disabled variant="outline" className="w-full border-zinc-700 text-zinc-500">Plano padrão</Button>
                    : <Button onClick={() => handleSubscribe(plan.id)} className={`w-full font-bold ${plan.color === "emerald" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-yellow-500 hover:bg-yellow-600 text-black"}`}>Assinar {plan.name}</Button>
                }
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center text-zinc-500 text-sm">
          <p>Pagamentos processados com segurança pelo <strong className="text-zinc-300">Mercado Pago</strong> · PIX, cartão e boleto</p>
          <p className="mt-1">Cancele a qualquer momento · Sem multas</p>
        </div>
      </div>
    </div>
  );
}
