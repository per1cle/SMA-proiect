package com.example.smishsmashsmosh.domain.model

import kotlinx.serialization.Serializable

@Serializable
enum class MessageType { SMS, EMAIL }

@Serializable
enum class Status { SAFE, SUSPICIOUS, DANGER, UNKNOWN }

@Serializable
enum class ScanSource { PASTE, SCREENSHOT, OVERLAY, SMS_AUTO, SHARE }

data class TextRange(val start: Int, val end: Int)

data class Reason(
    val code: String,
    val message: String,
    val highlight: TextRange? = null
)

/** Rezultatul analizei, independent de formatul backendului. */
data class AnalysisResult(
    val status: Status,
    val riskScore: Float,
    val reasons: List<Reason>,
    val advice: String,
    val modelVersion: String
)

/** Intrarea unei analize, independenta de transport. */
data class AnalysisInput(
    val text: String,
    val type: MessageType,
    val source: ScanSource,
    val sender: String? = null,
    val subject: String? = null,
    val links: List<String> = emptyList(),
    val locale: String = "ro"
)

/** Model de domeniu pentru istoric (CRUD). */
data class ScanEntry(
    val id: Long = 0,
    val text: String?,          // null daca utilizatorul nu vrea sa pastreze textul
    val type: MessageType,
    val source: ScanSource,
    val sender: String? = null,
    val subject: String? = null,
    val result: AnalysisResult,
    val note: String = "",
    val reported: Boolean = false,
    val falsePositive: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

sealed class AnalysisError(message: String) : Exception(message) {
    class Network : AnalysisError("Fara conexiune la internet")
    class BadRequest(msg: String) : AnalysisError(msg)
    class TooLarge : AnalysisError("Mesajul este prea lung")
    class RateLimited : AnalysisError("Prea multe cereri, incearca mai tarziu")
    class Server : AnalysisError("Eroare de server")
    class Unknown(msg: String) : AnalysisError(msg)
}
