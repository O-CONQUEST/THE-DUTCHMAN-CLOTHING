import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Dutchman | Durable Goods for the Modern Voyage",
  description: "Sleek fits for the modern voyage. Shop The Dutchman's collection of durable, minimalist essentials.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-black selection:text-white">
      {/* HERO SECTION - THE LANDING PAGE VIEW */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-10">
        {/* Large Hero Logo */}
        <div className="mb-14 animate-in fade-in zoom-in duration-1000">
          <img
            src="/logo.png"
            alt="The Dutchman Official"
            style={{ width: '60px', height: 'auto' }}
          />
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.6em] ml-1">
              Est. 2026 / Lagos
            </p>
            <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
              Durable Goods for the Modern Voyage
            </h2>
          </div>

          <Link href="/collection">
            <button className="group relative overflow-hidden border border-black bg-black text-white px-16 py-5 text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-500 hover:bg-white hover:text-black">
              <span className="relative z-10">View Collection</span>
            </button>
          </Link>
        </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="p-10 flex justify-between items-center border-t border-gray-50">
        <p className="text-[9px] text-gray-300 uppercase tracking-widest">
          © 2026 The Dutchman Clothing Co.
        </p>
        <div className="flex gap-6 text-[9px] text-gray-300 uppercase tracking-widest">
          <span className="cursor-pointer hover:text-black transition">Instagram</span>
          <span className="cursor-pointer hover:text-black transition">Terms</span>
        </div>
      </footer>
    </main>
  );
}
