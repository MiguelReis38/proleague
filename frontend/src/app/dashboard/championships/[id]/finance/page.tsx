"use client";

import { useEffect, useState, use } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Check,
  X,
  Trash2,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Printer,
  Share2,
  Copy,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

type Player = { id: string; name: string; photoUrl?: string; number?: number };
type Fee = { id: string; playerId: string; amount: number; dueDate: string; paidAt: string | null; note?: string };
type Expense = { id: string; description: string; amount: number; date: string; category: string };
type Summary = { totalCollected: number; totalPending: number; totalExpenses: number; balance: number; paidCount: number; totalPlayers: number };

const CATEGORY_LABELS: Record<string, string> = {
  FIELD: "🏟️ Quadra",
  EQUIPMENT: "⚽ Equipamentos",
  TROPHY: "🏆 Troféu",
  OTHER: "📦 Outros",
};

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function FinancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<{ summary: Summary; players: Player[]; fees: Fee[]; expenses: Expense[]; championshipName?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"fees" | "expenses">("fees");

  // Navegação por Mês
  const now = new Date();
  const currentMonthDefault = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthDefault);

  // Copied alert state
  const [copiedReminder, setCopiedReminder] = useState(false);

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
    if (res.ok) {
      const resData = await res.json();
      // Obter nome do campeonato
      const champRes = await fetchWithAuth(`/championships`);
      if (champRes.ok) {
        const champs = await champRes.json();
        const found = champs.find((c: any) => c.id === id);
        if (found) resData.championshipName = found.name;
      }
      setData(resData);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

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

  // Funções de Navegação Mensal
  const handlePrevMonth = () => {
    if (selectedMonth === "ALL") {
      setSelectedMonth(currentMonthDefault);
      return;
    }
    const [year, month] = selectedMonth.split("-").map(Number);
    const date = new Date(year, month - 2, 1);
    const prevStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(prevStr);
  };

  const handleNextMonth = () => {
    if (selectedMonth === "ALL") {
      setSelectedMonth(currentMonthDefault);
      return;
    }
    const [year, month] = selectedMonth.split("-").map(Number);
    const date = new Date(year, month, 1);
    const nextStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(nextStr);
  };

  // Formatar nome do mês selecionado
  const getSelectedMonthLabel = () => {
    if (selectedMonth === "ALL") return "Todos os Meses (Geral)";
    const [year, month] = selectedMonth.split("-").map(Number);
    return `${MONTH_NAMES[month - 1]} de ${year}`;
  };

  // Filtragem de mensalidades e despesas por mês
  const filteredFees = (data?.fees || []).filter((f) => {
    if (selectedMonth === "ALL") return true;
    return f.dueDate && f.dueDate.startsWith(selectedMonth);
  });

  const filteredExpenses = (data?.expenses || []).filter((e) => {
    if (selectedMonth === "ALL") return true;
    return e.date && e.date.startsWith(selectedMonth);
  });

  // Cálculo de resumos para o mês selecionado
  const monthCollected = filteredFees.filter((f) => f.paidAt).reduce((acc, f) => acc + f.amount, 0);
  const monthPending = filteredFees.filter((f) => !f.paidAt).reduce((acc, f) => acc + f.amount, 0);
  const monthExpensesTotal = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const monthBalance = monthCollected - monthExpensesTotal;
  const monthPaidCount = filteredFees.filter((f) => f.paidAt).length;

  // Exportar relatório mensal em PDF/Impressão
  const handleExportMonthReport = () => {
    const printWin = window.open("", "_blank");
    if (!printWin) return;

    const champName = data?.championshipName || "Campeonato ProLeague";
    const monthTitle = getSelectedMonthLabel();

    const feesRows = filteredFees
      .map((f) => {
        const player = data?.players.find((p) => p.id === f.playerId);
        const statusStr = f.paidAt ? "PAGO" : "PENDENTE";
        const statusColor = f.paidAt ? "green" : "red";
        return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${player?.name || "Jogador"}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(f.dueDate).toLocaleDateString("pt-BR")}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: ${statusColor};">${statusStr}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">R$ ${f.amount.toFixed(2)}</td>
        </tr>`;
      })
      .join("");

    const expenseRows = filteredExpenses
      .map((e) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${e.description}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${CATEGORY_LABELS[e.category]}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(e.date).toLocaleDateString("pt-BR")}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold; color: red;">R$ ${e.amount.toFixed(2)}</td>
        </tr>`)
      .join("");

    printWin.document.write(`
      <html>
        <head>
          <title>Balanço Financeiro - ${champName}</title>
          <style>
            body { font-family: sans-serif; padding: 30px; color: #111; line-height: 1.5; }
            h1 { margin-bottom: 5px; color: #047857; }
            .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: bold; }
            .grid { display: flex; gap: 15px; margin: 20px 0; }
            .card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; }
            .card h4 { margin: 0 0 5px; font-size: 12px; color: #64748b; text-transform: uppercase; }
            .card p { margin: 0; font-size: 18px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
            th { background: #f1f5f9; text-align: left; padding: 8px; border-bottom: 2px solid #cbd5e1; }
          </style>
        </head>
        <body>
          <h1>🏆 ${champName}</h1>
          <h3>Balanço Financeiro Mensal — <span class="badge">${monthTitle}</span></h3>
          <p style="font-size: 12px; color: #666;">Relatório gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>

          <div class="grid">
            <div class="card"><h4>Arrecadado</h4><p style="color: #047857;">R$ ${monthCollected.toFixed(2)}</p></div>
            <div class="card"><h4>Pendente</h4><p style="color: #d97706;">R$ ${monthPending.toFixed(2)}</p></div>
            <div class="card"><h4>Despesas</h4><p style="color: #dc2626;">R$ ${monthExpensesTotal.toFixed(2)}</p></div>
            <div class="card"><h4>Saldo Final</h4><p style="color: #0284c7;">R$ ${monthBalance.toFixed(2)}</p></div>
          </div>

          <h3>📋 Mensalidades do Mês</h3>
          <table>
            <thead>
              <tr><th>Atleta</th><th>Vencimento</th><th>Status</th><th style="text-align: right;">Valor</th></tr>
            </thead>
            <tbody>${feesRows || '<tr><td colspan="4" style="text-align: center; color: #888;">Nenhuma mensalidade neste mês</td></tr>'}</tbody>
          </table>

          <h3 style="margin-top: 30px;">💸 Despesas do Mês</h3>
          <table>
            <thead>
              <tr><th>Descrição</th><th>Categoria</th><th>Data</th><th style="text-align: right;">Valor</th></tr>
            </thead>
            <tbody>${expenseRows || '<tr><td colspan="4" style="text-align: center; color: #888;">Nenhuma despesa neste mês</td></tr>'}</tbody>
          </table>

          <script>setTimeout(() => { window.print(); }, 500);</script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  // Copiar lista de cobrança no WhatsApp
  const handleCopyWhatsAppReminder = () => {
    const unpaidList = filteredFees.filter((f) => !f.paidAt);
    const champName = data?.championshipName || "nosso Torneio";
    const monthTitle = getSelectedMonthLabel();

    let text = `📢 *LEMBRETE DE PAGAMENTO DA MENSALIDADE*\n🏆 *${champName}* — ${monthTitle}\n\n`;

    if (unpaidList.length === 0) {
      text += `✅ Parabéns a todos os atletas! Todas as mensalidades de ${monthTitle} estão 100% pagas! 🎉`;
    } else {
      text += `🔴 *Atletas com Mensalidade Pendente:*\n`;
      unpaidList.forEach((f) => {
        const player = data?.players.find((p) => p.id === f.playerId);
        text += `• *${player?.name || "Jogador"}*: R$ ${f.amount.toFixed(2)} (Venc: ${new Date(f.dueDate).toLocaleDateString("pt-BR")})\n`;
      });
      text += `\n🟢 *Atletas Pagos:* ${monthPaidCount}/${data?.players.length || 0}\n`;
      text += `\n💬 *Por favor, efetue o pagamento para a organização do torneio.* Obrigado!`;
    }

    navigator.clipboard.writeText(text);
    setCopiedReminder(true);
    setTimeout(() => setCopiedReminder(false), 3000);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/championships/${id}`}>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                💰 Controle Financeiro
              </h1>
              <p className="text-xs text-zinc-500">
                {data?.championshipName || "Campeonato"} · Gestão mensal de caixa
              </p>
            </div>
          </div>

          {/* Botões de Exportar & Cobrar WhatsApp */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={handleCopyWhatsAppReminder}
              size="sm"
              variant="outline"
              className="border-emerald-700/60 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900 text-xs font-bold"
            >
              {copiedReminder ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" /> Cobrar no WhatsApp
                </>
              )}
            </Button>

            <Button
              onClick={handleExportMonthReport}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold"
            >
              <Printer className="w-3.5 h-3.5 mr-1" /> Exportar Balanço (PDF/Print)
            </Button>
          </div>
        </div>

        {/* ─── SELETOR MENSAL NAVEGÁVEL ────────────────────────────────────────── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-bold text-zinc-300">
              Período de Gestão:
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={handlePrevMonth}
              size="sm"
              variant="outline"
              className="border-zinc-800 text-zinc-300 hover:bg-zinc-800 h-9"
              title="Mês Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Menu Dropdown de Seleção do Mês */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-emerald-400 font-bold text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer text-center flex-1 sm:flex-initial"
            >
              <option value={currentMonthDefault}>
                📅 {getSelectedMonthLabel()} (Mês Atual)
              </option>
              <option value="ALL">🌐 Todos os Meses (Geral)</option>

              {/* Lista de últimos 12 meses para rápida alternância */}
              {Array.from({ length: 12 }).map((_, i) => {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                if (val === currentMonthDefault) return null;
                return (
                  <option key={val} value={val}>
                    {MONTH_NAMES[d.getMonth()]} de {d.getFullYear()}
                  </option>
                );
              })}
            </select>

            <Button
              onClick={handleNextMonth}
              size="sm"
              variant="outline"
              className="border-zinc-800 text-zinc-300 hover:bg-zinc-800 h-9"
              title="Próximo Mês"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => setSelectedMonth(currentMonthDefault)}
              size="sm"
              variant="ghost"
              className="text-xs text-emerald-400 hover:bg-emerald-950/50 hidden md:inline-flex"
            >
              Hoje
            </Button>
          </div>
        </div>

        {/* Summary Cards do Mês Selecionado */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-bold">Arrecadado</span>
            </div>
            <p className="text-xl font-bold text-emerald-400">R$ {monthCollected.toFixed(2)}</p>
            <p className="text-xs text-zinc-500">
              {monthPaidCount} de {filteredFees.length} mensalidades
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-yellow-400 font-bold">Pendente</span>
            </div>
            <p className="text-xl font-bold text-yellow-400">R$ {monthPending.toFixed(2)}</p>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400 font-bold">Despesas</span>
            </div>
            <p className="text-xl font-bold text-red-400">R$ {monthExpensesTotal.toFixed(2)}</p>
          </div>

          <div
            className={`rounded-xl p-4 border ${
              monthBalance >= 0
                ? "bg-blue-500/10 border-blue-500/20"
                : "bg-red-900/20 border-red-800/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-400 font-bold">Saldo do Mês</span>
            </div>
            <p className={`text-xl font-bold ${monthBalance >= 0 ? "text-blue-400" : "text-red-400"}`}>
              R$ {monthBalance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-zinc-800 pb-2">
          <button
            onClick={() => setActiveTab("fees")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "fees" ? "bg-emerald-600 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            Mensalidades ({filteredFees.length})
          </button>
          <button
            onClick={() => setActiveTab("expenses")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "expenses" ? "bg-red-600 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            Despesas ({filteredExpenses.length})
          </button>
        </div>

        {/* MENSALIDADES */}
        {activeTab === "fees" && (
          <div>
            <div className="flex gap-2 mb-4">
              <Button onClick={() => setShowFeeForm(true)} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold">
                <Plus className="w-3.5 h-3.5 mr-1" /> Mensalidade Individual
              </Button>
              <Button onClick={() => setShowBulkForm(true)} size="sm" variant="outline" className="border-zinc-700 text-xs font-bold">
                <Users className="w-3.5 h-3.5 mr-1" /> Para Todos os Atletas
              </Button>
            </div>

            {/* Fee Form */}
            {showFeeForm && (
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4 space-y-3">
                <h3 className="text-sm font-semibold">Nova mensalidade individual</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Jogador</Label>
                    <select
                      value={feeForm.playerId}
                      onChange={(e) => setFeeForm({ ...feeForm, playerId: e.target.value })}
                      className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      <option value="">Selecionar...</option>
                      {data?.players.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Valor (R$)</Label>
                    <Input
                      type="number"
                      value={feeForm.amount}
                      onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })}
                      className="mt-1 bg-zinc-800 border-zinc-700 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Vencimento</Label>
                    <Input
                      type="date"
                      value={feeForm.dueDate}
                      onChange={(e) => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                      className="mt-1 bg-zinc-800 border-zinc-700 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Observação</Label>
                    <Input
                      value={feeForm.note}
                      onChange={(e) => setFeeForm({ ...feeForm, note: e.target.value })}
                      className="mt-1 bg-zinc-800 border-zinc-700 text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createFee} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                    Salvar
                  </Button>
                  <Button onClick={() => setShowFeeForm(false)} size="sm" variant="ghost" className="text-xs text-zinc-400">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* Bulk Form */}
            {showBulkForm && (
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4 space-y-3">
                <h3 className="text-sm font-semibold">Mensalidade para todos os jogadores</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Valor (R$)</Label>
                    <Input
                      type="number"
                      value={bulkForm.amount}
                      onChange={(e) => setBulkForm({ ...bulkForm, amount: e.target.value })}
                      className="mt-1 bg-zinc-800 border-zinc-700 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Vencimento</Label>
                    <Input
                      type="date"
                      value={bulkForm.dueDate}
                      onChange={(e) => setBulkForm({ ...bulkForm, dueDate: e.target.value })}
                      className="mt-1 bg-zinc-800 border-zinc-700 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Observação</Label>
                    <Input
                      value={bulkForm.note}
                      onChange={(e) => setBulkForm({ ...bulkForm, note: e.target.value })}
                      className="mt-1 bg-zinc-800 border-zinc-700 text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createBulk} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                    Criar para todos
                  </Button>
                  <Button onClick={() => setShowBulkForm(false)} size="sm" variant="ghost" className="text-xs text-zinc-400">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* Fee list */}
            <div className="space-y-2">
              {filteredFees.length === 0 && (
                <p className="text-zinc-500 text-sm text-center py-8">
                  Nenhuma mensalidade registrada para {getSelectedMonthLabel()}.
                </p>
              )}
              {filteredFees.map((fee) => {
                const player = data?.players.find((p) => p.id === fee.playerId);
                return (
                  <div
                    key={fee.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      fee.paidAt ? "bg-emerald-950/30 border-emerald-800/30" : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {player?.photoUrl ? (
                        <img src={player.photoUrl} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">
                          {player?.name[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{player?.name ?? "Jogador"}</p>
                        <p className="text-xs text-zinc-500">
                          Venc: {new Date(fee.dueDate).toLocaleDateString("pt-BR")} {fee.note && `· ${fee.note}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${fee.paidAt ? "text-emerald-400" : "text-yellow-400"}`}>
                        R$ {fee.amount.toFixed(2)}
                      </span>
                      {fee.paidAt ? (
                        <>
                          <span className="text-xs text-emerald-500 font-bold">✓ Pago</span>
                          <Button
                            onClick={() => markUnpaid(fee.id)}
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-zinc-500 hover:text-yellow-400"
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => markPaid(fee.id)}
                          size="sm"
                          className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 font-bold"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Marcar Pago
                        </Button>
                      )}
                      <Button
                        onClick={() => deleteFee(fee.id)}
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-zinc-600 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
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
              <Button onClick={() => setShowExpenseForm(true)} size="sm" className="bg-red-600 hover:bg-red-700 text-xs font-bold">
                <Plus className="w-3.5 h-3.5 mr-1" /> Nova Despesa
              </Button>
            </div>

            {showExpenseForm && (
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4 space-y-3">
                <h3 className="text-sm font-semibold">Adicionar despesa</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label className="text-xs">Descrição</Label>
                    <Input
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                      placeholder="Ex: Aluguel da quadra"
                      className="mt-1 bg-zinc-800 border-zinc-700 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Valor (R$)</Label>
                    <Input
                      type="number"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      className="mt-1 bg-zinc-800 border-zinc-700 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Data</Label>
                    <Input
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      className="mt-1 bg-zinc-800 border-zinc-700 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Categoria</Label>
                    <select
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                      className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createExpense} size="sm" className="bg-red-600 hover:bg-red-700 text-xs">
                    Salvar
                  </Button>
                  <Button onClick={() => setShowExpenseForm(false)} size="sm" variant="ghost" className="text-xs text-zinc-400">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {filteredExpenses.length === 0 && (
                <p className="text-zinc-500 text-sm text-center py-8">
                  Nenhuma despesa registrada para {getSelectedMonthLabel()}.
                </p>
              )}
              {filteredExpenses.map((exp) => (
                <div key={exp.id} className="flex items-center justify-between p-3 rounded-xl border bg-zinc-900 border-zinc-800">
                  <div>
                    <p className="text-sm font-medium">{exp.description}</p>
                    <p className="text-xs text-zinc-500">
                      {CATEGORY_LABELS[exp.category]} · {new Date(exp.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-red-400">R$ {exp.amount.toFixed(2)}</span>
                    <Button onClick={() => deleteExpense(exp.id)} size="sm" variant="ghost" className="h-7 w-7 p-0 text-zinc-600 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
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
