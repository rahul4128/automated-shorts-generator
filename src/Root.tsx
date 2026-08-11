import React from "react";
import { Composition, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { ShortVideo } from "./Video";

const FPS = 30;
const FALLBACK_SECONDS = 60;

// Curated, verified museum-cataloged paintings - each confirmed to exist via its own
// dedicated Wikimedia Commons file page (not guessed). Spans Ramayana, Mahabharata,
// Bhagavad Gita, Ganesha, and Hanuman themes.
const IMAGE_POOL = [
  "https://commons.wikimedia.org/wiki/Special:FilePath/Battle%20at%20Lanka%2C%20Ramayana%2C%20Udaipur%2C%201649-53.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Rama%2C%20Sita%2C%20and%20Lakshmana%20at%20the%20Hermitage%20of%20Bharadvaja%20Page%20from%20a%20dispersed%20Ramayana%20%28Story%20of%20King%20Rama%29%2C%20ca.%201780.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Ramayana%20-%20Marriage%20of%20Rama%20Bharata%20Lakshmana%20and%20Shatrughna.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Rama%20and%20Sita%2C%20with%20Lakshmana%20returning%20to%20Ayodhya.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Krishna%20Cleaves%20the%20Demon%20Narakasura%20with%20his%20Discus.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Krishna%20declaring%20the%20end%20of%20Mahabharata%20War%20by%20blowing%20the%20Conch%20Shell.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Krishna%20as%20Envoy.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Krishna%20and%20Arjun%20on%20the%20chariot%2C%20Mahabharata%2C%2018th-19th%20century%2C%20India.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Krishna%20Splits%20the%20Double%20Arjuna%20Tree.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Ganesha%20Basohli%20miniature%20circa%201730%20Dubost%20p73.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Ganesha%20miniature%20painting.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Hanuman%20painting%20c1920.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Hanuman%20painting%20c1920%202.jpg",
];
const NUM_IMAGES = 6;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const RemotionRoot: React.FC = () => {
  const audioFile = staticFile("audio.wav");
  // Picked ONCE here, before rendering spreads across parallel workers - this is
  // what actually guarantees a stable, consistent selection for the whole video.
  const pickedImages = shuffle(IMAGE_POOL).slice(0, NUM_IMAGES);

  return (
    <Composition
      id="ShortVideo"
      component={ShortVideo}
      durationInFrames={FALLBACK_SECONDS * FPS}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{
        audioUrl: audioFile,
        images: pickedImages,
      }}
      calculateMetadata={async () => {
        let seconds = FALLBACK_SECONDS;
        try {
          const detected = await getAudioDurationInSeconds(audioFile);
          if (detected && detected > 0) {
            seconds = detected + 0.5;
          }
        } catch (e) {
          seconds = FALLBACK_SECONDS;
        }
        return {
          durationInFrames: Math.ceil(seconds * FPS),
        };
      }}
    />
  );
};
