import { useRef, type ReactNode } from "react";

type ScrollSnapRootProps = {
  children: ReactNode;
};

export function ScrollSnapRoot({ children }: ScrollSnapRootProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="h-[100dvh] w-full overflow-y-auto overscroll-y-contain"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {children}
    </div>
  );
}
