import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useDismissiblePanel } from "../hooks/useDismissiblePanel";
import {
  overlayBackdrop,
  overlayPanel,
  staggerContainer,
  staggerItem,
  useMotionVariants,
} from "../lib/motion";

type KeyboardShortcutsHelpProps = {
  open: boolean;
  onClose: () => void;
  optionCount: number;
  submitted: boolean;
};

const SHORTCUT_ROWS = [
  { keys: "1–9", label: "Velg svar (nummer tilsvarer valg)" },
  { keys: "↑ ↓", label: "Flytt markering mellom svar (før du svarer)" },
  { keys: "j / k", label: "Samme som ↑ ↓ før du svarer" },
  { keys: "Enter", label: "Velg markert svar" },
  { keys: "←", label: "Forrige spørsmål" },
  { keys: "Backspace", label: "Forrige spørsmål" },
  { keys: "h", label: "Forrige spørsmål (og ↑ etter du har svart)" },
  { keys: "→", label: "Neste spørsmål" },
  { keys: "l", label: "Neste spørsmål (og ↓ etter du har svart)" },
  { keys: "?", label: "Vis eller skjul denne listen" },
  { keys: "Esc", label: "Lukk hjelpen" },
] as const;

export function KeyboardShortcutsHelp({
  open,
  onClose,
  optionCount,
  submitted,
}: KeyboardShortcutsHelpProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const backdropVariants = useMotionVariants(overlayBackdrop);
  const panelVariants = useMotionVariants(overlayPanel);
  const listVariants = useMotionVariants(staggerContainer);
  const rowVariants = useMotionVariants(staggerItem);

  const handleClose = useCallback(() => onClose(), [onClose]);

  useDismissiblePanel({
    open,
    onClose: handleClose,
    panelRef,
    triggerRef: closeRef,
    trapFocus: true,
    autoFocus: true,
    returnFocus: false,
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const digitRow =
    optionCount > 0
      ? `Taster 1–${Math.min(optionCount, 9)} er koblet til svaralternativene i rekkefølge.`
      : null;

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="keyboard-help overlay-shell"
          role="presentation"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
        >
          <button
            type="button"
            className="keyboard-help__backdrop"
            aria-label="Lukk tastatursnarveier"
            onClick={handleClose}
          />
          <motion.div
            ref={panelRef}
            className="keyboard-help__inner overlay-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="keyboard-help-title"
            tabIndex={-1}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
          >
            <header className="keyboard-help__header">
              <h2
                id="keyboard-help-title"
                className="keyboard-help__title"
                style={{ fontFamily: "var(--font-section)" }}
              >
                Tastatursnarveier
              </h2>
              <button
                ref={closeRef}
                type="button"
                className="keyboard-help__close"
                onClick={handleClose}
                style={{ fontFamily: "var(--font-nav)" }}
              >
                Lukk (Esc)
              </button>
            </header>

            {digitRow && (
              <p className="keyboard-help__note" style={{ fontFamily: "var(--font-body)" }}>
                {digitRow}
              </p>
            )}
            {submitted && (
              <p className="keyboard-help__note" style={{ fontFamily: "var(--font-body)" }}>
                Etter du har svart kan du også bruke ↑ og k for forrige spørsmål, ↓ og j for
                neste.
              </p>
            )}

            <motion.ul
              className="keyboard-help__list"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {SHORTCUT_ROWS.map((row) => (
                <motion.li
                  key={row.keys}
                  className="keyboard-help__row"
                  variants={rowVariants}
                >
                  <kbd className="keyboard-help__kbd">{row.keys}</kbd>
                  <span className="keyboard-help__label">{row.label}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
