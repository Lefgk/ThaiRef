export const locales = ["en", "ru", "zh", "th"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
