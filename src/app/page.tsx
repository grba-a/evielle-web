// Holding page until the homepage design is approved through the artifact workflow.
export default function Home() {
  return (
    <main className="relative isolate grid min-h-[100svh] place-items-center overflow-hidden px-4">
      <video
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        src="/media/sea-loop.mp4"
        poster="/media/sea-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,32,31,.08),rgba(6,32,31,.5))]" />
      <div className="text-center">
        <h1 className="font-display text-[clamp(2.4rem,13vw,6.5rem)] leading-none tracking-[0.32em] -mr-[0.32em]">
          EVIELLE
        </h1>
        <p className="mt-5 text-sm tracking-[0.3em] uppercase opacity-80 -mr-[0.3em]">Skin care</p>
        <p className="mt-10 text-lg opacity-90">Web trgovina uskoro.</p>
      </div>
    </main>
  );
}
