// Google Analytics 4 utilities
// Replace G-XXXXXXXXXX with your actual GA4 Measurement ID

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

// Pre-built events for common actions
export const analytics = {
  tourCardClick: (tourId: string, tourTitle: string) =>
    trackEvent("tour_card_click", { tour_id: tourId, tour_title: tourTitle }),

  bookNowClick: (tourId: string, price: number) =>
    trackEvent("book_now_click", { tour_id: tourId, price }),

  categoryFilter: (category: string) =>
    trackEvent("category_filter", { category }),

  chatOpen: () => trackEvent("chat_open"),

  chatMessage: () => trackEvent("chat_message_sent"),

  languageSwitch: (locale: string) =>
    trackEvent("language_switch", { locale }),
};
