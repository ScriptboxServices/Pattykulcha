import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SK ?? '',{
  apiVersion: '2024-06-20'
});


export { stripe }