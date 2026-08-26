"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { user, itemCount, signOut } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white z-[100]">
      <div className="flex-1">
        <Link
          href="/collection"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-black hover:opacity-60 transition"
        >
          Collection
        </Link>
      </div>

      <div className="flex-shrink-0">
        <Link href="/">
          <img src="/logo.png" alt="The Dutchman" className="h-8 w-auto block mx-auto" />
        </Link>
      </div>

      <div className="flex-1 flex justify-end items-center gap-6 text-right">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-black hover:opacity-60 transition"
            >
              {user.email?.split("@")[0]}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-3 w-40 bg-white border border-neutral-100 shadow-lg py-2 z-[110]">
                <Link
                  href="/account/orders"
                  className="block px-4 py-2 text-[9px] font-black uppercase tracking-widest text-black hover:bg-neutral-50 transition"
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="w-full text-left px-4 py-2 text-[9px] font-black uppercase tracking-widest text-black hover:bg-neutral-50 transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-black hover:opacity-60 transition"
          >
            Account
          </Link>
        )}
        <Link
          href="/cart"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-black hover:opacity-60 transition"
        >
          Bag ({itemCount})
        </Link>
      </div>
    </nav>
  );
}
