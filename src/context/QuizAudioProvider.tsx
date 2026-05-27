import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  readAudioPreferences,
  saveAudioPreferences,
  saveThemeMuted,
  type AudioPreferences,
} from "../lib/audio-preference";
import {
  getDuringTrack,
  getEndingTrackOptions,
  getTrackById,
  type DuringTrackId,
  type EndingTrackId,
  type QuizTrack,
} from "../lib/quiz-audio-tracks";
import { useQuiz } from "./QuizProvider";

const DEFAULT_VOLUME = 0.35;

type QuizAudioContextValue = {
  audioEnabled: boolean;
  isComplete: boolean;
  duringTrack: DuringTrackId;
  endingTrack: EndingTrackId;
  endingOptions: QuizTrack[];
  muted: boolean;
  playing: boolean;
  needsGesture: boolean;
  currentLabel: string;
  toggleMuted: () => void;
  play: () => void;
  setDuringTrack: (track: DuringTrackId) => void;
  setEndingTrack: (track: EndingTrackId) => void;
  setVideoPlaying: (playing: boolean) => void;
};

const QuizAudioContext = createContext<QuizAudioContextValue | null>(null);

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function QuizAudioProvider({ children }: { children: ReactNode }) {
  const { isComplete } = useQuiz();
  const [prefs, setPrefs] = useState<AudioPreferences>(readAudioPreferences);
  const [playing, setPlaying] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeTrackRef = useRef<string | null>(null);
  const resumeAfterVideoRef = useRef(false);

  const audioEnabled = prefs.consent === "with-audio";
  const endingOptions = useMemo(
    () => getEndingTrackOptions(prefs.duringTrack),
    [prefs.duringTrack],
  );

  const activeTrack = useMemo(() => {
    if (!audioEnabled || prefs.muted) return null;
    if (!isComplete && prefs.duringTrack !== "none") {
      return getDuringTrack(prefs.duringTrack);
    }
    if (isComplete) {
      return getTrackById(prefs.endingTrack);
    }
    return null;
  }, [audioEnabled, isComplete, prefs.duringTrack, prefs.endingTrack, prefs.muted]);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    const track = activeTrack;
    if (!audio || !track) return false;

    const trackKey = `${track.id}:${track.src}:${track.loop}`;
    if (activeTrackRef.current !== trackKey) {
      activeTrackRef.current = trackKey;
      audio.pause();
      audio.src = track.src;
      audio.loop = track.loop;
      audio.currentTime = 0;
      audio.load();
    }

    audio.volume = DEFAULT_VOLUME;

    try {
      await audio.play();
      setPlaying(true);
      setNeedsGesture(false);
      return true;
    } catch {
      setPlaying(false);
      setNeedsGesture(true);
      return false;
    }
  }, [activeTrack]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      activeTrackRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (videoPlaying) {
      if (!audio.paused) {
        resumeAfterVideoRef.current = true;
        audio.pause();
        setPlaying(false);
      }
      return;
    }

    if (!activeTrack) {
      audio.pause();
      activeTrackRef.current = null;
      setPlaying(false);
      setNeedsGesture(false);
      resumeAfterVideoRef.current = false;
      return;
    }

    if (prefersReducedMotion()) {
      setNeedsGesture(true);
      return;
    }

    if (resumeAfterVideoRef.current) {
      resumeAfterVideoRef.current = false;
    }

    void tryPlay();
  }, [activeTrack, tryPlay, videoPlaying]);

  const updatePrefs = useCallback((updater: (prev: AudioPreferences) => AudioPreferences) => {
    setPrefs((prev) => {
      const next = updater(prev);
      saveAudioPreferences(next);
      activeTrackRef.current = null;
      return next;
    });
  }, []);

  const setDuringTrack = useCallback(
    (duringTrack: DuringTrackId) => {
      if (!audioEnabled) return;
      updatePrefs((prev) => {
        const endingOptionsForDuring = getEndingTrackOptions(duringTrack);
        const endingStillValid = endingOptionsForDuring.some((t) => t.id === prev.endingTrack);
        const endingTrack = endingStillValid
          ? prev.endingTrack
          : (endingOptionsForDuring[0]?.id as EndingTrackId) ?? prev.endingTrack;
        return { ...prev, duringTrack, endingTrack };
      });
    },
    [audioEnabled, updatePrefs],
  );

  const setEndingTrack = useCallback(
    (endingTrack: EndingTrackId) => {
      if (!audioEnabled) return;
      updatePrefs((prev) => ({ ...prev, endingTrack }));
    },
    [audioEnabled, updatePrefs],
  );

  const toggleMuted = useCallback(() => {
    setPrefs((prev) => {
      const next = { ...prev, muted: !prev.muted };
      saveThemeMuted(next.muted);
      if (next.muted) {
        activeTrackRef.current = null;
        audioRef.current?.pause();
      }
      return next;
    });
  }, []);

  const play = useCallback(() => {
    void tryPlay();
  }, [tryPlay]);

  const currentLabel = activeTrack?.label ?? "Lyd";

  const value: QuizAudioContextValue = {
    audioEnabled,
    isComplete,
    duringTrack: prefs.duringTrack,
    endingTrack: prefs.endingTrack,
    endingOptions,
    muted: prefs.muted,
    playing: playing && !prefs.muted,
    needsGesture,
    currentLabel,
    toggleMuted,
    play,
    setDuringTrack,
    setEndingTrack,
    setVideoPlaying,
  };

  return (
    <QuizAudioContext.Provider value={value}>{children}</QuizAudioContext.Provider>
  );
}

export function useQuizAudio(): QuizAudioContextValue {
  const ctx = useContext(QuizAudioContext);
  if (!ctx) {
    throw new Error("useQuizAudio must be used within QuizAudioProvider");
  }
  return ctx;
}
