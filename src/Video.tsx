import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

interface SceneInput {
  image: string; // remote https:// URL, or a filename relative to public/
  durationInSeconds: number; // measured length of this scene's own narration clip
}

interface Props {
  audioUrl: string;
  imageUrl?: string; // legacy single-image fallback, kept for back-compat
  images?: string[]; // legacy: one entry per story beat, split evenly across the total duration
  scenes?: SceneInput[]; // preferred: each scene carries its own measured narration duration
}

const CROSSFADE_FRAMES = 12;

// staticFile() only accepts local files under public/ and throws on remote
// URLs — Remotion wants remote URLs passed to <Img> as-is instead. Since our
// image sources can be either (a full pollinations.ai URL, or a local
// "images/scene-0.jpg" path if a workflow step downloads them first), resolve
// each case correctly here rather than assuming one or the other.
const resolveImageSrc = (src: string): string =>
  /^https?:\/\//i.test(src) ? src : staticFile(src);

const Scene: React.FC<{ src: string; durationInFrames: number }> = ({
  src,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  // Gentle continuous zoom, same feel as before, but scoped to this scene only.
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Quick crossfade in/out at each scene boundary so cuts aren't jarring.
  const fadeIn = interpolate(frame, [0, CROSSFADE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - CROSSFADE_FRAMES, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Img
          src={resolveImageSrc(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

interface PlacedScene {
  src: string;
  from: number;
  durationInFrames: number;
}

// Lays scenes out back-to-back starting at frame 0, using each scene's own
// nominal duration — except the last scene, which always absorbs whatever
// frames remain up to `totalFrames`. That guarantees the scenes exactly
// cover the whole video with no gap or overshoot, regardless of rounding
// (real seconds -> frames) or an odd division (legacy equal split).
const layoutScenes = (
  items: { src: string; durationInFrames: number }[],
  totalFrames: number
): PlacedScene[] => {
  let from = 0;
  return items.map((item, i) => {
    const isLast = i === items.length - 1;
    const durationInFrames = isLast
      ? Math.max(1, totalFrames - from)
      : item.durationInFrames;
    const placed = { src: item.src, from, durationInFrames };
    from += durationInFrames;
    return placed;
  });
};

export const ShortVideo: React.FC<Props> = ({
  audioUrl,
  imageUrl,
  images,
  scenes,
}) => {
  const { durationInFrames, fps } = useVideoConfig();

  // Preferred: each scene's image is shown for exactly as long as its own
  // measured narration clip takes, so a short line's image doesn't linger
  // and a long line's image doesn't get cut off early. Falls back to an
  // even split (`images`) or a single static image (`imageUrl`) only for
  // callers that haven't moved to sending per-scene durations.
  const placedScenes: PlacedScene[] = (() => {
    if (scenes && scenes.length > 0) {
      const withFrames = scenes.map((s) => ({
        src: s.image,
        durationInFrames: Math.max(1, Math.round(s.durationInSeconds * fps)),
      }));
      return layoutScenes(withFrames, durationInFrames);
    }
    if (images && images.length > 0) {
      const perScene = Math.max(1, Math.floor(durationInFrames / images.length));
      const withFrames = images.map((src) => ({ src, durationInFrames: perScene }));
      return layoutScenes(withFrames, durationInFrames);
    }
    if (imageUrl) {
      return [{ src: imageUrl, from: 0, durationInFrames }];
    }
    return [];
  })();

  if (placedScenes.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: "black" }}>
        {audioUrl ? <Audio src={audioUrl} /> : null}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {placedScenes.map(({ src, from, durationInFrames: sceneDuration }, i) => (
        <Sequence key={`${i}-${src}`} from={from} durationInFrames={sceneDuration}>
          <Scene src={src} durationInFrames={sceneDuration} />
        </Sequence>
      ))}
      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  );
};
