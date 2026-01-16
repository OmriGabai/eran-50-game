import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center gap-2 mb-4">
          <span className="text-5xl">&#127881;</span>
          <span className="text-5xl">&#127874;</span>
          <span className="text-5xl">&#127881;</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold title-text mb-4">
          Eran&apos;s 50th Birthday
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-purple">
          Meme Game!
        </h2>
        <p className="text-lg text-purple/70 mt-4 max-w-md mx-auto">
          Caption the photos, make everyone laugh, and let the birthday boy pick his favorites!
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-6">
        <Link
          href="/host"
          className="btn-primary text-2xl px-12 py-6 text-center"
        >
          &#128250; Host Game
          <span className="block text-sm font-normal mt-1">
            (Open on TV/Projector)
          </span>
        </Link>

        <Link
          href="/play"
          className="btn-secondary text-2xl px-12 py-6 text-center"
        >
          &#128241; Join Game
          <span className="block text-sm font-normal mt-1">
            (Open on your phone)
          </span>
        </Link>
      </div>

      {/* Instructions */}
      <div className="mt-16 max-w-2xl mx-auto">
        <div className="card">
          <h3 className="text-xl font-bold text-purple mb-4 text-center">
            How to Play
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">1&#65039;&#8419;</div>
              <p className="font-medium text-purple-dark">Host opens TV display</p>
              <p className="text-sm text-purple/60">Share the screen with everyone</p>
            </div>
            <div>
              <div className="text-3xl mb-2">2&#65039;&#8419;</div>
              <p className="font-medium text-purple-dark">Players join on phones</p>
              <p className="text-sm text-purple/60">Enter your name to play</p>
            </div>
            <div>
              <div className="text-3xl mb-2">3&#65039;&#8419;</div>
              <p className="font-medium text-purple-dark">Caption &amp; laugh!</p>
              <p className="text-sm text-purple/60">Eran picks his favorites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin link */}
      <div className="mt-8">
        <Link
          href="/admin"
          className="text-purple/50 hover:text-purple text-sm underline"
        >
          Admin: Upload Images
        </Link>
      </div>
    </div>
  );
}
