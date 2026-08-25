import type { Metadata } from "next";
import SuccessView from "./SuccessView";

export const metadata: Metadata = {
  title: "Order Confirmed | The Dutchman",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return <SuccessView />;
}
