import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type Plyr from "plyr";
import "plyr/dist/plyr.css";
import { plyrOptions } from "../lib/plyr-config";

type PlayerStatus = "loading" | "ready" | "error";

export function usePlyrPlayer(src: string) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const [status, setStatus] = useState<PlayerStatus>("loading");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    setStatus("loading");
    setIsPlaying(false);
    setHasEnded(false);

    host.replaceChildren();

    const video = document.createElement("video");
    video.className = "naturfag-player__video";
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.preload = "metadata";
    video.src = src;

    const onReady = () => {
      if (!cancelled) setStatus("ready");
    };
    const onError = () => {
      if (!cancelled) setStatus("error");
    };

    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("error", onError);

    host.appendChild(video);

    void import("plyr").then(({ default: PlyrConstructor }) => {
      if (cancelled || !host.contains(video)) return;

      const player = new PlyrConstructor(video, plyrOptions);
      playerRef.current = player;

      player.on("play", () => { if (!cancelled) setIsPlaying(true); });
      player.on("pause", () => { if (!cancelled) setIsPlaying(false); });
      player.on("ended", () => {
        if (!cancelled) {
          setIsPlaying(false);
          setHasEnded(true);
        }
      });
    });

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("error", onError);
      playerRef.current?.destroy();
      playerRef.current = null;
      host.replaceChildren();
    };
  }, [src]);

  const pause = useCallback(() => {
    const player = playerRef.current;
    if (player && !player.paused) {
      player.pause();
    }
  }, []);

  return { hostRef, status, isPlaying, hasEnded, pause };
}
