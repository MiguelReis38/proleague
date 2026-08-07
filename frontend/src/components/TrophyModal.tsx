"use client";

import { X, Trophy, Target, Shirt, Award, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChampionStats = {
  championName?: string;
  topScorerName?: string;
  topScorerGoals?: number;
  bestGoalkeeperName?: string;
  bestGoalkeeperSaves?: number;
};

export function TrophyModal({
  championshipName,
  data,
  onClose,
}: {
  championshipName: string;
  data: ChampionStats;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-zinc-400 hover:text-white bg-zinc-900 p-2 rounded-full border border-zinc-800 z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CERTIFICADO / TROFÉU DIGITAL */}
        <div
          id="trophy-certificate"
          className="rounded-3xl p-8 border-2 border-yellow-500/60 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 mb-3 shadow-lg shadow-yellow-500/10">
              <Trophy className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-yellow-400 uppercase tracking-wider">
              Certificado de Glória
            </h2>
            <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest font-semibold">
              {championshipName}
            </p>
          </div>

          <div className="border-t border-yellow-500/20 my-4" />

          {/* Hall da Fama */}
          <div className="space-y-4 my-6">
            {/* 1º Lugar */}
            <div className="flex items-center gap-4 bg-yellow-950/30 border border-yellow-500/30 p-3.5 rounded-xl">
              <div className="p-2.5 rounded-lg bg-yellow-500/20 text-yellow-400 font-black text-lg shrink-0">
                🥇
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-extrabold uppercase text-yellow-500 tracking-wider block">
                  Campeão da Temporada
                </span>
                <span className="text-base font-bold text-white">
                  {data.championName || "Aguardando encerramento"}
                </span>
              </div>
            </div>

            {/* Artilheiro */}
            <div className="flex items-center gap-4 bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider block">
                  Artilheiro de Ouro
                </span>
                <span className="text-base font-bold text-white">
                  {data.topScorerName || "Aguardando"} {data.topScorerGoals !== undefined ? `(${data.topScorerGoals} gols)` : ""}
                </span>
              </div>
            </div>

            {/* Luva de Ouro */}
            <div className="flex items-center gap-4 bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
              <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                <Shirt className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider block">
                  Luva de Ouro (Melhor Goleiro)
                </span>
                <span className="text-base font-bold text-white">
                  {data.bestGoalkeeperName || "Aguardando"} {data.bestGoalkeeperSaves !== undefined ? `(${data.bestGoalkeeperSaves} defesas)` : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-yellow-500/20 my-4" />

          {/* Footer Signature */}
          <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-2">
            <span>ProLeague System</span>
            <span className="font-semibold text-zinc-400">Desenvolvido por Miguel Reis</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => alert("Tire um print para compartilhar com os vencedores!")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs"
          >
            <Share2 className="w-3.5 h-3.5 mr-1.5" /> Compartilhar Troféu
          </Button>
        </div>
      </div>
    </div>
  );
}
