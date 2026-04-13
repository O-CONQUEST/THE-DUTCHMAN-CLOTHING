"use client";

import { useState, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

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

    const nextPath = searchParams.get('next') || '/collection';

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else router.push(nextPath);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Success! Check your email for a confirmation link.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm space-y-10">
      <div className="text-center">
        {/* LOGO FIX: Since logo.png is directly in public/ in your sidebar */}
        <Image 
          src="/logo.png?v=1" 
          alt="The Dutchman" 
          width={60} 
          height={60} 
          className="mx-auto mb-4" 
          priority 
          unoptimized
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
          // REMOVED 'uppercase' class. 
          // Use 'normal-case' to override any global styles that might be forcing caps.
          className="w-full border-b border-black py-3 text-[10px] tracking-widest focus:outline-none font-bold bg-transparent text-black normal-case"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="PASSWORD" 
          required
          className="w-full border-b border-black py-3 text-[10px] tracking-widest focus:outline-none font-bold bg-transparent text-black"
          onChange={(e) => setPassword(e.target.value)}
        />
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

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-6 font-sans">
      <Suspense fallback={<div className="text-black uppercase text-[10px]">Loading...</div>}>
        <AuthForm />
      </Suspense>
    </main>
  );
}