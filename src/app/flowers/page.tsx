import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";


export const metadata: Metadata = {
  title: "Fresh Flowers",
  description:
    "Shop fresh flowers, seasonal bouquets, and arrangements from Port Petals in Port Allegany, Pennsylvania. Pickup and eligible local delivery are available.",
};

export default function FlowersPage() {
  return (
    <CategoryPage
      eyebrow="Fresh Flowers"
      title="Flowers for every kind of moment."
      description="Browse seasonal bouquets and arrangements made with care in Port Allegany. Availability may change based on what is freshest in the shop."
      heroImage="/collections/fresh-flowers.jpg"
      heroAlt="Fresh flower arrangement"
      sectionTitle="Fresh arrangements"
      products={[
        {
          name: "Seasonal Bouquet",
          description: "A cheerful seasonal mix designed with the freshest flowers available.",
          price: "From $35",
          image: "/collections/fresh-flowers.jpg",
        },
        {
          name: "Designer’s Choice",
          description: "A one-of-a-kind arrangement created using the best blooms in the shop.",
          price: "From $45",
          image: "/collections/fresh-flowers.jpg",
        },
        {
          name: "Special Occasion Arrangement",
          description: "Thoughtfully arranged flowers for birthdays, anniversaries, celebrations, and more.",
          price: "From $55",
          image: "/collections/fresh-flowers.jpg",
        },
      ]}
    />
  );
}
