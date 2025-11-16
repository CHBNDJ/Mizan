"use client";

import { useState } from "react";
import {
  X,
  Send,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ConsultationModalProps } from "@/types";

export default function ConsultationModal({
  isOpen,
  onClose,
  lawyerId,
  lawyerName,
  onSuccess,
}: ConsultationModalProps) {
  const supabase = createClient();
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Vous devez être connecté pour poser une question");
      return;
    }

    if (!question.trim()) {
      setError("Veuillez poser une question");
      return;
    }

    if (question.trim().length > 3000) {
      setError("Votre question est trop longue (maximum 3000 caractères)");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/consultations/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: user.id,
          lawyer_id: lawyerId,
          question: question.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Erreur lors de l'envoi");
      }

      setSuccess(true);
      setQuestion("");

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2500);
    } catch (err: any) {
      console.error("Erreur envoi consultation:", err);
      setError("Erreur lors de l'envoi de la question");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setQuestion("");
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  const characterCount = question.length;
  const maxCharacters = 3000;
  const isValid = characterCount > 0 && characterCount <= maxCharacters;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-[20px] max-w-[680px] w-full shadow-2xl animate-in slide-in-from-bottom-4 duration-300 overflow-hidden">
        <div className="bg-teal-500 px-6 sm:px-8 py-6 relative">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute top-5 right-5 w-8 h-8 bg-white/15 hover:bg-white/25 rounded-lg flex items-center justify-center text-white transition-all disabled:opacity-50 cursor-pointer"
          >
            <X className="w-[18px] h-[18px]" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                Consultation juridique
              </h2>
              <p className="text-[15px] text-white/90">{lawyerName}</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {success ? (
            <div className="text-center py-12">
              <div className="w-[72px] h-[72px] bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-5 animate-in zoom-in duration-400">
                <CheckCircle className="w-9 h-9 text-teal-600" />
              </div>
              <h3 className="text-[22px] font-semibold text-slate-900 mb-3">
                Question envoyée avec succès
              </h3>
              <p className="text-[15px] text-slate-600 leading-relaxed max-w-[420px] mx-auto mb-4">
                {lawyerName} a reçu votre question et vous répondra
                prochainement.
              </p>
              <p className="text-[13px] text-slate-400">
                Consultez vos demandes dans "Mes consultations"
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border-l-[3px] border-red-500 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Décrivez votre situation juridique
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg bg-white focus:border-2 hover:border-2 hover:border-teal-300 focus:border-teal-300 outline-none transition-all duration-200 text-slate-700 resize-none min-h-[180px]"
                  placeholder="Exemple : Je souhaite créer une SARL et j'ai besoin de conseils sur les démarches administratives et les statuts à prévoir. Mon associé et moi avons des apports différents..."
                  required
                  disabled={isSubmitting}
                />
                <div className="flex items-center justify-end mt-2">
                  <span
                    className={`text-[13px] font-medium transition-colors ${
                      characterCount > maxCharacters
                        ? "text-red-600"
                        : characterCount > 0
                          ? "text-teal-600"
                          : "text-slate-400"
                    }`}
                  >
                    {characterCount} / {maxCharacters} caractères
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="cursor-pointer flex-1 bg-slate-100 text-slate-700 py-3.5 px-5 rounded-xl hover:bg-slate-200 transition-all font-semibold text-[15px] disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="cursor-pointer flex-1 bg-teal-500 text-white py-3.5 px-5 rounded-xl hover:shadow-[0_6px_16px_rgba(13,148,136,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none font-semibold text-[15px] transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Envoyer ma question</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
