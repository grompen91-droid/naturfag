export type DuringTrackId = "none" | "theme";
export type EndingTrackId = "theme" | "ending" | "kjernens";

export type QuizTrack = {
  id: EndingTrackId | "theme";
  src: string;
  label: string;
  description: string;
  loop: boolean;
};

export const THEME_TRACK: QuizTrack = {
  id: "theme",
  src: "/naturfag_theme.wav",
  label: "Bærekraftens stemme",
  description: "Rolig temamusikk på loop mens du jobber med quizen.",
  loop: true,
};

export const ENDING_TRACKS: Record<Exclude<EndingTrackId, "theme">, QuizTrack> = {
  ending: {
    id: "ending",
    src: "/naturfag_ending.wav",
    label: "Grønt håp",
    description: "Triumferende avslutning med norsk diktopplesning.",
    loop: false,
  },
  kjernens: {
    id: "kjernens",
    src: "/Kjernens_tyngde.mp3",
    label: "Kjernens tyngde",
    description: "Sangen om atomkraft og krefter i kjernen.",
    loop: false,
  },
};

export function getAvailableEndingTracks(
  duringTrack: DuringTrackId,
): EndingTrackId[] {
  if (duringTrack === "theme") {
    return ["ending", "kjernens"];
  }
  return ["theme", "ending", "kjernens"];
}

export function getEndingTrackOptions(duringTrack: DuringTrackId): QuizTrack[] {
  return getAvailableEndingTracks(duringTrack).map((id) =>
    id === "theme" ? THEME_TRACK : ENDING_TRACKS[id],
  );
}

export function isEndingTrackAllowed(
  duringTrack: DuringTrackId,
  endingTrack: EndingTrackId,
): boolean {
  return getAvailableEndingTracks(duringTrack).includes(endingTrack);
}

export function getTrackById(id: EndingTrackId | "theme"): QuizTrack {
  if (id === "theme") return THEME_TRACK;
  return ENDING_TRACKS[id];
}
