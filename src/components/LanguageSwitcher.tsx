"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { locales, Locale } from "@/i18n/config";

const localeFlags: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  zh: "ZH",
  th: "TH",
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common.languageSwitcher");

  const handleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
        <span className="font-medium">{localeFlags[locale]}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="absolute right-0 top-full mt-1 py-1 w-36 rounded-xl bg-surface border border-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {locales.map((l) => (
          <button
            key={l}
            onClick={() => handleChange(l)}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              l === locale
                ? "text-accent-cyan bg-accent-cyan/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="font-medium mr-2">{localeFlags[l]}</span>
            {t(l)}
          </button>
        ))}
      </div>
    </div>
  );
}
