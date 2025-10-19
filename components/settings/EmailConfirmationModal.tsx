"use client";

import { CheckCircle } from "lucide-react";
import { EmailConfirmationModalProps } from "@/types";

export default function EmailConfirmationModal({
  isOpen,
  onClose,
  email,
}: EmailConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform animate-slideUp">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Email de confirmation envoyé !
          </h3>

          <p className="text-slate-600 text-sm mb-4">
            Un email a été envoyé à :
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-4">
            <p className="text-blue-800 font-medium text-sm">{email}</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left w-full">
            <p className="text-amber-800 text-sm mb-2 font-medium">
              📧 Étapes suivantes :
            </p>
            <ol className="text-amber-700 text-xs space-y-1 list-decimal list-inside">
              <li>Ouvrez votre boîte mail</li>
              <li>Cliquez sur le lien de confirmation</li>
              <li>Votre email sera modifié après confirmation</li>
            </ol>
            <p className="text-amber-600 text-xs mt-2 italic">
              Pensez à vérifier vos spams si vous ne recevez rien.
            </p>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
}
