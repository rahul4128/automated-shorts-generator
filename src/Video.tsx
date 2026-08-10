import React from "react";
import { AbsoluteFill, Audio, Img, useCurrentFrame, interpolate } from "remotion";

interface Props {
  audioUrl: string;
  imageUrl: string;
  captionText: string;
}

export const ShortVideo: React.FC<Props> = ({ audioUrl, imageUrl, captionText }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 450], [1, 1.15], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
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
