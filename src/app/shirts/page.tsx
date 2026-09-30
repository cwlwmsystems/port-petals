import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";


export const metadata: Metadata = {
  title: "Shirts",
  description:
    "Shop seasonal, local, and custom shirts from Port Petals in Port Allegany, Pennsylvania.",
};

export default function ShirtsPage() {
  return (
    <CategoryPage
      eyebrow="Shirts"
      title="Wear something fun."
      description="Shop comfortable shirts featuring seasonal designs, local favorites, creative graphics, and Port Petals style."
      heroImage="/collections/shirts.jpg"
      heroAlt="Port Petals shirts"
      sectionTitle="Shirts & designs"
      products={[
        {
          name: "Seasonal Tee",
          description: "A comfortable shirt featuring a seasonal or holiday-inspired design.",
          price: "From $22",
          image: "/collections/shirts.jpg",
        },
        {
          name: "Graphic Tee",
          description: "A fun everyday design printed on a comfortable shirt.",
          price: "From $22",
          image: "/collections/shirts.jpg",
        },
        {
          name: "Custom Shirt",
          description: "Create a personalized shirt with your own wording, theme, or special occasion.",
          price: "From $25",
          image: "/collections/shirts.jpg",
        },
      ]}
    />
  );
}
