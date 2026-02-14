import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Tour } from "@/data/tours";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={star <= Math.floor(rating) ? "#f59e0b" : "none"}
          stroke="#f59e0b"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TourCard({ tour }: { tour: Tour }) {
  const t = useTranslations("tours.items");
  const tc = useTranslations("common.tourCard");
  const tu = useTranslations("common.urgency");

  const tourTitle = t(`${tour.id}.title`);
  const tourSubtitle = t(`${tour.id}.subtitle`);
  const tourDuration = t(`${tour.id}.duration`);
  const tourBadge = tour.badge ? t(`${tour.id}.badge`) : null;
  const tourHighlights: string[] = tour.highlights.map((_, i) =>
    t(`${tour.id}.highlights.${i}`)
  );

  const discount = Math.round(
    ((tour.originalPrice - tour.price) / tour.originalPrice) * 100
  );

  return (
    <div className="group relative bg-surface rounded-2xl overflow-hidden border border-border hover:border-accent-cyan/30 transition-all duration-300 hover:glow-sm">
      {/* Clickable card link */}
      <Link
        href={`/tours/${tour.id}`}
        className="absolute inset-0 z-10"
        aria-label={`View details for ${tourTitle} - ${tourSubtitle}`}
      />

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={tour.image}
          alt={`${tourTitle} - ${tourSubtitle}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

        {tourBadge && (
          <div className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-accent text-white">
            {tourBadge}
          </div>
        )}

        <div className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full bg-red-500/90 text-white">
          -{discount}%
        </div>

        {/* Urgency: spots left */}
        {tour.spotsLeft != null && tour.spotsLeft <= 5 && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full bg-orange-500/90 text-white flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {tu("spotsLeft", { count: tour.spotsLeft.toString() })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white group-hover:text-accent-cyan transition-colors">
          {tourTitle}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">{tourSubtitle}</p>

        <div className="flex items-center gap-2 mt-3">
          <StarRating rating={tour.rating} />
          <span className="text-sm text-gray-400">
            {tour.rating} ({tour.reviewCount.toLocaleString()})
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {tourHighlights.slice(0, 3).map((h) => (
            <span
              key={h}
              className="px-2 py-0.5 text-xs text-gray-400 bg-surface-light rounded-md border border-border"
            >
              {h}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {tourDuration}
          </span>
          {tour.pickupIncluded && (
            <span className="flex items-center gap-1 text-accent-cyan">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {tc("freePickup")}
            </span>
          )}
        </div>

        {/* Urgency: bookings today */}
        {tour.bookingsToday != null && tour.bookingsToday > 0 && (
          <div className="flex items-center gap-1 mt-3 text-xs text-amber-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            {tu("bookingsToday", { count: tour.bookingsToday.toString() })}
          </div>
        )}

        <div className="flex items-end justify-between mt-5 pt-4 border-t border-border">
          <div>
            <span className="text-xs text-gray-500 line-through">
              {tour.originalPrice.toLocaleString()} {tour.currency}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">
                {tour.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">{tour.currency}</span>
            </div>
            <span className="text-xs text-gray-500">{tc("perPerson")}</span>
          </div>
          <a
            href={tour.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-20 px-5 py-2.5 text-sm font-medium text-white bg-gradient-accent rounded-full hover:opacity-90 transition-opacity"
          >
            {tc("bookNow")}
          </a>
        </div>
      </div>
    </div>
  );
}
