import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Confirmed | The Dutchman",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center text-center px-10 font-sans">
      <p className="text-[10px] text-gray-400 uppercase tracking-[0.6em] mb-6">Thank You</p>
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
        Order Confirmed
      </h1>
      <p className="text-sm text-neutral-500 max-w-md mb-14">
        Your order has been placed. A confirmation will be sent to your email shortly.
      </p>
      <Link href="/collection">
        <button className="border border-black bg-black text-white px-16 py-5 text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-500 hover:bg-white hover:text-black">
          Continue Shopping
        </button>
      </Link>
    </main>
  );
}
