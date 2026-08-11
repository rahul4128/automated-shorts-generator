import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  delayRender,
  continueRender,
} from "remotion";

interface Props {
  audioUrl: string;
}

const CATEGORIES = [
  "Krishna",
  "Rama",
  "Mahabharata",
  "Ramayana",
  "Shiva",
  "Ganesha",
  "Vishnu",
  "Hanuman",
];

const FALLBACK_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Fresco%20depicting%20a%20scene%20from%20the%20Indic%20epic%2C%20the%20Mahabharata%2C%20with%20Krishna%20and%20Arjuna%2C%20from%20Mansar%20Haveli.jpg";

async function fetchCategoryImages(category: string, limit = 20): Promise<string[]> {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(
    category
  )}&cmtype=file&cmlimit=${limit}&format=json&origin=*`;
  const res = await fetch(url);
  const data = await res.json();
  const members = data?.query?.categorymembers || [];
  return members
    .map((m: any) => m.title as string)
    .filter((t: string) => /\.(jpg|jpeg|png)$/i.test(t));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const NUM_IMAGES = 3;

export const ShortVideo: React.FC<Props> = ({ audioUrl }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const [images, setImages] = useState<string[] | null>(null);
  const [handle] = useState(() => delayRender("Fetching fresh devotional artwork from Wikimedia"));

  useEffect(() => {
     (async () => {
      try {
        const picks = shuffle(CATEGORIES).slice(0, 4);
        const results = await Promise.all(picks.map((c) => fetchCategoryImages(c)));
        const unique = Array.from(new Set(results.flat()));
        let titles = shuffle(unique).slice(0, NUM_IMAGES);
        if (titles.length === 0) {
          setImages([FALLBACK_IMAGE]);
        } else {
          const urls = titles.map(
            (t) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(t.replace(/^File:, ""))}`
          );
          setImages(urls);
        }
      } catch (e) {
        setImages([FALLBACK_IMAGE]);
      } finally {
        continueRender(handle);
      }
    })();
  }, [handle]);

  if (!images) return null;

  const segmentLen = durationInFrames / images.length;

  // Hard cut between images - no crossfade/overlap. Only the image whose
  // segment we're currently in gets rendered at all.
  const currentIndex = Math.min(Math.floor(frame / segmentLen), images.length - 1);
  const src = images[currentIndex];
  const localFrame = frame - currentIndex * segmentLen;
  const zoom = interpolate(localFrame, [0, segmentLen], [1, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill key={src} style={{ transform: `scale(${zoom})` }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  );
};
