package com.example.smishsmashsmosh.ui.common

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.smishsmashsmosh.domain.model.AnalysisResult
import com.example.smishsmashsmosh.domain.model.Status

fun Status.label() = when (this) {
    Status.SAFE -> "SIGUR"
    Status.SUSPICIOUS -> "SUSPECT"
    Status.DANGER -> "PERICOL"
    Status.UNKNOWN -> "NECUNOSCUT"
}

fun Status.color() = when (this) {
    Status.SAFE -> Color(0xFF2E7D32)
    Status.SUSPICIOUS -> Color(0xFFEF6C00)
    Status.DANGER -> Color(0xFFC62828)
    Status.UNKNOWN -> Color(0xFF616161)
}

@Composable
fun ResultCard(result: AnalysisResult, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = result.status.color().copy(alpha = 0.12f))
    ) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(result.status.label(), fontSize = 32.sp, fontWeight = FontWeight.Bold, color = result.status.color())
            Text("Risc: ${(result.riskScore * 100).toInt()}%", style = MaterialTheme.typography.titleMedium)
            if (result.advice.isNotBlank()) Text(result.advice, fontSize = 20.sp)
            result.reasons.forEach { Text("• ${it.message}", fontSize = 18.sp) }
        }
    }
}
