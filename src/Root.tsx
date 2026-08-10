import React from "react";
import { Composition, getInputProps } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { ShortVideo } from "./Video";

const FPS = 30;
const FALLBACK_SECONDS = 15;

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
            seconds = await getAudioDurationInSeconds(audioUrl);
            // Add half a second of tail padding so audio never feels cut off.
            seconds = seconds + 0.5;
          } catch (e) {
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
