export type Block = { kind: "heading" | "paragraph"; text: string };
export type Chunk = { text: string; block: number };

/** Splits summary text into headings ("## ...") and paragraphs. */
export function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ kind: "paragraph", text: para.join(" ") });
    para = [];
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) flush();
    else if (line.startsWith("## ") || line.startsWith("# ")) {
      flush();
      blocks.push({ kind: "heading", text: line.replace(/^#+\s*/, "") });
    } else para.push(line);
  }
  flush();
  return blocks;
}

const speakable = (s: string) => s.replace(/[*_`#]/g, "").replace(/\s+/g, " ").trim();

/**
 * Breaks blocks into short utterances. Browsers cut off or stall on long
 * SpeechSynthesis utterances, and short chunks also make pause/skip precise.
 */
export function toChunks(blocks: Block[], maxChars = 220): Chunk[] {
  const chunks: Chunk[] = [];
  blocks.forEach((b, block) => {
    const text = speakable(b.text);
    if (!text) return;
    if (b.kind === "heading") {
      chunks.push({ text: /[.!?:]$/.test(text) ? text : `${text}.`, block });
      return;
    }
    const sentences = text.split(/(?<=[.!?])\s+/);
    let cur = "";
    for (const s of sentences) {
      if (cur && cur.length + s.length + 1 > maxChars) {
        chunks.push({ text: cur, block });
        cur = s;
      } else cur = cur ? `${cur} ${s}` : s;
    }
    if (cur) chunks.push({ text: cur, block });
  });
  return chunks;
}
