import { getTranslations } from "next-intl/server";

export default async function Testimonials() {
  const t = await getTranslations("testimonials");
  const tc = await getTranslations("common");

  const count = 7;

  // Gradient colors for avatar initials
  const avatarGradients = [
    "from-cyan-500 to-blue-500",
    "from-purple-500 to-pink-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-blue-500 to-indigo-500",
    "from-pink-500 to-rose-500",
    "from-teal-500 to-cyan-500",
  ];

  return (
    <section id="reviews" className="relative py-24">
      <div className="orb-2 top-20 right-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
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

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-surface border border-border hover:border-accent-cyan/20 transition-all duration-300"
            >
              {/* Stars + Verified badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#f59e0b"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 rounded-full">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t("verifiedBadge")}
                </span>
              </div>

              {/* Quote */}
              <p className="text-gray-300 leading-relaxed mb-5">
                &ldquo;{t(`items.${i}.text`)}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar initials */}
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                >
                  {t(`items.${i}.avatar`)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">
                      {t(`items.${i}.name`)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{t(`items.${i}.location`)}</span>
                    <span>&middot;</span>
                    <span>{t(`items.${i}.date`)}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs text-accent-cyan bg-accent-cyan/10 rounded-full shrink-0">
                  {t(`items.${i}.tour`)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-16 p-6 rounded-2xl glass flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          <div className="flex items-center gap-2 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06d6a0" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-sm">{tc("trustBadges.licensed")}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06d6a0" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="text-sm">{tc("trustBadges.tatApproved")}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06d6a0" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <span className="text-sm">{tc("trustBadges.securePayments")}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06d6a0" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="text-sm">{tc("trustBadges.emailSupport")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
