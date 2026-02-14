import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const stats = [
    { value: t("stats.travelers"), label: t("stats.travelersLabel") },
    { value: t("stats.reviews"), label: t("stats.reviewsLabel") },
    { value: t("stats.tours"), label: t("stats.toursLabel") },
    { value: t("stats.support"), label: t("stats.supportLabel") },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        role="img"
        aria-label="Aerial view of Phuket's turquoise waters and tropical islands"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=80')",
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />

      {/* Ambient orbs */}
      <div className="orb-1 -top-40 -left-40 animate-pulse-slow" />
      <div className="orb-2 top-20 -right-40 animate-pulse-slow" style={{ animationDelay: "2s" }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="text-sm text-gray-300">
            {t("hero.badge")}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-up">
          <span className="text-white">{t("hero.headline1")}</span>
          <br />
          <span className="text-gradient">{t("hero.headline2")}</span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {t("hero.subheadline")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <a
            href="#tours"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-accent rounded-full hover:opacity-90 transition-all glow-sm hover:glow"
          >
            {t("hero.browseTours")}
          </a>
          <a
            href="#reviews"
            className="w-full sm:w-auto px-8 py-4 text-base font-medium text-gray-300 glass rounded-full hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-accent-cyan">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {t("hero.readReviews")}
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          {[
            tc("trustBadges.freeCancellation"),
            tc("trustBadges.bestPrice"),
            tc("trustBadges.instantConfirmation"),
            tc("trustBadges.hotelPickup"),
          ].map((badge) => (
            <span key={badge} className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06d6a0" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              {badge}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "0.4s" }}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gradient">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
