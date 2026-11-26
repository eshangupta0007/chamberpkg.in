package app.precis.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class SpeechTest {
    private val text = "## The Idea\n\nFirst sentence here. Second one follows.\nSame paragraph still.\n\n## The Takeaway\n\nLast para."

    @Test fun parsesHeadingsAndJoinsWrappedLines() {
        val b = parseBlocks(text)
        assertEquals(
            listOf(BlockKind.HEADING, BlockKind.PARAGRAPH, BlockKind.HEADING, BlockKind.PARAGRAPH),
            b.map { it.kind },
        )
        assertEquals("The Idea", b[0].text)
        assertEquals("First sentence here. Second one follows. Same paragraph still.", b[1].text)
    }

    @Test fun headingWithoutBlankLineBeforeParagraph() {
        val b = parseBlocks("## Title\nBody text here.")
        assertEquals(2, b.size)
        assertEquals("Body text here.", b[1].text)
    }

    @Test fun headingsAreSpokenWithoutHashesAndEndInPunctuation() {
        val c = toChunks(parseBlocks(text))
        assertEquals("The Idea.", c[0].text)
        assertTrue(c.none { '#' in it.text })
    }

    @Test fun chunksStayShortAndKeepTheirBlockIndex() {
        val long = (1..40).joinToString(" ") { "This is sentence number $it of a long paragraph." }
        val c = toChunks(parseBlocks("## H\n\n$long"))
        assertTrue(c.drop(1).all { it.text.length <= 260 }, "chunks bounded: ${c.maxOf { it.text.length }}")
        assertTrue(c.drop(1).all { it.block == 1 })
        assertEquals(long, c.drop(1).joinToString(" ") { it.text }, "no text lost or reordered")
    }

    @Test fun stripsMarkdownEmphasis() {
        val c = toChunks(parseBlocks("This is *very* important and `code`."))
        assertEquals("This is very important and code.", c.single().text)
    }

    @Test fun emptyInputGivesNoChunks() = assertEquals(0, toChunks(parseBlocks("  \n\n ")).size)
}
