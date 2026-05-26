import { motion } from "motion/react";
import { usePlyrPlayer } from "../hooks/usePlyrPlayer";
import {
  springSnappy,
  staggerContainer,
  staggerItem,
  useMotionTransition,
  useMotionVariants,
} from "../lib/motion";

type VideoSectionProps = {
  src: string;
  title?: string;
};

export function VideoSection({ src, title }: VideoSectionProps) {
  const { hostRef, status, isPlaying } = usePlyrPlayer(src);
  const transition = useMotionTransition(springSnappy);
  const containerVariants = useMotionVariants(staggerContainer);
  const itemVariants = useMotionVariants(staggerItem);

  const label = title ?? "Videoklipp";

  return (
    <section
      className="video-stage shrink-0 snap-start snap-always"
      aria-label={label}
    >
      <motion.div
        className="video-stage__ambient"
        aria-hidden
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={
          transition.duration === 0
            ? { duration: 0 }
            : { duration: 10, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
        }
      />

      <motion.div
        className="naturfag-player"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.header className="video-stage__header" variants={itemVariants}>
          <p className="video-stage__eyebrow">Videoklipp</p>
          <h2 className="naturfag-player__title">{label}</h2>
        </motion.header>

        <motion.div
          className={[
            "naturfag-player__frame",
            isPlaying ? "naturfag-player__frame--playing" : "",
            status === "ready" ? "naturfag-player__frame--ready" : "",
          ].join(" ")}
          variants={itemVariants}
          layout={false}
        >
          {status === "loading" && (
            <div className="naturfag-player__loading" role="status" aria-live="polite">
              <motion.div
                className="naturfag-player__loading-bar"
                animate={{ scaleX: [0.2, 0.85, 0.2] }}
                transition={
                  transition.duration === 0
                    ? { duration: 0 }
                    : { duration: 1.4, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }
                }
              />
              <span>Laster video…</span>
            </div>
          )}

          {status === "error" && (
            <div className="naturfag-player__error" role="alert">
              <p>Kunne ikke laste videoen.</p>
              <p className="naturfag-player__error-detail">
                Sjekk nettverket og last siden på nytt.
              </p>
            </div>
          )}

          <div
            ref={hostRef}
            className={status === "ready" || status === "loading" ? "" : "sr-only"}
            aria-hidden={status === "error"}
          />
        </motion.div>

        <motion.p className="naturfag-player__hint" variants={itemVariants}>
          {status === "ready"
            ? "Trykk play for å starte. Scroll ned når du er ferdig."
            : "Scroll ned når du er ferdig med videoen"}
        </motion.p>
      </motion.div>
    </section>
  );
}
