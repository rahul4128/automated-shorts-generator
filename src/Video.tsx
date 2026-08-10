import React from "react";
import { AbsoluteFill, Audio, Img, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

interface Props {
  audioUrl: string;
  imageUrl: string;
  captionText: string;
}

export const ShortVideo: React.FC<Props> = ({ audioUrl, imageUrl, captionText }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Visible but smooth Ken Burns effect: zoom + gentle pan across the full clip.
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.18], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });
  const panX = interpolate(frame, [0, durationInFrames], [0, -3], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translateX(${panX}%)` }}>
        <Img src={imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 160,
          paddingLeft: 60,
          paddingRight: 60,
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 56,
            fontFamily: "Arial, sans-serif",
            fontWeight: 800,
            textAlign: "center",
            textShadow: "0 4px 12px rgba(0,0,0,0.8)",
            lineHeight: 1.25,
          }}
        >
          {captionText}
        </div>
      </AbsoluteFill>
      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  );
};
