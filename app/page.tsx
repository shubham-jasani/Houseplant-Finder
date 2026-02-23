import Link from "next/link";


export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] flex items-center justify-center px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT: TEXT */}
        <div className="space-y-6 text-center md:text-left">
          <p className="text-sm uppercase tracking-wide text-green-700 font-semibold">
            Houseplant Finder
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Find the right houseplant
            <span className="block text-green-700">
              for your space
            </span>
          </h1>

          <p className="text-lg text-slate-600 max-w-xl mx-auto md:mx-0">
            Answer a few quick questions and get personalized plant
            recommendations based on your light, care preferences,
            and lifestyle.
          </p>

          <div className="pt-4">
            <Link
              href="/quiz"
              className="inline-block rounded-xl bg-green-600 px-8 py-4 text-white text-lg font-semibold hover:bg-green-700 transition shadow-sm"
            >
              Start the quiz →
            </Link>
          </div>

          {/* Subtle reassurance (text only, no icons) */}
          <p className="pt-4 text-sm text-slate-500">
            Designed for beginners · Pet safety considered · Takes under a minute
          </p>
        </div>

      </div>
    </main>
  );
}
