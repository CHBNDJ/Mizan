"use client";

import { Phone, Smartphone, MessageCircle, X } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyerName: string;
  phoneNumber?: string;
  mobileNumber?: string;
}

export function ContactModal({
  isOpen,
  onClose,
  lawyerName,
  phoneNumber,
  mobileNumber,
}: ContactModalProps) {
  if (!isOpen) return null;

  const cleanMobile = mobileNumber?.replace(/[\s\-\(\)]/g, "");

  const handleCallPhone = () => {
    if (phoneNumber) {
      const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, "");
      window.location.href = `tel:${cleanPhone}`;
      onClose();
    }
  };

  const handleCallMobile = () => {
    if (mobileNumber) {
      window.location.href = `tel:${cleanMobile}`;
      onClose();
    }
  };

  const handleWhatsApp = () => {
    if (cleanMobile) {
      window.open(`https://wa.me/${cleanMobile}`, "_blank");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-teal-500 px-6 py-5 relative rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold text-white">
            Contacter {lawyerName}
          </h2>
          <p className="text-white/90 text-sm mt-1">
            Choisissez votre mode de contact
          </p>
        </div>

        <div className="p-6 space-y-3">
          {phoneNumber && (
            <button
              onClick={handleCallPhone}
              className="cursor-pointer w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group border-2 border-transparent hover:border-teal-300"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                <Phone className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-slate-900">Appeler le fixe</p>
                <p className="text-sm text-slate-600">{phoneNumber}</p>
              </div>
            </button>
          )}

          {mobileNumber && (
            <button
              onClick={handleCallMobile}
              className="cursor-pointer w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group border-2 border-transparent hover:border-teal-300"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                <Smartphone className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-slate-900">
                  Appeler le mobile
                </p>
                <p className="text-sm text-slate-600">{mobileNumber}</p>
              </div>
            </button>
          )}

          {mobileNumber && (
            <button
              onClick={handleWhatsApp}
              className="cursor-pointer w-full flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all group border-2 border-transparent hover:border-green-400"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-slate-900">
                  Appeler sur WhatsApp
                </p>
                <p className="text-sm text-slate-600">Gratuit via internet</p>
              </div>
            </button>
          )}
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="cursor-pointer w-full py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
