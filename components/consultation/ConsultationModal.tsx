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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl transform animate-slideUp overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Consultation juridique
                </h3>
                <p className="text-sm text-teal-50">{lawyerName}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="cursor-pointer text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <CheckCircle className="w-10 h-10 text-teal-600" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">
                Question envoyée avec succès
              </h4>
              <p className="text-slate-600 text-center max-w-md">
                {lawyerName} a reçu votre question et vous répondra
                prochainement.
              </p>
              <p className="text-sm text-slate-500 mt-4">
                Consultez vos demandes dans "Mes consultations"
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3 animate-shake">
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
                  className="w-full px-4 py-3 text-slate-900 border-2 border-slate-200 rounded-xl focus:border-slate-300 outline-none transition-all resize-none hover:border-slate-300"
                  rows={10}
                  placeholder="Exemple : Je souhaite créer une SARL et j'ai besoin de conseils sur les démarches administratives et les statuts à prévoir. Mon associé et moi avons des apports différents..."
                  required
                  disabled={isSubmitting}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-500">
                    Soyez le plus précis possible pour obtenir une réponse
                    adaptée
                  </p>
                  <p
                    className={`text-xs font-medium transition-colors ${
                      characterCount > maxCharacters
                        ? "text-red-600"
                        : characterCount > 0
                          ? "text-teal-600"
                          : "text-slate-400"
                    }`}
                  >
                    {characterCount} / {maxCharacters} caractères
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="cursor-pointer flex-1 border-2 border-slate-200 text-slate-600 py-3 px-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="cursor-pointer flex-1 bg-teal-600 text-white py-3 px-4 rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Envoyer ma question</span>
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
