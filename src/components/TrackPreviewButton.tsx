type TrackPreviewButtonProps = {
  label: string;
  isPreviewing: boolean;
  onPreview: () => void;
};

export function TrackPreviewButton({
  label,
  isPreviewing,
  onPreview,
}: TrackPreviewButtonProps) {
  return (
    <button
      type="button"
      className="audio-preview-btn"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onPreview();
      }}
      aria-pressed={isPreviewing}
      aria-label={
        isPreviewing ? `Stopper forhåndsvisning av ${label}` : `Forhåndsvis ${label} i 5 sekunder`
      }
      title={isPreviewing ? "Stopp" : "Forhåndsvis (5 sek)"}
      style={{ fontFamily: "var(--font-nav)" }}
    >
      {isPreviewing ? "■" : "▶"}
      <span className="audio-preview-btn__text">{isPreviewing ? "Stopp" : "5s"}</span>
    </button>
  );
}
