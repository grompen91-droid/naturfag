# Project Theme, Visuals & Audio Assets: "Bærekraftens Stemme"

This document contains all theme assets, custom lyrics, and design ideas for the **Naturfag Quiz** project. This file is structured specifically so that an AI development agent can read it and implement these features directly in the codebase.

---

## 🎨 1. Theme Image Asset
The generated visual identity for the quiz represents **Naturfag og Bærekraft** (Natural Science and Sustainability). It shows a glowing atomic structure intertwined with green leaves, a clean Norwegian water stream, a wind turbine, and a mangrove forest background.

* **Asset Path:** `/public/naturfag_quiz_hero.png`
* **Relative URL for React Components:** `/naturfag_quiz_hero.png`

### React Integration Code (Tailwind CSS v4):
An agent can render this image in a landing page or sidebar with the following modern layout:
```tsx
export function QuizHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-emerald-500/30">
      <img 
        src="/naturfag_quiz_hero.png" 
        alt="Naturfag og Bærekraft" 
        className="w-full h-auto object-cover rounded-xl border border-white/5 shadow-inner"
        loading="eager"
      />
      <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-950/80 backdrop-blur-sm border border-white/10">
        <h3 className="text-xl font-bold text-emerald-400">Naturfag & Bærekraft</h3>
        <p className="text-sm text-slate-300 mt-1">Energi, matproduksjon og klodens fremtid.</p>
      </div>
    </div>
  );
}
```

---

## 🔊 2. Main Theme Audio Asset (Synthesized Loop)
I have programmatically synthesized a beautiful **32-second atmospheric ambient synth track** representing the themes of natural science and ecosystems. It features warm chord pads (Am - F - C - G progression), sub-bass undertones, and delicate high-pitch digital bells playing a flowing arpeggio.

* **Asset Path:** `/public/naturfag_theme.wav`
* **Relative URL for React Components:** `/naturfag_theme.wav`
* **Audio Characteristics:** 44.1 kHz, 16-bit PCM Mono, seamless loop, 120 BPM.

### Drop-in React Audio Player Component:
Your other agent can create `src/components/AudioPlayer.tsx` and paste this code to add atmospheric sound:
```tsx
import React, { useRef, useState } from 'react';

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("User interaction required: ", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/80 p-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-emerald-500/30">
      <audio 
        ref={audioRef} 
        src="/naturfag_theme.wav" 
        loop 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Play/Pause Button */}
      <button 
        onClick={togglePlay}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        title={isPlaying ? "Mute Theme Song" : "Play Theme Song"}
      >
        {isPlaying ? "⏸" : "🎵"}
      </button>

      {/* Info & Volume Slider */}
      <div className="flex flex-col pr-2">
        <span className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">Tema-Sang</span>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-400">Volum</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={volume} 
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
```

---

## 🎉 3. Triumphant Ending Song: "Grønt Håp" (With Spoken Norwegian Vocals!)
I have mathematically synthesized a **bright, celebratory C-major triumphant instrumental track** (chords: C - G - Am - F) with joyful chime bells and mixed it with **expressive, high-quality Norwegian spoken vocals** reading the ending poem. This creates a fully produced audio experience for when the student completes the quiz!

* **Asset Path:** `/public/naturfag_ending.wav`
* **Relative URL for React Components:** `/naturfag_ending.wav`
* **Audio Characteristics:** 44.1 kHz, 16-bit PCM Mono, 24 seconds, mixed backing + vocals.

---

## 🖥️ 4. Guide: Generating Audio/Songs Using Gemini in the Browser

If you want to use **Google AI Studio in your browser** to visually generate, listen to, and download high-quality vocal tracks directly from Gemini, follow these step-by-step instructions.

