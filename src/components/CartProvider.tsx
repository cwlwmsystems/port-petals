"use client";

import { useToast } from "@/components/ToastProvider";
import {
  trackAddToCart,
  trackRemoveFromCart,
} from "@/lib/analytics";


import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartCustomization = Record<string, string>;

export type CartItemInput = {
  productId: string;
  variantId: string | null;
  productName: string;
  slug: string;
  productPath?: string;
  imageUrl: string | null;

  unitPrice: number;

  garmentType?: string | null;
  size?: string | null;
  color?: string | null;

  playerName?: string | null;
  playerNumber?: string | null;

  customization?: CartCustomization;
};

export type CartItem = CartItemInput & {
  lineId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: CartItemInput, quantity?: number) => void;
  removeItem: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "port-petals-cart-v1";

function createItemSignature(item: CartItemInput) {
  const customization = Object.entries(item.customization ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join("|");

  return [
    item.productId,
    item.variantId ?? "",
    item.garmentType ?? "",
    item.size ?? "",
    item.color ?? "",
    item.playerName?.trim().toLowerCase() ?? "",
    item.playerNumber?.trim().toLowerCase() ?? "",
    customization,
  ].join("::");
}

export default function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { toast } =
    useToast();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (error) {
      console.error("Unable to load cart:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    if (items.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    );
  }, [items, loaded]);

  function addItem(
    input: CartItemInput,
    quantity = 1
  ) {
    if (quantity < 1) {
      return;
    }

    const signature = createItemSignature(input);

    setItems((current) => {
      const existing = current.find(
        (item) => createItemSignature(item) === signature
      );

      if (existing) {
        return current.map((item) =>
          item.lineId === existing.lineId
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...input,
          lineId: crypto.randomUUID(),
          quantity,
        },
      ];
    });

    trackAddToCart(
      {
        productId: input.productId,
        variantId: input.variantId,
        productName: input.productName,
        unitPrice: input.unitPrice,
        garmentType:
          input.garmentType,
        size: input.size,
        color: input.color,
      },
      quantity
    );

    toast(
      `${input.productName} added to cart.`,
      "success"
    );
  }

  function removeItem(lineId: string) {
    const existing =
      items.find(
        (item) =>
          item.lineId === lineId
      );

    if (existing) {
      trackRemoveFromCart(
        {
          productId:
            existing.productId,
          variantId:
            existing.variantId,
          productName:
            existing.productName,
          unitPrice:
            existing.unitPrice,
          quantity:
            existing.quantity,
          garmentType:
            existing.garmentType,
          size:
            existing.size,
          color:
            existing.color,
        },
        existing.quantity
      );
    }

    setItems((current) =>
      current.filter(
        (item) =>
          item.lineId !== lineId
      )
    );
  }

  function setQuantity(
    lineId: string,
    quantity: number
  ) {
    if (quantity <= 0) {
      removeItem(lineId);
      return;
    }

    const existing =
      items.find(
        (item) =>
          item.lineId === lineId
      );

    if (
      existing &&
      quantity <
        existing.quantity
    ) {
      const removedQuantity =
        existing.quantity -
        quantity;

      trackRemoveFromCart(
        {
          productId:
            existing.productId,
          variantId:
            existing.variantId,
          productName:
            existing.productName,
          unitPrice:
            existing.unitPrice,
          quantity:
            removedQuantity,
          garmentType:
            existing.garmentType,
          size:
            existing.size,
          color:
            existing.color,
        },
        removedQuantity
      );
    }

    setItems((current) =>
      current.map((item) =>
        item.lineId === lineId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  }

  function clearCart() {
    window.localStorage.removeItem(STORAGE_KEY);
    setItems([]);
  }

  const itemCount = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.unitPrice * item.quantity,
        0
      ),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    }),
    [items, itemCount, subtotal]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider."
    );
  }

  return context;
}
