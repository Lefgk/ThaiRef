import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AISearch from "@/components/AISearch";
import FeaturedTours from "@/components/FeaturedTours";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import EmailCapture from "@/components/EmailCapture";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <AISearch />
        <FeaturedTours />
        <Testimonials />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
      <EmailCapture />
    </>
  );
}
