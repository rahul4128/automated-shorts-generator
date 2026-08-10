import React from "react";
import { Composition, getInputProps } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { ShortVideo } from "./Video";

const FPS = 30;
// Generous safety-net fallback: only used if duration detection genuinely fails.
// Set high on purpose so a detection failure never truncates real audio.
const FALLBACK_SECONDS = 60;

export const RemotionRoot: React.FC = () => {
  const inputProps = getInputProps();
  return (
    <Composition
      id="ShortVideo"
      component={ShortVideo}
      durationInFrames={FALLBACK_SECONDS * FPS}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{
        audioUrl: (inputProps as any).audioUrl || "",
        imageUrl: (inputProps as any).imageUrl || "",
        captionText: (inputProps as any).captionText || "",
      }}
      calculateMetadata={async ({ props }) => {
        const audioUrl = (props as any).audioUrl;
        let seconds = FALLBACK_SECONDS;
        if (audioUrl) {
          try {
            const detected = await getAudioDurationInSeconds(audioUrl);
            if (detected && detected > 0) {
              // Add half a second of tail padding so audio never feels cut off.
              seconds = detected + 0.5;
            }
          } catch (e) {
            // Detection failed - keep the generous fallback rather than a short one.
            seconds = FALLBACK_SECONDS;
          }
        }
        return {
          durationInFrames: Math.ceil(seconds * FPS),
        };
      }}
    />
  );
};
