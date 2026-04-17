"use client";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white p-10">
      
      <h1 className="text-3xl font-bold">Opsly Dashboard</h1>

      <div className="mt-6 grid gap-4">
        
        <div className="bg-gray-800 p-4 rounded">
          👥 Team Members: 1
        </div>

        <div className="bg-gray-800 p-4 rounded">
          📊 Projects: 0
        </div>

        <div className="bg-gray-800 p-4 rounded">
          ⚡ Activity Feed: Empty
        </div>

      </div>

    </div>
  );
}
