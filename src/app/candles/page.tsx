import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";


export const metadata: Metadata = {
  title: "Candles",
  description:
    "Browse candles and cozy gift options from Port Petals in Port Allegany, Pennsylvania.",
};

export default function CandlesPage() {
  return (
    <CategoryPage
      eyebrow="Candles"
      title="A little warmth for every room."
      description="Browse cozy candles selected for gifting, relaxing evenings, seasonal scents, and everyday home comfort."
      heroImage="/collections/candles.jpg"
      heroAlt="Decorative candles"
      sectionTitle="Cozy favorites"
      products={[
        {
          name: "Signature Candle",
          description: "A cozy everyday candle perfect for gifting or enjoying at home.",
          price: "From $18",
          image: "/collections/candles.jpg",
        },
        {
          name: "Seasonal Scent",
          description: "Limited seasonal fragrances selected to match the time of year.",
          price: "From $20",
          image: "/collections/candles.jpg",
        },
        {
          name: "Gift Candle",
          description: "A thoughtful candle option ready for birthdays, thank-yous, and special occasions.",
          price: "From $22",
          image: "/collections/candles.jpg",
        },
      ]}
    />
  );
}
