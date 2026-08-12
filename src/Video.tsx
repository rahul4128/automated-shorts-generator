import React from "react";
import { AbsoluteFill, Audio, Img, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface Props {
  audioUrl: string;
  imageUrl: string;
}

export const ShortVideo: React.FC<Props> = ({ audioUrl, imageUrl }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Single fresh AI-generated image for the whole video, with a gentle continuous zoom.
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Img src={imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  );
};
