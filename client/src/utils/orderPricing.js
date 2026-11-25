const toAmount = (value, fallback = 0) => {
  if (value === undefined || value === null || value === "") return fallback;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : fallback;
};

export const calculateOrderPricing = ({ items = [], subtotal: suppliedSubtotal, settings = {}, discount = 0 } = {}) => {
  const itemCount = items.reduce((count, item) => count + toAmount(item.quantity ?? 1, 1), 0);
  const subtotal = suppliedSubtotal === undefined
    ? items.reduce((sum, item) => sum + toAmount(item.price ?? item.caloriesPerServing) * toAmount(item.quantity ?? 1, 1), 0)
    : toAmount(suppliedSubtotal);
  const hasItems = itemCount > 0 || subtotal > 0;
  const freeDeliveryThreshold = toAmount(settings.freeDeliveryThreshold, 499);
  const isFreeDelivery = hasItems && subtotal >= freeDeliveryThreshold;
  const deliveryFee = hasItems
    ? (isFreeDelivery ? 0 : toAmount(settings.deliveryFee, 30))
    : 0;
  const packagingFee = hasItems ? toAmount(settings.packagingFee, 15) : 0;
  const taxRate = toAmount(settings.taxRate, 5);
  const taxes = hasItems ? Math.round(subtotal * taxRate / 100) : 0;
  const discountAmount = hasItems
    ? Math.max(0, Math.min(toAmount(discount), subtotal + deliveryFee + packagingFee + taxes))
    : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee + packagingFee + taxes - discountAmount);

  return {
    itemCount,
    subtotal,
    deliveryFee,
    packagingFee,
    taxRate,
    taxes,
    discountAmount,
    grandTotal,
    isFreeDelivery,
  };
};

export const getSavedOrderPricing = (order = {}) => {
  const itemSubtotal = (order.items || []).reduce(
    (sum, item) => sum + toAmount(item.price ?? item.caloriesPerServing) * toAmount(item.quantity ?? 1, 1),
    0
  );
  const subtotal = toAmount(order.subtotal, itemSubtotal);
  const deliveryFee = toAmount(order.deliveryFee, 30);
  const hasCompleteBreakdown = [order.packagingFee, order.taxes, order.discount]
    .every((value) => value !== undefined && value !== null);
  const packagingFee = toAmount(order.packagingFee);
  const taxes = order.taxes === undefined || order.taxes === null
    ? Math.round(subtotal * 0.05)
    : toAmount(order.taxes);
  const discountAmount = toAmount(order.discount);
  const calculatedTotal = Math.max(0, subtotal + deliveryFee + packagingFee + taxes - discountAmount);
  const grandTotal = order.total === undefined || order.total === null
    ? calculatedTotal
    : toAmount(order.total, calculatedTotal);

  return {
    subtotal,
    deliveryFee,
    packagingFee,
    taxes,
    discountAmount,
    grandTotal,
    hasCompleteBreakdown,
  };
};
