"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("opsly_user_email");
    if (!email) {
      router.push("/signup");
    } else {
      setUserEmail(email);
    }
  }, [router]);

  const handleGenerateInvite = async () => {
    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        body: JSON.stringify({ userId: "mock-id-01", email: userEmail }),
      });
      const data = await res.json();
      if (data.inviteLink) {
        setInviteLink(data.inviteLink);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpgrade = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex">
      {/* Sidebar Area */}
      <div className="w-64 bg-[#111827] border-r border-[#1F2937] p-6 hidden md:block">
        <h2 className="text-xl font-bold tracking-wider mb-8">OPSLY</h2>
        <nav className="space-y-4 text-gray-400 font-medium">
          <p className="text-white">Workspace</p>
          <p className="hover:text-white cursor-pointer transition">Projects</p>
          <p className="hover:text-white cursor-pointer transition">Activity</p>
          <p className="hover:text-white cursor-pointer transition">Settings</p>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 md:p-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden font-medium sm:block">{userEmail}</span>
            <button
              onClick={handleUpgrade}
              className="bg-indigo-600 hover:bg-indigo-500 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-xl shadow-sm">
            <p className="text-gray-400 text-sm font-medium mb-1">Team Members</p>
            <h3 className="text-2xl font-bold">1</h3>
            <p className="text-indigo-400 text-xs mt-2 font-medium">Owner</p>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-xl shadow-sm">
            <p className="text-gray-400 text-sm font-medium mb-1">Active Projects</p>
            <h3 className="text-2xl font-bold">1</h3>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-xl shadow-sm">
            <p className="text-gray-400 text-sm font-medium mb-1">Billing Tier</p>
            <h3 className="text-2xl font-bold">Free</h3>
            <p className="text-gray-500 text-xs mt-2 font-medium">Auto-scales safely</p>
          </div>
        </div>

        {/* Viral Growth Section */}
        <div className="mt-8 bg-[#111827] border border-blue-900/50 p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-40"></div>
          <h2 className="text-xl font-bold mb-2">Invite &amp; Unlock</h2>
          <p className="text-gray-400 text-sm max-w-xl mb-6">
            Opsly is built for teams. Invite 3 users to unlock advanced workflow analytics and higher project limits instantly.
          </p>

          {!inviteLink ? (
            <button
              onClick={handleGenerateInvite}
              className="bg-blue-600 hover:bg-blue-500 font-medium text-sm px-6 py-3 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
            >
              Generate Invite Link
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="bg-[#0B1220] border border-gray-700 rounded-lg p-3 w-full max-w-md text-sm outline-none font-mono text-blue-300"
              />
              <button
                onClick={() => navigator.clipboard.writeText(inviteLink)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-3 rounded-lg transition-colors text-sm"
              >
                Copy Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
