"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useTranslations, useLocale } from "next-intl";
import { localizedDigits } from "@/lib/arabicNumerals";
import FeedbackPopup from "@/components/FeedbackPopup";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  MessageSquare,
  Send,
  CheckCircle,
  User,
  AlertCircle,
  Mail,
  MapPin,
  ArrowLeft,
  Video,
  Archive,
  Clock,
  Filter,
  Calendar,
  CheckSquare,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Message, Consultation } from "@/types";
import { gsap } from "gsap";
import { JoinCallButton } from "@/components/consultation/JoinCallButton";

type TabFilter = "active" | "archived" | "all";

const capitalizeWords = (text: string) => {
  if (!text) return "";
  return text
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

function LawyerConsultationsContent() {
  const supabase = createClient();
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);
  const t = useTranslations();
  const dateLocale =
    locale === "ar" ? "ar-DZ" : locale === "en" ? "en-US" : "fr-FR";

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [tabFilter, setTabFilter] = useState<TabFilter>("active");
  const [archiving, setArchiving] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isActioning, setIsActioning] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  useEffect(() => {
    if (searchParams.get("feedback") === "true") {
      const timer = setTimeout(() => setShowFeedback(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/lawyer/login");
      return;
    }
    if (!profile) {
      return;
    }
    if (profile.user_type !== "lawyer") {
      router.push("/");
      return;
    }
    loadConsultations();
  }, [user, profile, authLoading]);

  useEffect(() => {
    if (selectedConsultation) loadMessages(selectedConsultation.id);
  }, [selectedConsultation]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!containerRef.current || loading) return;
    gsap
      .timeline()
      .fromTo(
        ".page-header",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      )
      .fromTo(
        ".page-subtitle",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".consultations-list",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".chat-container",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );
  }, [loading]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("lawyer-consultations-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "consultation_messages" },
        () => {
          loadConsultations();
          if (selectedConsultation) loadMessages(selectedConsultation.id);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "consultations",
          filter: `lawyer_id=eq.${user.id}`,
        },
        () => loadConsultations()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConsultation]);

  useEffect(() => {
    if (!selectedConsultation) return;
    const channel = supabase
      .channel(`consultation-${selectedConsultation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "consultation_messages",
          filter: `consultation_id=eq.${selectedConsultation.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          Promise.all([
            supabase
              .from("users")
              .select("first_name, last_name")
              .eq("id", newMsg.sender_id)
              .single(),
            newMsg.attachment_url
              ? supabase.storage
                  .from("consultation-attachments")
                  .createSignedUrl(
                    extractStoragePath(newMsg.attachment_url),
                    3600
                  )
              : Promise.resolve({ data: null }),
          ]).then(([{ data }, signedRes]) => {
            setMessages((prev) => [
              ...prev,
              {
                ...newMsg,
                attachment_url:
                  signedRes?.data?.signedUrl || newMsg.attachment_url,
                sender: {
                  first_name: data?.first_name || "",
                  last_name: data?.last_name || "",
                },
              },
            ]);
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConsultation, supabase]);

  useEffect(() => {
    if (!selectedConsultation || !user) return;
    const channel = supabase.channel(`typing-${selectedConsultation.id}`);
    channel
      .on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload.userId !== user.id) {
          setOtherUserTyping(true);
          setTimeout(() => setOtherUserTyping(false), 3000);
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConsultation, user, supabase]);

  const loadConsultations = async () => {
    if (!user) return;
    setError("");
    try {
      const { data, error: err } = await supabase
        .from("consultations")
        .select(
          `*, client:users!consultations_client_id_fkey(id, first_name, last_name, email, location, mobile)`
        )
        .eq("lawyer_id", user.id)
        .order("created_at", { ascending: false });
      if (err) throw err;

      const withUnread = await Promise.all(
        (data || []).map(async (item) => {
          const { count } = await supabase
            .from("consultation_messages")
            .select("*", { count: "exact", head: true })
            .eq("consultation_id", item.id)
            .eq("is_read", false)
            .neq("sender_id", user.id);
          return {
            id: item.id,
            status: item.status as "answered" | "closed" | "accepted",
            created_at: item.created_at,
            client_id: item.client_id,
            lawyer_id: item.lawyer_id,
            question: item.question,
            response: item.response,
            answered_at: item.answered_at,
            opened_by_lawyer: item.opened_by_lawyer || false,
            archived_at: item.archived_at || null,
            scheduled_at: item.scheduled_at || null,
            subject: item.subject || "",
            channel: item.channel || "",
            unread_count: count || 0,
            client: {
              first_name: item.client?.first_name || "",
              last_name: item.client?.last_name || "",
              email: item.client?.email || "",
              location: item.client?.location || "",
              mobile: item.client?.mobile || null,
            },
          };
        })
      );
      setConsultations(withUnread);
    } catch {
      setError(t("consultShared.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const extractStoragePath = (attachmentUrl: string): string => {
    const marker = "consultation-attachments/";
    const idx = attachmentUrl.indexOf(marker);
    return idx >= 0 ? attachmentUrl.slice(idx + marker.length) : attachmentUrl;
  };

  const loadMessages = async (consultationId: string) => {
    try {
      const { data, error: err } = await supabase
        .from("consultation_messages")
        .select("*")
        .eq("consultation_id", consultationId)
        .order("created_at", { ascending: true });
      if (err) throw err;
      if (!data || data.length === 0) {
        setMessages([]);
        return;
      }
      const senderIds = [...new Set(data.map((m) => m.sender_id))];
      const { data: sendersData } = await supabase
        .from("users")
        .select("id, first_name, last_name")
        .in("id", senderIds);
      const withSignedUrls = await Promise.all(
        data.map(async (msg) => {
          const sender = sendersData?.find((s) => s.id === msg.sender_id);
          let attachment_url = msg.attachment_url;
          if (attachment_url) {
            const path = extractStoragePath(attachment_url);
            const { data: signed } = await supabase.storage
              .from("consultation-attachments")
              .createSignedUrl(path, 3600);
            if (signed?.signedUrl) attachment_url = signed.signedUrl;
          }
          return {
            ...msg,
            attachment_url,
            sender: {
              first_name:
                sender?.first_name || t("myProfile.firstNameFallback"),
              last_name: sender?.last_name || "",
            },
          };
        })
      );
      setMessages(withSignedUrls);
    } catch {
      setMessages([]);
    }
  };

  const handleArchive = async (id: string, currentlyArchived: boolean) => {
    setArchiving(id);
    try {
      await supabase
        .from("consultations")
        .update({
          archived_at: currentlyArchived ? null : new Date().toISOString(),
        })
        .eq("id", id);
      await loadConsultations();
      if (selectedConsultation?.id === id && !currentlyArchived) {
        setSelectedConsultation(null);
        setShowChat(false);
      }
    } finally {
      setArchiving(null);
    }
  };

  const handleCloseConsultation = async () => {
    if (!selectedConsultation || !user) return;
    setIsActioning(true);
    setConfirmClose(false);
    try {
      const { data: userData } = await supabase
        .from("users")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();
      const lawyerName =
        `${t("mesConsultations.lawyerPrefix")} ${userData?.first_name || ""} ${userData?.last_name || ""}`.trim();

      await fetch(`/api/consultations/${selectedConsultation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_key: "close",
          system_params: { lawyerName },
        }),
      });

      await supabase
        .from("consultations")
        .update({ status: "closed" })
        .eq("id", selectedConsultation.id);

      await loadConsultations();
      setSelectedConsultation((prev) =>
        prev ? { ...prev, status: "closed" } : prev
      );
      // Afficher le popup feedback Mizan au professionnel après clôture
      setTimeout(() => setShowFeedback(true), 1200);
    } catch {
      setError(t("lawyerConsultations.actionError"));
    } finally {
      setIsActioning(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError(t("consultShared.fileTooBig"));
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setError(t("consultShared.fileNotAllowed"));
      return;
    }
    setSelectedFile(file);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${selectedConsultation!.id}/${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from("consultation-attachments")
      .upload(fileName, file);
    if (error) throw error;
    return fileName;
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || isSending) return;
    if (
      selectedConsultation?.status === "closed" ||
      selectedConsultation?.archived_at
    )
      return;
    setIsSending(true);
    setError("");
    try {
      let attachmentUrl = null,
        attachmentType = null,
        attachmentName = null;
      if (selectedFile) {
        setUploading(true);
        attachmentUrl = await uploadFile(selectedFile);
        attachmentType = selectedFile.type;
        attachmentName = selectedFile.name;
        setUploading(false);
      }
      const res = await fetch(
        `/api/consultations/${selectedConsultation!.id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: newMessage.trim() || t("consultShared.attachedFile"),
            attachment_url: attachmentUrl,
            attachment_type: attachmentType,
            attachment_name: attachmentName,
          }),
        }
      );
      if (!res.ok) throw new Error((await res.json()).error || "Erreur");
      await loadMessages(selectedConsultation!.id);
      setNewMessage("");
      setSelectedFile(null);
    } catch (error: any) {
      setError(error.message || t("consultShared.sendError"));
    } finally {
      setIsSending(false);
      setUploading(false);
    }
  };

  const markMessagesAsRead = async (consultationId: string) => {
    if (!user) return;
    await supabase.rpc("mark_consultation_messages_as_read", {
      p_consultation_id: consultationId,
    });
    await loadConsultations();
    window.dispatchEvent(new Event("mizan:refresh-unread"));
  };

  const markConsultationAsOpened = async (id: string) => {
    await supabase
      .from("consultations")
      .update({ opened_by_lawyer: true })
      .eq("id", id);
  };

  const handleSelectConsultation = async (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setShowChat(true);
    setConfirmClose(false);
    if (!consultation.opened_by_lawyer)
      await markConsultationAsOpened(consultation.id);
    await markMessagesAsRead(consultation.id);
  };

  const isVideoConsultation = (subject?: string, channel?: string) =>
    !!(
      channel?.startsWith("video") ||
      subject?.toLowerCase().includes("vidéo") ||
      subject?.toLowerCase().includes("video")
    );
  const isPhoneConsultation = (subject?: string, channel?: string) =>
    !!(channel === "phone" || subject?.toLowerCase().includes("téléphone"));
  const isCallWindowOpen = (scheduledAt?: string | null, channel?: string) => {
    if (!scheduledAt) return false;
    const now = Date.now();
    const start = new Date(scheduledAt).getTime();
    const durationMin = channel === "video_60" ? 60 : 30;
    return (
      now >= start - 15 * 60 * 1000 &&
      now <= start + (durationMin + 30) * 60 * 1000
    );
  };
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(dateLocale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString(dateLocale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  const formatScheduled = (iso: string) => {
    const d = new Date(iso);
    return (
      d.toLocaleDateString(dateLocale, {
        weekday: "short",
        day: "numeric",
        month: "short",
      }) +
      ` ${t("consultShared.atConnector")} ` +
      d.toLocaleTimeString(dateLocale, { hour: "2-digit", minute: "2-digit" })
    );
  };

  const filtered = consultations.filter((c) => {
    if (tabFilter === "active") return !c.archived_at;
    if (tabFilter === "archived") return !!c.archived_at;
    return true;
  });
  const activeCount = consultations.filter((c) => !c.archived_at).length;
  const archivedCount = consultations.filter((c) => !!c.archived_at).length;
  const unreadTotal = consultations.filter(
    (c) => (c.unread_count ?? 0) > 0 && !c.archived_at
  ).length;

  const isClosed = selectedConsultation?.status === "closed";
  const isLocked = isClosed || !!selectedConsultation?.archived_at;

  if (loading)
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-[#2a2a2d] rounded-xl animate-pulse w-48" />
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-slate-200 dark:bg-[#2a2a2d] rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );

  const ChatPanel = () => (
    <div className="bg-white dark:bg-[#1c1c1e] rounded-xl shadow-sm dark:shadow-none border border-slate-200 dark:border-[#1c2220] flex flex-col h-[600px]">
      <div className="p-5 bg-teal-50 dark:bg-[#1c1c1e] border-b border-slate-200 dark:border-[#1c2220]">
        <div className="flex items-start gap-3">
          <button
            onClick={() => setShowChat(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a2a2d] cursor-pointer flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-[#E8E8E6]" />
          </button>
          <div className="w-10 h-10 bg-teal-600 dark:bg-[#0F6E56] rounded-lg flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-[#F5F5F4] truncate">
              {selectedConsultation!.client.first_name}{" "}
              {selectedConsultation!.client.last_name}
            </h3>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              <p className="text-xs text-slate-500 dark:text-[#A8A8A6] flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {selectedConsultation!.client.email}
              </p>
              <p className="text-xs text-slate-500 dark:text-[#A8A8A6] flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {capitalizeWords(selectedConsultation!.client.location)}
              </p>
            </div>
            {selectedConsultation!.scheduled_at && (
              <div className="flex items-center gap-1 mt-1 text-teal-700 dark:text-[#6fcf9f]">
                <Calendar className="w-3 h-3" />
                <span className="text-xs font-medium">
                  {formatScheduled(selectedConsultation!.scheduled_at)}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isLocked &&
              isVideoConsultation(
                selectedConsultation!.subject,
                selectedConsultation!.channel
              ) && (
                <JoinCallButton
                  consultationId={selectedConsultation!.id}
                  canal={selectedConsultation!.channel || "video_60"}
                />
              )}
            <button
              onClick={() =>
                handleArchive(
                  selectedConsultation!.id,
                  !!selectedConsultation!.archived_at
                )
              }
              disabled={archiving === selectedConsultation!.id}
              title={
                selectedConsultation!.archived_at
                  ? t("consultShared.unarchive")
                  : t("consultShared.archive")
              }
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a2a2d] text-slate-400 dark:text-[#7A7A78] hover:text-slate-600 dark:hover:text-[#E8E8E6] cursor-pointer"
            >
              <Archive className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isClosed && (
          <div className="mt-3">
            {confirmClose ? (
              <div className="bg-teal-50 dark:bg-[#141415] border border-teal-200 dark:border-[#1c2220] rounded-xl p-3 flex items-center justify-between gap-2">
                <p className="text-xs text-teal-700 dark:text-[#6fcf9f] font-medium">
                  {t("lawyerConsultations.closeConfirm")}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmClose(false)}
                    className="text-xs text-slate-500 dark:text-[#A8A8A6] hover:text-slate-700 dark:hover:text-[#E8E8E6] cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a2a2d]"
                  >
                    {t("lawyerConsultations.cancel")}
                  </button>
                  <button
                    onClick={handleCloseConsultation}
                    disabled={isActioning}
                    className="text-xs font-semibold text-white bg-teal-600 dark:bg-[#085041] hover:bg-teal-700 dark:hover:bg-[#0a6b52] px-3 py-1 rounded-lg cursor-pointer disabled:opacity-50"
                  >
                    {isActioning ? "..." : t("lawyerConsultations.confirm")}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClose(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-teal-700 dark:text-[#6fcf9f] bg-teal-50 dark:bg-[#141415] hover:bg-teal-100 dark:hover:bg-[#1c2220] border border-teal-200 dark:border-[#1c2220] rounded-xl cursor-pointer transition-all"
              >
                <CheckSquare className="w-3.5 h-3.5" />{" "}
                {t("lawyerConsultations.close")}
              </button>
            )}
          </div>
        )}

        {isClosed && (
          <div className="mt-3 flex items-center gap-2 bg-slate-50 dark:bg-[#141415] border border-slate-200 dark:border-[#1c2220] rounded-xl px-3 py-2">
            <CheckCircle className="w-3.5 h-3.5 text-slate-400 dark:text-[#7A7A78] flex-shrink-0" />
            <p className="text-xs text-slate-500 dark:text-[#A8A8A6]">
              {t("lawyerConsultations.consultationClosed")}
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {!isLocked &&
          isPhoneConsultation(
            selectedConsultation!.subject,
            selectedConsultation!.channel
          ) &&
          selectedConsultation!.client.mobile &&
          isCallWindowOpen(
            selectedConsultation!.scheduled_at,
            selectedConsultation!.channel
          ) && (
            <div className="bg-teal-50 dark:bg-[#0F6E56]/15 border border-teal-100 dark:border-[#6fcf9f]/25 rounded-2xl p-4 mb-2">
              <p className="text-xs text-teal-700 dark:text-[#6fcf9f] mb-1">
                {t("consultShared.callTime")}
              </p>
              <p className="text-sm text-teal-900 dark:text-[#E8E8E6] mb-3">
                {t("consultShared.callClient")}
              </p>
              <div className="flex gap-2">
                <a
                  href={`tel:${selectedConsultation!.client.mobile}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-teal-600 dark:bg-[#0F6E56] hover:bg-teal-700 text-white py-3 rounded-xl font-medium text-sm"
                >
                  <Phone className="w-4 h-4" />
                  {t("consultShared.callButton")}
                </a>
                <a
                  href={`https://wa.me/${selectedConsultation!.client.mobile.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-medium text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
              <p className="text-xs text-teal-700 dark:text-[#6fcf9f] text-center mt-3">
                {selectedConsultation!.client.mobile}
              </p>
            </div>
          )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_type === "lawyer" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-xl p-3.5 ${message.sender_type === "lawyer" ? "bg-teal-600 dark:bg-[#0F6E56] text-white" : "bg-slate-100 dark:bg-[#2a2a2d] text-slate-900 dark:text-[#F5F5F4]"}`}
            >
              {message.system_key ? (
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {t(
                    `lawyerConsultations.autoMessages.${message.system_key}`,
                    message.system_params || {}
                  )}
                </p>
              ) : (
                message.message && (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.message}
                  </p>
                )
              )}
              {message.attachment_url && (
                <div className="mt-2">
                  {message.attachment_type?.startsWith("image/") ? (
                    <img
                      src={message.attachment_url}
                      alt={message.attachment_name || t("consultShared.image")}
                      className="max-w-full rounded-lg cursor-pointer"
                      onClick={() =>
                        window.open(message.attachment_url!, "_blank")
                      }
                    />
                  ) : (
                    <a
                      href={message.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white dark:bg-[#1c1c1e]/10 rounded p-2 hover:bg-white/20"
                    >
                      <span>📄</span>
                      <span className="text-sm underline">
                        {message.attachment_name ||
                          t("consultShared.attachedFileFallback")}
                      </span>
                    </a>
                  )}
                </div>
              )}
              <div className="flex items-center gap-1.5 justify-end mt-2 pt-1.5 border-t border-white/10">
                <p
                  className={`text-xs ${message.sender_type === "lawyer" ? "text-teal-100" : "text-slate-500 dark:text-[#A8A8A6]"}`}
                >
                  {formatTime(message.created_at)}
                </p>
                {message.sender_type === "lawyer" && (
                  <span className="text-teal-100">
                    {message.is_read ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border-2 border-current" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {otherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-[#2a2a2d] rounded-xl p-3 flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500 dark:text-[#A8A8A6]">
                {t("lawyerConsultations.clientTyping")}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-[#1c2220]">
        {isLocked ? (
          <p className="text-center text-xs text-slate-400 dark:text-[#7A7A78] py-2">
            {selectedConsultation!.archived_at && !isClosed
              ? t("consultShared.archivedNotice")
              : t("lawyerConsultations.consultationClosed")}
          </p>
        ) : (
          <>
            {selectedFile && (
              <div className="mb-3 bg-slate-50 dark:bg-[#141415] rounded-lg p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>
                    {selectedFile.type.startsWith("image/") ? "🖼️" : "📄"}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-slate-900 dark:text-[#F5F5F4]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-[#A8A8A6]">
                      {(selectedFile.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-red-500 dark:text-[#E08585] hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer px-3 border border-slate-200 dark:border-[#1c2220] rounded-lg hover:border-teal-400 dark:hover:border-[#6fcf9f] hover:bg-teal-50 dark:hover:bg-[#26492f] bg-white dark:bg-[#141415]"
                disabled={isSending || uploading}
              >
                📎
              </button>
              <textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  if (!isTyping && selectedConsultation) {
                    setIsTyping(true);
                    const ch = supabase.channel(
                      `typing-${selectedConsultation.id}`
                    );
                    ch.subscribe((status) => {
                      if (status === "SUBSCRIBED")
                        ch.send({
                          type: "broadcast",
                          event: "typing",
                          payload: { userId: user?.id },
                        });
                    });
                  }
                  if (typingTimeoutRef.current)
                    clearTimeout(typingTimeoutRef.current);
                  typingTimeoutRef.current = setTimeout(
                    () => setIsTyping(false),
                    1000
                  );
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={t("consultShared.messagePlaceholder")}
                className="w-full h-14 px-3 py-2.5 text-sm border border-slate-300 dark:border-[#3a3a3d] rounded-lg bg-white dark:bg-[#1c1c1e] focus:border-teal-300 outline-none text-slate-700 dark:text-[#E8E8E6] resize-none"
                rows={2}
              />
              <button
                onClick={handleSendMessage}
                disabled={
                  (!newMessage.trim() && !selectedFile) ||
                  isSending ||
                  uploading
                }
                className="cursor-pointer px-4 bg-teal-600 dark:bg-[#085041] text-white rounded-lg hover:bg-teal-700 dark:hover:bg-[#0a6b52] disabled:opacity-50"
              >
                {isSending || uploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <style>{`.page-header,.page-subtitle,.consultations-list,.chat-container{opacity:0;}`}</style>
      <div className="max-w-7xl mx-auto px-4 py-8" ref={containerRef}>
        <div className="mb-6">
          <h1 className="page-header text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#F5F5F4] mb-1">
            {t("lawyerConsultations.title")}
          </h1>
          <p className="page-subtitle text-slate-600 dark:text-[#E8E8E6] text-sm sm:text-base">
            {t("lawyerConsultations.subtitle")}
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-r-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {consultations.length === 0 ? (
          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-12 text-center shadow-sm dark:shadow-none border border-slate-200 dark:border-[#1c2220]">
            <MessageSquare className="w-16 h-16 text-slate-300 dark:text-[#3a3a3d] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 dark:text-[#F5F5F4] mb-2">
              {t("lawyerConsultations.emptyTitle")}
            </h3>
            <p className="text-slate-600 dark:text-[#E8E8E6]">
              {t("lawyerConsultations.emptyDesc")}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-5">
              {[
                {
                  key: "active",
                  label: t("consultShared.tabs.active"),
                  count: activeCount,
                  icon: Clock,
                },
                {
                  key: "archived",
                  label: t("consultShared.tabs.archived"),
                  count: archivedCount,
                  icon: Archive,
                },
                {
                  key: "all",
                  label: t("consultShared.tabs.all"),
                  count: consultations.length,
                  icon: Filter,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setTabFilter(tab.key as TabFilter)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${tabFilter === tab.key ? "bg-teal-600 dark:bg-[#0F6E56] text-white" : "bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] text-slate-600 dark:text-[#E8E8E6] hover:bg-slate-50 dark:hover:bg-[#2a2a2d]"}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tabFilter === tab.key ? "bg-white text-teal-700 dark:bg-[#1c1c1e]/30 dark:text-white" : "bg-slate-100 text-slate-600 dark:bg-[#2a2a2d] dark:text-[#E8E8E6]"}`}
                    >
                      {ld(String(tab.count))}
                    </span>
                    {tab.key === "active" && unreadTotal > 0 && (
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className={`consultations-list space-y-3 ${showChat ? "hidden lg:block" : "block"}`}
              >
                {filtered.length === 0 ? (
                  <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-8 text-center border border-slate-200 dark:border-[#1c2220]">
                    <Archive className="w-10 h-10 text-slate-300 dark:text-[#3a3a3d] mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-[#A8A8A6] text-sm">
                      {tabFilter === "archived"
                        ? t("consultShared.noArchived")
                        : t("consultShared.noActive")}
                    </p>
                  </div>
                ) : (
                  filtered.map((consultation) => (
                    <div
                      key={consultation.id}
                      onClick={() => handleSelectConsultation(consultation)}
                      className={`cursor-pointer bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border-2 transition-all hover:shadow-md relative ${selectedConsultation?.id === consultation.id ? "border-teal-500 shadow-md dark:shadow-none" : "border-slate-200 dark:border-[#1c2220] hover:border-teal-300 dark:hover:border-[#6fcf9f]"} ${consultation.archived_at ? "opacity-70" : ""}`}
                    >
                      {(consultation.unread_count ?? 0) > 0 && (
                        <div className="absolute -top-2 -end-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg dark:shadow-none">
                          {ld(String(consultation.unread_count))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-teal-100 dark:bg-[#1c2220] rounded-lg flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-teal-600 dark:text-[#6fcf9f]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-[#F5F5F4] text-sm truncate">
                              {consultation.client.first_name}{" "}
                              {consultation.client.last_name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-[#A8A8A6]">
                              {capitalizeWords(consultation.client.location)}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <p className="text-xs text-slate-400 dark:text-[#7A7A78]">
                                {formatDate(consultation.created_at)}
                              </p>
                              {isVideoConsultation(
                                consultation.subject,
                                consultation.channel
                              ) && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-teal-600 dark:text-[#6fcf9f] bg-teal-50 dark:bg-[#141415] px-1.5 py-0.5 rounded-full border border-teal-100 dark:border-[#1c2220]">
                                  <Video className="w-2.5 h-2.5" />{" "}
                                  {t("consultShared.videoLabel")}
                                </span>
                              )}
                              {isPhoneConsultation(
                                consultation.subject,
                                consultation.channel
                              ) && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-600 dark:text-[#7EA8E0] bg-blue-50 dark:bg-[#1F2A3D] px-1.5 py-0.5 rounded-full border border-blue-100 dark:border-[#2A3A5A]">
                                  {t("lawyerConsultations.phoneLabel")}
                                </span>
                              )}
                              {consultation.status === "closed" && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-[#A8A8A6] bg-slate-100 dark:bg-[#2a2a2d] px-1.5 py-0.5 rounded-full">
                                  <CheckCircle className="w-2.5 h-2.5" />{" "}
                                  {t("lawyerConsultations.closedLabel")}
                                </span>
                              )}
                              {consultation.archived_at &&
                                consultation.status !== "closed" && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-[#A8A8A6] bg-slate-100 dark:bg-[#2a2a2d] px-1.5 py-0.5 rounded-full">
                                    <Archive className="w-2.5 h-2.5" />{" "}
                                    {t("consultShared.archivedLabel")}
                                  </span>
                                )}
                            </div>
                            {consultation.scheduled_at &&
                              (isVideoConsultation(
                                consultation.subject,
                                consultation.channel
                              ) ||
                                isPhoneConsultation(
                                  consultation.subject,
                                  consultation.channel
                                )) && (
                                <div className="flex items-center gap-1 mt-1.5 text-teal-700 dark:text-[#6fcf9f] bg-teal-50 dark:bg-[#141415] border border-teal-100 dark:border-[#1c2220] rounded-lg px-2 py-1 w-fit">
                                  <Calendar className="w-3 h-3 flex-shrink-0" />
                                  <span className="text-[11px] font-medium">
                                    {formatScheduled(consultation.scheduled_at)}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ms-2">
                          {consultation.status !== "closed" &&
                            (consultation.unread_count ?? 0) === 0 && (
                              <CheckCircle className="w-5 h-5 text-teal-600 dark:text-[#6fcf9f]" />
                            )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchive(
                                consultation.id,
                                !!consultation.archived_at
                              );
                            }}
                            disabled={archiving === consultation.id}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a2a2d] text-slate-400 dark:text-[#7A7A78] hover:text-slate-600 dark:hover:text-[#E8E8E6] cursor-pointer"
                          >
                            {archiving === consultation.id ? (
                              <div className="w-4 h-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                            ) : (
                              <Archive className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div
                className={`chat-container lg:sticky lg:top-24 lg:self-start ${showChat ? "block" : "hidden lg:block"}`}
              >
                {selectedConsultation ? (
                  ChatPanel()
                ) : (
                  <div className="hidden lg:flex bg-slate-50 dark:bg-[#141415] rounded-xl p-12 text-center border-2 border-dashed border-slate-300 dark:border-[#3a3a3d] flex-col items-center">
                    <MessageSquare className="w-12 h-12 text-slate-300 dark:text-[#3a3a3d] mb-3" />
                    <p className="text-slate-500 dark:text-[#A8A8A6] font-medium">
                      {t("lawyerConsultations.selectPrompt")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {showFeedback && <FeedbackPopup onClose={() => setShowFeedback(false)} />}
    </div>
  );
}

export default function LawyerConsultationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 dark:border-[#6fcf9f]" />
        </div>
      }
    >
      <LawyerConsultationsContent />
    </Suspense>
  );
}
