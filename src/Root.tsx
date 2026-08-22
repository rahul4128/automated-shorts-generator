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
        images: (inputProps as any).images || [],
        // Preferred prop: one entry per scene with its own measured
        // narration duration, so Video.tsx can time each image to exactly
        // how long its line takes to speak instead of splitting the total
        // video length evenly across images. `images`/`imageUrl` above are
        // kept only as a fallback for callers that haven't moved to this.
        scenes: (inputProps as any).scenes || [],
      }}
      calculateMetadata={async () => {
        // audio.wav is the concatenation of every scene's own clip (see the
        // render workflow), so its total length already equals the sum of
        // the per-scene durations in `scenes` — this stays the single
        // source of truth for the video's overall length, with Video.tsx
        // handling how that length is divided across scenes.
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
