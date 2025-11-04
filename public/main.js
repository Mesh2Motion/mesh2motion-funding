// publishable key for Stripe
// it is ok if people see this key when the site is built
// it is a variable to help when switching between test and live environments for Stripe
const stripe = Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

document.addEventListener('DOMContentLoaded', () => {
      // simple API to grab results
    loadStripeEmbeddedWidget();
})

// test payment card info
// successful payment card:  4242 4242 4242 4242

async function loadStripeEmbeddedWidget() {
    const clientSecret = await fetch('/api/create-checkout-session', {method: 'POST'})
      .then((response) => response.json())
      .then((json) => json.checkoutSessionClientSecret);

      console.log('Starting checkout with client secret: ', clientSecret);
      const checkout = await stripe.initEmbeddedCheckout({
        clientSecret: clientSecret
      });

      const checkoutContainer = document.getElementById('checkout-container');
      checkoutContainer.innerHTML = ''; // Clear previous content
      checkout.mount('#checkout-container');
}