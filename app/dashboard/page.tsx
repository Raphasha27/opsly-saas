"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const initDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/signup");
        return;
      }
      setUserEmail(user.email ?? "owner@opsly.app");

      // Load retention hooks (Activity Feed)
      const { data: recentActivity } = await supabase
        .from("activities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentActivity?.length) {
        setActivities(recentActivity);
      } else {
        // Mock fallback so the user always sees value natively on first boot
        setActivities([
          { id: 1, type: "workspace_created", description: "You created the workspace.", created_at: new Date().toISOString() },
          { id: 2, type: "system_event", description: "Security configurations initialized.", created_at: new Date().toISOString() }
        ]);
      }
    };
    initDashboard();
  }, [router]);

  const handleGenerateInvite = async () => {
    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        body: JSON.stringify({ userId: "mock-id", email: userEmail }),
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
          <p className="text-white hover:text-white cursor-pointer transition">Workspace</p>
          <p className="hover:text-white cursor-pointer transition">Projects</p>
          <p className="hover:text-white cursor-pointer transition">Activity Feed</p>
          <p className="hover:text-white cursor-pointer transition">Settings</p>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden font-medium sm:block">{userEmail}</span>
            <button
              onClick={handleUpgrade}
              className="bg-indigo-600 hover:bg-indigo-500 font-medium px-4 py-2 rounded-lg transition-colors text-sm shadow-lg shadow-indigo-500/20"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* Dynamic Activity Feed (Retention Engine) */}
        <div className="mb-8 p-6 bg-[#111827] border border-blue-900/50 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            ⚡ What you missed today
          </h2>
          <div className="space-y-3">
            {activities.map((act, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#1F2937] rounded-lg border border-gray-700">
                <span className="text-sm font-medium text-gray-200">
                  {act.description || `Recent event: ${act.type}`}
                </span>
                <span className="text-xs text-gray-500">Just now</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-xl shadow-sm">
            <p className="text-gray-400 text-sm font-medium mb-1">Team Members</p>
            <h3 className="text-2xl font-bold">1 <span className="text-sm text-gray-500 font-normal">/ 3 Free</span></h3>
            <p className="text-indigo-400 text-xs mt-2 font-medium">Add 2 more free</p>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-xl shadow-sm">
            <p className="text-gray-400 text-sm font-medium mb-1">Active Projects</p>
            <h3 className="text-2xl font-bold">1</h3>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-xl shadow-sm">
            <p className="text-gray-400 text-sm font-medium mb-1">Billing Tier</p>
            <h3 className="text-2xl font-bold text-green-400">Free</h3>
            <p className="text-gray-500 text-xs mt-2 font-medium">Auto-scales safely</p>
          </div>
        </div>

        {/* Viral Growth Section */}
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-40"></div>
          <h2 className="text-xl font-bold mb-2">Invite your team to collaborate</h2>
          <p className="text-gray-400 text-sm max-w-xl mb-6">
            Opsly thrives on teamwork. Invite 2 members to lock in your free tier configuration instantly.
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
