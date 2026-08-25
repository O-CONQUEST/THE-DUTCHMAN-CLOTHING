"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, authLoading } = useCart();

  const nextPath = searchParams.get("next") || "/collection";

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(nextPath);
    }
  }, [authLoading, user, nextPath, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push(nextPath);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("Success! Check your email for a confirmation link.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm space-y-10">
      <div className="text-center">
        <img
          src="/logo.png"
          alt="The Dutchman"
          width={60}
          height={60}
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl font-black uppercase tracking-tighter text-black">
          {isLogin ? "Member Login" : "Join the Voyage"}
        </h1>
      </div>

      <form onSubmit={handleAuth} className="space-y-6">
        <input
          type="email"
          placeholder="EMAIL"
          required
          value={email}
          className="w-full border-b border-black py-3 text-[10px] tracking-widest focus:outline-none font-bold bg-transparent text-black normal-case"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="PASSWORD"
          required
          value={password}
          className="w-full border-b border-black py-3 text-[10px] tracking-widest focus:outline-none font-bold bg-transparent text-black"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-[9px] font-bold uppercase tracking-widest text-red-500">{error}</p>
        )}
        {message && (
          <p className="text-[9px] font-bold uppercase tracking-widest text-green-600">{message}</p>
        )}

        <button
          disabled={loading}
          className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:opacity-80 transition disabled:bg-gray-400"
        >
          {loading ? "AUTHENTICATING..." : isLogin ? "Sign In" : "Register"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setIsLogin(!isLogin);
          setError(null);
          setMessage(null);
        }}
        className="w-full text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition"
      >
        {isLogin ? "No account? Create one" : "Already a member? Sign in"}
      </button>
    </div>
  );
}

export default function AuthFormWrapper() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-6 font-sans">
      <Suspense fallback={<div className="text-black uppercase text-[10px]">Loading...</div>}>
        <AuthForm />
      </Suspense>
    </main>
  );
}
