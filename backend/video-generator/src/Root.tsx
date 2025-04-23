// src/Root.tsx
import React from "react";
import { Composition } from "remotion";
import { CaptionedVideo } from "./CaptionedVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CaptionedVideo"
      component={CaptionedVideo}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={300} // 10 seconds at 30 fps
      defaultProps={{
        promptText:
          "Default text for local preview. This text will be replaced by the Gemini Flash 1.5 output.",
      }}
    />
  );
};
