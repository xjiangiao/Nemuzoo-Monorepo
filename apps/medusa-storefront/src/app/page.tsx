import HeroSection from "@/components/home/HeroSection";
import BrandPhilosophy from "@/components/home/BrandPhilosophy";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CollectionBanners from "@/components/home/CollectionBanner";
import ValueProps from "@/components/home/ValueProps";
import NewsletterSignup from "@/components/home/NewsletterSignup";

export default function Home() {
  return (
    <>
      <HeroSection />
      <BrandPhilosophy />
      <FeaturedProducts />
      <CollectionBanners />
      <ValueProps />
      <NewsletterSignup />
    </>
  );
}
