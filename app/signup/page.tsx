"use client";

import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const handleSignup = () => {
    localStorage.setItem("opsly_user", "demo-user");
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl mb-6">Create Workspace</h1>

      <button
        onClick={handleSignup}
        className="bg-blue-500 px-6 py-3 rounded"
      >
        Create Workspace
      </button>
    </div>
  );
}
