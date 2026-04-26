"use client";

import { useEffect, useRef, useState } from "react";

type HeroVideoProps = {
  src: string;
  /** Static frame shown until enough video has buffered to start playback. */
  poster?: string;
  className?: string;
};

export function HeroVideo({ src, poster, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      videoRef.current?.pause();
    }
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
    } else {
      v.pause();
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
        preload="metadata"
        poster={poster}
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        onLoadedMetadata={() => setIsReady(true)}
        onError={() => setIsReady(false)}
        className={className}
      >
        <source src={src} type="video/mp4" />
      </video>
      {isReady && (
        <button
          type="button"
          onClick={toggle}
          aria-label={
            isPaused ? "Play background video" : "Pause background video"
          }
          aria-pressed={isPaused}
          className="absolute bottom-3 right-3 z-20 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-black/55 text-white transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:bottom-4 md:right-4"
        >
          {isPaused ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3 w-3"
            >
              <path d="M8 5.5v13a1 1 0 0 0 1.55.83l10-6.5a1 1 0 0 0 0-1.66l-10-6.5A1 1 0 0 0 8 5.5z" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3 w-3"
            >
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
