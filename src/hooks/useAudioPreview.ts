import { useCallback, useEffect, useRef, useState } from "react";

const PREVIEW_MS = 5000;
const PREVIEW_VOLUME = 0.35;

export function useAudioPreview() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const stopPreview = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    }
    setPreviewingId(null);
  }, []);

  const preview = useCallback(
    (trackId: string, src: string) => {
      if (previewingId === trackId) {
        stopPreview();
        return;
      }

      stopPreview();

      const audio = new Audio(src);
      audio.volume = PREVIEW_VOLUME;
      audioRef.current = audio;
      setPreviewingId(trackId);

      const onDone = () => stopPreview();
      audio.addEventListener("ended", onDone, { once: true });

      void audio.play().catch(() => {
        onDone();
      });

      timeoutRef.current = setTimeout(onDone, PREVIEW_MS);
    },
    [previewingId, stopPreview],
  );

  useEffect(() => () => stopPreview(), [stopPreview]);

  return { previewingId, preview, stopPreview };
}
