"use client";

import { useMemo } from "react";
import { parseBlocks } from "@/lib/speech";
import { usePlayer } from "./PlayerProvider";

/**
 * Renders summary text. When this summary is the one loaded in the player, the
 * paragraph being spoken is highlighted and any paragraph can be tapped to jump to it.
 */
export function SummaryReader({ text, summaryKey }: { text: string; summaryKey?: string }) {
  const player = usePlayer();
  const blocks = useMemo(() => parseBlocks(text), [text]);
  const active = !!summaryKey && player.track?.summary.key === summaryKey;
  const currentBlock = active ? player.track?.chunks[player.index]?.block : undefined;

  return (
    <div className="reader">
      {blocks.map((b, i) => {
        if (b.kind === "heading") return <h3 key={i}>{b.text}</h3>;
        const chunkIdx = player.track?.chunks.findIndex((c) => c.block === i) ?? -1;
        const canJump = active && chunkIdx >= 0;
        return (
          <p
            key={i}
            className={currentBlock === i ? "reader-p is-current" : "reader-p"}
            onClick={canJump ? () => player.seek(chunkIdx) : undefined}
            title={canJump ? "Jump here" : undefined}
          >
            {b.text}
          </p>
        );
      })}
    </div>
  );
}
