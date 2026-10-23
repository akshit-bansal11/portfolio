/*
 * DemoModal.tsx
 * Modal that plays a project's demo video, on a native <dialog> opened with showModal():
 * the browser supplies the top layer, background inertness, Escape and focus return to the
 * trigger. Mounted only while open, so the video loads on demand.
 */

"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface DemoModalProps {
  videoUrl: string;
  title: string;
  onClose: () => void;
}

// Renders the dialog; every close path (Escape, Close button, backdrop) ends in the native close event.
export default function DemoModal({ videoUrl, title, onClose }: DemoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const downOnBackdrop = useRef(false);

  useEffect(() => {
    // Open as modal and lock body scroll (a native dialog does not lock it).
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label={`${title} demo video`}
      onClose={onClose}
      onPointerDown={(e) => {
        downOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        // Close only when the press and the release both landed on the backdrop
        // (a drag that starts in the video and ends outside must not close).
        if (downOnBackdrop.current && e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="m-auto max-h-none w-[calc(100%-2rem)] max-w-4xl overflow-visible bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Close video"
        >
          <X aria-hidden className="h-6 w-6" />
        </button>
        <video
          src={videoUrl}
          className="aspect-video max-h-[calc(100dvh-6rem)] w-full rounded-xl bg-black shadow-2xl"
          controls
          autoPlay
          muted
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          title={title}
        >
          <track kind="captions" />
        </video>
      </div>
    </dialog>
  );
}
