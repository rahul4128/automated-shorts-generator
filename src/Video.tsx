import React from "react";
import { AbsoluteFill, Audio, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface Props {
  audioUrl: string;
  imageUrl: string;
  captionText: string;
}

export const ShortVideo: React.FC<Props> = ({ audioUrl, captionText }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Body bounce (bigger, more physical than before)
  const bounceCycle = 24;
  const bouncePhase = (frame % bounceCycle) / bounceCycle;
  const bounceY = Math.sin(bouncePhase * Math.PI * 2) * 14;
  const squash = 1 + Math.sin(bouncePhase * Math.PI * 2) * 0.03;

  // Arm wave while talking
  const armCycle = 30;
  const armPhase = (frame % armCycle) / armCycle;
  const armAngle = audioUrl ? Math.sin(armPhase * Math.PI * 2) * 22 : 4;

  // Blink
  const blinkCycle = 80;
  const blinkPhase = frame % blinkCycle;
  const isBlinking = blinkPhase < 4;
  const eyeHeight = isBlinking ? 4 : 30;

  // Talking mouth
  const mouthCycle = 8;
  const mouthPhase = (frame % mouthCycle) / mouthCycle;
  const mouthOpen = audioUrl ? Math.abs(Math.sin(mouthPhase * Math.PI * 2)) : 0.1;
  const mouthHeight = 14 + mouthOpen * 32;

  const introScale = spring({ frame, fps, config: { damping: 12, mass: 0.7 } });
  const hue = interpolate(frame, [0, durationInFrames], [24, 46], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, hsl(${hue}, 70%, 82%), hsl(${hue + 20}, 75%, 70%))`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transform: `translateY(${bounceY}px) scale(${introScale})`,
          position: "relative",
          width: 520,
          height: 620,
        }}
      >
        {/* Left arm */}
        <div
          style={{
            position: "absolute",
            top: 300,
            left: 60,
            width: 100,
            height: 34,
            borderRadius: 20,
            background: "#8B5E3C",
            transformOrigin: "right center",
            transform: `rotate(${-30 - armAngle}deg)`,
          }}
        />
        {/* Right arm */}
        <div
          style={{
            position: "absolute",
            top: 300,
            right: 60,
            width: 100,
            height: 34,
            borderRadius: 20,
            background: "#8B5E3C",
            transformOrigin: "left center",
            transform: `rotate(${30 + armAngle}deg)`,
          }}
        />

        {/* Body */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: `translateX(-50%) scaleY(${squash})`,
            width: 300,
            height: 260,
            borderRadius: "48% 48% 44% 44%",
            background: "#A9714A",
            boxShadow: "0 18px 40px rgba(0,0,0,0.2)",
          }}
        />

        {/* Ears */}
        <div style={{ position: "absolute", top: 10, left: 70, width: 90, height: 90, borderRadius: "50%", background: "#8B5E3C" }} />
        <div style={{ position: "absolute", top: 10, right: 70, width: 90, height: 90, borderRadius: "50%", background: "#8B5E3C" }} />
        <div style={{ position: "absolute", top: 30, left: 90, width: 50, height: 50, borderRadius: "50%", background: "#F0C9A0" }} />
        <div style={{ position: "absolute", top: 30, right: 90, width: 50, height: 50, borderRadius: "50%", background: "#F0C9A0" }} />

        {/* Head */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: "50%",
            transform: "translateX(-50%)",
            width: 340,
            height: 320,
            borderRadius: "50%",
            background: "#C48A5C",
            boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
          }}
        />

        {/* Muzzle */}
        <div
          style={{
            position: "absolute",
            top: 200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 190,
            height: 150,
            borderRadius: "50%",
            background: "#F0C9A0",
         }}
        />

        {/* Eyes */}
        <div style={{ position: "absolute", top: 150, left: 150, width: 32, height: eyeHeight, borderRadius: 20, background: "#2E2116" }} />
        <div style={{ position: "absolute", top: 150, right: 150, width: 32, height: eyeHeight, borderRadius: 20, background: "#2E2116" }} />

        {/* Nose */}
        <div style={{ position: "absolute", top: 218, left: "50%", transform: "translateX(-50%)", width: 46, height: 32, borderRadius: "50%", background: "#2E2116" }} />

        {/* Mouth */}
        <div
          style={{
            position: "absolute",
            top: 255,
            left: "50%",
            transform: "translateX(-50%)",
            width: 70,
            height: mouthHeight,
            borderRadius: "0 0 35px 35px",
            background: "#7A3B2E",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 60,
          right: 60,
          textAlign: "center",
          color: "white",
          fontSize: 58,
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
