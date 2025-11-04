import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-03-31.basil' } as any)

export async function createProduct() {
  const product = await stripe.products.create({
    name: 'Starter Subscription',
    description: '$12/Month subscription',
  });

  const price = await stripe.prices.create({
    unit_amount: 1200,
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
    product: product.id,
  });

  return {
    product: product.id,
    price: price.id
  };
}