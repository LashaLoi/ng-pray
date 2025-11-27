"use client";

import { Timer } from "@/components/ui/timer";
import { AudioPlayer } from "@/components/ui/audio-player";
import { useEffect, useRef } from "react";
import { useIsTimerRunning } from "@/components/ui/timer/store";

export default function Home() {
  const isTimerRunning = useIsTimerRunning();

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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black relative">
      <div>
        <Timer />
        <AudioPlayer
          ref={audioRef}
          src="/audio/demo.mp3"
          title="Sample track"
          className="mt-6"
        />
      </div>
    </div>
  );
}
