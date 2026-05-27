import { useRef, type ReactNode } from "react";

type ScrollSnapRootProps = {
  children: ReactNode;
  className?: string;
};

export function ScrollSnapRoot({ children, className }: ScrollSnapRootProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      data-scroll-root
      className={[
        "h-[100dvh] w-full min-w-0 overflow-y-auto overscroll-y-contain",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ scrollSnapType: "y mandatory" }}
    >
      {children}
    </div>
  );
}
