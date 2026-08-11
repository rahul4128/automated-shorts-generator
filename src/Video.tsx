import React from "react";
import { AbsoluteFill, Audio, Img, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface Props {
  audioUrl: string;
}

// Curated real, verified public-domain artwork - cycles through all of these within one video.
// (Ganesh entry removed - that exact Wikimedia filename failed to resolve.)
const IMAGES = [
  "https://commons.wikimedia.org/wiki/Special:FilePath/Fresco%20depicting%20a%20scene%20from%20the%20Indic%20epic%2C%20the%20Mahabharata%2C%20with%20Krishna%20and%20Arjuna%2C%20from%20Mansar%20Haveli.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Rama%20breaking%20the%20bow%20of%20lord%20Shiva%20in%20the%20court%20of%20Raja%20Janaka.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Brooklyn%20Museum%20-%20Krishna%20Counsels%20the%20Pandava%20Leaders%20Page%20from%20a%20Mahabharata%20series.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Ascent%20of%20Rama%2C%20From%20the%20Mewar%20Ramayana.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Shiva%27s%20Twilight%20Dance%20LACMA%20M.77.154.31.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Illustration%20of%20the%20Mahabharata.jpg",
];

export const ShortVideo: React.FC<Props> = ({ audioUrl }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const segmentLen = durationInFrames / IMAGES.length;
  const fadeFrames = 10;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {IMAGES.map((src, i) => {
        const segStart = i * segmentLen;
        const localFrame = frame - segStart;
        if (localFrame < -fadeFrames || localFrame > segmentLen + fadeFrames) return null;

        const opacity = interpolate(
          localFrame,
          [0, fadeFrames, segmentLen - fadeFrames, segmentLen],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const zoom = interpolate(localFrame, [0, segmentLen], [1, 1.1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <AbsoluteFill key={i} style={{ opacity }}>
            <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
              <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </AbsoluteFill>
          </AbsoluteFill>
        );
      })}
      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  );
};
