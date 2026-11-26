package app.precis.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.precis.core.Book

/** A typographic cover generated from the title; no network, no stock art that could be wrong. */
@Composable
fun Cover(book: Book, modifier: Modifier = Modifier, titleSize: Int = 14) {
    var h = 0
    for (c in book.title + book.author) h = (h * 31 + c.code) % 360
    val brush = Brush.linearGradient(
        listOf(Color.hsl(h.toFloat(), 0.45f, 0.28f), Color.hsl(((h + 40) % 360).toFloat(), 0.5f, 0.14f)),
    )
    Box(modifier.aspectRatio(2f / 3f).clip(RoundedCornerShape(8.dp)).background(brush).padding(10.dp)) {
        Column(Modifier.fillMaxSize(), verticalArrangement = Arrangement.SpaceBetween) {
            Text(
                book.title.split(':', '(').first(),
                fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold, fontSize = titleSize.sp,
                lineHeight = (titleSize + 3).sp, color = Color.White, maxLines = 4, overflow = TextOverflow.Ellipsis,
            )
            if (book.author.isNotEmpty()) {
                Text(book.author, fontSize = (titleSize - 4).coerceAtLeast(7).sp, color = Color.White.copy(alpha = 0.75f), maxLines = 2)
            }
        }
    }
}

@Composable
fun BookCard(book: Book, onClick: () -> Unit, modifier: Modifier = Modifier) {
    Column(modifier.clickable(onClick = onClick), verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Cover(book)
        Text(book.title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, maxLines = 2, overflow = TextOverflow.Ellipsis)
        Text(
            book.author + (book.year?.let { " · $it" } ?: ""),
            color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 12.sp, maxLines = 1, overflow = TextOverflow.Ellipsis,
        )
    }
}
