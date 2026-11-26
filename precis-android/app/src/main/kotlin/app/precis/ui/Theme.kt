package app.precis.ui

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val Amber = Color(0xFFF4A21C)

private val scheme = darkColorScheme(
    primary = Amber,
    onPrimary = Color(0xFF1A1203),
    background = Color(0xFF12100E),
    onBackground = Color(0xFFF3EDE4),
    surface = Color(0xFF1C1916),
    onSurface = Color(0xFFF3EDE4),
    surfaceVariant = Color(0xFF26221E),
    onSurfaceVariant = Color(0xFFA69C8F),
    outline = Color(0xFF36312B),
    error = Color(0xFFFF8A7A),
)

@Composable
fun PrecisTheme(content: @Composable () -> Unit) = MaterialTheme(colorScheme = scheme, content = content)
