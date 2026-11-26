package app.precis.core

enum class BlockKind { HEADING, PARAGRAPH }

data class Block(val kind: BlockKind, val text: String)

/** One utterance; [block] is the index of the Block it came from. */
data class Chunk(val text: String, val block: Int)

/** Splits summary text into headings ("## ...") and paragraphs. */
fun parseBlocks(text: String): List<Block> {
    val blocks = mutableListOf<Block>()
    val para = mutableListOf<String>()
    fun flush() {
        if (para.isNotEmpty()) blocks += Block(BlockKind.PARAGRAPH, para.joinToString(" "))
        para.clear()
    }
    for (raw in text.split("\n")) {
        val line = raw.trim()
        when {
            line.isEmpty() -> flush()
            line.startsWith("## ") || line.startsWith("# ") -> {
                flush()
                blocks += Block(BlockKind.HEADING, line.replace(Regex("^#+\\s*"), ""))
            }
            else -> para += line
        }
    }
    flush()
    return blocks
}

private fun speakable(s: String) = s.replace(Regex("[*_`#]"), "").replace(Regex("\\s+"), " ").trim()

/**
 * Breaks blocks into short utterances. Short chunks keep pause/skip precise and avoid
 * engines that stall on long input (TextToSpeech also caps input length).
 */
fun toChunks(blocks: List<Block>, maxChars: Int = 220): List<Chunk> {
    val chunks = mutableListOf<Chunk>()
    blocks.forEachIndexed { index, b ->
        val text = speakable(b.text)
        if (text.isEmpty()) return@forEachIndexed
        if (b.kind == BlockKind.HEADING) {
            chunks += Chunk(if (Regex("[.!?:]$").containsMatchIn(text)) text else "$text.", index)
            return@forEachIndexed
        }
        var cur = ""
        for (s in text.split(Regex("(?<=[.!?])\\s+"))) {
            if (cur.isNotEmpty() && cur.length + s.length + 1 > maxChars) {
                chunks += Chunk(cur, index)
                cur = s
            } else cur = if (cur.isEmpty()) s else "$cur $s"
        }
        if (cur.isNotEmpty()) chunks += Chunk(cur, index)
    }
    return chunks
}
