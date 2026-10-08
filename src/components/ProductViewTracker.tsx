"use client";

import {
  useEffect,
  useRef,
} from "react";
import { trackViewItem } from "@/lib/analytics";

type ProductViewTrackerProps = {
  productId: string;
  productName: string;
  category: string;
  price: number | null;
};

export default function ProductViewTracker({
  productId,
  productName,
  category,
  price,
}: ProductViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) {
      return;
    }

    const sent =
      trackViewItem({
        productId,
        productName,
        category,
        price,
      });

    if (sent) {
      tracked.current = true;
    }
  }, [
    productId,
    productName,
    category,
    price,
  ]);

  return null;
}
