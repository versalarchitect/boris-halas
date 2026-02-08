"use client";

import { useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  XIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
} from "react-share";
import Image from "next/image";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareDialog({ isOpen, onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const title = "Boris Halas Photography";
  const description = "Boris Halas Photography";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 z-[80] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="mb-4 text-lg font-semibold">Share</h2>

        {/* Preview Card */}
        <div className="mb-6 overflow-hidden rounded-lg border border-border">
          <div className="relative aspect-[1200/630] w-full bg-muted">
            <Image
              src="/og-image.jpg"
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-3">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* Copy Link */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">Copy link</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Social Platforms */}
        <div>
          <label className="mb-3 block text-sm font-medium">Share directly</label>
          <div className="flex flex-wrap justify-center gap-3">
            <FacebookShareButton url={url} hashtag="#photography">
              <div className="flex flex-col items-center gap-1">
                <FacebookIcon size={44} round />
                <span className="text-xs text-muted-foreground">Facebook</span>
              </div>
            </FacebookShareButton>

            <TwitterShareButton url={url} title={title}>
              <div className="flex flex-col items-center gap-1">
                <XIcon size={44} round />
                <span className="text-xs text-muted-foreground">X</span>
              </div>
            </TwitterShareButton>

            <LinkedinShareButton url={url} title={title} summary={description}>
              <div className="flex flex-col items-center gap-1">
                <LinkedinIcon size={44} round />
                <span className="text-xs text-muted-foreground">LinkedIn</span>
              </div>
            </LinkedinShareButton>

            <WhatsappShareButton url={url} title={title}>
              <div className="flex flex-col items-center gap-1">
                <WhatsappIcon size={44} round />
                <span className="text-xs text-muted-foreground">WhatsApp</span>
              </div>
            </WhatsappShareButton>

            <TelegramShareButton url={url} title={title}>
              <div className="flex flex-col items-center gap-1">
                <TelegramIcon size={44} round />
                <span className="text-xs text-muted-foreground">Telegram</span>
              </div>
            </TelegramShareButton>

            <EmailShareButton url={url} subject={title} body={description}>
              <div className="flex flex-col items-center gap-1">
                <EmailIcon size={44} round />
                <span className="text-xs text-muted-foreground">Email</span>
              </div>
            </EmailShareButton>
          </div>
        </div>
      </div>
    </>
  );
}
