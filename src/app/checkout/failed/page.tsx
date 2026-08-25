import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Failed | The Dutchman",
  robots: { index: false, follow: false },
};

export default function CheckoutFailedPage() {
  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center text-center px-10 font-sans">
      <p className="text-[10px] text-red-500 uppercase tracking-[0.6em] mb-6">Payment Failed</p>
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
        Something Went Wrong
      </h1>
      <p className="text-sm text-neutral-500 max-w-md mb-14">
        We couldn&apos;t confirm your payment. You have not been charged for anything
        that didn&apos;t go through. Your bag is still saved — please try again.
      </p>
      <Link href="/cart">
        <button className="border border-black bg-black text-white px-16 py-5 text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-500 hover:bg-white hover:text-black">
          Back to Bag
        </button>
      </Link>
    </main>
  );
}