### Step 1: Open Google AI Studio
1. Navigate to [aistudio.google.com](https://aistudio.google.com) in your web browser.
2. Sign in with your Google account.

### Step 2: Choose a Multimodal Model
1. In the right-hand configuration panel, locate the **Model** dropdown.
2. Select a model that natively supports **Audio output**, such as **Gemini 2.5 Flash** or **Gemini 2.0 Flash**.

### Step 3: Enable the Audio Modality
1. Under the settings/run panel on the right side, find the **Response Modality** setting.
2. Change the response modality from **Text** to **Audio**.
3. (Optional) Choose a voice profile under **Voice Settings**. For theatrical, emotional, or sung narrations, **`Aoede`** (expressive/dramatic) or **`Puck`** (energetic) are recommended.

### Step 4: Write the Vocal Synthesis Prompt
Copy-paste this exact prompt into the input text box to instruct Gemini to perform the lyrics:

```text
You are an exceptionally talented vocal artist and narrator. I want you to read and perform the following Norwegian poem. 

Please perform it in a slow, emotional, and highly expressive theatrical rhythm (matching an atmospheric indie-pop song around 90-100 BPM). Add natural pauses between sections to let the atmosphere settle. Pronounce the Norwegian words naturally and beautifully.

POEM TO PERFORM:
"Inni kjernen av et lite atom
Ligger krefter som kan lyse opp et rom
Men veien er lang, og avfallet tungt
Skal vi lagre det dypt, skal det holdes ungt?
Mens vinden suser over fjell og hei
Og vannet fosser ned en grønnere vei
Her i nord har vi elver som glitrer av stål
Er atomkraften svaret på klodens mål?

Å, hør bærekraftens stemme som slår!
Hvert valg vi tar er jorden vi får.
Fra atomets kjerne til skogens vind
Slipper vi vitenskap og fremtid inn!"
```

### Step 5: Generate and Listen
1. Click the **Run** (or Submit) button.
2. Gemini will generate the response. Instead of text, you will see a **custom audio player** render directly in the chat panel.
3. Click the play button to listen to Gemini perform the song/poem!

### Step 6: Download and Use in Your Project
1. On the audio player generated by Gemini, click the **three dots menu** (Options).
2. Click **Download** to save the generated file (it will download as an `.mp3` or `.wav` file).
3. Rename the file to `naturfag_gemini_vocals.mp3`.
4. Drag and drop the downloaded file into your project's `/public/` directory.
5. In your React component, you can now load this file directly:
   ```tsx
   const audio = new Audio('/naturfag_gemini_vocals.mp3');
   audio.play();
   ```

---

## 🤖 5. Gemini Multimodal Audio Client-Side Integration (React SDK)
To dynamically generate speech in real-time within your React app instead of downloading static files, use this client-side template:

```tsx
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/generative-ai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export function GeminiVoiceGuide() {
  const [loading, setLoading] = useState(false);

  const generateLyricsReading = async () => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Read with a slow, expressive tone: "Inni kjernen av et lite atom..."',
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Aoede" 
              }
            }
          }
        }
      });

      const candidate = response.candidates?.[0];
      const audioPart = candidate?.content?.parts?.find(part => part.inlineData && part.inlineData.mimeType.startsWith('audio/'));

      if (audioPart && audioPart.inlineData) {
        const base64Data = audioPart.inlineData.data;
        const mimeType = audioPart.inlineData.mimeType;

        const binary = atob(base64Data);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([array], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const audio = new Audio(url);
        audio.play();
      }
    } catch (error) {
      console.error("Gemini Audio Generation failed: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={generateLyricsReading} disabled={loading}>
      {loading ? "Genererer lyd..." : "▶ Spill av med Gemini Voice"}
    </button>
  );
}
```

---

## 🎵 6. Theme Song: "Bærekraftens Stemme" (The Voice of Sustainability)
* **Genre:** Atmospheric Electro-pop / Modern Norwegian Indie Folk (Inspired by Aurora, Highasakite, and Alan Walker)
* **Instrumentation:** Sweeping synthesizers, acoustic guitar, clean piano, driving electronic percussion, and ethereal vocal harmonies.
* **Tempo:** 120 BPM (0.5s quarter notes), emotional and hopeful.

### 🇳🇴 Norwegian Version (Official Lyrics)
```text
[Vers 1: Energi og Krefter]
Inni kjernen av et lite atom
Ligger krefter som kan lyse opp et rom
Men veien er lang, og avfallet tungt
Skal vi lagre det dypt, skal det holdes ungt?
Mens vinden suser over fjell og hei
Og vannet fosser ned en grønnere vei
Her i nord har vi elver som glitrer av stål
Er atomkraften svaret på klodens mål?

[Refreng]
Å, hør bærekraftens stemme som slår!
Hvert valg vi tar er jorden vi får.
Fra atomets kjerne til skogens vind
Slipper vi vitenskap og fremtid inn!
Naturfag og vilje, hånd i hånd
Vi knytter jorden i grønnere bånd.

[Vers 2: Bærekraftig Mat]
Fra erter og bønner til grønnkål og bygg
Er veien til tallerkenen grønn og trygg.
Men energien svinner når kornet blir fôr
Vi mister så mye på vår rike jord.
Spis det som spirer, spis det i sesong
Kortreiste smaker gjør reisen mindre lang.
Kast ikke maten, spar på hver bit
La oss vende om jorden med ny flid!

[Vers 3: Mangrovene og Havet]
Langt borte i sør, der mangrovene står
Med røtter i havet som leger våre sår
De lagrer vår CO₂, dyp og tro
Men scampi-farmer truer deres ro.
Når skogene faller og havbunnen dør
Kan vi ikke leve som vi gjorde før!
Bærekraft er maten som etterlater spor
Så små at de nesten ikke merkes av mor.

[Bro]
(Crescendo - trommer bygger seg opp, strykere sveller)
Vi spør, vi lærer, vi finner et svar!
Hva vil vi beholde av alt det vi har?
Det handler om krefter, om mat og om strøm
Vi bygger en fremtid, vi lever en drøm!

[Outro]
(Rolig, piano og vokal)
Et lite atom...
En mangrovegren...
La jorden få puste.
La fremtiden bli ren.
(Naturfag og bærekraft...)
```
