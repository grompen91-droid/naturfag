type ContentPanelProps = {
  title: string;
  body: string[];
};

export function ContentPanel({ title, body }: ContentPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white p-[10px]">
      <h2
        className="mb-0 shrink-0 text-[40px] leading-normal text-[var(--color-text)]"
        style={{ fontFamily: "var(--font-title)" }}
      >
        {title}
      </h2>
      <div className="mt-[10px] min-h-0 flex-1 overflow-y-auto">
        {body.map((paragraph, i) => (
          <p
            key={i}
            className="mb-0 text-[18px] leading-normal text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
