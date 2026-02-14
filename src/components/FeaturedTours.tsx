"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { tours, categories } from "@/data/tours";
import TourCard from "./TourCard";

type SortOption = "popular" | "price-low" | "price-high" | "rating";
type DurationFilter = "all" | "half" | "full" | "multi";

export default function FeaturedTours() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [durationFilter, setDurationFilter] = useState<DurationFilter>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const t = useTranslations("home.featured");
  const tc = useTranslations("home.categories");
  const tf = useTranslations("home.filters");

  const filteredAndSorted = useMemo(() => {
    let result = activeCategory === "all"
      ? [...tours]
      : tours.filter((tour) => tour.category === activeCategory);

    // Price filter
    result = result.filter(
      (tour) => tour.price >= priceRange[0] && tour.price <= priceRange[1]
    );

    // Duration filter
    if (durationFilter !== "all") {
      result = result.filter((tour) => {
        const d = tour.duration.toLowerCase();
        switch (durationFilter) {
          case "half":
            return d.includes("half") || d.includes("hour") && !d.includes("full") && !d.includes("day");
          case "full":
            return d.includes("full day") || (d.includes("hour") && parseInt(d) >= 6);
          case "multi":
            return d.includes("night") || d.includes("days");
          default:
            return true;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case "popular":
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [activeCategory, sortBy, durationFilter, priceRange]);

  const maxPrice = Math.max(...tours.map((t) => t.price));

  return (
    <section id="tours" className="relative py-24">
      <div className="orb-3 top-0 right-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-accent-cyan uppercase tracking-wider">
            {t("sectionLabel")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
            {t("title")}
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                activeCategory === cat.id
                  ? "bg-gradient-accent text-white font-medium"
                  : "text-gray-400 bg-surface border border-border hover:border-accent-cyan/30 hover:text-white"
              }`}
            >
              {tc(cat.id)}
              <span className="ml-1.5 text-xs opacity-60">{cat.count}</span>
            </button>
          ))}
        </div>

        {/* Advanced filters row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-gray-500">
              {tf("sortBy")}
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1.5 text-sm text-gray-300 bg-surface border border-border rounded-lg focus:border-accent-cyan/50 focus:outline-none"
            >
              <option value="popular">{tf("mostPopular")}</option>
              <option value="price-low">{tf("priceLowHigh")}</option>
              <option value="price-high">{tf("priceHighLow")}</option>
              <option value="rating">{tf("topRated")}</option>
            </select>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2">
            <label htmlFor="duration-select" className="text-xs text-gray-500">
              {tf("duration")}
            </label>
            <select
              id="duration-select"
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value as DurationFilter)}
              className="px-3 py-1.5 text-sm text-gray-300 bg-surface border border-border rounded-lg focus:border-accent-cyan/50 focus:outline-none"
            >
              <option value="all">{tf("anyDuration")}</option>
              <option value="half">{tf("halfDay")}</option>
              <option value="full">{tf("fullDay")}</option>
              <option value="multi">{tf("multiDay")}</option>
            </select>
          </div>

          {/* Price range */}
          <div className="flex items-center gap-2">
            <label htmlFor="price-range" className="text-xs text-gray-500">
              {tf("maxPrice")}
            </label>
            <input
              id="price-range"
              type="range"
              min={0}
              max={maxPrice}
              step={500}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-24 accent-cyan-500"
            />
            <span className="text-xs text-gray-400 min-w-[70px]">
              {priceRange[1] >= maxPrice
                ? tf("any")
                : `≤${priceRange[1].toLocaleString()}`}
            </span>
          </div>

          {/* Results count */}
          <span className="text-xs text-gray-500">
            {tf("showing", { count: filteredAndSorted.length.toString() })}
          </span>
        </div>

        {/* Tour grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSorted.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">{tf("noResults")}</p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setDurationFilter("all");
                setPriceRange([0, maxPrice]);
                setSortBy("popular");
              }}
              className="mt-4 px-5 py-2 text-sm text-accent-cyan border border-accent-cyan/30 rounded-full hover:bg-accent-cyan/10 transition-colors"
            >
              {tf("clearFilters")}
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm mb-4">
            {t("customTourText")}
          </p>
          <a
            href="mailto:hello@islandtrip.co"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-300 glass rounded-full hover:text-white hover:bg-white/10 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            {t("customTourCta")}
          </a>
        </div>
      </div>
    </section>
  );
}
