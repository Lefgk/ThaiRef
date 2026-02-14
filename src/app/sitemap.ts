import type { MetadataRoute } from "next";
import { tours } from "@/data/tours";
import { locales } from "@/i18n/config";

const BASE_URL = "https://phuket-tours.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homePages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${BASE_URL}/${l}`])
      ),
    },
  }));

  const tourPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    tours.map((tour) => ({
      url: `${BASE_URL}/${locale}/tours/${tour.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE_URL}/${l}/tours/${tour.id}`])
        ),
      },
    }))
  );

  return [...homePages, ...tourPages];
}
