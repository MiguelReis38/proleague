"use client";

import { X, Share2, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

type PlayerStats = {
  name: string;
  photoUrl?: string;
  number?: number;
  category: string;
  points: number;
  goals: number;
  assists?: number;
  wins: number;
  matches?: number;
  saves?: number;
};

export function FifaCardModal({
  player,
  championshipName,
  onClose,
}: {
  player: PlayerStats | null;
  championshipName: string;
  onClose: () => void;
}) {
  if (!player) return null;

  // Cálculo de overall dinâmico (75 a 99)
  const baseRating = 75;
  const bonus = Math.min(
    24,
    (player.goals || 0) * 2 + (player.wins || 0) * 3 + (player.saves || 0) * 1.5
  );
  const overall = Math.min(99, Math.round(baseRating + bonus));

  const categoryLabel: Record<string, string> = {
    CAT_A: "ATA",
    CAT_B: "MEI",
    CAT_C: "DEF",
    GOALKEEPER: "GOL",
  };

  const pos = categoryLabel[player.category] || "JOG";

  // Atributos FUT dinâmicos
  const pac = Math.min(99, 78 + (player.wins || 0) * 2);
  const sho = Math.min(99, 70 + (player.goals || 0) * 4);
  const pas = Math.min(99, 75 + (player.assists || 0) * 3 + Math.floor(player.points / 2));
  const dri = Math.min(99, 80 + (player.goals || 0) * 2);
  const def = player.category === "GOALKEEPER" ? Math.min(99, 82 + (player.saves || 0) * 3) : 74;
  const phy = Math.min(99, 82 + (player.wins || 0) * 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-zinc-400 hover:text-white bg-zinc-900 p-2 rounded-full border border-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CARD ESTILO EA FC / FIFA */}
        <div
          id="fifa-card"
          className="w-80 h-[480px] rounded-3xl p-5 relative flex flex-col justify-between shadow-2xl overflow-hidden border-2 border-amber-400/60 bg-gradient-to-b from-amber-900/90 via-zinc-950 to-black text-amber-100"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none" />

          {/* Top Header */}
          <div className="flex justify-between items-start z-10">
            <div className="flex flex-col items-center leading-none">
              <span className="text-4xl font-black text-amber-300 tracking-tighter drop-shadow-md">
                {overall}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200/90 mt-0.5">
                {pos}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/30 px-2 py-1 rounded-full">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-extrabold uppercase text-amber-300">
                EA FC CARD
              </span>
            </div>
          </div>

          {/* Foto do Jogador */}
          <div className="my-1 flex justify-center z-10">
            <div className="w-28 h-28 rounded-full border-4 border-amber-400/60 shadow-2xl overflow-hidden bg-zinc-900 flex items-center justify-center">
              {player.photoUrl ? (
                <img
                  src={player.photoUrl}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-black text-amber-400/50">
                  {player.name[0]}
                </span>
              )}
            </div>
          </div>

          {/* Nome & Camisa */}
          <div className="text-center z-10">
            <h2 className="text-xl font-black uppercase tracking-wide truncate text-amber-200 drop-shadow">
              {player.name}
            </h2>
            <p className="text-[11px] font-bold text-amber-400/80 uppercase tracking-widest">
              {championshipName} {player.number ? `· #${player.number}` : ""}
            </p>
          </div>

          <div className="border-t border-amber-500/30 my-1 z-10" />

          {/* FUT STATS GRID (PAC, SHO, PAS, DRI, DEF, PHY) */}
          <div className="grid grid-cols-6 gap-1 text-center z-10 bg-amber-950/40 border border-amber-500/20 rounded-xl p-2">
            <div>
              <span className="block text-sm font-black text-amber-300">{pac}</span>
              <span className="text-[9px] text-amber-200/60 font-bold">PAC</span>
            </div>
            <div>
              <span className="block text-sm font-black text-amber-300">{sho}</span>
              <span className="text-[9px] text-amber-200/60 font-bold">SHO</span>
            </div>
            <div>
              <span className="block text-sm font-black text-amber-300">{pas}</span>
              <span className="text-[9px] text-amber-200/60 font-bold">PAS</span>
            </div>
            <div>
              <span className="block text-sm font-black text-amber-300">{dri}</span>
              <span className="text-[9px] text-amber-200/60 font-bold">DRI</span>
            </div>
            <div>
              <span className="block text-sm font-black text-amber-300">{def}</span>
              <span className="text-[9px] text-amber-200/60 font-bold">DEF</span>
            </div>
            <div>
              <span className="block text-sm font-black text-amber-300">{phy}</span>
              <span className="text-[9px] text-amber-200/60 font-bold">PHY</span>
            </div>
          </div>

          {/* Resumo de Pontos & Gols */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold z-10 pb-1">
            <div className="bg-black/40 border border-amber-500/20 rounded-lg py-1">
              <span className="block text-amber-300 text-xs font-black">{player.points}</span>
              <span className="text-[9px] text-amber-200/60">PTS</span>
            </div>
            <div className="bg-black/40 border border-amber-500/20 rounded-lg py-1">
              <span className="block text-amber-300 text-xs font-black">{player.goals}</span>
              <span className="text-[9px] text-amber-200/60">GOLS</span>
            </div>
            <div className="bg-black/40 border border-amber-500/20 rounded-lg py-1">
              <span className="block text-amber-300 text-xs font-black">{player.wins}</span>
              <span className="text-[9px] text-amber-200/60">VÍT</span>
            </div>
          </div>
        </div>

        {/* Botão de Compartilhar */}
        <div className="flex gap-2 mt-4">
          <Button
            onClick={() =>
              alert("Tire um print da tela para compartilhar este Card no seu WhatsApp ou Instagram Stories!")
            }
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-lg shadow-amber-950"
          >
            <Share2 className="w-3.5 h-3.5 mr-1.5" /> Compartilhar Card no WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
