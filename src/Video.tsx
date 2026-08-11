import React from "react";
import { AbsoluteFill, Audio, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";

interface Props {
  audioUrl: string;
  imageUrl: string;
  captionText: string;
}

export const ShortVideo: React.FC<Props> = ({ audioUrl, captionText }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Gentle bounce - continuous up/down loop
  const bounceCycle = 20; // frames per bounce
  const bouncePhase = (frame % bounceCycle) / bounceCycle;
  const bounceY = Math.sin(bouncePhase * Math.PI * 2) * 18;

  // Blink periodically (quick close every ~2.5s)
  const blinkCycle = 75;
  const blinkPhase = frame % blinkCycle;
  const isBlinking = blinkPhase < 4;
  const eyeHeight = isBlinking ? 4 : 34;

  // Mouth "talking" wobble - open/close rhythmically while audio plays
  const mouthCycle = 8;
  const mouthPhase = (frame % mouthCycle) / mouthCycle;
  const mouthOpen = audioUrl ? Math.abs(Math.sin(mouthPhase * Math.PI * 2)) : 0.15;
  const mouthHeight = 20 + mouthOpen * 45;

  // Gentle intro pop-in
  const introScale = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });

  // Background color cycles slowly through friendly warm tones
  const hue = interpolate(frame, [0, durationInFrames], [30, 330], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, hsl(${hue}, 85%, 68%), hsl(${(hue + 40) % 360}, 80%, 78%))`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transform: `translateY(${bounceY}px) scale(${introScale})`,
          width: 460,
          height: 460,
          borderRadius: "50%",
          background: "#FFD54A",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Eyes */}
        <div style={{ position: "absolute", top: 150, left: 110, width: 46, height: eyeHeight, borderRadius: 30, background: "#3A2E1F", transition: "none" }} />
        <div style={{ position: "absolute", top: 150, left: 300, width: 46, height: eyeHeight, borderRadius: 30, background: "#3A2E1F" }} />
        {/* Cheeks */}
        <div style={{ position: "absolute", top: 240, left: 70, width: 55, height: 32, borderRadius: "50%", background: "#FF8A80", opacity: 0.6 }} />
        <div style={{ position: "absolute", top: 240, left: 335, width: 55, height: 32, borderRadius: "50%", background: "#FF8A80", opacity: 0.6 }} />
        {/* Mouth */}
        <div
          style={{
            position: "absolute",
            top: 275,
            left: 180,
            width: 100,
            height: mouthHeight,
            borderRadius: "0 0 50px 50px",
            background: "#B23B3B",
            border: "6px solid #3A2E1F",
            borderTop: "none",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 130,
          left: 60,
          right: 60,
          textAlign: "center",
          color: "white",
          fontSize: 60,
          fontFamily: "Arial, sans-serif",
          fontWeight: 800,
          textShadow: "0 4px 12px rgba(0,0,0,0.5)",
          lineHeight: 1.25,
        }}
      >
        {captionText}
      </div>

      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  );
};
