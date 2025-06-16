"use client"
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Support } from "@/components/Support";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { PartnerCatalogs } from "@/components/PartnerCatalogs";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <PartnerCatalogs />
      <Services />
      <Support />
      <About />
      <TestimonialCarousel />
      <NewsletterSignup />
      <Contact />
      <Footer />
    </div>
  );
}
