package com.example.smishsmashsmosh.data.remote

import com.example.smishsmashsmosh.data.remote.dto.AnalysisRequest
import com.example.smishsmashsmosh.data.remote.dto.AnalysisResponse
import com.example.smishsmashsmosh.data.remote.dto.HighlightDto
import com.example.smishsmashsmosh.data.remote.dto.ReasonDto
import com.example.smishsmashsmosh.domain.model.Status
import kotlinx.coroutines.delay

/** Implementare falsa a contractului; se inlocuieste cu Retrofit cand exista backendul. */
class MockAnalysisApi : AnalysisApi {
    override suspend fun analyze(request: AnalysisRequest): AnalysisResponse {
        delay(800)
        val t = request.text.lowercase()
        val reasons = mutableListOf<ReasonDto>()
        Regex("https?://\\S+").find(request.text)?.let {
            reasons += ReasonDto("LINK", "Mesajul contine un link", HighlightDto(it.range.first, it.range.last + 1))
        }
        if (listOf("urgent", "imediat", "blocat", "suspendat").any { it in t })
            reasons += ReasonDto("URGENCY", "Mesajul te grabeste sa actionezi")
        if (listOf("parola", "card", "cod", "iban").any { it in t })
            reasons += ReasonDto("SENSITIVE_DATA", "Cere date personale sau financiare")
        val score = (reasons.size * 0.35f).coerceAtMost(1f)
        val status = when {
            score >= 0.7f -> Status.DANGER
            score > 0f -> Status.SUSPICIOUS
            else -> Status.SAFE
        }
        val advice = when (status) {
            Status.DANGER -> "Nu apasa pe link si nu raspunde. Sterge mesajul."
            Status.SUSPICIOUS -> "Fii atent. Verifica expeditorul inainte sa faci ceva."
            else -> "Mesajul pare in regula."
        }
        return AnalysisResponse(status, score, reasons, advice, "mock-1")
    }
}
