// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { createClient } from "@/lib/supabase/client";
// import { useAuth } from "@/hooks/useAuth";
// import { Message, ClientConsultation } from "@/types";
// import {
//   MessageSquare,
//   Send,
//   CheckCircle,
//   Calendar,
//   AlertCircle,
//   User,
//   ArrowLeft,
//   Video,
// } from "lucide-react";
// import { gsap } from "gsap";
// import { JoinCallButton } from "@/components/consultation/JoinCallButton";

// export default function MesConsultationsPage() {
//   const supabase = createClient();
//   const { user, profile } = useAuth();
//   const router = useRouter();
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [consultations, setConsultations] = useState<ClientConsultation[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>("");
//   const [selectedConsultation, setSelectedConsultation] =
//     useState<ClientConsultation | null>(null);
//   const [showChat, setShowChat] = useState(false);
//   const [newMessage, setNewMessage] = useState("");
//   const [isSending, setIsSending] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const [isTyping, setIsTyping] = useState(false);
//   const [otherUserTyping, setOtherUserTyping] = useState(false);
//   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (!user) {
//       router.push("/auth/client/login");
//       return;
//     }
//     if (profile?.user_type !== "client") {
//       router.push("/");
//       return;
//     }
//     loadConsultations();
//   }, [user, profile]);

//   useEffect(() => {
//     if (selectedConsultation) loadMessages(selectedConsultation.id);
//   }, [selectedConsultation]);
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     if (!containerRef.current || loading) return;
//     gsap
//       .timeline()
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
//     if (!user) return;
//     const channel = supabase
//       .channel("client-consultations-updates")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "consultation_messages" },
//         () => {
//           loadConsultations();
//           if (selectedConsultation) loadMessages(selectedConsultation.id);
//         }
//       )
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "consultations",
//           filter: `client_id=eq.${user.id}`,
//         },
//         () => loadConsultations()
//       )
//       .subscribe();
//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [user, selectedConsultation]);

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

//   const loadConsultations = async () => {
//     if (!user) return;
//     setError("");
//     try {
//       const { data, error: err } = await supabase
//         .from("consultations")
//         .select(
//           `*, lawyer:lawyers!consultations_lawyer_id_fkey(id, bar_number)`
//         )
//         .eq("client_id", user.id)
//         .order("created_at", { ascending: false });
//       if (err) throw err;

//       const lawyerIds = data?.map((c) => c.lawyer?.id).filter(Boolean) || [];
//       let lawyersData: any[] = [];
//       if (lawyerIds.length > 0) {
//         const { data: usersData } = await supabase
//           .from("users")
//           .select("id, first_name, last_name")
//           .in("id", lawyerIds)
//           .eq("user_type", "lawyer");
//         lawyersData = usersData || [];
//       }

//       const withUnread = await Promise.all(
//         (data || []).map(async (item) => {
//           const { count } = await supabase
//             .from("consultation_messages")
//             .select("*", { count: "exact", head: true })
//             .eq("consultation_id", item.id)
//             .eq("is_read", false)
//             .eq("sender_type", "lawyer");
//           const lawyerUser = lawyersData.find((l) => l.id === item.lawyer?.id);
//           return {
//             id: item.id,
//             status: item.status as "pending" | "answered" | "closed",
//             subject: item.subject || "",
//             created_at: item.created_at,
//             unread_count: count || 0,
//             lawyer: {
//               first_name: lawyerUser?.first_name || "Prénom",
//               last_name: lawyerUser?.last_name || "Nom",
//             },
//           };
//         })
//       );
//       setConsultations(withUnread);
//     } catch {
//       setError("Erreur lors du chargement des consultations.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadMessages = async (consultationId: string) => {
//     try {
//       const { data, error: err } = await supabase
//         .from("consultation_messages")
//         .select(
//           `*, sender:users!consultation_messages_sender_id_fkey(first_name, last_name)`
//         )
//         .eq("consultation_id", consultationId)
//         .order("created_at", { ascending: true });
//       if (err) throw err;
//       setMessages(data || []);
//     } catch {}
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (file.size > 10 * 1024 * 1024) {
//       setError("Le fichier ne doit pas dépasser 10MB");
//       return;
//     }
//     const allowed = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
//     if (!allowed.includes(file.type)) {
//       setError("Type de fichier non autorisé");
//       return;
//     }
//     setSelectedFile(file);
//   };

//   const uploadFile = async (file: File): Promise<string> => {
//     const fileExt = file.name.split(".").pop();
//     const fileName = `${selectedConsultation!.id}/${Date.now()}.${fileExt}`;
//     const { error } = await supabase.storage
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
//       let attachmentUrl = null,
//         attachmentType = null,
//         attachmentName = null;
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
//       if (!res.ok) throw new Error((await res.json()).error || "Erreur");
//       await loadMessages(selectedConsultation!.id);
//       setNewMessage("");
//       setSelectedFile(null);
//     } catch (error: any) {
//       setError(error.message || "Erreur lors de l'envoi.");
//     } finally {
//       setIsSending(false);
//       setUploading(false);
//     }
//   };

//   const markMessagesAsRead = async (consultationId: string) => {
//     if (!user) return;
//     const { data } = await supabase
//       .from("consultation_messages")
//       .select("id")
//       .eq("consultation_id", consultationId)
//       .eq("is_read", false)
//       .neq("sender_id", user.id);
//     if (data && data.length > 0) {
//       await supabase
//         .from("consultation_messages")
//         .update({ is_read: true })
//         .in(
//           "id",
//           data.map((m) => m.id)
//         );
//       await loadConsultations();
//     }
//   };

//   const handleSelectConsultation = async (consultation: ClientConsultation) => {
//     setSelectedConsultation(consultation);
//     setShowChat(true);
//     await markMessagesAsRead(consultation.id);
//   };

//   const isVideoConsultation = (subject?: string) => {
//     if (!subject) return false;
//     return (
//       subject.toLowerCase().includes("vidéo") ||
//       subject.toLowerCase().includes("video")
//     );
//   };

//   const formatDate = (d: string) =>
//     new Date(d).toLocaleDateString("fr-FR", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   const formatTime = (d: string) =>
//     new Date(d).toLocaleTimeString("fr-FR", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//   if (loading)
//     return (
//       <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
//         <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
//           <div className="h-8 bg-slate-200 rounded-xl animate-pulse w-48" />
//           {[...Array(3)].map((_, i) => (
//             <div
//               key={i}
//               className="h-24 bg-slate-200 rounded-xl animate-pulse"
//             />
//           ))}
//         </div>
//       </div>
//     );

//   const ChatPanel = () => (
//     <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
//       <div className="p-5 bg-gradient-to-r from-teal-50 to-white border-b border-slate-200">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setShowChat(false)}
//             className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
//           >
//             <ArrowLeft className="w-5 h-5 text-slate-600" />
//           </button>
//           <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
//             <User className="w-5 h-5 text-white" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-slate-900 truncate">
//               Me. {selectedConsultation!.lawyer.first_name}{" "}
//               {selectedConsultation!.lawyer.last_name}
//             </h3>
//             <p className="text-xs text-slate-500">
//               {formatDate(selectedConsultation!.created_at)}
//             </p>
//           </div>
//           {isVideoConsultation((selectedConsultation as any)?.subject) && (
//             <JoinCallButton
//               consultationId={selectedConsultation!.id}
//               canal="video_30"
//             />
//           )}
//           {selectedConsultation!.status === "answered" &&
//             (selectedConsultation!.unread_count ?? 0) === 0 && (
//               <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
//             )}
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-5 space-y-3">
//         {messages.length === 0 ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center">
//               <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
//               <p className="text-slate-500 font-medium">Aucun message</p>
//               <p className="text-slate-400 text-sm mt-1">
//                 Commencez la conversation
//               </p>
//             </div>
//           </div>
//         ) : (
//           <>
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${message.sender_type === "client" ? "justify-end" : "justify-start"}`}
//               >
//                 <div
//                   className={`max-w-[75%] rounded-xl p-3.5 ${message.sender_type === "client" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-900"}`}
//                 >
//                   {message.message && (
//                     <p className="text-sm whitespace-pre-wrap leading-relaxed">
//                       {message.message}
//                     </p>
//                   )}
//                   {message.attachment_url && (
//                     <div className="mt-2">
//                       {message.attachment_type?.startsWith("image/") ? (
//                         <img
//                           src={message.attachment_url}
//                           alt={message.attachment_name || "Image"}
//                           className="max-w-full rounded-lg cursor-pointer"
//                           onClick={() =>
//                             window.open(message.attachment_url!, "_blank")
//                           }
//                         />
//                       ) : (
//                         <a
//                           href={message.attachment_url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center gap-2 bg-white/10 rounded p-2 hover:bg-white/20 transition-colors"
//                         >
//                           <span>📄</span>
//                           <span className="text-sm underline">
//                             {message.attachment_name || "Fichier joint"}
//                           </span>
//                         </a>
//                       )}
//                     </div>
//                   )}
//                   <div className="flex items-center gap-1.5 justify-end mt-2 pt-1.5 border-t border-white/10">
//                     <p
//                       className={`text-xs ${message.sender_type === "client" ? "text-teal-100" : "text-slate-500"}`}
//                     >
//                       {formatTime(message.created_at)}
//                     </p>
//                     {message.sender_type === "client" && (
//                       <span className="text-teal-100">
//                         {message.is_read ? (
//                           <CheckCircle className="w-3 h-3" />
//                         ) : (
//                           <div className="w-3 h-3 rounded-full border-2 border-current" />
//                         )}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {otherUserTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-slate-100 rounded-xl p-3 flex items-center gap-2">
//                   <div className="flex gap-1">
//                     {[0, 150, 300].map((d) => (
//                       <span
//                         key={d}
//                         className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
//                         style={{ animationDelay: `${d}ms` }}
//                       />
//                     ))}
//                   </div>
//                   <span className="text-xs text-slate-500">
//                     L'avocat est en train d'écrire...
//                   </span>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </>
//         )}
//       </div>

//       <div className="p-4 border-t border-slate-200">
//         {selectedFile && (
//           <div className="mb-3 bg-slate-50 rounded-lg p-2.5 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <span>
//                 {selectedFile.type.startsWith("image/") ? "🖼️" : "📄"}
//               </span>
//               <div>
//                 <p className="text-xs font-medium text-slate-900">
//                   {selectedFile.name}
//                 </p>
//                 <p className="text-xs text-slate-500">
//                   {(selectedFile.size / 1024).toFixed(0)} KB
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setSelectedFile(null)}
//               className="text-red-500 hover:text-red-700 text-sm"
//             >
//               ✕
//             </button>
//           </div>
//         )}
//         <div className="flex gap-2">
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*,.pdf"
//             onChange={handleFileSelect}
//             className="hidden"
//           />
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             className="cursor-pointer px-3 border border-slate-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all"
//             disabled={isSending || uploading}
//           >
//             📎
//           </button>
//           <textarea
//             value={newMessage}
//             onChange={(e) => {
//               setNewMessage(e.target.value);
//               if (!isTyping && selectedConsultation) {
//                 setIsTyping(true);
//                 const ch = supabase.channel(
//                   `typing-${selectedConsultation.id}`
//                 );
//                 ch.subscribe((status) => {
//                   if (status === "SUBSCRIBED")
//                     ch.send({
//                       type: "broadcast",
//                       event: "typing",
//                       payload: { userId: user?.id },
//                     });
//                 });
//               }
//               if (typingTimeoutRef.current)
//                 clearTimeout(typingTimeoutRef.current);
//               typingTimeoutRef.current = setTimeout(
//                 () => setIsTyping(false),
//                 1000
//               );
//             }}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSendMessage();
//               }
//             }}
//             placeholder="Écrivez votre message..."
//             className="w-full h-14 px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:border-teal-300 outline-none transition-all text-slate-700 resize-none"
//             rows={2}
//           />
//           <button
//             onClick={handleSendMessage}
//             disabled={
//               (!newMessage.trim() && !selectedFile) || isSending || uploading
//             }
//             className="cursor-pointer px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-all"
//           >
//             {isSending || uploading ? (
//               <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
//             ) : (
//               <Send className="w-5 h-5" />
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
//       <style>{`.page-header, .page-subtitle, .consultations-list, .chat-container { opacity: 0; }`}</style>

//       <div className="max-w-6xl mx-auto px-4 py-8" ref={containerRef}>
//         <div className="mb-6">
//           <h1 className="page-header text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
//             Mes consultations
//           </h1>
//           <p className="page-subtitle text-slate-600 text-sm sm:text-base">
//             Suivez vos questions et les réponses de vos avocats
//           </p>
//         </div>

//         {error && (
//           <div className="mb-5 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 flex items-start gap-3">
//             <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//             <p className="text-red-700 text-sm">{error}</p>
//           </div>
//         )}

//         {consultations.length === 0 ? (
//           <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
//             <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-slate-800 mb-2">
//               Aucune consultation
//             </h3>
//             <p className="text-slate-600 mb-6">
//               Vous n'avez pas encore posé de question à un avocat
//             </p>
//             <button
//               onClick={() => router.push("/search")}
//               className="cursor-pointer bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors font-medium text-sm"
//             >
//               Trouver un avocat
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div
//               className={`consultations-list space-y-3 ${showChat ? "hidden lg:block" : "block"}`}
//             >
//               {consultations.map((consultation) => (
//                 <div
//                   key={consultation.id}
//                   onClick={() => handleSelectConsultation(consultation)}
//                   className={`cursor-pointer bg-white rounded-xl p-4 border-2 transition-all hover:shadow-md relative ${selectedConsultation?.id === consultation.id ? "border-teal-500 shadow-md" : "border-slate-200 hover:border-teal-300"}`}
//                 >
//                   {(consultation.unread_count ?? 0) > 0 && (
//                     <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
//                       {consultation.unread_count}
//                     </div>
//                   )}
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <User className="w-5 h-5 text-teal-600" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-slate-900 text-sm">
//                           Me. {consultation.lawyer.first_name}{" "}
//                           {consultation.lawyer.last_name}
//                         </h3>
//                         <div className="flex items-center gap-2 mt-0.5">
//                           <p className="text-xs text-slate-500 flex items-center gap-1">
//                             <Calendar className="w-3 h-3" />
//                             {formatDate(consultation.created_at)}
//                           </p>
//                           {isVideoConsultation(
//                             (consultation as any).subject
//                           ) && (
//                             <span className="inline-flex items-center gap-1 text-[10px] font-medium text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full border border-teal-100">
//                               <Video className="w-2.5 h-2.5" /> Vidéo
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     {consultation.status === "answered" &&
//                       (consultation.unread_count ?? 0) === 0 && (
//                         <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
//                       )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div
//               className={`chat-container lg:sticky lg:top-24 lg:self-start ${showChat ? "block" : "hidden lg:block"}`}
//             >
//               {selectedConsultation ? (
//                 <ChatPanel />
//               ) : (
//                 <div className="hidden lg:flex bg-slate-50 rounded-xl p-12 text-center border-2 border-dashed border-slate-300 flex-col items-center">
//                   <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
//                   <p className="text-slate-500 font-medium">
//                     Sélectionnez une consultation pour voir la conversation
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

"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Message, ClientConsultation } from "@/types";
import {
  MessageSquare,
  Send,
  CheckCircle,
  Calendar,
  AlertCircle,
  User,
  ArrowLeft,
  Video,
  Archive,
  Clock,
  Filter,
} from "lucide-react";
import { gsap } from "gsap";
import { JoinCallButton } from "@/components/consultation/JoinCallButton";

type TabFilter = "active" | "archived" | "all";

export default function MesConsultationsPage() {
  const supabase = createClient();
  const { user, profile } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [consultations, setConsultations] = useState<ClientConsultation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedConsultation, setSelectedConsultation] =
    useState<ClientConsultation | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [tabFilter, setTabFilter] = useState<TabFilter>("active");
  const [archiving, setArchiving] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      router.push("/auth/client/login");
      return;
    }
    if (profile?.user_type !== "client") {
      router.push("/");
      return;
    }
    loadConsultations();
  }, [user, profile]);

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
      .channel("client-consultations-updates")
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
          filter: `client_id=eq.${user.id}`,
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

  const loadConsultations = async () => {
    if (!user) return;
    setError("");
    try {
      const { data, error: err } = await supabase
        .from("consultations")
        .select(
          `*, lawyer:lawyers!consultations_lawyer_id_fkey(id, bar_number)`
        )
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });
      if (err) throw err;

      const lawyerIds = data?.map((c) => c.lawyer?.id).filter(Boolean) || [];
      let lawyersData: any[] = [];
      if (lawyerIds.length > 0) {
        const { data: usersData } = await supabase
          .from("users")
          .select("id, first_name, last_name")
          .in("id", lawyerIds)
          .eq("user_type", "lawyer");
        lawyersData = usersData || [];
      }

      const withUnread = await Promise.all(
        (data || []).map(async (item) => {
          const { count } = await supabase
            .from("consultation_messages")
            .select("*", { count: "exact", head: true })
            .eq("consultation_id", item.id)
            .eq("is_read", false)
            .eq("sender_type", "lawyer");
          const lawyerUser = lawyersData.find((l) => l.id === item.lawyer?.id);
          return {
            id: item.id,
            status: item.status as "pending" | "answered" | "closed",
            subject: item.subject || "",
            created_at: item.created_at,
            archived_at: item.archived_at || null,
            unread_count: count || 0,
            lawyer: {
              first_name: lawyerUser?.first_name || "Prénom",
              last_name: lawyerUser?.last_name || "Nom",
            },
          };
        })
      );
      setConsultations(withUnread);
    } catch {
      setError("Erreur lors du chargement des consultations.");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (consultationId: string) => {
    try {
      const { data, error: err } = await supabase
        .from("consultation_messages")
        .select(
          `*, sender:users!consultation_messages_sender_id_fkey(first_name, last_name)`
        )
        .eq("consultation_id", consultationId)
        .order("created_at", { ascending: true });
      if (err) throw err;
      setMessages(data || []);
    } catch {}
  };

  const handleArchive = async (
    consultationId: string,
    currentlyArchived: boolean
  ) => {
    setArchiving(consultationId);
    try {
      await supabase
        .from("consultations")
        .update({
          archived_at: currentlyArchived ? null : new Date().toISOString(),
        })
        .eq("id", consultationId);
      await loadConsultations();
      if (selectedConsultation?.id === consultationId && !currentlyArchived) {
        setSelectedConsultation(null);
        setShowChat(false);
      }
    } finally {
      setArchiving(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Le fichier ne doit pas dépasser 10MB");
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setError("Type de fichier non autorisé");
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
            message: newMessage.trim() || "(Fichier joint)",
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
      setError(error.message || "Erreur lors de l'envoi.");
    } finally {
      setIsSending(false);
      setUploading(false);
    }
  };

  const markMessagesAsRead = async (consultationId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from("consultation_messages")
      .select("id")
      .eq("consultation_id", consultationId)
      .eq("is_read", false)
      .neq("sender_id", user.id);
    if (data && data.length > 0) {
      await supabase
        .from("consultation_messages")
        .update({ is_read: true })
        .in(
          "id",
          data.map((m) => m.id)
        );
      await loadConsultations();
    }
  };

  const handleSelectConsultation = async (consultation: ClientConsultation) => {
    setSelectedConsultation(consultation);
    setShowChat(true);
    await markMessagesAsRead(consultation.id);
  };

  const isVideoConsultation = (subject?: string) =>
    subject?.toLowerCase().includes("vidéo") ||
    subject?.toLowerCase().includes("video");
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const filteredConsultations = consultations.filter((c) => {
    if (tabFilter === "active") return !c.archived_at;
    if (tabFilter === "archived") return !!c.archived_at;
    return true;
  });

  const activeCount = consultations.filter((c) => !c.archived_at).length;
  const archivedCount = consultations.filter((c) => !!c.archived_at).length;

  if (loading)
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
          <div className="h-8 bg-slate-200 rounded-xl animate-pulse w-48" />
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-slate-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );

  const ChatPanel = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
      <div className="p-5 bg-gradient-to-r from-teal-50 to-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowChat(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">
              Me. {selectedConsultation!.lawyer.first_name}{" "}
              {selectedConsultation!.lawyer.last_name}
            </h3>
            <p className="text-xs text-slate-500">
              {formatDate(selectedConsultation!.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isVideoConsultation((selectedConsultation as any)?.subject) && (
              <JoinCallButton
                consultationId={selectedConsultation!.id}
                canal="video_30"
              />
            )}
            <button
              onClick={() =>
                handleArchive(
                  selectedConsultation!.id,
                  !!(selectedConsultation as any).archived_at
                )
              }
              disabled={archiving === selectedConsultation!.id}
              className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
              title={
                (selectedConsultation as any).archived_at
                  ? "Désarchiver"
                  : "Archiver"
              }
            >
              <Archive className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Aucun message</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_type === "client" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-xl p-3.5 ${message.sender_type === "client" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-900"}`}
                >
                  {message.message && (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.message}
                    </p>
                  )}
                  {message.attachment_url && (
                    <div className="mt-2">
                      {message.attachment_type?.startsWith("image/") ? (
                        <img
                          src={message.attachment_url}
                          alt={message.attachment_name || "Image"}
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
                          className="flex items-center gap-2 bg-white/10 rounded p-2 hover:bg-white/20"
                        >
                          <span>📄</span>
                          <span className="text-sm underline">
                            {message.attachment_name || "Fichier joint"}
                          </span>
                        </a>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 justify-end mt-2 pt-1.5 border-t border-white/10">
                    <p
                      className={`text-xs ${message.sender_type === "client" ? "text-teal-100" : "text-slate-500"}`}
                    >
                      {formatTime(message.created_at)}
                    </p>
                    {message.sender_type === "client" && (
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
                <div className="bg-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">
                    L'avocat est en train d'écrire...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-slate-200">
        {selectedFile && (
          <div className="mb-3 bg-slate-50 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>
                {selectedFile.type.startsWith("image/") ? "🖼️" : "📄"}
              </span>
              <div>
                <p className="text-xs font-medium text-slate-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(selectedFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-red-500 hover:text-red-700 text-sm"
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
            className="cursor-pointer px-3 border border-slate-200 rounded-lg hover:border-teal-400 hover:bg-teal-50"
            disabled={isSending || uploading}
          >
            📎
          </button>
          <textarea
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              if (selectedConsultation) {
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
              typingTimeoutRef.current = setTimeout(() => {}, 1000);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Écrivez votre message..."
            className="w-full h-14 px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:border-teal-300 outline-none text-slate-700 resize-none"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={
              (!newMessage.trim() && !selectedFile) || isSending || uploading
            }
            className="cursor-pointer px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            {isSending || uploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`.page-header,.page-subtitle,.consultations-list,.chat-container{opacity:0;}`}</style>
      <div className="max-w-6xl mx-auto px-4 py-8" ref={containerRef}>
        <div className="mb-6">
          <h1 className="page-header text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
            Mes consultations
          </h1>
          <p className="page-subtitle text-slate-600 text-sm sm:text-base">
            Suivez vos questions et les réponses de vos avocats
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {consultations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Aucune consultation
            </h3>
            <p className="text-slate-600 mb-6">
              Vous n'avez pas encore posé de question à un avocat
            </p>
            <button
              onClick={() => router.push("/search")}
              className="cursor-pointer bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 font-medium text-sm"
            >
              Trouver un avocat
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-5">
              {[
                { key: "active", label: "En cours", count: activeCount },
                { key: "archived", label: "Archivées", count: archivedCount },
                { key: "all", label: "Toutes", count: consultations.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTabFilter(tab.key as TabFilter)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${tabFilter === tab.key ? "bg-teal-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  {tab.key === "archived" ? (
                    <Archive className="w-3.5 h-3.5" />
                  ) : tab.key === "active" ? (
                    <Clock className="w-3.5 h-3.5" />
                  ) : (
                    <Filter className="w-3.5 h-3.5" />
                  )}
                  {tab.label}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${tabFilter === tab.key ? "bg-white/20" : "bg-slate-100"}`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className={`consultations-list space-y-3 ${showChat ? "hidden lg:block" : "block"}`}
              >
                {filteredConsultations.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
                    <Archive className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">
                      {tabFilter === "archived"
                        ? "Aucune consultation archivée"
                        : "Aucune consultation en cours"}
                    </p>
                  </div>
                ) : (
                  filteredConsultations.map((consultation) => (
                    <div
                      key={consultation.id}
                      onClick={() => handleSelectConsultation(consultation)}
                      className={`cursor-pointer bg-white rounded-xl p-4 border-2 transition-all hover:shadow-md relative ${selectedConsultation?.id === consultation.id ? "border-teal-500 shadow-md" : "border-slate-200 hover:border-teal-300"} ${(consultation as any).archived_at ? "opacity-70" : ""}`}
                    >
                      {(consultation.unread_count ?? 0) > 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                          {consultation.unread_count}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-teal-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-900 text-sm truncate">
                              Me. {consultation.lawyer.first_name}{" "}
                              {consultation.lawyer.last_name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(consultation.created_at)}
                              </p>
                              {isVideoConsultation(
                                (consultation as any).subject
                              ) && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full border border-teal-100">
                                  <Video className="w-2.5 h-2.5" /> Vidéo
                                </span>
                              )}
                              {(consultation as any).archived_at && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                                  <Archive className="w-2.5 h-2.5" /> Archivée
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {consultation.status === "answered" &&
                            (consultation.unread_count ?? 0) === 0 && (
                              <CheckCircle className="w-5 h-5 text-teal-600" />
                            )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchive(
                                consultation.id,
                                !!(consultation as any).archived_at
                              );
                            }}
                            disabled={archiving === consultation.id}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            title={
                              (consultation as any).archived_at
                                ? "Désarchiver"
                                : "Archiver"
                            }
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
                  <ChatPanel />
                ) : (
                  <div className="hidden lg:flex bg-slate-50 rounded-xl p-12 text-center border-2 border-dashed border-slate-300 flex-col items-center">
                    <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-slate-500 font-medium">
                      Sélectionnez une consultation pour voir la conversation
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
