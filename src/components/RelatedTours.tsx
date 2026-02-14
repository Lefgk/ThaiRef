"use client";

import { useTranslations } from "next-intl";
import { tours } from "@/data/tours";
import TourCard from "./TourCard";

interface RelatedToursProps {
  currentTourId: string;
  category: string;
}

export default function RelatedTours({ currentTourId, category }: RelatedToursProps) {
  const t = useTranslations("common.relatedTours");

  const related = tours
    .filter((tour) => tour.id !== currentTourId && tour.category === category)
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 3);

  // If not enough tours in same category, fill with popular tours from other categories
  if (related.length < 3) {
    const needed = 3 - related.length;
    const ids = new Set([currentTourId, ...related.map((t) => t.id)]);
    const extras = tours
      .filter((tour) => !ids.has(tour.id))
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, needed);
    related.push(...extras);
  }

  if (related.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-white mb-2">{t("title")}</h2>
      <p className="text-gray-400 text-sm mb-8">{t("subtitle")}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
  );
}
