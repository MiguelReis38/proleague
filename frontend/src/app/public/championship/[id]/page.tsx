"use client";

import { useEffect, useState, use } from "react";
import { Trophy, Users, Target, Shirt, Copy, Check } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function PublicLeaderboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [scorers, setScorers] = useState<any[]>([]);
  const [goalkeepers, setGoalkeepers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<"pontos" | "artilheiros" | "luva">("pontos");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [champRes, scorersRes, gkRes] = await Promise.all([
          fetch(`${API_URL}/public/championship/${id}`),
          fetch(`${API_URL}/public/championship/${id}/scorers`),
          fetch(`${API_URL}/public/championship/${id}/goalkeepers`),
        ]);
        if (!champRes.ok) { setNotFound(true); return; }
        setData(await champRes.json());
        if (scorersRes.ok) setScorers(await scorersRes.json());
        if (gkRes.ok) setGoalkeepers(await gkRes.json());
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryLabel: Record<string, string> = {
    CAT_A: "Categoria A", CAT_B: "Categoria B", CAT_C: "Categoria C", GOALKEEPER: "Goleiro"
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm">Carregando classificação...</p>
      </div>
    </div>
  );

  if (notFound || !data) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-center p-6">
      <div>
        <Trophy className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Campeonato não encontrado</h1>
        <p className="text-zinc-500">O link pode estar errado ou o campeonato foi removido.</p>
      </div>
    </div>
  );

  const { championship, leaderboard } = data;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              {championship.logoUrl ? (
                <img src={championship.logoUrl} alt="Logo" className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/30" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-500/30">
                  <Trophy className="w-7 h-7 text-emerald-400" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    ProLeague
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${championship.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                    {championship.status === 'ACTIVE' ? '🟢 Ao Vivo' : '🏁 Encerrado'}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white">{championship.name}</h1>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors text-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copiado!" : "Copiar Link"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Sub-tabs */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
          {[
            { key: "pontos", label: "Classificação", icon: Trophy },
            { key: "artilheiros", label: "Artilheiros", icon: Target },
            { key: "luva", label: "Luva de Ouro", icon: Shirt },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                activeTab === key ? "bg-emerald-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tabela Pontos */}
        {activeTab === "pontos" && (
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3 w-12">Pos</th>
                  <th className="px-4 py-3">Jogador</th>
                  <th className="px-4 py-3 text-center">Nº</th>
                  <th className="px-4 py-3 text-center">PTS</th>
                  <th className="px-4 py-3 text-center">J</th>
                  <th className="px-4 py-3 text-center">V</th>
                  <th className="px-4 py-3 text-center">E</th>
                  <th className="px-4 py-3 text-center">D</th>
                  <th className="px-4 py-3 text-center">⚽</th>
                  <th className="px-4 py-3 text-center">GC</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 && (
                  <tr><td colSpan={10} className="px-4 py-10 text-center text-zinc-500">Nenhuma partida finalizada ainda.</td></tr>
                )}
                {leaderboard.map((p: any, idx: number) => (
                  <tr key={p.id} className={`border-b border-zinc-800/60 transition-colors ${idx < 3 ? 'hover:bg-emerald-500/5' : 'hover:bg-zinc-800/40'}`}>
                    <td className="px-4 py-3">
                      <span className={`font-bold text-sm ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-zinc-300' : idx === 2 ? 'text-amber-600' : 'text-zinc-500'}`}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.photoUrl ? (
                          <img src={p.photoUrl} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-zinc-700" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4 text-zinc-600" />
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-white">{p.name}</span>
                          <span className="block text-xs text-zinc-500">{categoryLabel[p.category] || p.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-zinc-400 text-xs font-mono">{p.number ? `#${p.number}` : '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold text-base ${idx < 3 ? 'text-emerald-400' : 'text-white'}`}>{p.points}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-zinc-400">{p.matchesPlayed}</td>
                    <td className="px-4 py-3 text-center text-zinc-400">{p.wins}</td>
                    <td className="px-4 py-3 text-center text-zinc-400">{p.draws}</td>
                    <td className="px-4 py-3 text-center text-zinc-400">{p.losses}</td>
                    <td className="px-4 py-3 text-center text-zinc-400">{p.goals}</td>
                    <td className="px-4 py-3 text-center text-red-400/70 text-xs">{p.ownGoals > 0 ? p.ownGoals : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Artilheiros */}
        {activeTab === "artilheiros" && (
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3 w-12">Pos</th>
                  <th className="px-4 py-3">Jogador</th>
                  <th className="px-4 py-3 text-center">Nº</th>
                  <th className="px-4 py-3 text-center">⚽ Gols</th>
                </tr>
              </thead>
              <tbody>
                {scorers.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-zinc-500">Nenhum gol registrado ainda.</td></tr>
                )}
                {scorers.map((p: any, idx: number) => (
                  <tr key={p.playerId} className="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-sm text-zinc-500">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.photoUrl ? <img src={p.photoUrl} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-zinc-700" /> : <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center"><Users className="w-4 h-4 text-zinc-600" /></div>}
                        <span className="font-semibold text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-zinc-400 text-xs font-mono">{p.number ? `#${p.number}` : '—'}</td>
                    <td className="px-4 py-3 text-center font-bold text-2xl text-emerald-400">{p.goals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Luva de Ouro */}
        {activeTab === "luva" && (
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3 w-12">Pos</th>
                  <th className="px-4 py-3">Goleiro</th>
                  <th className="px-4 py-3 text-center">Nº</th>
                  <th className="px-4 py-3 text-center">🧤 Defesas</th>
                </tr>
              </thead>
              <tbody>
                {goalkeepers.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-zinc-500">Nenhuma defesa registrada ainda.</td></tr>
                )}
                {goalkeepers.map((p: any, idx: number) => (
                  <tr key={p.playerId} className="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-sm text-zinc-500">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.photoUrl ? <img src={p.photoUrl} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-zinc-700" /> : <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center"><Users className="w-4 h-4 text-zinc-600" /></div>}
                        <span className="font-semibold text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-zinc-400 text-xs font-mono">{p.number ? `#${p.number}` : '—'}</td>
                    <td className="px-4 py-3 text-center font-bold text-2xl text-blue-400">{p.saves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-4 border-t border-zinc-800">
          <p className="text-zinc-600 text-xs">Gerado por <span className="text-emerald-500 font-medium">ProLeague</span> · Classificação em tempo real</p>
        </div>
      </div>
    </div>
  );
}
