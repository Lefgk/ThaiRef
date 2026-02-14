import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { tours, getTourBySlug, Tour } from "@/data/tours";
import { locales } from "@/i18n/config";
import { Link } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGallery from "@/components/PhotoGallery";
import RelatedTours from "@/components/RelatedTours";

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    tours.map((tour) => ({ locale, slug: tour.id }))
  );
}

// ---------------------------------------------------------------------------
// Dynamic metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return {};

  const t = await getTranslations({ locale, namespace: "tours" });

  const tourTitle = t(`items.${tour.id}.title`);
  const tourSubtitle = t(`items.${tour.id}.subtitle`);
  const tourDescription = t(`items.${tour.id}.description`);

  const title = `${tourTitle} - ${tourSubtitle} | IslandTrip.co`;
  const description = `${tourDescription} From ${tour.price.toLocaleString()} ${tour.currency}. Duration: ${t(`items.${tour.id}.duration`)}. Rated ${tour.rating}/5 by ${tour.reviewCount.toLocaleString()} travelers.`;

  const localeMap: Record<string, string> = {
    en: "en_US",
    ru: "ru_RU",
    zh: "zh_CN",
    th: "th_TH",
  };

  return {
    title,
    description,
    keywords: `${tourTitle}, ${tourSubtitle}, ${tour.location} tour, ${tour.category} tour, Thailand tour, book ${tourTitle}`,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [
          l,
          `https://phuket-tours.vercel.app/${l}/tours/${slug}`,
        ])
      ),
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: localeMap[locale] || "en_US",
      siteName: "IslandTrip.co",
      images: [
        {
          url: tour.image,
          width: 800,
          height: 600,
          alt: `${tourTitle} - ${tourSubtitle}`,
        },
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD schema markup
// ---------------------------------------------------------------------------

function generateJsonLd(
  tour: Tour,
  faqs: { question: string; answer: string }[],
  locale: string,
  tourTitle: string,
  tourSubtitle: string,
  tourDescription: string
) {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${tourTitle} - ${tourSubtitle}`,
    description: tourDescription,
    image: tour.image,
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: tour.currency,
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString().split("T")[0],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tour.rating,
      reviewCount: tour.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://phuket-tours.vercel.app/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tours",
        item: `https://phuket-tours.vercel.app/${locale}#tours`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tourTitle,
        item: `https://phuket-tours.vercel.app/${locale}/tours/${tour.id}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return { productSchema, breadcrumbSchema, faqSchema };
}

// ---------------------------------------------------------------------------
// Star rating component
// ---------------------------------------------------------------------------

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={star <= Math.floor(rating) ? "#f59e0b" : "none"}
          stroke="#f59e0b"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function TourPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tour = getTourBySlug(slug);
  if (!tour) {
    notFound();
  }

  const t = await getTranslations("tours");

  const tourTitle = t(`items.${tour.id}.title`);
  const tourSubtitle = t(`items.${tour.id}.subtitle`);
  const tourDescription = t(`items.${tour.id}.description`);
  const tourDuration = t(`items.${tour.id}.duration`);
  const tourBadge = tour.badge ? t(`items.${tour.id}.badge`) : null;
  const tourHighlights: string[] = tour.highlights.map((_, i) =>
    t(`items.${tour.id}.highlights.${i}`)
  );
  const tourIncludes: string[] = tour.includes.map((_, i) =>
    t(`items.${tour.id}.includes.${i}`)
  );

  const discount = Math.round(
    ((tour.originalPrice - tour.price) / tour.originalPrice) * 100
  );

  // Generate localized FAQs
  const faqs: { question: string; answer: string }[] = [];

  faqs.push({
    question: t("detail.faqIncluded", { tourTitle }),
    answer: t("detail.faqIncludedAnswer", {
      tourTitle,
      includes: tourIncludes.join(", "),
      duration: tourDuration,
    }),
  });

  if (tour.pickupIncluded) {
    faqs.push({
      question: t("detail.faqPickupYes", { tourTitle }),
      answer: t("detail.faqPickupYesAnswer", {
        location: tour.location || "the area",
      }),
    });
  } else {
    faqs.push({
      question: t("detail.faqPickupNo", { tourTitle }),
      answer: t("detail.faqPickupNoAnswer", {
        location: tour.location || "the area",
      }),
    });
  }

  faqs.push({
    question: t("detail.faqPricing", { tourTitle }),
    answer: t("detail.faqPricingAnswer", {
      tourTitle,
      price: tour.price.toLocaleString(),
      originalPrice: tour.originalPrice.toLocaleString(),
      currency: tour.currency,
    }),
  });

  if (tour.category === "islands" || tour.category === "diving") {
    faqs.push({
      question: t("detail.faqSwimming", { tourTitle }),
      answer: t("detail.faqSwimmingAnswer"),
    });
  } else if (tour.category === "activities") {
    faqs.push({
      question: t("detail.faqBeginners", { tourTitle }),
      answer: t("detail.faqBeginnersAnswer", { tourTitle }),
    });
  } else if (tour.category === "nature") {
    faqs.push({
      question: t("detail.faqBring", { tourTitle }),
      answer: t("detail.faqBringAnswer"),
    });
  } else {
    faqs.push({
      question: t("detail.faqChildren", { tourTitle }),
      answer: t("detail.faqChildrenAnswer"),
    });
  }

  const { productSchema, breadcrumbSchema, faqSchema } = generateJsonLd(
    tour,
    faqs,
    locale,
    tourTitle,
    tourSubtitle,
    tourDescription
  );

  const bookingUrl = tour.bookingUrl;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />

      <main id="main-content" className="min-h-screen pt-20 sm:pt-24 pb-16">
        <div className="orb-1 -top-40 -left-40" />
        <div className="orb-2 top-1/3 -right-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link
              href="/"
              className="hover:text-accent-cyan transition-colors"
            >
              {t("detail.home")}
            </Link>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <Link
              href="/#tours"
              className="hover:text-accent-cyan transition-colors"
            >
              {t("detail.toursLabel")}
            </Link>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="text-gray-400">{tourTitle}</span>
          </nav>

          {/* Hero section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden border border-border aspect-[4/3]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${tour.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent" />

              {tourBadge && (
                <div className="absolute top-4 left-4 px-4 py-1.5 text-sm font-semibold rounded-full bg-gradient-accent text-white">
                  {tourBadge}
                </div>
              )}

              <div className="absolute top-4 right-4 px-3 py-1.5 text-sm font-bold rounded-full bg-red-500/90 text-white">
                -{discount}%
              </div>

              {tour.location && (
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-sm text-gray-300">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {tour.location}
                </div>
              )}
            </div>
            {tour.images && tour.images.length > 0 && (
              <PhotoGallery
                images={tour.images}
                mainImage={tour.image}
                alt={`${tourTitle} - ${tourSubtitle}`}
              />
            )}

            {/* Details */}
            <div className="flex flex-col">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {tourTitle}
              </h1>
              <p className="text-lg text-accent-cyan mt-2">{tourSubtitle}</p>

              <div className="flex items-center gap-3 mt-4">
                <StarRating rating={tour.rating} />
                <span className="text-base text-gray-400">
                  {tour.rating} ({t("detail.reviews", { count: tour.reviewCount.toLocaleString() })})
                </span>
              </div>

              <p className="text-gray-400 leading-relaxed mt-6">
                {tourDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {tourDuration}
                </div>
                {tour.pickupIncluded && (
                  <div className="flex items-center gap-2 text-sm text-accent-cyan">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {t("detail.freeHotelPickup")}
                  </div>
                )}
                {tour.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {tour.location}
                  </div>
                )}
              </div>

              {/* Price block */}
              <div className="mt-8 p-6 rounded-2xl glass">
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold text-white">
                    {tour.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-500">
                    {tour.currency}
                  </span>
                  <span className="text-base text-gray-500 line-through ml-2">
                    {tour.originalPrice.toLocaleString()} {tour.currency}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {t("detail.perPerson")} &middot; {t("detail.save", { discount: String(discount) })}
                </p>

                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium text-white bg-gradient-accent rounded-full hover:opacity-90 transition-opacity"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t("detail.bookNowWhatsApp")}
                </a>

                <p className="text-xs text-gray-500 text-center mt-3">
                  {t("detail.freeCancellation24h")}
                </p>
              </div>
            </div>
          </div>

          {/* Highlights & Includes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="p-6 rounded-2xl glass">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#06d6a0"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {t("detail.tourHighlights")}
              </h2>
              <ul className="space-y-3">
                {tourHighlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#06d6a0"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="mt-0.5 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl glass">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                {t("detail.whatsIncluded")}
              </h2>
              <ul className="space-y-3">
                {tourIncludes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0891b2"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="mt-0.5 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              {t("detail.faq")}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="p-5 rounded-2xl glass">
                  <h3 className="text-base font-medium text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA bar */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl glass">
            <div>
              <p className="text-lg font-semibold text-white">
                {t("detail.readyToExperience", { tourTitle })}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {t("detail.bookNowSave", { discount: String(discount) })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/#tours"
                className="px-5 py-2.5 text-sm font-medium text-gray-300 glass rounded-full hover:text-white hover:bg-white/10 transition-all"
              >
                &larr; {t("detail.allTours")}
              </Link>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-accent rounded-full hover:opacity-90 transition-opacity"
              >
                {t("detail.bookNowWhatsApp")}
              </a>
            </div>
          </div>
          {/* Related Tours */}
          <RelatedTours currentTourId={tour.id} category={tour.category} />
        </div>
      </main>

      <Footer />
    </>
  );
}
