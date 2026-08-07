"use client";

import { useEffect, useState, use } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Wallet, Plus, Check, X, Trash2, Users } from "lucide-react";
import Link from "next/link";

type Player = { id: string; name: string; photoUrl?: string; number?: number };
type Fee = { id: string; playerId: string; amount: number; dueDate: string; paidAt: string | null; note?: string };
type Expense = { id: string; description: string; amount: number; date: string; category: string };
type Summary = { totalCollected: number; totalPending: number; totalExpenses: number; balance: number; paidCount: number; totalPlayers: number };

const CATEGORY_LABELS: Record<string, string> = {
  FIELD: "🏟️ Quadra", EQUIPMENT: "⚽ Equipamentos", TROPHY: "🏆 Troféu", OTHER: "📦 Outros",
};

export default function FinancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<{ summary: Summary; players: Player[]; fees: Fee[]; expenses: Expense[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"fees" | "expenses">("fees");

  // Fee form
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [feeForm, setFeeForm] = useState({ playerId: "", amount: "", dueDate: "", note: "" });
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkForm, setBulkForm] = useState({ amount: "", dueDate: "", note: "" });

  // Expense form
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ description: "", amount: "", date: "", category: "OTHER" });

  const load = async () => {
    setLoading(true);
    const res = await fetchWithAuth(`/championships/${id}/finance`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const markPaid = async (feeId: string) => {
    await fetchWithAuth(`/championships/${id}/finance/fees/${feeId}/pay`, { method: "PUT" });
    load();
  };

  const markUnpaid = async (feeId: string) => {
    await fetchWithAuth(`/championships/${id}/finance/fees/${feeId}/unpay`, { method: "PUT" });
    load();
  };

  const deleteFee = async (feeId: string) => {
    if (!confirm("Excluir esta mensalidade?")) return;
    await fetchWithAuth(`/championships/${id}/finance/fees/${feeId}`, { method: "DELETE" });
    load();
  };

  const deleteExpense = async (expId: string) => {
    if (!confirm("Excluir esta despesa?")) return;
    await fetchWithAuth(`/championships/${id}/finance/expenses/${expId}`, { method: "DELETE" });
    load();
  };

  const createFee = async () => {
    await fetchWithAuth(`/championships/${id}/finance/fees`, {
      method: "POST",
      body: JSON.stringify({ playerId: feeForm.playerId, amount: parseFloat(feeForm.amount), dueDate: feeForm.dueDate, note: feeForm.note }),
    });
    setShowFeeForm(false);
    setFeeForm({ playerId: "", amount: "", dueDate: "", note: "" });
    load();
  };

  const createBulk = async () => {
    await fetchWithAuth(`/championships/${id}/finance/fees/bulk`, {
      method: "POST",
      body: JSON.stringify({ amount: parseFloat(bulkForm.amount), dueDate: bulkForm.dueDate, note: bulkForm.note }),
    });
    setShowBulkForm(false);
    setBulkForm({ amount: "", dueDate: "", note: "" });
    load();
  };

  const createExpense = async () => {
    await fetchWithAuth(`/championships/${id}/finance/expenses`, {
      method: "POST",
      body: JSON.stringify({ description: expenseForm.description, amount: parseFloat(expenseForm.amount), date: expenseForm.date, category: expenseForm.category }),
    });
    setShowExpenseForm(false);
    setExpenseForm({ description: "", amount: "", date: "", category: "OTHER" });
    load();
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" /></div>;

  const s = data?.summary;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/dashboard/championships/${id}`}>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">💰 Controle Financeiro</h1>
            <p className="text-xs text-zinc-500">Mensalidades e despesas do campeonato</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-emerald-400" /><span className="text-xs text-emerald-400">Arrecadado</span></div>
            <p className="text-xl font-bold text-emerald-400">R$ {(s?.totalCollected ?? 0).toFixed(2)}</p>
            <p className="text-xs text-zinc-500">{s?.paidCount}/{s?.totalPlayers} jogadores</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-yellow-400" /><span className="text-xs text-yellow-400">Pendente</span></div>
            <p className="text-xl font-bold text-yellow-400">R$ {(s?.totalPending ?? 0).toFixed(2)}</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1"><TrendingDown className="w-4 h-4 text-red-400" /><span className="text-xs text-red-400">Despesas</span></div>
            <p className="text-xl font-bold text-red-400">R$ {(s?.totalExpenses ?? 0).toFixed(2)}</p>
          </div>
          <div className={`rounded-xl p-4 border ${(s?.balance ?? 0) >= 0 ? "bg-blue-500/10 border-blue-500/20" : "bg-red-900/20 border-red-800/30"}`}>
            <div className="flex items-center gap-2 mb-1"><Wallet className="w-4 h-4 text-blue-400" /><span className="text-xs text-blue-400">Saldo</span></div>
            <p className={`text-xl font-bold ${(s?.balance ?? 0) >= 0 ? "text-blue-400" : "text-red-400"}`}>R$ {(s?.balance ?? 0).toFixed(2)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setActiveTab("fees")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "fees" ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>
            Mensalidades
          </button>
          <button onClick={() => setActiveTab("expenses")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "expenses" ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>
            Despesas
          </button>
        </div>

        {/* MENSALIDADES */}
        {activeTab === "fees" && (
          <div>
            <div className="flex gap-2 mb-4">
              <Button onClick={() => setShowFeeForm(true)} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" /> Individual
              </Button>
              <Button onClick={() => setShowBulkForm(true)} size="sm" variant="outline" className="border-zinc-700 text-xs">
                <Users className="w-3.5 h-3.5 mr-1" /> Para todos
              </Button>
            </div>

            {/* Fee Form */}
            {showFeeForm && (
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4 space-y-3">
                <h3 className="text-sm font-semibold">Nova mensalidade individual</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Jogador</Label>
                    <select value={feeForm.playerId} onChange={e => setFeeForm({ ...feeForm, playerId: e.target.value })} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white">
                      <option value="">Selecionar...</option>
                      {data?.players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div><Label className="text-xs">Valor (R$)</Label><Input type="number" value={feeForm.amount} onChange={e => setFeeForm({ ...feeForm, amount: e.target.value })} className="mt-1 bg-zinc-800 border-zinc-700 text-sm" /></div>
                  <div><Label className="text-xs">Vencimento</Label><Input type="date" value={feeForm.dueDate} onChange={e => setFeeForm({ ...feeForm, dueDate: e.target.value })} className="mt-1 bg-zinc-800 border-zinc-700 text-sm" /></div>
                  <div><Label className="text-xs">Observação</Label><Input value={feeForm.note} onChange={e => setFeeForm({ ...feeForm, note: e.target.value })} className="mt-1 bg-zinc-800 border-zinc-700 text-sm" /></div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createFee} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs">Salvar</Button>
                  <Button onClick={() => setShowFeeForm(false)} size="sm" variant="ghost" className="text-xs text-zinc-400">Cancelar</Button>
                </div>
              </div>
            )}

            {/* Bulk Form */}
            {showBulkForm && (
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4 space-y-3">
                <h3 className="text-sm font-semibold">Mensalidade para todos os jogadores</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label className="text-xs">Valor (R$)</Label><Input type="number" value={bulkForm.amount} onChange={e => setBulkForm({ ...bulkForm, amount: e.target.value })} className="mt-1 bg-zinc-800 border-zinc-700 text-sm" /></div>
                  <div><Label className="text-xs">Vencimento</Label><Input type="date" value={bulkForm.dueDate} onChange={e => setBulkForm({ ...bulkForm, dueDate: e.target.value })} className="mt-1 bg-zinc-800 border-zinc-700 text-sm" /></div>
                  <div><Label className="text-xs">Observação</Label><Input value={bulkForm.note} onChange={e => setBulkForm({ ...bulkForm, note: e.target.value })} className="mt-1 bg-zinc-800 border-zinc-700 text-sm" /></div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createBulk} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs">Criar para todos</Button>
                  <Button onClick={() => setShowBulkForm(false)} size="sm" variant="ghost" className="text-xs text-zinc-400">Cancelar</Button>
                </div>
              </div>
            )}

            {/* Fee list grouped by player */}
            <div className="space-y-2">
              {data?.fees.length === 0 && <p className="text-zinc-500 text-sm text-center py-8">Nenhuma mensalidade cadastrada ainda.</p>}
              {data?.fees.map(fee => {
                const player = data.players.find(p => p.id === fee.playerId);
                return (
                  <div key={fee.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${fee.paidAt ? "bg-emerald-950/30 border-emerald-800/30" : "bg-zinc-900 border-zinc-800"}`}>
                    <div className="flex items-center gap-3">
                      {player?.photoUrl ? <img src={player.photoUrl} className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">{player?.name[0]}</div>}
                      <div>
                        <p className="text-sm font-medium">{player?.name ?? "Jogador"}</p>
                        <p className="text-xs text-zinc-500">Venc: {new Date(fee.dueDate).toLocaleDateString("pt-BR")} {fee.note && `· ${fee.note}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${fee.paidAt ? "text-emerald-400" : "text-yellow-400"}`}>R$ {fee.amount.toFixed(2)}</span>
                      {fee.paidAt
                        ? <><span className="text-xs text-emerald-500">✓ Pago</span><Button onClick={() => markUnpaid(fee.id)} size="sm" variant="ghost" className="h-7 w-7 p-0 text-zinc-500 hover:text-yellow-400"><X className="w-3.5 h-3.5" /></Button></>
                        : <Button onClick={() => markPaid(fee.id)} size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"><Check className="w-3 h-3 mr-1" />Pago</Button>
                      }
                      <Button onClick={() => deleteFee(fee.id)} size="sm" variant="ghost" className="h-7 w-7 p-0 text-zinc-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DESPESAS */}
        {activeTab === "expenses" && (
          <div>
            <div className="flex gap-2 mb-4">
              <Button onClick={() => setShowExpenseForm(true)} size="sm" className="bg-red-600 hover:bg-red-700 text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" /> Nova Despesa
              </Button>
            </div>

            {showExpenseForm && (
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4 space-y-3">
                <h3 className="text-sm font-semibold">Adicionar despesa</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2"><Label className="text-xs">Descrição</Label><Input value={expenseForm.description} onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })} placeholder="Ex: Aluguel da quadra" className="mt-1 bg-zinc-800 border-zinc-700 text-sm" /></div>
                  <div><Label className="text-xs">Valor (R$)</Label><Input type="number" value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })} className="mt-1 bg-zinc-800 border-zinc-700 text-sm" /></div>
                  <div><Label className="text-xs">Data</Label><Input type="date" value={expenseForm.date} onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })} className="mt-1 bg-zinc-800 border-zinc-700 text-sm" /></div>
                  <div className="col-span-2">
                    <Label className="text-xs">Categoria</Label>
                    <select value={expenseForm.category} onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white">
                      {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createExpense} size="sm" className="bg-red-600 hover:bg-red-700 text-xs">Salvar</Button>
                  <Button onClick={() => setShowExpenseForm(false)} size="sm" variant="ghost" className="text-xs text-zinc-400">Cancelar</Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {data?.expenses.length === 0 && <p className="text-zinc-500 text-sm text-center py-8">Nenhuma despesa cadastrada ainda.</p>}
              {data?.expenses.map(exp => (
                <div key={exp.id} className="flex items-center justify-between p-3 rounded-xl border bg-zinc-900 border-zinc-800">
                  <div>
                    <p className="text-sm font-medium">{exp.description}</p>
                    <p className="text-xs text-zinc-500">{CATEGORY_LABELS[exp.category]} · {new Date(exp.date).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-red-400">R$ {exp.amount.toFixed(2)}</span>
                    <Button onClick={() => deleteExpense(exp.id)} size="sm" variant="ghost" className="h-7 w-7 p-0 text-zinc-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
