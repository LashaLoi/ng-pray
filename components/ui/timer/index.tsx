"use client";

import { Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn, formatTime } from "@/lib/utils";

import { toggleTimerStatus } from "./store";
import { useTimer } from "./useTimer";

type TimerProps = {
  initialSeconds?: number;
};

export const Timer: React.FC<TimerProps> = () => {
  const { isRunning, seconds } = useTimer();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Pray time
      </div>
      <div
        className={cn(
          "font-mono text-4xl tabular-nums text-foreground",
          isRunning ? "animate-pulse" : ""
        )}
      >
        {formatTime(seconds)}
      </div>
      <div className="flex gap-3">
        <Button
          size="lg"
          className="w-[140px]"
          onClick={() => toggleTimerStatus()}
        >
          {isRunning ? (
            <>
              <Pause />
              Pause
            </>
          ) : (
            <>
              <Play />
              Start
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
