"use client";

import { useEffect, useRef } from "react";

import { AudioPlayer } from "@/components/ui/audio-player";
import { Loader } from "@/components/ui/loader";
import { AuthModal } from "@/components/ui/auth-modal";
import { Timer } from "@/components/ui/timer";
import {
  useIsTimerRunning,
  useTimerStateQuery,
} from "@/components/ui/timer/store";

export default function Home() {
  const isTimerRunning = useIsTimerRunning();
  const { isPending } = useTimerStateQuery();

  const audioRef = useRef<{
    play: () => void;
    pause: () => void;
  }>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isTimerRunning) audioRef.current.play();
    else audioRef.current.pause();
  }, [isTimerRunning]);

  return (
    <div className="relative flex min-h-screen items-end bg-zinc-50 font-sans dark:bg-black">
      <AuthModal />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start">
        <main className="h-64 flex-1 rounded-3xl border border-zinc-200/70 bg-white/80 p-8 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-zinc-900/60">
          <div className="flex items-center justify-center h-full">
            {isPending ? <Loader size="lg" /> : <Timer />}
          </div>
        </main>

        <div className="flex flex-col items-center justify-center h-64 w-full rounded-3xl border border-zinc-200/70 bg-white/80 p-6 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-zinc-900/60 md:w-80">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Soundtrack
            </p>
            <h3 className="text-lg font-semibold text-foreground">
              Stay focused
            </h3>
            <p className="text-sm text-muted-foreground">
              Let the loop keep you in the zone while the timer runs.
            </p>
          </div>

          <AudioPlayer
            ref={audioRef}
            src="/audio/demo.mp3"
            title="Sample track"
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}
