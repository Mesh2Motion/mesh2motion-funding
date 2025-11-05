// publishable key for Stripe
// it is ok if people see this key when the site is built
// it is a variable to help when switching between test and live environments for Stripe

// Initialize Stripe with key from API
let stripe;
async function initStripe() {
  const config = await fetch('/api/config').then(r => r.json());
  stripe = Stripe(config.stripePublishableKey);
}


document.addEventListener('DOMContentLoaded', async () => {
    await initStripe();
    addEventListeners();
    loadSuccessfulPayments();
})

function addEventListeners() {
    const tipButton = document.getElementById('tip_button');
      
    tipButton.addEventListener('click', () => {
        const tipAmountInput = document.getElementById('tip-amount');
        const amount = parseFloat(tipAmountInput.value);
        
        // Validate the amount
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid tip amount greater than 0');
            return;
        }
        
        // Convert to cents and load the Stripe widget
        loadStripeEmbeddedWidget(amount * 100);
    });
}

const fetchClientSecret = async (amount) => {
  return await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    })
    .then((response) => response.json())
    .then((json) => json.checkoutSessionClientSecret);
};



// test payment card info
// successful payment card:  4242 4242 4242 4242

async function loadStripeEmbeddedWidget(amount = 10000) {

    // we can only load a stripe embedded widget once (I think)
    // show UI section that has Stripe widget
    const stripeCheckoutArea = document.getElementById('stripe-checkout-area');
    stripeCheckoutArea.style.display = 'flex';

    // hide the tip amount and show the reload step
    const selectTipStep = document.getElementById('select-tip-step');
    const reloadStep = document.getElementById('reload-step');
    selectTipStep.style.display = 'none';
    reloadStep.style.display = 'flex';

    const checkout = await stripe.initEmbeddedCheckout({
      fetchClientSecret: () => fetchClientSecret(amount)
    });

    const checkoutContainer = document.getElementById('checkout-container');
    checkoutContainer.innerHTML = ''; // Clear previous content
    checkout.mount('#checkout-container');
}



async function loadSuccessfulPayments() {

  fetch('/api/successful-payments')
    .then(response => response.json())
    .then(data => {

      // You can update the UI with this data as needed
      const successfulPaymentsCount = document.getElementById('successful-payments-count');
      if (successfulPaymentsCount) {
        successfulPaymentsCount.textContent = data.total_successful_payments
      }

      const cumulativePaymentAmount = document.getElementById('cumulative-payment-amount');
      if (cumulativePaymentAmount) {
        const totalAmount = data.payments.reduce((sum, payment) => sum + payment.amount, 0);
        cumulativePaymentAmount.textContent = (totalAmount / 100).toFixed(2);
      }

  })
}