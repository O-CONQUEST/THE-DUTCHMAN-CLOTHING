import type { Metadata } from "next";
import CheckoutForm from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout | The Dutchman",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
