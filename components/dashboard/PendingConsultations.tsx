"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  CheckCircle,
  X,
  Clock,
  MessageCircle,
  Phone,
  Video,
  Mail,
  ChevronRight,
} from "lucide-react";

const CANAL_ICONS: Record<string, any> = {
  message: MessageCircle,
  phone: Phone,
  video_30: Video,
  video_60: Video,
  email: Mail,
};

interface Consultation {
  id: string;
  status: string;
  created_at: string;
  subject: string;
  client: { first_name: string; last_name: string; avatar_url?: string };
  lastMessage?: string;
  canal?: string;
}

export function PendingConsultations() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [items, setItems] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [declining, setDeclining] = useState<string | null>(null);
  const [declineMsg, setDeclineMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    loadPending();

    const channel = supabase
      .channel("pending-consultations")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "consultations",
          filter: `lawyer_id=eq.${user.id}`,
        },
        () => loadPending()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadPending = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("consultations")
      .select(
        `
        id, status, created_at, subject,
        client:client_id(first_name, last_name, avatar_url),
        messages(content, created_at)
      `
      )
      .eq("lawyer_id", user.id)
      .in("status", ["pending", "accepted", "in_progress"])
      .order("created_at", { ascending: false })
      .limit(10);

    if (!data) return;

    const enriched = data.map((c: any) => {
      const msgs = c.messages || [];
      const first = msgs.sort(
        (a: any, b: any) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )[0];
      const content = first?.content || "";
      const canal = Object.keys(CANAL_ICONS).find((k) =>
        content.toLowerCase().includes(k.replace("_", " "))
      );
      return { ...c, lastMessage: content, canal };
    });

    setItems(enriched);
    setLoading(false);
  };

  const updateStatus = async (
    id: string,
    status: "accepted" | "declined",
    message?: string
  ) => {
    await fetch(`/api/consultations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, message }),
    });
    loadPending();
    setDeclining(null);
    setDeclineMsg("");
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      pending: {
        label: "En attente",
        color: "bg-amber-50 text-amber-700 border-amber-200",
      },
      accepted: {
        label: "Acceptée",
        color: "bg-teal-50 text-teal-700 border-teal-200",
      },
      in_progress: {
        label: "En cours",
        color: "bg-blue-50 text-blue-700 border-blue-200",
      },
    };
    return (
      map[status] || {
        label: status,
        color: "bg-slate-50 text-slate-600 border-slate-200",
      }
    );
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `il y a ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `il y a ${hrs}h`;
    return `il y a ${Math.floor(hrs / 24)}j`;
  };

  if (loading)
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-40 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-slate-50 rounded-xl mb-3" />
        ))}
      </div>
    );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600" />
          <h2 className="text-sm font-bold text-slate-900">Consultations</h2>
          {items.filter((i) => i.status === "pending").length > 0 && (
            <span className="bg-teal-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {items.filter((i) => i.status === "pending").length}
            </span>
          )}
        </div>
        <button
          onClick={() => router.push("/dashboard/consultations")}
          className="text-xs text-teal-600 font-medium hover:text-teal-700 cursor-pointer"
        >
          Voir tout →
        </button>
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">
            Aucune consultation
          </p>
          <p className="text-xs text-slate-400">
            Les demandes apparaîtront ici
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {items.map((c) => {
            const badge = getStatusBadge(c.status);
            const CanalIcon = c.canal ? CANAL_ICONS[c.canal] : MessageCircle;
            const isPending = c.status === "pending";

            return (
              <div key={c.id} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm flex-shrink-0">
                    {c.client?.first_name?.[0]}
                    {c.client?.last_name?.[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {c.client?.first_name} {c.client?.last_name}
                      </p>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">
                        {timeAgo(c.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <CanalIcon className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                      <p className="text-xs text-slate-500 truncate">
                        {c.subject || "Consultation"}
                      </p>
                      <span
                        className={`flex-shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {isPending ? (
                      declining === c.id ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={declineMsg}
                            onChange={(e) => setDeclineMsg(e.target.value)}
                            placeholder="Motif (optionnel)..."
                            rows={2}
                            className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 resize-none focus:border-teal-400 outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                updateStatus(c.id, "declined", declineMsg)
                              }
                              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium py-1.5 rounded-lg cursor-pointer transition-all"
                            >
                              Confirmer le refus
                            </button>
                            <button
                              onClick={() => setDeclining(null)}
                              className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-lg cursor-pointer transition-all"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => updateStatus(c.id, "accepted")}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2 rounded-lg cursor-pointer transition-all"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Accepter
                          </button>
                          <button
                            onClick={() => setDeclining(c.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium py-2 rounded-lg cursor-pointer transition-all"
                          >
                            <X className="w-3.5 h-3.5" /> Refuser
                          </button>
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() =>
                          router.push(`/dashboard/consultations/${c.id}`)
                        }
                        className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer mt-1"
                      >
                        Voir la conversation{" "}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
