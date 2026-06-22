import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import BestSellers from "@/components/BestSellers";
import NewArrivals from "@/components/NewArrivals";
import TrendingProducts from "@/components/TrendingProducts";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <FeaturedCategories />
      <BestSellers />
      <NewArrivals />
      <TrendingProducts />
    </main>
  );
}
