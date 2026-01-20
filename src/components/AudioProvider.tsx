"use client";

import React, { createContext, useContext, useRef, useState, useEffect } from "react";

interface AudioContextType {
  musicPlaying: boolean;
  audioInitialized: boolean;
  toggleMusic: () => void;
  initializeAudio: (play: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Check session storage for initialization state on mount
    if (typeof window !== 'undefined' && sessionStorage.getItem("hasVisited")) {
        setAudioInitialized(true);
    }
  }, []);

  const initializeAudio = (play: boolean) => {
    setAudioInitialized(true);
    sessionStorage.setItem("hasVisited", "true");
    
    if (play && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      setMusicPlaying(true);
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (musicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    setMusicPlaying(!musicPlaying);
  };

  return (
    <AudioContext.Provider value={{ musicPlaying, audioInitialized, toggleMusic, initializeAudio }}>
      <audio ref={audioRef} src="/song.mp3" loop />
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
