"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function EmailCapture() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const t = useTranslations("common.emailCapture");

  useEffect(() => {
    // Don't show if already dismissed or submitted
    if (sessionStorage.getItem("emailCaptureDismissed")) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 30000); // Show after 30 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // In production, send to your email service (Mailchimp, Resend, etc.)
    setSubmitted(true);
    sessionStorage.setItem("emailCaptureDismissed", "true");
    setTimeout(() => setIsOpen(false), 3000);
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("emailCaptureDismissed", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-surface border border-border p-8 animate-fade-up">
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-gradient-accent flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
            <polyline points="12 3 12 15" />
            <polyline points="8 11 12 15 16 11" />
          </svg>
        </div>

        {submitted ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-white font-medium">{t("success")}</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-white text-center mb-2">
              {t("title")}
            </h3>
            <p className="text-sm text-gray-400 text-center mb-6">
              {t("subtitle")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder")}
                className="w-full px-4 py-3 text-sm text-white bg-background border border-border rounded-xl focus:border-accent-cyan/50 focus:outline-none placeholder:text-gray-600"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-accent rounded-xl hover:opacity-90 transition-opacity"
              >
                {t("cta")}
              </button>
            </form>

            <p className="text-xs text-gray-600 text-center mt-3">
              {t("noSpam")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
