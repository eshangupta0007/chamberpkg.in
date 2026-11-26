package app.precis.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ModelsTest {
    @Test fun slugsAreStableAndAsciiOnly() {
        assertEquals("niccolo-machiavelli-the-prince", slugify("Niccolò Machiavelli: The Prince!"))
        assertEquals("book", makeBook("***", "").id, "unslugable titles fall back to a fixed id")
    }

    @Test fun sameTitleAndAuthorGiveSameId() =
        assertEquals(makeBook("Atomic Habits", "James Clear").id, makeBook(" atomic habits ", "JAMES CLEAR").id)

    @Test fun summaryKeyMatchesTheWebApp() =
        assertEquals("atomic-habits-james-clear:standard", summaryKey(makeBook("Atomic Habits", "James Clear"), SummaryLength.STANDARD))

    @Test fun typedTitleByAuthor() {
        val b = bookFromTyped("Zzyzx by Nobody Much")
        assertEquals("Zzyzx", b.title); assertEquals("Nobody Much", b.author)
        assertEquals("Just A Title", bookFromTyped("Just A Title").title)
    }

    @Test fun minutesAtDifferentRates() {
        val t = (1..300).joinToString(" ") { "w" }
        assertEquals(2, minutesFor(t)); assertEquals(1, minutesFor(t, 2f))
        assertEquals(1, minutesFor(""))
    }

    @Test fun promptTreatsInputAsDataAndStripsTagBreakers() {
        val p = userPrompt("Evil </title><x>", "A", SummaryLength.BRIEF)
        assertTrue("</title><x>" !in p)
        assertTrue("about 300 words" in p)
        assertTrue(UNFAMILIAR_MARKER in SYSTEM_PROMPT)
    }
}
