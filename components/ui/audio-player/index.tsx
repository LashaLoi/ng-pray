"use client";

import { Ref, useImperativeHandle, useState } from "react";

import { Pause, Play, SlidersHorizontal, Volume2, VolumeX } from "lucide-react";

import { cn, formatTrackTime } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

import { useAudioPlayer } from "./useAudioPlayer";

type AudioPlayerProps = {
  src: string;
  title?: string;
  className?: string;
  ref: Ref<{
    play: () => void;
    pause: () => void;
  }>;
};

export function AudioPlayer({ src, title, className, ref }: AudioPlayerProps) {
  const {
    togglePlayPause,
    toggleMute,
    setVolume,
    seek,
    volume,
    duration,
    isReady,
    isPlaying,
    isMuted,
    currentTime,
    play,
    pause,
  } = useAudioPlayer(src);

  useImperativeHandle(ref, () => ({
    play,
    pause,
  }));

  const [showVolume, setShowVolume] = useState(false);

  return (
    <div
      className={cn("flex w-full max-w-md flex-col gap-3 px-4 py-3", className)}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-foreground">
            {title ?? "Audio"}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatTrackTime(currentTime)} / {formatTrackTime(duration)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isReady ? (
            <Button
              size="icon"
              variant="secondary"
              type="button"
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
              {isPlaying ? <Pause /> : <Play />}
            </Button>
          ) : (
            <Loader size="sm" />
          )}

          <Button
            size="icon"
            variant={showVolume ? "secondary" : "ghost"}
            type="button"
            onClick={() => setShowVolume((prev) => !prev)}
            aria-label={
              showVolume ? "Hide volume controls" : "Show volume controls"
            }
          >
            <SlidersHorizontal />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(event) => seek(Number(event.target.value))}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-muted accent-foreground"
          aria-label="Track position"
          disabled={!isReady}
        />
      </div>

      <div
        className={cn(
          "overflow-hidden transition-[max-height] duration-300 ease-in-out",
          showVolume ? "max-h-16" : "max-h-0"
        )}
      >
        {showVolume ? (
          <div className="flex animate-in fade-in items-center gap-2 duration-200">
            <span className="text-xs text-muted-foreground">Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume ?? 1}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-muted accent-foreground"
              aria-label="Volume"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
