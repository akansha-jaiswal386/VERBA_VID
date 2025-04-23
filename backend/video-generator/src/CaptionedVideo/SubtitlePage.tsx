// src/CaptionedVideo/SubtitlePage.tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Page } from "./Page";
import { TikTokPage } from "@remotion/captions";

const SubtitlePage: React.FC<{ readonly page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {page.tokens.map((token, index) => {
        const startFrame = (token.fromMs / 1000) * fps;
        const endFrame = (token.toMs / 1000) * fps;

        // Smooth fade-in and fade-out effect
        const opacity = interpolate(
          frame,
          [startFrame, startFrame + 15, endFrame - 15, endFrame],
          [0, 1, 1, 0],
          { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
        );

        return (
          <div key={index} style={{ opacity }}>
            <Page text={token.text} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default SubtitlePage;
