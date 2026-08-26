"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FulfillButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}/fulfill`, { method: "POST" });
    setLoading(false);
    if (res.ok) router.refresh();
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="border border-black px-4 py-2 text-[9px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition disabled:opacity-50"
    >
      {loading ? "Updating..." : "Mark Fulfilled"}
    </button>
  );
}
