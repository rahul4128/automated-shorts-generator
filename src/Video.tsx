import React from "react";
import { AbsoluteFill, Audio, Img, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface Props {
  audioUrl: string;
  images: string[];
}

export const ShortVideo: React.FC<Props> = ({ audioUrl, images }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const segmentLen = durationInFrames / images.length;

  // One image at a time, hard cut between them (no fade/overlap), each with a
  // gentle continuous zoom-in for motion.
  const currentIndex = Math.min(Math.floor(frame / segmentLen), images.length - 1);
  const src = images[currentIndex];
  const localFrame = frame - currentIndex * segmentLen;
  const zoom = interpolate(localFrame, [0, segmentLen], [1, 1.15], {
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
