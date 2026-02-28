// Stripe product and price IDs
export const STRIPE_PLANS = {
  pro: {
    monthly: {
      priceId: "price_1T5llOEPoXPeqIKkDtRpYhVl",
      productId: "prod_U3tYqTgjr0uBJ2",
    },
    annual: {
      priceId: "price_1T5llfEPoXPeqIKkJDnfP0XU",
      productId: "prod_U3tYWk1nwfTsD1",
    },
  },
} as const;
