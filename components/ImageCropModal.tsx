"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Check } from "lucide-react";
import { Area, ImageCropModalProps } from "@/types";

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const outputSize = 800;
  canvas.width = outputSize;
  canvas.height = outputSize;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      "image/jpeg",
      0.95
    );
  });
}

export default function ImageCropModal({
  image,
  onComplete,
  onCancel,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleValidate = async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      if (croppedImage) {
        onComplete(croppedImage);
      }
    } catch (error) {
      console.error("Erreur crop:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-3xl rounded-[28px] max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">
        {/* Header iOS-style */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-gray-200/60">
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
            Ajuster la photo
          </h3>
          <button
            onClick={onCancel}
            className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150"
          >
            <X className="w-5 h-5 text-gray-500" strokeWidth={2.5} />
          </button>
        </div>

        {/* Zone de crop iOS */}
        <div className="p-5">
          <div className="relative h-80 rounded-[20px] overflow-hidden bg-gray-100 shadow-inner">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        </div>

        {/* Contrôles iOS */}
        <div className="px-5 pb-5 space-y-5">
          {/* Slider iOS-style */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium text-gray-600">Zoom</span>
              <span className="text-sm font-semibold text-teal-600 tabular-nums">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-6
                [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.15),0_0_0_0.5px_rgba(0,0,0,0.1)]
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:transition-all
                [&::-webkit-slider-thumb]:active:scale-110"
            />
          </div>

          {/* Boutons iOS */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="cursor-pointer flex-1 h-[50px] rounded-[14px] bg-gray-100 text-gray-900 font-semibold text-[17px] hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150"
            >
              Annuler
            </button>
            <button
              onClick={handleValidate}
              disabled={!croppedAreaPixels}
              className="cursor-pointer flex-1 h-[50px] rounded-[14px] bg-teal-500 text-white font-semibold text-[17px] hover:bg-teal-600 active:bg-teal-700 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" strokeWidth={2.5} />
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
