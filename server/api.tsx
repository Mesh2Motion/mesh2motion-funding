import { Hono } from 'hono'
import Stripe from 'stripe'
import { createProduct } from './stripe-actions'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-03-31.basil' } as any)

const app = new Hono()

// e.g. http://localhost:5173/api/books
app.get('/api/books', (c) => {
  return c.json([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: 3, title: '1984', author: 'George Orwell' }
  ])
})

// stripe-related API calls
app.post('/api/create-product', async (c) => {
  try {
    const result = await createProduct();
    return c.json({ 
      success: true,  
      ...result
    });
  } catch (error) {
    return c.json({ error: `Failed to create subscription: ${error}` }, 500);
  }
});

app.post('/api/create-checkout-session', async (c: any) => {

  try {

    // Stripe needs a fully qualified return URL
    const return_url = getCurrentBaseURL(c) + '/success?session_id={CHECKOUT_SESSION_ID}'

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Custom amount',
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: return_url

    });

    return c.json({checkoutSessionClientSecret: session.client_secret});
  }
  catch(error) {
    return c.json({ error: `Failed to create checkout session: ${error}` }, 500);
  };



});

function getCurrentBaseURL(context: any) {
  // Alternative approach - dynamic URL based on request
  const host = context.req.header('host') || 'localhost:5173';
  const protocol = context.req.header('x-forwarded-proto') || 'http';
  return `${protocol}://${host}`; 
}


export default app
