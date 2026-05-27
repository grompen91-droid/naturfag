import { useEffect, useRef, useState } from "react";
import { useDismissiblePanel } from "../hooks/useDismissiblePanel";
import { motion } from "motion/react";
import { TrackPreviewButton } from "./TrackPreviewButton";
import { useAudioPreview } from "../hooks/useAudioPreview";
import {
  getAvailableEndingTracks,
  getEndingTrackOptions,
  THEME_TRACK,
  type DuringTrackId,
  type EndingTrackId,
} from "../lib/quiz-audio-tracks";
import { overlayPanel, springSnap, useMotionTransition, useMotionVariants } from "../lib/motion";

type AudioConsentGateProps = {
  loading?: boolean;
  onAcceptWithAudio: (duringTrack: DuringTrackId, endingTrack: EndingTrackId) => void;
  onAcceptWithoutAudio: () => void;
};

export function AudioConsentGate({
  loading = false,
  onAcceptWithAudio,
  onAcceptWithoutAudio,
}: AudioConsentGateProps) {
  const transition = useMotionTransition(springSnap);
  const panelVariants = useMotionVariants(overlayPanel);
  const panelRef = useRef<HTMLDivElement>(null);
  const { previewingId, preview } = useAudioPreview();

  useDismissiblePanel({
    open: true,
    onClose: () => {},
    panelRef,
    trapFocus: true,
    autoFocus: true,
    returnFocus: false,
    dismissOnEscape: false,
    dismissOnOutsideClick: false,
  });

  const [duringTrack, setDuringTrack] = useState<DuringTrackId>("none");
  const [endingTrack, setEndingTrack] = useState<EndingTrackId>("ending");

  useEffect(() => {
    const allowed = getAvailableEndingTracks(duringTrack);
    if (!allowed.includes(endingTrack)) {
      setEndingTrack(allowed[0] ?? "ending");
    }
  }, [duringTrack, endingTrack]);

  const endingOptions = getEndingTrackOptions(duringTrack);

  return (
    <motion.div
      className="audio-consent overlay-shell"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-consent-title"
      aria-describedby="audio-consent-desc"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
    >
      <motion.div
        ref={panelRef}
        className="audio-consent__panel audio-consent__panel--wide overlay-panel"
        tabIndex={-1}
        initial="hidden"
        animate="visible"
        variants={panelVariants}
      >
        <p
          className="audio-consent__eyebrow"
          style={{ fontFamily: "var(--font-nav)", color: "var(--color-blue)" }}
        >
          Lyd på denne siden
        </p>
        <h1
          id="audio-consent-title"
          className="audio-consent__title"
          style={{ fontFamily: "var(--font-section)", color: "var(--color-text)" }}
        >
          Velg musikk for quizen
        </h1>
        <p
          id="audio-consent-desc"
          className="audio-consent__body"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-text)" }}
        >
          Du kan ha musikk mens du svarer, og en annen sang når du er ferdig. Trykk{" "}
          <strong>5s</strong> for å høre et kort utdrag før du velger.
        </p>
        <p
          className="audio-consent__highlight"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-text)" }}
        >
          <strong>Vil du dempe musikken senere?</strong> Bruk demp-knappen{" "}
          <strong>nederst til høyre</strong> på skjermen (knappene «Bytt sang» og «Demp lyd»).
          Der kan du også <strong>bytte sang</strong>.
        </p>

        <div className="audio-consent__choices">
        <fieldset className="audio-consent__fieldset">
          <legend
            className="audio-consent__legend"
            style={{ fontFamily: "var(--font-section)", color: "var(--color-text)" }}
          >
            Under quizen
          </legend>
          <p
            className="audio-consent__hint"
            style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
          >
            Kun temamusikken kan spilles på loop mens du jobber.
          </p>
          <div className="audio-consent__option-row">
            <label className="audio-consent__option">
              <input
                type="radio"
                name="during-track"
                value="none"
                checked={duringTrack === "none"}
                onChange={() => setDuringTrack("none")}
              />
              <span>
                <strong style={{ fontFamily: "var(--font-nav)" }}>Ingen musikk</strong>
                <span
                  className="audio-consent__option-desc"
                  style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
                >
                  Stille mens du svarer — du kan fortsatt velge avslutningssang nedenfor.
                </span>
              </span>
            </label>
          </div>
          <div className="audio-consent__option-row">
            <label className="audio-consent__option">
              <input
                type="radio"
                name="during-track"
                value="theme"
                checked={duringTrack === "theme"}
                onChange={() => setDuringTrack("theme")}
              />
              <span>
                <strong style={{ fontFamily: "var(--font-nav)" }}>{THEME_TRACK.label}</strong>
                <span
                  className="audio-consent__option-desc"
                  style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
                >
                  {THEME_TRACK.description}
                </span>
              </span>
            </label>
            <TrackPreviewButton
              label={THEME_TRACK.label}
              isPreviewing={previewingId === THEME_TRACK.id}
              onPreview={() => preview(THEME_TRACK.id, THEME_TRACK.src)}
            />
          </div>
        </fieldset>

        <fieldset className="audio-consent__fieldset">
          <legend
            className="audio-consent__legend"
            style={{ fontFamily: "var(--font-section)", color: "var(--color-text)" }}
          >
            Når du er ferdig
          </legend>
          {duringTrack === "theme" ? (
            <p
              className="audio-consent__hint"
              style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
            >
              Du hører allerede {THEME_TRACK.label} under quizen, så den kan ikke spilles
              på nytt til slutt.
            </p>
          ) : (
            <p
              className="audio-consent__hint"
              style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
            >
              Velg hvilken sang som spilles på oppsummeringen.
            </p>
          )}
          {endingOptions.map((track) => (
            <div key={track.id} className="audio-consent__option-row">
              <label className="audio-consent__option">
                <input
                  type="radio"
                  name="ending-track"
                  value={track.id}
                  checked={endingTrack === track.id}
                  onChange={() => setEndingTrack(track.id as EndingTrackId)}
                />
                <span>
                  <strong style={{ fontFamily: "var(--font-nav)" }}>{track.label}</strong>
                  <span
                    className="audio-consent__option-desc"
                    style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
                  >
                    {track.description}
                  </span>
                </span>
              </label>
              <TrackPreviewButton
                label={track.label}
                isPreviewing={previewingId === track.id}
                onPreview={() => preview(track.id, track.src)}
              />
            </div>
          ))}
        </fieldset>
        </div>

        <div className="audio-consent__actions">
          <button
            type="button"
            className="audio-consent__btn audio-consent__btn--primary"
            onClick={() => onAcceptWithAudio(duringTrack, endingTrack)}
            style={{ fontFamily: "var(--font-nav)" }}
          >
            Fortsett med valgt musikk
          </button>
          <button
            type="button"
            className="audio-consent__btn audio-consent__btn--secondary"
            onClick={onAcceptWithoutAudio}
            style={{ fontFamily: "var(--font-nav)" }}
          >
            Fortsett uten lyd
          </button>
        </div>

        {loading && (
          <p
            className="audio-consent__loading"
            role="status"
            style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
          >
            Laster quiz i bakgrunnen…
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
