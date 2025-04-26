import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const secretKey = process.env.STRIPE_SECRET_KEY;

if (!publishableKey) {
  throw new Error("Missing Stripe publishable key");
}

if (!secretKey) {
  throw new Error("Missing Stripe secret key");
}

export const stripe = new Stripe(secretKey, {
  apiVersion: "2023-10-16", // Update this to the latest version as needed
});

export const stripePromise = loadStripe(publishableKey); 