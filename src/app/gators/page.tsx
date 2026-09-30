import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";


export const metadata: Metadata = {
  title: "Port Allegany Gator Gear",
  description:
    "Shop Port Allegany Gator shirts, sweatshirts, spirit wear, and custom hometown apparel from Port Petals.",
};

export default function GatorsPage() {
  return (
    <CategoryPage
      eyebrow="Gator Gear"
      title="Show your Port Allegany pride."
      description="Shop hometown apparel and spirit gear made for Port Allegany Gator fans, families, students, and supporters."
      heroImage="/collections/gators.jpg"
      heroAlt="Port Allegany Gator gear"
      sectionTitle="Hometown spirit"
      products={[
        {
          name: "Gator T-Shirt",
          description: "A comfortable Port Allegany spirit shirt for game days and everyday wear.",
          price: "From $22",
          image: "/collections/gators.jpg",
        },
        {
          name: "Gator Sweatshirt",
          description: "Warm hometown apparel for cooler weather, school events, and game nights.",
          price: "From $35",
          image: "/collections/gators.jpg",
        },
        {
          name: "Custom Gator Gear",
          description: "Personalized hometown apparel for players, families, teams, and special events.",
          price: "From $25",
          image: "/collections/gators.jpg",
        },
      ]}
    />
  );
}
