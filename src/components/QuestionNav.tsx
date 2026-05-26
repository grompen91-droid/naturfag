import type { ReactNode } from "react";

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
  return (
    <nav
      className="flex w-full max-w-[400px] shrink-0 items-center justify-between gap-3 pt-2"
      aria-label="Spørsmålsnavigasjon"
    >
      <NavButton onClick={onBack} disabled={!canBack} variant="back">
        Tilbake
      </NavButton>
      <NavButton onClick={onNext} disabled={!canNext} variant="next">
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
}: {
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
  variant: "back" | "next";
}) {
  const isNext = variant === "next";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "min-h-[44px] shrink-0 whitespace-nowrap border-2 border-solid px-4 py-2 text-base leading-none",
        "transition-[opacity,filter] duration-150 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-blue)]/40",
        "disabled:cursor-not-allowed disabled:opacity-40",
        !disabled && isNext ? "hover:brightness-105" : "",
        !disabled && !isNext ? "hover:brightness-[0.97]" : "",
      ].join(" ")}
      style={{
        fontFamily: "var(--font-nav)",
        borderRadius: "var(--radius-sm)",
        backgroundColor: isNext
          ? "var(--color-blue)"
          : "var(--color-blue-light-active)",
        borderColor: isNext ? "var(--color-blue-dark)" : "var(--color-blue)",
        color: isNext ? "var(--color-on-blue)" : "var(--color-text)",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      {children}
    </button>
  );
}
