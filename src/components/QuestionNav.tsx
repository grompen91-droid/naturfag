import { motion } from "motion/react";
import type { ReactNode } from "react";
import { pressableHover, pressableTap } from "../lib/pressable-motion";
import { springSnappy, useMotionTransition } from "../lib/motion";

type QuestionNavProps = {
  onBack: () => void;
  onNext: () => void;
  canBack: boolean;
  canNext: boolean;
};

export function QuestionNav({
  onBack,
  onNext,
  canBack,
  canNext,
}: QuestionNavProps) {
  const transition = useMotionTransition(springSnappy);

  return (
    <nav
      className="flex w-full shrink-0 items-center justify-between gap-3 pt-2"
      aria-label="Spørsmålsnavigasjon"
    >
      <NavButton onClick={onBack} disabled={!canBack} variant="back" transition={transition}>
        Tilbake
      </NavButton>
      <NavButton onClick={onNext} disabled={!canNext} variant="next" transition={transition}>
        Neste
      </NavButton>
    </nav>
  );
}

function NavButton({
  children,
  onClick,
  disabled,
  variant,
  transition,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
  variant: "back" | "next";
  transition: ReturnType<typeof useMotionTransition>;
}) {
  const isNext = variant === "next";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "min-h-[44px] shrink-0 whitespace-nowrap border-2 border-solid px-4 py-2 text-base leading-none",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-blue)]/40",
        "disabled:cursor-not-allowed disabled:opacity-40",
      ].join(" ")}
      style={{
        fontFamily: "var(--font-nav)",
        borderRadius: "var(--radius-sm)",
        backgroundColor: isNext
          ? "var(--color-blue)"
          : "var(--color-blue-light-active)",
        borderColor: isNext ? "var(--color-blue-dark)" : "var(--color-blue)",
        color: isNext ? "var(--color-on-blue)" : "var(--color-text)",
      }}
      whileHover={!disabled ? pressableHover : undefined}
      whileTap={!disabled ? pressableTap : undefined}
      transition={transition}
    >
      {children}
    </motion.button>
  );
}
