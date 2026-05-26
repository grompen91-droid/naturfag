type VideoSectionProps = {
  src: string;
};

export function VideoSection({ src }: VideoSectionProps) {
  return (
    <section
      className="flex h-[100dvh] w-full shrink-0 snap-start snap-always items-center justify-center"
      style={{ backgroundColor: "var(--color-video-bg)" }}
    >
      <video
        className="max-h-full max-w-full object-contain"
        src={src}
        controls
        playsInline
        preload="metadata"
      >
        <track kind="captions" />
      </video>
    </section>
  );
}
