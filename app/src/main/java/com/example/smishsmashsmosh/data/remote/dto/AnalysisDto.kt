package com.example.smishsmashsmosh.data.remote.dto

import com.example.smishsmashsmosh.domain.model.MessageType
import com.example.smishsmashsmosh.domain.model.ScanSource
import com.example.smishsmashsmosh.domain.model.Status
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class AnalysisRequest(
    val text: String,
    val type: MessageType,
    val source: ScanSource? = null,
    val sender: String? = null,
    val subject: String? = null,
    val links: List<String> = emptyList(),
    val locale: String = "ro"
)

@Serializable
data class HighlightDto(val start: Int, val end: Int)

@Serializable
data class ReasonDto(
    val code: String,
    val message: String,
    val highlight: HighlightDto? = null
)

@Serializable
data class AnalysisResponse(
    val status: Status = Status.UNKNOWN,
    @SerialName("risk_score") val riskScore: Float = 0f,
    val reasons: List<ReasonDto> = emptyList(),
    val advice: String = "",
    @SerialName("model_version") val modelVersion: String = ""
)

@Serializable
data class ErrorBody(val error: ErrorDto)

@Serializable
data class ErrorDto(val code: String, val message: String)
