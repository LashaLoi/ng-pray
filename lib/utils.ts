import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatTime = (totalSeconds: number) => {
  const days = Math.floor(totalSeconds / 86_400); // 60 * 60 * 24
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return `${days.toString().padStart(2, "0")}:${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const formatTrackTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";

  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;

  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};
