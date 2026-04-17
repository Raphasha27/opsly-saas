export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#0B1220] text-white">
      
      <h1 className="text-5xl font-bold">
        Opsly
      </h1>

      <p className="text-gray-400 mt-4 text-center max-w-md">
        Run your startup team in one simple operating system.
      </p>

      <a
        href="/signup"
        className="mt-8 bg-blue-500 px-6 py-3 rounded-lg"
      >
        Start Free
      </a>

    </main>
  );
}
