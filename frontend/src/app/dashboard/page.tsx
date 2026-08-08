"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function DashboardRootPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function redirectUser() {
      try {
        const res = await fetchWithAuth("/championships");
        if (res.ok) {
          const championships = await res.json();

          if (championships.length === 0) {
            // Nenhum campeonato -> ir para criação
            router.replace("/dashboard/championships/new");
            return;
          }

          // Checar se há um campeonato ativo salvo em localStorage
          const savedId = typeof window !== "undefined" ? localStorage.getItem("activeChampionshipId") : null;
          const foundSaved = championships.find((c: any) => c.id === savedId);

          if (foundSaved) {
            router.replace(`/dashboard/championships/${foundSaved.id}`);
          } else if (championships.length === 1) {
            // Se só tem 1 campeonato, abre direto
            localStorage.setItem("activeChampionshipId", championships[0].id);
            router.replace(`/dashboard/championships/${championships[0].id}`);
          } else {
            // Se tem mais de 1 e nenhum salvo, vai para a lista de seleção
            router.replace("/dashboard/championships");
          }
        } else {
          router.replace("/dashboard/championships");
        }
      } catch (err) {
        router.replace("/dashboard/championships");
      } finally {
        setLoading(false);
      }
    }

    redirectUser();
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-zinc-400 gap-3">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      <p className="text-sm font-medium">Carregando seu campeonato...</p>
    </div>
  );
}
