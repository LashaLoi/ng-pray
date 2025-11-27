import { useAudioPlayer as useAudioPlayerLib } from "react-use-audio-player";
import { useRef, useState, useEffect } from "react";

export const useAudioPlayer = (src: string) => {
  const {
    togglePlayPause,
    toggleMute,
    setVolume,
    volume,
    seek,
    duration,
    getPosition,
    isReady,
    isPlaying,
    isMuted,
    play,
    pause,
  } = useAudioPlayerLib(src);

  const frameRef = useRef<number>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const animate = () => {
      setCurrentTime(getPosition());
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [getPosition]);

  return {
    togglePlayPause,
    toggleMute,
    setVolume,
    volume,
    seek,
    duration,
    isReady,
    isPlaying,
    isMuted,
    currentTime,
    play,
    pause,
  };
};
