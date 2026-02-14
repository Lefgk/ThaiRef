import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: {
      ...(await import(`../messages/${locale}/common.json`)).default,
      ...(await import(`../messages/${locale}/home.json`)).default,
      ...(await import(`../messages/${locale}/tours.json`)).default,
      ...(await import(`../messages/${locale}/testimonials.json`)).default,
      ...(await import(`../messages/${locale}/faq.json`)).default,
      ...(await import(`../messages/${locale}/chat.json`)).default,
    },
  };
});
