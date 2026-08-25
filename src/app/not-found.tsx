import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center text-center px-10 font-sans">
      <p className="text-[10px] text-gray-400 uppercase tracking-[0.6em] mb-6">404</p>
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
        Page Not Found
      </h1>
      <p className="text-sm text-neutral-500 max-w-md mb-14">
        The page you&apos;re looking for doesn&apos;t exist, or has been moved.
      </p>
      <Link href="/">
        <button className="border border-black bg-black text-white px-16 py-5 text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-500 hover:bg-white hover:text-black">
          Back to Home
        </button>
      </Link>
    </main>
  );
}
