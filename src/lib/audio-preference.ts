import {
  getAvailableEndingTracks,
  isEndingTrackAllowed,
  type DuringTrackId,
  type EndingTrackId,
} from "./quiz-audio-tracks";

export const AUDIO_CONSENT_KEY = "naturfag-audio-consent";
export const THEME_MUTED_KEY = "naturfag-theme-muted";
export const DURING_TRACK_KEY = "naturfag-during-track";
export const ENDING_TRACK_KEY = "naturfag-ending-track";

export type AudioConsentChoice = "with-audio" | "no-audio";

export type AudioPreferences = {
  consent: AudioConsentChoice;
  duringTrack: DuringTrackId;
  endingTrack: EndingTrackId;
  muted: boolean;
};

const DEFAULT_ENDING: EndingTrackId = "ending";

function normalizeEndingTrack(
  duringTrack: DuringTrackId,
  endingTrack: string | null,
): EndingTrackId {
  const candidate = endingTrack as EndingTrackId;
  if (candidate && isEndingTrackAllowed(duringTrack, candidate)) {
    return candidate;
  }
  return getAvailableEndingTracks(duringTrack)[0] ?? DEFAULT_ENDING;
}

export function hasAudioConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(AUDIO_CONSENT_KEY) !== null;
  } catch {
    return false;
  }
}

export function readAudioPreferences(): AudioPreferences {
  if (typeof window === "undefined") {
    return {
      consent: "no-audio",
      duringTrack: "none",
      endingTrack: DEFAULT_ENDING,
      muted: true,
    };
  }

  try {
    const consent =
      (window.localStorage.getItem(AUDIO_CONSENT_KEY) as AudioConsentChoice | null) ??
      "no-audio";
    const duringTrack =
      (window.localStorage.getItem(DURING_TRACK_KEY) as DuringTrackId | null) ?? "none";
    const endingRaw = window.localStorage.getItem(ENDING_TRACK_KEY);
    const muted = window.localStorage.getItem(THEME_MUTED_KEY) === "1";

    if (consent === "no-audio") {
      return {
        consent: "no-audio",
        duringTrack: "none",
        endingTrack: DEFAULT_ENDING,
        muted: true,
      };
    }

    return {
      consent: "with-audio",
      duringTrack: duringTrack === "theme" ? "theme" : "none",
      endingTrack: normalizeEndingTrack(
        duringTrack === "theme" ? "theme" : "none",
        endingRaw,
      ),
      muted,
    };
  } catch {
    return {
      consent: "no-audio",
      duringTrack: "none",
      endingTrack: DEFAULT_ENDING,
      muted: true,
    };
  }
}

export function readThemeMuted(): boolean {
  return readAudioPreferences().muted;
}

export function saveAudioPreferences(prefs: AudioPreferences): void {
  try {
    window.localStorage.setItem(AUDIO_CONSENT_KEY, prefs.consent);
    window.localStorage.setItem(DURING_TRACK_KEY, prefs.duringTrack);
    window.localStorage.setItem(ENDING_TRACK_KEY, prefs.endingTrack);
    window.localStorage.setItem(THEME_MUTED_KEY, prefs.muted ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function saveAudioConsentNoAudio(): void {
  saveAudioPreferences({
    consent: "no-audio",
    duringTrack: "none",
    endingTrack: DEFAULT_ENDING,
    muted: true,
  });
}

export function saveAudioConsentWithSongs(
  duringTrack: DuringTrackId,
  endingTrack: EndingTrackId,
): void {
  saveAudioPreferences({
    consent: "with-audio",
    duringTrack,
    endingTrack,
    muted: false,
  });
}

export function saveThemeMuted(muted: boolean): void {
  try {
    window.localStorage.setItem(THEME_MUTED_KEY, muted ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function saveTrackSelection(
  duringTrack: DuringTrackId,
  endingTrack: EndingTrackId,
): void {
  const prefs = readAudioPreferences();
  if (prefs.consent !== "with-audio") return;

  const normalizedEnding = isEndingTrackAllowed(duringTrack, endingTrack)
    ? endingTrack
    : normalizeEndingTrack(duringTrack, endingTrack);

  saveAudioPreferences({
    ...prefs,
    duringTrack,
    endingTrack: normalizedEnding,
  });
}
