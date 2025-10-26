"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  User,
  AlertCircle,
  Mail,
  MapPin,
} from "lucide-react";
import { Message, Consultation } from "@/types";
import { gsap } from "gsap";

const capitalizeWords = (text: string) => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function LawyerConsultationsPage() {
  const supabase = createClient();
  const { user, profile } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "answered">("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      router.push("/auth/lawyer/login");
      return;
    }

    if (profile?.user_type !== "lawyer") {
      router.push("/");
      return;
    }

    loadConsultations();
  }, [user, profile]);

  useEffect(() => {
    if (selectedConsultation) {
      loadMessages(selectedConsultation.id);
    }
  }, [selectedConsultation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!containerRef.current || loading) return;

    const timeline = gsap.timeline();

    timeline
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
        ".filter-buttons",
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
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

  // [Le reste du code continue avec les mêmes useEffect pour real-time, typing, etc...]

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

          supabase
            .from("users")
            .select("first_name, last_name")
            .eq("id", newMsg.sender_id)
            .single()
            .then(({ data }) => {
              setMessages((prev) => [
                ...prev,
                {
                  ...newMsg,
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

  useEffect(() => {
    if (!selectedConsultation || !user) return;

    const markAsRead = async () => {
      const { data: unreadMessages } = await supabase
        .from("consultation_messages")
        .select("id")
        .eq("consultation_id", selectedConsultation.id)
        .eq("is_read", false)
        .neq("sender_id", user.id);

      if (unreadMessages && unreadMessages.length > 0) {
        const messageIds = unreadMessages.map((m) => m.id);

        await supabase
          .from("consultation_messages")
          .update({ is_read: true })
          .in("id", messageIds);

        await loadMessages(selectedConsultation.id);
      }
    };

    markAsRead();
  }, [selectedConsultation, user, supabase]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConsultations = async () => {
    if (!user) return;
    setError("");

    try {
      const { data: consultationsData, error: consultationsError } =
        await supabase
          .from("consultations")
          .select(
            `
          *,
          client:users!consultations_client_id_fkey(
            id,
            first_name,
            last_name,
            email,
            location
          )
        `
          )
          .eq("lawyer_id", user.id)
          .order("created_at", { ascending: false });

      if (consultationsError) throw consultationsError;

      const formattedData = (consultationsData?.map((item) => ({
        id: item.id,
        status: item.status as "pending" | "answered" | "closed",
        created_at: item.created_at,
        client_id: item.client_id,
        lawyer_id: item.lawyer_id,
        question: item.question,
        response: item.response,
        answered_at: item.answered_at,
        client: {
          first_name: item.client?.first_name || "",
          last_name: item.client?.last_name || "",
          email: item.client?.email || "",
          location: item.client?.location || "",
        },
      })) || []) as Consultation[];

      setConsultations(formattedData);
    } catch (error) {
      console.error("Erreur chargement consultations:", error);
      setError("Erreur lors du chargement des consultations.");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (consultationId: string) => {
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from("consultation_messages")
        .select("*")
        .eq("consultation_id", consultationId)
        .order("created_at", { ascending: true });

      if (messagesError) {
        console.error("Erreur chargement messages:", messagesError);
        throw messagesError;
      }

      if (!messagesData || messagesData.length === 0) {
        setMessages([]);
        return;
      }

      const senderIds = [...new Set(messagesData.map((m) => m.sender_id))];

      const { data: sendersData, error: sendersError } = await supabase
        .from("users")
        .select("id, first_name, last_name")
        .in("id", senderIds);

      if (sendersError) {
        console.error("Erreur chargement senders:", sendersError);
      }

      const enrichedMessages: Message[] = messagesData.map((msg) => {
        const sender = sendersData?.find((s) => s.id === msg.sender_id);
        return {
          ...msg,
          sender: {
            first_name: sender?.first_name || "Utilisateur",
            last_name: sender?.last_name || "Inconnu",
          },
        };
      });

      setMessages(enrichedMessages);
    } catch (error) {
      console.error("Erreur chargement messages:", error);
      setMessages([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Le fichier ne doit pas dépasser 10MB");
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError(
          "Type de fichier non autorisé (JPEG, PNG, GIF, PDF uniquement)"
        );
        return;
      }

      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${selectedConsultation!.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("consultation-attachments")
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("consultation-attachments")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || isSending) return;

    setIsSending(true);
    setError("");

    try {
      let attachmentUrl = null;
      let attachmentType = null;
      let attachmentName = null;

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
            message: newMessage.trim() || "(Fichier joint)",
            attachment_url: attachmentUrl,
            attachment_type: attachmentType,
            attachment_name: attachmentName,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Erreur lors de l'envoi");
      }

      await loadMessages(selectedConsultation!.id);
      setNewMessage("");
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Erreur envoi message:", error);
      setError(error.message || "Erreur lors de l'envoi du message.");
    } finally {
      setIsSending(false);
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredConsultations = consultations.filter((c) => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  const pendingCount = consultations.filter(
    (c) => c.status === "pending"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-50 via-white to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-50 via-white to-teal-50">
      <style>{`
        .page-header,
        .page-subtitle,
        .filter-buttons,
        .consultations-list,
        .chat-container {
          opacity: 0;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-8" ref={containerRef}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-header text-3xl font-bold text-slate-900 mb-2">
            Mes consultations
          </h1>
          <p className="page-subtitle text-slate-600">
            Gérez les questions de vos clients et apportez vos réponses
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Erreur</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="filter-buttons flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "all"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-200 hover:border-teal-300 hover:bg-teal-50"
            }`}
          >
            Toutes ({consultations.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              filter === "pending"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-200 hover:border-teal-300 hover:bg-teal-50"
            }`}
          >
            <Clock className="w-4 h-4" />
            En attente ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("answered")}
            className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "answered"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-200 hover:border-teal-300 hover:bg-teal-50"
            }`}
          >
            Répondues (
            {consultations.filter((c) => c.status === "answered").length})
          </button>
        </div>

        {filteredConsultations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Aucune consultation{" "}
              {filter !== "all" && filter === "pending"
                ? "en attente"
                : "répondue"}
            </h3>
            <p className="text-slate-600">
              {filter === "pending"
                ? "Toutes vos consultations ont été traitées"
                : "Vous n'avez pas encore reçu de consultation"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Liste */}
            <div className="consultations-list space-y-4">
              {filteredConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  onClick={() => setSelectedConsultation(consultation)}
                  className={`cursor-pointer bg-white rounded-xl p-5 border-2 transition-all hover:shadow-lg ${
                    selectedConsultation?.id === consultation.id
                      ? "border-teal-500 shadow-lg"
                      : "border-slate-200 hover:border-teal-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {consultation.client.first_name}{" "}
                          {consultation.client.last_name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {capitalizeWords(consultation.client.location)}
                        </p>
                      </div>
                    </div>
                    {consultation.status === "pending" ? (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Nouveau
                      </span>
                    ) : (
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                    )}
                  </div>

                  <p className="text-xs text-slate-500">
                    {formatDate(consultation.created_at)}
                  </p>
                </div>
              ))}
            </div>

            {/* Chat */}
            <div className="chat-container lg:sticky lg:top-24 lg:self-start">
              {selectedConsultation ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
                  {/* Header */}
                  <div className="p-6 bg-gradient-to-r from-teal-50 to-white border-b border-slate-200">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-2">
                          {selectedConsultation.client.first_name}{" "}
                          {selectedConsultation.client.last_name}
                        </h3>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-600 flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            {selectedConsultation.client.email}
                          </p>
                          <p className="text-sm text-slate-600 flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            {capitalizeWords(
                              selectedConsultation.client.location
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_type === "lawyer"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] ${
                            message.sender_type === "lawyer"
                              ? "bg-teal-600 text-white"
                              : "bg-slate-100 text-slate-900"
                          } rounded-lg p-4`}
                        >
                          {/* Message texte */}
                          {message.message && (
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                              {message.message}
                            </p>
                          )}

                          {/* Pièce jointe */}
                          {message.attachment_url && (
                            <div className="mt-2">
                              {message.attachment_type?.startsWith("image/") ? (
                                <img
                                  src={message.attachment_url}
                                  alt={message.attachment_name || "Image"}
                                  className="max-w-full rounded-lg cursor-pointer"
                                  onClick={() =>
                                    window.open(
                                      message.attachment_url!,
                                      "_blank"
                                    )
                                  }
                                />
                              ) : (
                                <a
                                  href={message.attachment_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 bg-white/10 rounded p-2 hover:bg-white/20 transition-colors"
                                >
                                  <span>📄</span>
                                  <span className="text-sm underline">
                                    {message.attachment_name || "Fichier joint"}
                                  </span>
                                </a>
                              )}
                            </div>
                          )}

                          {/* Timestamp + Checkmark */}
                          <div className="flex items-center gap-2 justify-end mt-3 pt-2 border-t border-white/10">
                            <p
                              className={`text-xs ${
                                message.sender_type === "lawyer"
                                  ? "text-teal-100"
                                  : "text-slate-500"
                              }`}
                            >
                              {formatTime(message.created_at)}
                            </p>
                            {message.sender_type === "lawyer" && (
                              <span className="text-teal-100">
                                {message.is_read ? (
                                  <CheckCircle className="w-3 h-3" />
                                ) : (
                                  <Clock className="w-3 h-3" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {otherUserTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 rounded-lg p-4 max-w-[75%]">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <span
                                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              ></span>
                              <span
                                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              ></span>
                              <span
                                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              ></span>
                            </div>
                            <span className="text-xs text-slate-500">
                              Le client est en train d'écrire...
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-slate-200">
                    {selectedFile && (
                      <div className="mb-3 bg-slate-50 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-teal-100 rounded flex items-center justify-center">
                            {selectedFile.type.startsWith("image/") ? (
                              <span className="text-sm">🖼️</span>
                            ) : (
                              <span className="text-sm">📄</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="text-red-500 hover:text-red-700"
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
                        className="cursor-pointer px-3 border-2 border-slate-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all"
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

                            const channel = supabase.channel(
                              `typing-${selectedConsultation.id}`
                            );

                            channel.subscribe((status) => {
                              if (status === "SUBSCRIBED") {
                                channel.send({
                                  type: "broadcast",
                                  event: "typing",
                                  payload: { userId: user?.id },
                                });
                              }
                            });
                          }

                          if (typingTimeoutRef.current) {
                            clearTimeout(typingTimeoutRef.current);
                          }

                          typingTimeoutRef.current = setTimeout(() => {
                            setIsTyping(false);
                          }, 1000);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Écrivez votre message..."
                        className="w-full h-16 px-4 py-3 text-sm border border-slate-300 rounded-lg bg-white focus:border-2 hover:border-2 hover:border-teal-300 focus:border-teal-300 outline-none transition-all duration-200 text-slate-700"
                        rows={2}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={
                          (!newMessage.trim() && !selectedFile) ||
                          isSending ||
                          uploading
                        }
                        className="cursor-pointer px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isSending || uploading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-xl p-12 text-center border-2 border-dashed border-slate-300">
                  <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">
                    Sélectionnez une consultation pour démarrer la conversation
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { createClient } from "@/lib/supabase/client";
// import { useAuth } from "@/hooks/useAuth";
// import {
//   MessageSquare,
//   Send,
//   Clock,
//   CheckCircle,
//   User,
//   AlertCircle,
//   Mail,
//   MapPin,
// } from "lucide-react";
// import { Message, Consultation } from "@/types";
// import { gsap } from "gsap";

// const capitalizeWords = (text: string) => {
//   if (!text) return "";
//   return text
//     .split(" ")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//     .join(" ");
// };

// export default function LawyerConsultationsPage() {
//   const supabase = createClient();
//   const { user, profile } = useAuth();
//   const router = useRouter();
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [consultations, setConsultations] = useState<Consultation[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>("");
//   const [selectedConsultation, setSelectedConsultation] =
//     useState<Consultation | null>(null);
//   const [newMessage, setNewMessage] = useState("");
//   const [isSending, setIsSending] = useState(false);
//   const [filter, setFilter] = useState<"all" | "pending" | "answered">("all");
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const [isTyping, setIsTyping] = useState(false);
//   const [otherUserTyping, setOtherUserTyping] = useState(false);
//   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

//   useEffect(() => {
//     if (!user) {
//       router.push("/auth/lawyer/login");
//       return;
//     }

//     if (profile?.user_type !== "lawyer") {
//       router.push("/");
//       return;
//     }

//     loadConsultations();
//   }, [user, profile]);

//   useEffect(() => {
//     if (selectedConsultation) {
//       loadMessages(selectedConsultation.id);
//     }
//   }, [selectedConsultation]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     if (!containerRef.current || loading) return;

//     const timeline = gsap.timeline();

//     timeline
//       .fromTo(
//         ".page-header",
//         { opacity: 0, y: -30 },
//         { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
//       )
//       .fromTo(
//         ".page-subtitle",
//         { opacity: 0, y: -20 },
//         { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
//         "-=0.4"
//       )
//       .fromTo(
//         ".filter-buttons",
//         { opacity: 0, y: -15 },
//         { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
//         "-=0.3"
//       )
//       .fromTo(
//         ".consultations-list",
//         { opacity: 0, x: -20 },
//         { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
//         "-=0.3"
//       )
//       .fromTo(
//         ".chat-container",
//         { opacity: 0, x: 20 },
//         { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
//         "-=0.4"
//       );
//   }, [loading]);

//   useEffect(() => {
//     if (!selectedConsultation) return;

//     const channel = supabase
//       .channel(`consultation-${selectedConsultation.id}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "consultation_messages",
//           filter: `consultation_id=eq.${selectedConsultation.id}`,
//         },
//         (payload) => {
//           const newMsg = payload.new as Message;

//           supabase
//             .from("users")
//             .select("first_name, last_name")
//             .eq("id", newMsg.sender_id)
//             .single()
//             .then(({ data }) => {
//               setMessages((prev) => [
//                 ...prev,
//                 {
//                   ...newMsg,
//                   sender: {
//                     first_name: data?.first_name || "",
//                     last_name: data?.last_name || "",
//                   },
//                 },
//               ]);
//             });

//           // Mettre à jour les compteurs
//           loadUnreadCounts();
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [selectedConsultation, supabase]);

//   useEffect(() => {
//     if (!selectedConsultation || !user) return;

//     const channel = supabase.channel(`typing-${selectedConsultation.id}`);

//     channel
//       .on("broadcast", { event: "typing" }, (payload) => {
//         if (payload.payload.userId !== user.id) {
//           setOtherUserTyping(true);
//           setTimeout(() => setOtherUserTyping(false), 3000);
//         }
//       })
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [selectedConsultation, user, supabase]);

//   useEffect(() => {
//     if (!selectedConsultation || !user) return;

//     const markAsRead = async () => {
//       const { data: unreadMessages } = await supabase
//         .from("consultation_messages")
//         .select("id")
//         .eq("consultation_id", selectedConsultation.id)
//         .eq("is_read", false)
//         .neq("sender_id", user.id);

//       if (unreadMessages && unreadMessages.length > 0) {
//         const messageIds = unreadMessages.map((m) => m.id);

//         await supabase
//           .from("consultation_messages")
//           .update({ is_read: true })
//           .in("id", messageIds);

//         await loadMessages(selectedConsultation.id);
//         await loadUnreadCounts();
//       }
//     };

//     markAsRead();
//   }, [selectedConsultation, user, supabase]);

//   // ✅ REAL-TIME : Recharger les compteurs
//   useEffect(() => {
//     if (!user || consultations.length === 0) return;

//     const unreadChannel = supabase
//       .channel("lawyer-unread-counts")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "consultation_messages",
//         },
//         () => {
//           loadUnreadCounts();
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(unreadChannel);
//     };
//   }, [user, consultations]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const loadConsultations = async () => {
//     if (!user) return;
//     setError("");

//     try {
//       const { data: consultationsData, error: consultationsError } =
//         await supabase
//           .from("consultations")
//           .select(
//             `
//           *,
//           client:users!consultations_client_id_fkey(
//             id,
//             first_name,
//             last_name,
//             email,
//             location
//           )
//         `
//           )
//           .eq("lawyer_id", user.id)
//           .order("created_at", { ascending: false });

//       if (consultationsError) throw consultationsError;

//       const formattedData = (consultationsData?.map((item) => ({
//         id: item.id,
//         status: item.status as "pending" | "answered" | "closed",
//         created_at: item.created_at,
//         client_id: item.client_id,
//         lawyer_id: item.lawyer_id,
//         question: item.question,
//         response: item.response,
//         answered_at: item.answered_at,
//         client: {
//           first_name: item.client?.first_name || "",
//           last_name: item.client?.last_name || "",
//           email: item.client?.email || "",
//           location: item.client?.location || "",
//         },
//       })) || []) as Consultation[];

//       setConsultations(formattedData);

//       // Charger les compteurs de messages non lus
//       if (formattedData.length > 0) {
//         await loadUnreadCounts();
//       }
//     } catch (error) {
//       console.error("Erreur chargement consultations:", error);
//       setError("Erreur lors du chargement des consultations.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadUnreadCounts = async () => {
//     if (!user || consultations.length === 0) return;

//     try {
//       const consultationIds = consultations.map((c) => c.id);

//       const { data: unreadData } = await supabase
//         .from("consultation_messages")
//         .select("consultation_id, id")
//         .in("consultation_id", consultationIds)
//         .eq("is_read", false)
//         .neq("sender_id", user.id);

//       const counts: Record<string, number> = {};
//       unreadData?.forEach((msg) => {
//         counts[msg.consultation_id] = (counts[msg.consultation_id] || 0) + 1;
//       });

//       setUnreadCounts(counts);
//     } catch (error) {
//       console.error("Erreur chargement messages non lus:", error);
//     }
//   };

//   const loadMessages = async (consultationId: string) => {
//     try {
//       const { data: messagesData, error: messagesError } = await supabase
//         .from("consultation_messages")
//         .select("*")
//         .eq("consultation_id", consultationId)
//         .order("created_at", { ascending: true });

//       if (messagesError) {
//         console.error("Erreur chargement messages:", messagesError);
//         throw messagesError;
//       }

//       if (!messagesData || messagesData.length === 0) {
//         setMessages([]);
//         return;
//       }

//       const senderIds = [...new Set(messagesData.map((m) => m.sender_id))];

//       const { data: sendersData, error: sendersError } = await supabase
//         .from("users")
//         .select("id, first_name, last_name")
//         .in("id", senderIds);

//       if (sendersError) {
//         console.error("Erreur chargement senders:", sendersError);
//       }

//       const enrichedMessages: Message[] = messagesData.map((msg) => {
//         const sender = sendersData?.find((s) => s.id === msg.sender_id);
//         return {
//           ...msg,
//           sender: {
//             first_name: sender?.first_name || "Utilisateur",
//             last_name: sender?.last_name || "Inconnu",
//           },
//         };
//       });

//       setMessages(enrichedMessages);
//     } catch (error) {
//       console.error("Erreur chargement messages:", error);
//       setMessages([]);
//     }
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 10 * 1024 * 1024) {
//         setError("Le fichier ne doit pas dépasser 10MB");
//         return;
//       }

//       const allowedTypes = [
//         "image/jpeg",
//         "image/png",
//         "image/gif",
//         "application/pdf",
//       ];
//       if (!allowedTypes.includes(file.type)) {
//         setError(
//           "Type de fichier non autorisé (JPEG, PNG, GIF, PDF uniquement)"
//         );
//         return;
//       }

//       setSelectedFile(file);
//     }
//   };

//   const uploadFile = async (file: File): Promise<string> => {
//     const fileExt = file.name.split(".").pop();
//     const fileName = `${selectedConsultation!.id}/${Date.now()}.${fileExt}`;

//     const { data, error } = await supabase.storage
//       .from("consultation-attachments")
//       .upload(fileName, file);

//     if (error) throw error;

//     const { data: urlData } = supabase.storage
//       .from("consultation-attachments")
//       .getPublicUrl(fileName);

//     return urlData.publicUrl;
//   };

//   const handleSendMessage = async () => {
//     if ((!newMessage.trim() && !selectedFile) || isSending) return;

//     setIsSending(true);
//     setError("");

//     try {
//       let attachmentUrl = null;
//       let attachmentType = null;
//       let attachmentName = null;

//       if (selectedFile) {
//         setUploading(true);
//         attachmentUrl = await uploadFile(selectedFile);
//         attachmentType = selectedFile.type;
//         attachmentName = selectedFile.name;
//         setUploading(false);
//       }

//       const res = await fetch(
//         `/api/consultations/${selectedConsultation!.id}/messages`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             message: newMessage.trim() || "(Fichier joint)",
//             attachment_url: attachmentUrl,
//             attachment_type: attachmentType,
//             attachment_name: attachmentName,
//           }),
//         }
//       );

//       const result = await res.json();

//       if (!res.ok) {
//         throw new Error(result.error || "Erreur lors de l'envoi");
//       }

//       await loadMessages(selectedConsultation!.id);
//       setNewMessage("");
//       setSelectedFile(null);
//     } catch (error: any) {
//       console.error("Erreur envoi message:", error);
//       setError(error.message || "Erreur lors de l'envoi du message.");
//     } finally {
//       setIsSending(false);
//       setUploading(false);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("fr-FR", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString("fr-FR", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const filteredConsultations = consultations.filter((c) => {
//     if (filter === "all") return true;
//     return c.status === filter;
//   });

//   const pendingCount = Object.keys(unreadCounts).filter(
//     (id) => unreadCounts[id] > 0
//   ).length;

//   if (loading) {
//     return (
//       <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-50 via-white to-teal-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-50 via-white to-teal-50">
//       <style>{`
//         .page-header,
//         .page-subtitle,
//         .filter-buttons,
//         .consultations-list,
//         .chat-container {
//           opacity: 0;
//         }
//       `}</style>

//       <div className="max-w-7xl mx-auto px-4 py-8" ref={containerRef}>
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="page-header text-3xl font-bold text-slate-900 mb-2">
//             Mes consultations
//           </h1>
//           <p className="page-subtitle text-slate-600">
//             Gérez les questions de vos clients et apportez vos réponses
//           </p>
//         </div>

//         {/* Message d'erreur */}
//         {error && (
//           <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 flex items-start gap-3">
//             <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//             <div className="flex-1">
//               <p className="text-red-800 font-medium">Erreur</p>
//               <p className="text-red-700 text-sm">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Filtres */}
//         <div className="filter-buttons flex flex-wrap gap-3 mb-6">
//           <button
//             onClick={() => setFilter("all")}
//             className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === "all"
//                 ? "bg-teal-600 text-white shadow-md"
//                 : "bg-white text-slate-700 border border-slate-200 hover:border-teal-300 hover:bg-teal-50"
//             }`}
//           >
//             Toutes ({consultations.length})
//           </button>
//           <button
//             onClick={() => setFilter("pending")}
//             className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
//               filter === "pending"
//                 ? "bg-teal-600 text-white shadow-md"
//                 : "bg-white text-slate-700 border border-slate-200 hover:border-teal-300 hover:bg-teal-50"
//             }`}
//           >
//             <MessageSquare className="w-4 h-4" />
//             Nouveaux messages ({pendingCount})
//           </button>
//           <button
//             onClick={() => setFilter("answered")}
//             className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === "answered"
//                 ? "bg-teal-600 text-white shadow-md"
//                 : "bg-white text-slate-700 border border-slate-200 hover:border-teal-300 hover:bg-teal-50"
//             }`}
//           >
//             Répondues (
//             {consultations.filter((c) => c.status === "answered").length})
//           </button>
//         </div>

//         {filteredConsultations.length === 0 ? (
//           <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
//             <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-slate-800 mb-2">
//               Aucune consultation{" "}
//               {filter !== "all" && filter === "pending"
//                 ? "avec nouveaux messages"
//                 : "répondue"}
//             </h3>
//             <p className="text-slate-600">
//               {filter === "pending"
//                 ? "Toutes vos consultations ont été traitées"
//                 : "Vous n'avez pas encore reçu de consultation"}
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Liste */}
//             <div className="consultations-list space-y-4">
//               {filteredConsultations.map((consultation) => (
//                 <div
//                   key={consultation.id}
//                   onClick={() => setSelectedConsultation(consultation)}
//                   className={`cursor-pointer bg-white rounded-xl p-5 border-2 transition-all hover:shadow-lg ${
//                     selectedConsultation?.id === consultation.id
//                       ? "border-teal-500 shadow-lg"
//                       : "border-slate-200 hover:border-teal-300"
//                   }`}
//                 >
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
//                         <User className="w-5 h-5 text-teal-600" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-slate-900">
//                           {consultation.client.first_name}{" "}
//                           {consultation.client.last_name}
//                         </h3>
//                         <p className="text-xs text-slate-500">
//                           {capitalizeWords(consultation.client.location)}
//                         </p>
//                       </div>
//                     </div>
//                     {unreadCounts[consultation.id] > 0 ? (
//                       <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
//                         <MessageSquare className="w-3 h-3" />
//                         {unreadCounts[consultation.id]}
//                       </span>
//                     ) : consultation.status === "answered" ? (
//                       <CheckCircle className="w-5 h-5 text-teal-600" />
//                     ) : (
//                       <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1">
//                         <Clock className="w-3 h-3" />
//                         En attente
//                       </span>
//                     )}
//                   </div>

//                   <p className="text-xs text-slate-500">
//                     {formatDate(consultation.created_at)}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             {/* Chat */}
//             <div className="chat-container lg:sticky lg:top-24 lg:self-start">
//               {selectedConsultation ? (
//                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
//                   {/* Header */}
//                   <div className="p-6 bg-gradient-to-r from-teal-50 to-white border-b border-slate-200">
//                     <div className="flex items-start gap-3">
//                       <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <User className="w-6 h-6 text-white" />
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-slate-900 mb-2">
//                           {selectedConsultation.client.first_name}{" "}
//                           {selectedConsultation.client.last_name}
//                         </h3>
//                         <div className="space-y-1">
//                           <p className="text-sm text-slate-600 flex items-center gap-2">
//                             <Mail className="w-3 h-3" />
//                             {selectedConsultation.client.email}
//                           </p>
//                           <p className="text-sm text-slate-600 flex items-center gap-2">
//                             <MapPin className="w-3 h-3" />
//                             {capitalizeWords(
//                               selectedConsultation.client.location
//                             )}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Messages */}
//                   <div className="flex-1 overflow-y-auto p-6 space-y-4">
//                     {messages.map((message) => (
//                       <div
//                         key={message.id}
//                         className={`flex ${
//                           message.sender_type === "lawyer"
//                             ? "justify-end"
//                             : "justify-start"
//                         }`}
//                       >
//                         <div
//                           className={`max-w-[75%] ${
//                             message.sender_type === "lawyer"
//                               ? "bg-teal-600 text-white"
//                               : "bg-slate-100 text-slate-900"
//                           } rounded-lg p-4`}
//                         >
//                           {message.message && (
//                             <p className="text-sm whitespace-pre-wrap leading-relaxed">
//                               {message.message}
//                             </p>
//                           )}

//                           {message.attachment_url && (
//                             <div className="mt-2">
//                               {message.attachment_type?.startsWith("image/") ? (
//                                 <img
//                                   src={message.attachment_url}
//                                   alt={message.attachment_name || "Image"}
//                                   className="max-w-full rounded-lg cursor-pointer"
//                                   onClick={() =>
//                                     window.open(
//                                       message.attachment_url!,
//                                       "_blank"
//                                     )
//                                   }
//                                 />
//                               ) : (
//                                 <a
//                                   href={message.attachment_url}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="flex items-center gap-2 bg-white/10 rounded p-2 hover:bg-white/20 transition-colors"
//                                 >
//                                   <span>📄</span>
//                                   <span className="text-sm underline">
//                                     {message.attachment_name || "Fichier joint"}
//                                   </span>
//                                 </a>
//                               )}
//                             </div>
//                           )}

//                           <div className="flex items-center gap-2 justify-end mt-3 pt-2 border-t border-white/10">
//                             <p
//                               className={`text-xs ${
//                                 message.sender_type === "lawyer"
//                                   ? "text-teal-100"
//                                   : "text-slate-500"
//                               }`}
//                             >
//                               {formatTime(message.created_at)}
//                             </p>
//                             {message.sender_type === "lawyer" && (
//                               <span className="text-teal-100">
//                                 {message.is_read ? (
//                                   <CheckCircle className="w-3 h-3" />
//                                 ) : (
//                                   <Clock className="w-3 h-3" />
//                                 )}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}

//                     {otherUserTyping && (
//                       <div className="flex justify-start">
//                         <div className="bg-slate-100 rounded-lg p-4 max-w-[75%]">
//                           <div className="flex items-center gap-2">
//                             <div className="flex gap-1">
//                               <span
//                                 className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
//                                 style={{ animationDelay: "0ms" }}
//                               ></span>
//                               <span
//                                 className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
//                                 style={{ animationDelay: "150ms" }}
//                               ></span>
//                               <span
//                                 className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
//                                 style={{ animationDelay: "300ms" }}
//                               ></span>
//                             </div>
//                             <span className="text-xs text-slate-500">
//                               Le client est en train d'écrire...
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                     <div ref={messagesEndRef} />
//                   </div>

//                   {/* Input */}
//                   <div className="p-4 border-t border-slate-200">
//                     {selectedFile && (
//                       <div className="mb-3 bg-slate-50 rounded-lg p-3 flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <div className="w-8 h-8 bg-teal-100 rounded flex items-center justify-center">
//                             {selectedFile.type.startsWith("image/") ? (
//                               <span className="text-sm">🖼️</span>
//                             ) : (
//                               <span className="text-sm">📄</span>
//                             )}
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium text-slate-900">
//                               {selectedFile.name}
//                             </p>
//                             <p className="text-xs text-slate-500">
//                               {(selectedFile.size / 1024).toFixed(2)} KB
//                             </p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => setSelectedFile(null)}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     )}

//                     <div className="flex gap-2">
//                       <input
//                         ref={fileInputRef}
//                         type="file"
//                         accept="image/*,.pdf"
//                         onChange={handleFileSelect}
//                         className="hidden"
//                       />
//                       <button
//                         onClick={() => fileInputRef.current?.click()}
//                         className="cursor-pointer px-3 border-2 border-slate-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all"
//                         disabled={isSending || uploading}
//                       >
//                         📎
//                       </button>

//                       <textarea
//                         value={newMessage}
//                         onChange={(e) => {
//                           setNewMessage(e.target.value);

//                           if (!isTyping && selectedConsultation) {
//                             setIsTyping(true);

//                             const channel = supabase.channel(
//                               `typing-${selectedConsultation.id}`
//                             );

//                             channel.subscribe((status) => {
//                               if (status === "SUBSCRIBED") {
//                                 channel.send({
//                                   type: "broadcast",
//                                   event: "typing",
//                                   payload: { userId: user?.id },
//                                 });
//                               }
//                             });
//                           }

//                           if (typingTimeoutRef.current) {
//                             clearTimeout(typingTimeoutRef.current);
//                           }

//                           typingTimeoutRef.current = setTimeout(() => {
//                             setIsTyping(false);
//                           }, 1000);
//                         }}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter" && !e.shiftKey) {
//                             e.preventDefault();
//                             handleSendMessage();
//                           }
//                         }}
//                         placeholder="Écrivez votre message..."
//                         className="w-full h-16 px-4 py-3 text-sm border border-slate-300 rounded-lg bg-white focus:border-2 hover:border-2 hover:border-teal-300 focus:border-teal-300 outline-none transition-all duration-200 text-slate-700"
//                         rows={2}
//                       />
//                       <button
//                         onClick={handleSendMessage}
//                         disabled={
//                           (!newMessage.trim() && !selectedFile) ||
//                           isSending ||
//                           uploading
//                         }
//                         className="cursor-pointer px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                       >
//                         {isSending || uploading ? (
//                           <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
//                         ) : (
//                           <Send className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-slate-50 rounded-xl p-12 text-center border-2 border-dashed border-slate-300">
//                   <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
//                   <p className="text-slate-500 font-medium">
//                     Sélectionnez une consultation pour démarrer la conversation
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
