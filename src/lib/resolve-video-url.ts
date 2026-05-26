/** Map Blob URLs to local paths when VITE_USE_LOCAL_VIDEOS=true (dev). */
export function resolveVideoUrl(src: string): string {
  const overrideKlipp1 = import.meta.env.VITE_VIDEO_KLIPP1;
  const overrideKlipp2 = import.meta.env.VITE_VIDEO_KLIPP2;

  if (overrideKlipp1 && src.includes("klipp1.mp4")) return overrideKlipp1;
  if (overrideKlipp2 && src.includes("klipp2.mp4")) return overrideKlipp2;

  if (import.meta.env.VITE_USE_LOCAL_VIDEOS === "true") {
    if (src.includes("klipp1.mp4")) return "/videos/klipp1.mp4";
    if (src.includes("klipp2.mp4")) return "/videos/klipp2.mp4";
  }

  return src;
}
