export type AnalyticsCartItem = {
  productId: string;
  variantId?: string | null;
  productName: string;
  unitPrice: number;
  quantity: number;

  garmentType?: string | null;
  size?: string | null;
  color?: string | null;
};

export type AnalyticsPurchaseItem = {
  productId: string;
  variantId?: string | null;
  productName: string;
  variantName?: string | null;
  garmentType?: string | null;
  size?: string | null;
  color?: string | null;
  quantity: number;
  unitPrice: number;
};

type GtagFunction = (
  command: "event",
  eventName: string,
  parameters: Record<string, unknown>
) => void;

function getGtag(): GtagFunction | null {
  if (typeof window === "undefined") {
    return null;
  }

  const analyticsWindow =
    window as typeof window & {
      dataLayer?: unknown[];
      gtag?: GtagFunction;
    };

  analyticsWindow.dataLayer =
    analyticsWindow.dataLayer ?? [];

  if (
    typeof analyticsWindow.gtag !==
    "function"
  ) {
    analyticsWindow.gtag = (
      command,
      eventName,
      parameters
    ) => {
      analyticsWindow.dataLayer?.push(
        [
          command,
          eventName,
          parameters,
        ]
      );
    };
  }

  return analyticsWindow.gtag;
}

function buildVariantLabel(
  item: {
    variantId?: string | null;
    variantName?: string | null;
    garmentType?: string | null;
    size?: string | null;
    color?: string | null;
  }
) {
  const details = [
    item.variantName,
    item.garmentType,
    item.color,
    item.size,
  ].filter(Boolean);

  if (details.length > 0) {
    return details.join(" / ");
  }

  return item.variantId ?? undefined;
}

function buildItem(
  item: AnalyticsCartItem | AnalyticsPurchaseItem
) {
  return {
    item_id: item.productId,
    item_name: item.productName,
    item_variant:
      buildVariantLabel(item),
    price: Number(item.unitPrice),
    quantity: Number(item.quantity),
  };
}

export function trackViewItem(input: {
  productId: string;
  productName: string;
  category: string;
  price: number | null;
}) {
  const gtag = getGtag();

  if (!gtag) {
    return false;
  }

  const price =
    input.price !== null
      ? Number(input.price)
      : 0;

  gtag("event", "view_item", {
    currency: "USD",
    value: price,
    items: [
      {
        item_id:
          input.productId,
        item_name:
          input.productName,
        item_category:
          input.category,
        price,
        quantity: 1,
      },
    ],
  });

  return true;
}

export function trackAddToCart(
  item: Omit<
    AnalyticsCartItem,
    "quantity"
  >,
  quantity = 1
) {
  const gtag = getGtag();

  if (!gtag) {
    return false;
  }

  const normalizedQuantity =
    Math.max(1, Number(quantity));

  gtag("event", "add_to_cart", {
    currency: "USD",
    value:
      Number(item.unitPrice) *
      normalizedQuantity,
    items: [
      buildItem({
        ...item,
        quantity:
          normalizedQuantity,
      }),
    ],
  });

  return true;
}

export function trackRemoveFromCart(
  item: AnalyticsCartItem,
  quantity = 1
) {
  const gtag = getGtag();

  if (!gtag) {
    return false;
  }

  const normalizedQuantity =
    Math.max(1, Number(quantity));

  gtag("event", "remove_from_cart", {
    currency: "USD",
    value:
      Number(item.unitPrice) *
      normalizedQuantity,
    items: [
      buildItem({
        ...item,
        quantity:
          normalizedQuantity,
      }),
    ],
  });

  return true;
}

export function trackAddPaymentInfo(
  items: AnalyticsCartItem[],
  value: number,
  paymentType = "Square"
) {
  const gtag = getGtag();

  if (!gtag || items.length === 0) {
    return false;
  }

  gtag("event", "add_payment_info", {
    currency: "USD",
    value: Number(value),
    payment_type: paymentType,
    items: items.map(buildItem),
  });

  return true;
}

export function trackViewCart(
  items: AnalyticsCartItem[],
  value: number
) {
  const gtag = getGtag();

  if (!gtag || items.length === 0) {
    return false;
  }

  gtag("event", "view_cart", {
    currency: "USD",
    value: Number(value),
    items: items.map(buildItem),
  });

  return true;
}

export function trackBeginCheckout(
  items: AnalyticsCartItem[],
  value: number
) {
  const gtag = getGtag();

  if (!gtag || items.length === 0) {
    return false;
  }

  gtag("event", "begin_checkout", {
    currency: "USD",
    value: Number(value),
    items: items.map(buildItem),
  });

  return true;
}

export function trackPurchase(input: {
  transactionId: string;
  value: number;
  tax: number;
  shipping: number;
  items: AnalyticsPurchaseItem[];
}) {
  const gtag = getGtag();

  if (!gtag) {
    return false;
  }

  gtag("event", "purchase", {
    transaction_id:
      input.transactionId,
    currency: "USD",
    value: Number(input.value),
    tax: Number(input.tax),
    shipping: Number(input.shipping),
    items:
      input.items.map(buildItem),
  });

  return true;
}
