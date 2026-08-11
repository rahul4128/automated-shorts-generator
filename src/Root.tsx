import React from "react";
import { Composition, getInputProps, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { ShortVideo } from "./Video";

const FPS = 30;
const FALLBACK_SECONDS = 60;

export const RemotionRoot: React.FC = () => {
  const inputProps = getInputProps();
  const audioFile = staticFile("audio.wav");
  return (
    <Composition
      id="ShortVideo"
      component={ShortVideo}
      durationInFrames={FALLBACK_SECONDS * FPS}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{
        audioUrl: audioFile,
        imageUrl: (inputProps as any).imageUrl || "",
        captionText: (inputProps as any).captionText || "",
      }}
      calculateMetadata={async () => {
        let seconds = FALLBACK_SECONDS;
        try {
          const detected = await getAudioDurationInSeconds(audioFile);
          if (detected && detected > 0) {
            seconds = detected + 0.5;
          }
        } catch (e) {
          seconds = FALLBACK_SECONDS;
        }
        return {
          durationInFrames: Math.ceil(seconds * FPS),
        };
      }}
    />
  );
};
