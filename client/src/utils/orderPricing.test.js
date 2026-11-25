import { calculateOrderPricing, getSavedOrderPricing } from "./orderPricing";

describe("calculateOrderPricing", () => {
  test("includes configured GST and packaging with free delivery and no automatic discount", () => {
    const result = calculateOrderPricing({
      items: [{ price: 400, quantity: 2 }, { price: 200, quantity: 1 }],
      settings: { freeDeliveryThreshold: 499, deliveryFee: 60, packagingFee: 15, taxRate: 5 },
    });

    expect(result).toMatchObject({
      itemCount: 3,
      subtotal: 1000,
      deliveryFee: 0,
      packagingFee: 15,
      taxes: 50,
      discountAmount: 0,
      grandTotal: 1065,
      isFreeDelivery: true,
    });
  });

  test("charges delivery below the free-delivery threshold and respects item quantities", () => {
    const result = calculateOrderPricing({
      items: [{ price: 100, quantity: 2 }],
      settings: { freeDeliveryThreshold: 499, deliveryFee: 60, packagingFee: 15, taxRate: 5 },
    });

    expect(result).toMatchObject({
      subtotal: 200,
      deliveryFee: 60,
      packagingFee: 15,
      taxes: 10,
      discountAmount: 0,
      grandTotal: 285,
      isFreeDelivery: false,
    });
  });

  test("returns zero charges for an empty order", () => {
    expect(calculateOrderPricing()).toMatchObject({
      subtotal: 0,
      deliveryFee: 0,
      packagingFee: 0,
      taxes: 0,
      discountAmount: 0,
      grandTotal: 0,
    });
  });
});

describe("getSavedOrderPricing", () => {
  test("keeps older recorded totals authoritative when their fee breakdown was not saved", () => {
    expect(getSavedOrderPricing({ subtotal: 500, deliveryFee: 30, taxes: 25, total: 505 }))
      .toMatchObject({ grandTotal: 505, hasCompleteBreakdown: false });
  });

  test("uses saved fee fields for orders with a complete breakdown", () => {
    expect(getSavedOrderPricing({
      subtotal: 500,
      deliveryFee: 0,
      packagingFee: 15,
      taxes: 25,
      discount: 0,
      total: 540,
    })).toMatchObject({ grandTotal: 540, hasCompleteBreakdown: true });
  });
});
