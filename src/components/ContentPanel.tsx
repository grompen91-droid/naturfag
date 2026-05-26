type ContentPanelProps = {
  title: string;
  body: string[];
};

export function ContentPanel({ title, body }: ContentPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface)] p-3 md:p-[10px]">
      <h2
        className="mb-2 shrink-0 text-xl leading-tight md:text-2xl"
        style={{ fontFamily: "var(--font-title)", color: "var(--color-text)" }}
      >
        {title}
      </h2>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {body.map((paragraph, i) => (
          <p
            key={i}
            className="mb-3 max-w-prose text-base leading-relaxed last:mb-0"
            style={{ fontFamily: "var(--font-body)", color: "var(--color-text)" }}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
