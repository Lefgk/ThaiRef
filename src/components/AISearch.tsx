"use client";

import { useChat } from "ai/react";
import { useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";

export default function AISearch() {
  const t = useTranslations("chat");
  const locale = useLocale();

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } =
    useChat({
      api: "/api/chat",
      body: { locale },
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestions = [
    t("suggestions.0"),
    t("suggestions.1"),
    t("suggestions.2"),
    t("suggestions.3"),
    t("suggestions.4"),
    t("suggestions.5"),
  ];

  const handleSuggestion = (suggestion: string) => {
    if (isLoading) return;
    setInput(suggestion);
    setTimeout(() => {
      const form = document.getElementById("ai-chat-form") as HTMLFormElement;
      form?.requestSubmit();
    }, 50);
  };

  return (
    <section className="relative py-16 -mt-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="rounded-2xl glass glow overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2a7 7 0 0 1 7 7c0 3-2 5.5-4 7.5L12 20l-3-3.5C7 14.5 5 12 5 9a7 7 0 0 1 7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{t("title")}</h3>
                <p className="text-sm text-gray-500">
                  {t("subtitle")}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                <span className="text-xs text-gray-500">{t("online")}</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="px-6 py-4 min-h-[120px] max-h-[400px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="space-y-4">
                {/* Welcome */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2a7 7 0 0 1 7 7c0 3-2 5.5-4 7.5L12 20l-3-3.5C7 14.5 5 12 5 9a7 7 0 0 1 7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                  </div>
                  <div className="bg-surface-light rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {t("welcomeMessage")}
                    </p>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="pl-10">
                  <p className="text-xs text-gray-600 mb-2">{t("tryAsking")}</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSuggestion(s)}
                        className="px-3 py-1.5 text-xs text-gray-400 bg-surface border border-border rounded-full hover:border-accent-cyan/30 hover:text-accent-cyan transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {m.role === "assistant" ? (
                      <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M12 2a7 7 0 0 1 7 7c0 3-2 5.5-4 7.5L12 20l-3-3.5C7 14.5 5 12 5 9a7 7 0 0 1 7-7z" />
                          <circle cx="12" cy="9" r="2.5" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-accent-purple/20 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                        m.role === "user"
                          ? "bg-accent-purple/15 border border-accent-purple/20 rounded-tr-sm"
                          : "bg-surface-light rounded-tl-sm"
                      }`}
                    >
                      <div
                        className="text-sm text-gray-300 leading-relaxed [&_strong]:text-accent-cyan [&_strong]:font-semibold"
                        dangerouslySetInnerHTML={{
                          __html: formatMessage(m.content),
                        }}
                      />
                    </div>
                  </div>
                ))}

                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 2a7 7 0 0 1 7 7c0 3-2 5.5-4 7.5L12 20l-3-3.5C7 14.5 5 12 5 9a7 7 0 0 1 7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                    </div>
                    <div className="bg-surface-light rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-6 pb-6 pt-2">
            <form id="ai-chat-form" onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder={t("placeholder")}
                className="flex-1 px-4 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent-cyan/50 transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-5 py-3 bg-gradient-accent rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
            <p className="text-[11px] text-gray-600 mt-2 text-center">
              {t("disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatMessage(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}
