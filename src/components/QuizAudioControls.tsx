import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useQuizAudio } from "../context/QuizAudioProvider";
import { useDismissiblePanel } from "../hooks/useDismissiblePanel";
import { popoverPanel, useMotionVariants } from "../lib/motion";
import { THEME_TRACK } from "../lib/quiz-audio-tracks";

export function QuizAudioControls() {
  const {
    audioEnabled,
    isComplete,
    duringTrack,
    endingTrack,
    endingOptions,
    muted,
    playing,
    needsGesture,
    currentLabel,
    toggleMuted,
    play,
    setDuringTrack,
    setEndingTrack,
  } = useQuizAudio();

  const menuId = useId();
  const menuTitleId = `${menuId}-title`;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const menuVariants = useMotionVariants(popoverPanel);

  const closeMenu = () => setMenuOpen(false);

  useDismissiblePanel({
    open: menuOpen,
    onClose: closeMenu,
    panelRef: menuRef,
    triggerRef: menuToggleRef,
    trapFocus: true,
    returnFocus: true,
  });

  if (!audioEnabled) return null;

  const muteIsPrimary = !muted;

  return (
    <div className="quiz-audio-toolbar" role="region" aria-label="Quiz-lyd">
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            id={menuId}
            className="quiz-audio-toolbar__menu"
            role="region"
            aria-labelledby={menuTitleId}
            tabIndex={-1}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            <p id={menuTitleId} className="quiz-audio-toolbar__menu-title">
              Bytt sang
            </p>

            {!isComplete && (
              <fieldset className="quiz-audio-toolbar__group">
                <legend>Under quizen</legend>
                <label className="quiz-audio-toolbar__choice">
                  <input
                    type="radio"
                    name="live-during"
                    checked={duringTrack === "none"}
                    onChange={() => setDuringTrack("none")}
                  />
                  <span>Ingen musikk</span>
                </label>
                <label className="quiz-audio-toolbar__choice">
                  <input
                    type="radio"
                    name="live-during"
                    checked={duringTrack === "theme"}
                    onChange={() => setDuringTrack("theme")}
                  />
                  <span>{THEME_TRACK.label}</span>
                </label>
              </fieldset>
            )}

            <fieldset className="quiz-audio-toolbar__group">
              <legend>{isComplete ? "Avslutningssang" : "Når du er ferdig"}</legend>
              {duringTrack === "theme" && !isComplete && (
                <p className="quiz-audio-toolbar__hint">
                  {THEME_TRACK.label} spilles allerede under quizen.
                </p>
              )}
              {endingOptions.map((track) => (
                <label key={track.id} className="quiz-audio-toolbar__choice">
                  <input
                    type="radio"
                    name="live-ending"
                    checked={endingTrack === track.id}
                    onChange={() => setEndingTrack(track.id as typeof endingTrack)}
                  />
                  <span>{track.label}</span>
                </label>
              ))}
            </fieldset>
          </motion.div>
        )}
      </AnimatePresence>

      {needsGesture && !playing && !muted && (
        <button
          type="button"
          className="quiz-audio-toolbar__btn quiz-audio-toolbar__btn--primary"
          onClick={play}
        >
          Spill {currentLabel}
        </button>
      )}

      <div className="quiz-audio-toolbar__actions">
        <button
          ref={menuToggleRef}
          type="button"
          className="quiz-audio-toolbar__btn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-haspopup="true"
          aria-controls={menuOpen ? menuId : undefined}
        >
          Bytt sang
        </button>

        <button
          type="button"
          className={[
            "quiz-audio-toolbar__btn",
            muteIsPrimary ? "quiz-audio-toolbar__btn--primary" : "",
          ].join(" ")}
          onClick={needsGesture && !playing && !muted ? play : toggleMuted}
          aria-pressed={!muted && playing}
          aria-label={
            muted
              ? "Slå på lyd (nederst til høyre)"
              : playing
                ? `Demp ${currentLabel} (nederst til høyre)`
                : `Spill ${currentLabel} (nederst til høyre)`
          }
        >
          <span className="quiz-audio-toolbar__glyph" aria-hidden>
            {muted ? "Av" : playing ? "På" : "▶"}
          </span>
          <span>{muted ? "Lyd av" : playing ? "Demp lyd" : "Spill lyd"}</span>
        </button>
      </div>
    </div>
  );
}
