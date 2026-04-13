"use client";

import { useState, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

// 1. Logic moved to AuthForm to satisfy the Next.js Suspense requirement
function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Determines where to go after login (defaults to collection)
    const nextPath = searchParams.get('next') || '/collection';

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(error.message);
      } else {
        router.push(nextPath);
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert(error.message);
      } else {
        alert("Success! Check your email for a confirmation link.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm space-y-10">
      <div className="text-center">
        {/* Path adjusted to where your logo is stored */}
        <Image src="/clothes/logo.png" alt="Logo" width={40} height={40} className="mx-auto mb-4" priority />
        <h1 className="text-2xl font-black uppercase tracking-tighter text-black">
          {isLogin ? "Member Login" : "Join the Voyage"}
        </h1>
      </div>

      <form onSubmit={handleAuth} className="space-y-6">
        <div className="space-y-1">
          <input 
            type="email" 
            placeholder="EMAIL" 
            required
            // Removed 'uppercase' class to allow normal input
            className="w-full border-b border-black py-3 text-[10px] tracking-widest focus:outline-none font-bold bg-transparent text-black"
            // Visual uppercase only - keeps actual data intact
            style={{ textTransform: 'uppercase' }} 
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <input 
            type="password" 
            placeholder="PASSWORD" 
            required
            // No uppercase styling on passwords to avoid login confusion
            className="w-full border-b border-black py-3 text-[10px] tracking-widest focus:outline-none font-bold bg-transparent text-black"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:opacity-80 transition disabled:bg-gray-400"
        >
          {loading ? "AUTHENTICATING..." : isLogin ? "Sign In" : "Register"}
        </button>
      </form>

      <button 
        type="button"
        onClick={() => setIsLogin(!isLogin)} 
        className="w-full text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition"
      >
        {isLogin ? "No account? Create one" : "Already a member? Sign in"}
      </button>
    </div>
  );
}

// 2. Main Page Export: The Suspense boundary fixes the Vercel Build Error
export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-6 font-sans">
      <Suspense fallback={
        <div className="text-[10px] font-bold uppercase tracking-widest text-black">
          Loading...
        </div>
      }>
        <AuthForm />
      </Suspense>
    </main>
  );
}