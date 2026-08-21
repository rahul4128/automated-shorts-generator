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

interface Props {
  audioUrl: string;
  imageUrl?: string; // legacy single-image fallback, kept for back-compat
  images?: string[]; // new: one entry per story beat — either a remote https:// URL, or a filename relative to public/
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

export const ShortVideo: React.FC<Props> = ({ audioUrl, imageUrl, images }) => {
  const { durationInFrames } = useVideoConfig();

  // Prefer the new multi-image array; fall back to the old single image so
  // nothing breaks if a caller still sends only `imageUrl`.
  const scenes = images && images.length > 0 ? images : imageUrl ? [imageUrl] : [];

  if (scenes.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: "black" }}>
        {audioUrl ? <Audio src={audioUrl} /> : null}
      </AbsoluteFill>
    );
  }

  const perScene = Math.floor(durationInFrames / scenes.length);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {scenes.map((src, i) => {
        const isLast = i === scenes.length - 1;
        const from = perScene * i;
        const sceneDuration = isLast ? durationInFrames - from : perScene;

        return (
          <Sequence key={`${i}-${src}`} from={from} durationInFrames={sceneDuration}>
            <Scene src={src} durationInFrames={sceneDuration} />
          </Sequence>
        );
      })}
      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  );
};
