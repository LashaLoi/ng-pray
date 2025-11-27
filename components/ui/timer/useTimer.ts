import { useEffect } from "react";
import {
  useTimerStateQuery,
  useTimerStateSeconds,
  useIsTimerRunning,
  addSecond,
  setPauseTimerStatus,
} from "./store";

export const useTimer = () => {
  const { isPending } = useTimerStateQuery();

  const seconds = useTimerStateSeconds();
  const isRunning = useIsTimerRunning();

  useEffect(() => {
    if (!isRunning) return;
    const intervalId = setInterval(addSecond, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    const handleBeforeUnload = () => setPauseTimerStatus();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return {
    isPending,
    seconds,
    isRunning,
  };
};
