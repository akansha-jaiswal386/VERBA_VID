// src/CaptionedVideo/index.tsx
import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, Video, Img, useVideoConfig } from "remotion";
import { createTikTokStyleCaptions, Caption, TikTokPage } from "@remotion/captions";
import SubtitlePage from "./SubtitlePage";
import { generateCaptionsFromPrompt } from "./generateCaptions";

type Props = {
  promptText: string;
  backgroundPath?: string; // Background path (video/image)
};

export const CaptionedVideo: React.FC<Props> = ({ promptText, backgroundPath }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const totalDurationMs = (durationInFrames / fps) * 1000;

  // Generate captions
  const generatedCaptions: Caption[] = useMemo(() => {
    return generateCaptionsFromPrompt(promptText, totalDurationMs);
  }, [promptText, totalDurationMs]);

  // Create TikTok-style caption pages
  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      combineTokensWithinMilliseconds: 0,
      captions: generatedCaptions,
    });
  }, [generatedCaptions]);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Render Background (Video or Image) */}
      {backgroundPath ? (
        backgroundPath.endsWith(".mp4") || backgroundPath.endsWith(".mov") ? (
          <Video src={backgroundPath} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Img src={backgroundPath} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )
      ) : null}

      {/* Render Captions */}
      {pages.map((page: TikTokPage, index) => {
        const startMs = page.startMs;
        const endMs = Math.max(...page.tokens.map((t) => t.toMs));
        const startFrame = (startMs / 1000) * fps;
        const durationInFrames = ((endMs - startMs) / 1000) * fps;

        return (
          <Sequence key={index} from={startFrame} durationInFrames={Math.ceil(durationInFrames)}>
            <SubtitlePage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
