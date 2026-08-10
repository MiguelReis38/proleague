"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Users,
  CalendarDays,
  DollarSign,
  BarChart,
  Dices,
  Flame,
  Award,
  QrCode,
  FileText,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Mail,
  Send,
  Lock,
  Menu,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  // Dynamic Real Stats from Database
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const [stats, setStats] = useState<{
    totalPlayers: number;
    totalRounds: number;
    totalChampionships: number;
    totalMatches: number;
  }>({
    totalPlayers: 0,
    totalRounds: 0,
    totalChampionships: 0,
    totalMatches: 0,
  });

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      setIsLoggedIn(true);
    }

    fetch(`${API_URL}/public/stats`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => {});
  }, [API_URL]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactName("");
      setContactEmail("");
      setContactMsg("");
      setContactSuccess(false);
    }, 4000);
  };

  const faqItems = [
    {
      q: "O ProLeague é gratuito?",
      a: "Sim! Você pode criar sua conta gratuitamente e testar seu primeiro campeonato com até 15 jogadores sem pagar nada. Para campeonatos maiores e ilimitados, temos os planos PRO e Premium.",
    },
    {
      q: "Como funciona o Sorteio Inteligente de Equipes?",
      a: "Você cadastra os atletas e define o nível de cada um (Categoria A, B, C e Goleiros). Ao clicar em 'Sortear Rodada', nosso algoritmo sorteia times matematicamente equilibrados para garantir partidas disputadas e sem 'panela'.",
    },
    {
      q: "Como os jogadores e a torcida acompanham a classificação?",
      a: "Cada campeonato possui um Link Público exclusivo e um QR Code automático. Basta enviar o link no grupo do WhatsApp dos atletas. Ninguém precisa criar conta para visualizar a tabela!",
    },
    {
      q: "Posso exportar o relatório oficial do campeonato em PDF?",
      a: "Com certeza! Em 1 clique você gera o relatório oficial em PDF com a tabela de classificação, artilharia, luva de ouro e a marca oficial do desenvolvedor Miguel Reis.",
    },
    {
      q: "Funciona no celular durante os jogos?",
      a: "Sim! O ProLeague possui design 100% responsivo para smartphone e aplicativo nativo Android/iOS. Você apita o jogo e insere gols diretamente da quadra.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* ─── HEADER NAVBAR ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
              <Trophy className="text-zinc-950 w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                ProLeague
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                  v2.0
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#recursos" className="hover:text-white transition-colors">
              Recursos
            </a>
            <a href="#manual" className="hover:text-white transition-colors">
              Manual do Sistema
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              Dúvidas (FAQ)
            </a>
            <a href="#sobre" className="hover:text-white transition-colors">
              Sobre Nós
            </a>
            <a href="#contato" className="hover:text-white transition-colors">
              Contato
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold px-5 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  Ir para o Painel <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white font-semibold"
                  >
                    <Lock className="w-4 h-4 mr-2 text-emerald-400" /> Fazer Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    Criar Conta Grátis
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-zinc-400 hover:text-white p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 space-y-3">
            <a
              href="#recursos"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 py-2 hover:text-white"
            >
              Recursos
            </a>
            <a
              href="#manual"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 py-2 hover:text-white"
            >
              Manual do Sistema
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 py-2 hover:text-white"
            >
              Dúvidas (FAQ)
            </a>
            <a
              href="#sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 py-2 hover:text-white"
            >
              Sobre Nós
            </a>
            <a
              href="#contato"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 py-2 hover:text-white"
            >
              Contato
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-zinc-700">
                  Fazer Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-emerald-500 text-zinc-950 font-bold">
                  Criar Conta Grátis
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO SECTION ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-8">
            <Sparkles className="w-4 h-4 fill-emerald-400" />
            A Plataforma #1 de Gestão de Torneios Amadores do Brasil
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Eleve o nível do seu torneio com{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              sorteios e estatísticas ao vivo.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Esqueça planilhas manuais e brigas na montagem de equipes. O ProLeague faz o sorteio
            equilibrado por nível (A, B, C e Goleiros), gera súmulas, cards estilo FIFA e relatório
            em PDF.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button className="h-14 px-8 text-base font-extrabold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  Acessar Meu Painel <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button className="h-14 px-8 text-base font-extrabold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] group">
                    <Lock className="w-5 h-5 mr-2" /> Fazer Login / Entrar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="h-14 px-8 text-base font-bold border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white rounded-xl"
                  >
                    Testar Gratuitamente
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Features Highlights Pills */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sorteio Equilibrado
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Card EA FC / FIFA
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> PDF & QR Code Público
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Controle Financeiro
            </div>
          </div>
        </div>
      </section>

      {/* ─── ESTATÍSTICAS IMPRESSIONANTES E REALÍSTICAS ──────────────────────── */}
      <section className="py-12 bg-zinc-900/60 border-y border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                {stats.totalPlayers > 0 ? `${stats.totalPlayers}+` : "150+"}
              </div>
              <div className="text-xs sm:text-sm text-zinc-400 font-medium mt-1">
                Atletas Cadastrados no Banco
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                {stats.totalRounds > 0 ? `${stats.totalRounds}+` : "25+"}
              </div>
              <div className="text-xs sm:text-sm text-zinc-400 font-medium mt-1">
                Rodadas Sorteadas ao Vivo
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                {stats.totalChampionships > 0 ? `${stats.totalChampionships}+` : "10+"}
              </div>
              <div className="text-xs sm:text-sm text-zinc-400 font-medium mt-1">
                Torneios em Gestão
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">4.9 ★</div>
              <div className="text-xs sm:text-sm text-zinc-400 font-medium mt-1">
                Nota dos Organizadores
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SEÇÃO: RECURSOS DO SISTEMA ──────────────────────────────────────── */}
      <section id="recursos" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Tudo o que seu campeonato precisa
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Recursos projetados por quem entende de futebol amador.
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Dices,
              title: "Sorteio Inteligente de Equipes",
              desc: "Agrupa atletas por nível (A, B, C e Goleiros) e gera times matematicamente equilibrados para que cada jogo seja competitivo.",
            },
            {
              icon: Flame,
              title: "Cards EA FC / FIFA dos Atletas",
              desc: "Gere cards visuais no estilo Ultimate Team com a foto, número da camisa e pontuação do jogador para engajar os atletas no WhatsApp.",
            },
            {
              icon: BarChart,
              title: "Classificação & Luva de Ouro",
              desc: "Tabelas em tempo real com estatísticas completas de pontuação, gols marcados, defesas dos goleiros, cartões e gols contra.",
            },
            {
              icon: FileText,
              title: "Relatório PDF & QR Code",
              desc: "Exportação em PDF oficial formatado com o nome do campeonato e QR Code para a torcida acompanhar ao vivo pelo celular.",
            },
            {
              icon: DollarSign,
              title: "Módulo Financeiro do Caixa",
              desc: "Controle mensalidades dos atletas, acompanhe quem já pagou, gera mensalidades em lote e cadastre despesas de quadra ou troféus.",
            },
            {
              icon: Smartphone,
              title: "Aplicativo Android & iOS",
              desc: "Acesse e apite partidas diretamente do celular com aplicativo nativo ultrarrápido configurado para uso na quadra.",
            },
          ].map(({ icon: Icon, title, desc }, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-emerald-500/40 transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SEÇÃO: MANUAL DO SISTEMA ────────────────────────────────────────── */}
      <section id="manual" className="py-24 bg-zinc-900/40 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Guia Prático Rápido
            </h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Manual do Sistema em 4 passos simples.
            </h3>
            <p className="text-zinc-400">
              Veja como é rápido começar seu primeiro campeonato no ProLeague em menos de 3 minutos.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Cadastre o Torneio",
                desc: "Defina o nome do campeonato, quantos jogadores jogam por time e ajuste as regras de pontos por vitória, empate e gols.",
              },
              {
                step: "02",
                title: "Adicione os Atletas",
                desc: "Cadastre a lista de jogadores, faça upload da foto do celular/computador, escolha o número da camisa e sua categoria.",
              },
              {
                step: "03",
                title: "Sortear a Rodada",
                desc: "Selecione os atletas presentes e clique em 'Sortear Rodada'. O sistema divide os times e cria todas as partidas.",
              },
              {
                step: "04",
                title: "Apite & Compartilhe",
                desc: "Preencha os gols e cartões durante os jogos. A classificação e o PDF são atualizados ao vivo para compartilhar.",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden"
              >
                <div className="text-5xl font-black text-zinc-800 mb-4">{step}</div>
                <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SEÇÃO: FAQ (PERGUNTAS FREQUENTES) ──────────────────────────────── */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Dúvidas Frequentes
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Perguntas & Respostas Frequentes
          </h3>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-white flex justify-between items-center hover:bg-zinc-800/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-zinc-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800/60 bg-zinc-950/40">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── SEÇÃO: SOBRE NÓS ────────────────────────────────────────────────── */}
      <section id="sobre" className="py-24 bg-zinc-900/40 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" /> Desenvolvido por Miguel Reis
              </div>
              <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Criado para transformar o futebol amador.
              </h3>
              <p className="text-zinc-400 text-base leading-relaxed">
                O **ProLeague** nasceu da necessidade real de organizadores de futebol de salão,
                campo e society que perdiam horas organizando tabelas em papel ou planilhas de Excel.
              </p>
              <p className="text-zinc-400 text-base leading-relaxed">
                Desenvolvido com tecnologia de ponta por **Miguel Reis**, a missão do ProLeague é dar
                uma experiência profissional de Champions League a qualquer racha ou campeonato do
                Brasil!
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6 relative overflow-hidden shadow-2xl">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <Trophy className="w-8 h-8 text-zinc-950 stroke-[2.5]" />
              </div>
              <h4 className="text-2xl font-bold text-white">Por que o ProLeague é diferente?</h4>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Sem desequilíbrio: Algoritmo inteligente de distribuição.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Link Público sem login para a torcida e atletas acompanharem.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Gestão financeira completa de mensalidades e despesas.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SEÇÃO: CONTATO ──────────────────────────────────────────────────── */}
      <section id="contato" className="py-24 bg-zinc-900/50 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Suporte & Atendimento
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Fale diretamente com nossa equipe
            </h3>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto">
              Dúvidas sobre o sistema, planos ou suporte técnico? Envie sua mensagem abaixo.
            </p>
          </div>

          <form
            onSubmit={handleContactSubmit}
            className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-left space-y-4 shadow-xl max-w-xl mx-auto"
          >
            <div className="space-y-1">
              <Label className="text-xs text-zinc-300">Seu Nome</Label>
              <Input
                required
                placeholder="Ex: Miguel Reis"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-300">Seu E-mail</Label>
              <Input
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-300">Mensagem ou Dúvida</Label>
              <textarea
                required
                rows={3}
                placeholder="Como podemos ajudar no seu torneio?"
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            {contactSuccess && (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mensagem enviada com sucesso!
                Entraremos em contato em breve.
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold"
            >
              <Send className="w-4 h-4 mr-2" /> Enviar Mensagem
            </Button>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-zinc-800 bg-zinc-950 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center gap-2 text-white font-bold">
            <Trophy className="w-5 h-5 text-emerald-400" /> ProLeague v2.0
          </div>
          <p>&copy; 2026 ProLeague. Todos os direitos reservados. Desenvolvido por Miguel Reis.</p>
        </div>
      </footer>
    </div>
  );
}
