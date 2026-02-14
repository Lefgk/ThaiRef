import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { locales, Locale } from "@/i18n/config";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "IslandTrip.co | Phuket Tours & Island Trips - Save Up to 50%",
    ru: "IslandTrip.co | Туры на Пхукете и острова — Скидки до 50%",
    zh: "IslandTrip.co | 普吉岛旅游与海岛之旅 - 最高优惠50%",
    th: "IslandTrip.co | ทัวร์ภูเก็ตและทริปเกาะ - ประหยัดสูงสุด 50%",
  };

  const descriptions: Record<string, string> = {
    en: "Book Phuket's best tours at direct operator prices. Phi Phi Islands, James Bond Island, Similan Islands, and 50+ curated experiences. Free hotel pickup, instant confirmation, best price guarantee.",
    ru: "Бронируйте лучшие туры на Пхукете по ценам операторов. Острова Пхи-Пхи, Остров Джеймса Бонда, Симиланы и 50+ экскурсий.",
    zh: "以运营商直接价格预订普吉岛最佳旅游。皮皮岛、詹姆士·邦德岛、斯米兰群岛以及50+精选体验。",
    th: "จองทัวร์ที่ดีที่สุดในภูเก็ตในราคาตรงจากผู้ประกอบการ เกาะพีพี เกาะเจมส์บอนด์ หมู่เกาะสิมิลันและทัวร์คัดสรรกว่า 50+",
  };

  const localeMap: Record<string, string> = {
    en: "en_US",
    ru: "ru_RU",
    zh: "zh_CN",
    th: "th_TH",
  };

  return {
    metadataBase: new URL("https://phuket-tours.vercel.app"),
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    keywords:
      "Phuket tours, Phi Phi Island tour, James Bond Island, Similan Islands, Phuket day trips, Thailand island tours, Phuket boat tours, Phuket excursions",
    alternates: {
      canonical: `https://phuket-tours.vercel.app/${locale}`,
      languages: {
        en: "https://phuket-tours.vercel.app/en",
        ru: "https://phuket-tours.vercel.app/ru",
        zh: "https://phuket-tours.vercel.app/zh",
        th: "https://phuket-tours.vercel.app/th",
      },
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      type: "website",
      locale: localeMap[locale] || "en_US",
      siteName: "IslandTrip.co",
      url: `https://phuket-tours.vercel.app/${locale}`,
      images: [
        {
          url: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&h=630&q=80",
          width: 1200,
          height: 630,
          alt: "Phuket Tours - Beautiful tropical islands in southern Thailand",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      images: [
        "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&h=630&q=80",
      ],
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Phuket Tours",
  url: "https://phuket-tours.vercel.app",
  description:
    "Book the best tours in southern Thailand. Phi Phi Islands, James Bond Island, Similan Islands, and 50+ curated experiences with free hotel pickup and best price guarantee.",
  areaServed: "Southern Thailand",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <head>
        <meta name="theme-color" content="#07070e" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-white`}
      >
        <GoogleAnalytics />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent-cyan focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>
        <NextIntlClientProvider messages={messages}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
