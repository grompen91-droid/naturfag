import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type UseDismissiblePanelOptions = {
  open: boolean;
  onClose: () => void;
  panelRef: RefObject<HTMLElement | null>;
  triggerRef?: RefObject<HTMLElement | null>;
  /** Trap Tab within the panel while open. */
  trapFocus?: boolean;
  /** Move focus to the first focusable element when opened. */
  autoFocus?: boolean;
  /** Return focus to the trigger when closed. */
  returnFocus?: boolean;
  dismissOnEscape?: boolean;
  dismissOnOutsideClick?: boolean;
};

function getFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
  );
}

export function useDismissiblePanel({
  open,
  onClose,
  panelRef,
  triggerRef,
  trapFocus = false,
  autoFocus = true,
  returnFocus = true,
  dismissOnEscape = true,
  dismissOnOutsideClick = true,
}: UseDismissiblePanelOptions) {
  useEffect(() => {
    if (!open) return;

    if (autoFocus) {
      const panel = panelRef.current;
      if (panel) {
        const focusables = getFocusables(panel);
        (focusables[0] ?? panel).focus();
      }
    }

    const closeAndReturnFocus = () => {
      onClose();
      if (returnFocus) {
        requestAnimationFrame(() => triggerRef?.current?.focus());
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      if (!dismissOnOutsideClick) return;
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef?.current?.contains(target)) return;
      closeAndReturnFocus();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dismissOnEscape) {
        event.preventDefault();
        event.stopPropagation();
        closeAndReturnFocus();
        return;
      }

      if (!trapFocus || event.key !== "Tab" || !panelRef.current) return;

      const focusables = getFocusables(panelRef.current);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !panelRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !panelRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [
    open,
    onClose,
    panelRef,
    triggerRef,
    trapFocus,
    autoFocus,
    returnFocus,
    dismissOnEscape,
    dismissOnOutsideClick,
  ]);
}
