import React from "react";
import { Composition, getInputProps } from "remotion";
import { ShortVideo } from "./Video";

export const RemotionRoot: React.FC = () => {
  const inputProps = getInputProps();
  return (
    <Composition
      id="ShortVideo"
      component={ShortVideo}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        audioUrl: (inputProps as any).audioUrl || "",
        imageUrl: (inputProps as any).imageUrl || "",
        captionText: (inputProps as any).captionText || "",
      }}
    />
  );
};
