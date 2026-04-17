"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    // Secure Supabase Implementation replacing previous localStorage mockup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    
    // Auth complete -> proceed to secure dashboard
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B1220] text-white">
      <div className="bg-[#111827] p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Create Workspace</h1>
        <p className="text-gray-400 mb-6 font-medium text-sm">Join Opsly to start running your operations seamlessly.</p>

        {errorMsg && <p className="text-red-500 mb-4 text-sm">{errorMsg}</p>}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email address" 
            className="p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-500 font-semibold px-6 py-3 rounded transition-colors"
          >
            Sign Up & Initialize
          </button>
        </form>
      </div>
    </div>
  );
}
