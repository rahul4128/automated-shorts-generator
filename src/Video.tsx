import React from "react";
import { AbsoluteFill, Audio, Img, useCurrentFrame, useVideoConfig } from "remotion";

interface Props {
  audioUrl: string;
  images: string[];
}

export const ShortVideo: React.FC<Props> = ({ audioUrl, images }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const segmentLen = durationInFrames / images.length;

  // Simple: show exactly one image at a time, full frame, no zoom, no fade.
  const currentIndex = Math.min(Math.floor(frame / segmentLen), images.length - 1);
  const src = images[currentIndex];

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  );
};
