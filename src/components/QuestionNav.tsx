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
    <div className="flex w-full max-w-[400px] shrink-0 items-center justify-center gap-[50px]">
      <NavButton onClick={onBack} disabled={!canBack} variant="back">
        Tilbake
      </NavButton>
      <NavButton onClick={onNext} disabled={!canNext} variant="next">
        Neste spørsmål
      </NavButton>
    </div>
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
      className="shrink-0 whitespace-nowrap border-2 border-solid px-4 py-2 text-[18px] leading-none transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      style={{
        fontFamily: "var(--font-nav)",
        borderRadius: 0,
        backgroundColor: isNext
          ? "var(--color-blue)"
          : "var(--color-blue-light-active)",
        borderColor: isNext ? "var(--color-blue-dark)" : "var(--color-blue)",
        color: isNext ? "#ffffff" : "var(--color-text)",
      }}
    >
      {children}
    </button>
  );
}
