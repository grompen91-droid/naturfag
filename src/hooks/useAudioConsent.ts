import { useCallback, useState } from "react";
import {
  hasAudioConsent,
  saveAudioConsentNoAudio,
  saveAudioConsentWithSongs,
} from "../lib/audio-preference";
import type { DuringTrackId, EndingTrackId } from "../lib/quiz-audio-tracks";

export function useAudioConsent() {
  const [consented, setConsented] = useState(hasAudioConsent);

  const acceptWithoutAudio = useCallback(() => {
    saveAudioConsentNoAudio();
    setConsented(true);
  }, []);

  const acceptWithAudio = useCallback(
    (duringTrack: DuringTrackId, endingTrack: EndingTrackId) => {
      saveAudioConsentWithSongs(duringTrack, endingTrack);
      setConsented(true);
    },
    [],
  );

  return {
    hasConsent: consented,
    acceptWithAudio,
    acceptWithoutAudio,
  };
}
