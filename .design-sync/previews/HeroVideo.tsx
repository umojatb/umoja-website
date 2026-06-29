import { HeroVideo } from "../../src/components/hero-video";

export function Preview() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-primary-900" style={{ height: 380 }}>
      {/* Gradient overlay mimicking the live hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-primary-700/40 z-10" />
      {/* HeroVideo with a placeholder src — poster fills the frame */}
      <HeroVideo
        src="/hero.mp4"
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Annotation so the card is readable even if the video is blank */}
      <div className="absolute inset-0 z-20 flex flex-col items-start justify-end p-8">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/80">
          HeroVideo
        </span>
        <p className="mt-2 font-heading text-2xl font-bold text-white">
          Autoplay background video
        </p>
        <p className="mt-1 text-sm text-white/70">
          Loop with pause/play toggle — appears when video is ready
        </p>
      </div>
    </div>
  );
}
