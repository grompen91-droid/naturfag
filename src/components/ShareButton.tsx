import { useState } from "react";
import { drawResultCard } from "../lib/draw-result-card";

type ShareButtonProps = {
  correctCount: number;
  totalQuestions: number;
  bestStreak: number;
};

type ShareStatus = "idle" | "working" | "copied" | "error";

export function ShareButton({ correctCount, totalQuestions, bestStreak }: ShareButtonProps) {
  const [status, setStatus] = useState<ShareStatus>("idle");

  const handleShare = async () => {
    if (status === "working") return;
    setStatus("working");

    try {
      const blob = await drawResultCard({ correctCount, totalQuestions, bestStreak });

      // Web Share API with file (mobile / modern desktop)
      if (
        typeof navigator.share === "function" &&
        navigator.canShare?.({ files: [new File([blob], "resultat.png", { type: "image/png" })] })
      ) {
        await navigator.share({
          title: "Naturfag Quiz — mitt resultat",
          text: `Jeg fikk ${correctCount} av ${totalQuestions} riktige!`,
          files: [new File([blob], "resultat.png", { type: "image/png" })],
        });
        setStatus("idle");
        return;
      }

      // Fallback: download the image
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "naturfag-resultat.png";
      a.click();
      URL.revokeObjectURL(url);
      setStatus("copied");
    } catch (err) {
      // User cancelled share — not an error
      if (err instanceof DOMException && err.name === "AbortError") {
        setStatus("idle");
        return;
      }
      setStatus("error");
    }

    window.setTimeout(() => setStatus("idle"), 2200);
  };

  const label =
    status === "working" ? "Lager kort…"
    : status === "copied"  ? "Lastet ned!"
    : status === "error"   ? "Prøv igjen"
    : "Del resultat";

  return (
    <button
      type="button"
      onClick={() => { void handleShare(); }}
      disabled={status === "working"}
      className="share-result-btn"
      style={{ fontFamily: "var(--font-nav)" }}
      aria-label="Del resultatkort som bilde"
    >
      <span aria-hidden>
        {status === "working" ? "⏳" : status === "copied" ? "✓" : "↗"}
      </span>{" "}
      {label}
    </button>
  );
}
